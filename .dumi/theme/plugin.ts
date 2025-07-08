import { IApi } from 'dumi';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

// 缓存解析结果
const apiCache = new Map<string, any>();
// 文件监听器
const fileWatchers = new Map<string, fs.FSWatcher>();
// 已处理的文件，用于避免循环引用
const processedFiles = new Set<string>();

// 解析的API类型
interface ApiItem {
  name: string;
  type: string;
  description: string;
  default?: string;
  value?: string; // 用于类型别名
  params?: Array<{
    name: string;
    type: string;
    description: string;
    default?: string;
    required?: boolean;
  }>;
  returns?: {
    type: string;
    description: string;
  };
  properties?: Array<{
    name: string;
    type: string;
    description: string;
    default?: string;
    required?: boolean;
  }>;
  methods?: Array<{ // 用于类方法
    name: string;
    type: string;
    description: string;
    params?: Array<{
      name: string;
      type: string;
      description: string;
      default?: string;
      required?: boolean;
    }>;
    returns?: {
      type: string;
      description: string;
    };
  }>;
}

/**
 * 解析TSDoc注释
 */
function parseTSDocComment(commentText: string): { description: string; tags: Record<string, any> } {
  const lines = commentText.split('\n');
  const description: string[] = [];
  const tags: Record<string, any> = {};
  let currentTag: string | null = null;
  let currentTagContent: string[] = [];

  lines.forEach(line => {
    // 移除注释符号和前后空格
    const trimmedLine = line.replace(/^\s*\/\*\*|\s*\*\/|\s*\*\s?/g, '').trim();
    
    if (trimmedLine.startsWith('@')) {
      // 如果有当前标签，保存它
      if (currentTag) {
        tags[currentTag] = currentTagContent.join(' ').trim();
        currentTagContent = [];
      }
      
      // 解析新标签
      const tagMatch = trimmedLine.match(/^@(\w+)(?:\s+(.*))?$/);
      if (tagMatch) {
        currentTag = tagMatch[1];
        currentTagContent = tagMatch[2] ? [tagMatch[2]] : [];
      }
    } else if (currentTag) {
      // 继续当前标签的内容
      if (trimmedLine) {
        currentTagContent.push(trimmedLine);
      }
    } else if (trimmedLine) {
      // 描述部分
      description.push(trimmedLine);
    }
  });

  // 保存最后一个标签
  if (currentTag) {
    tags[currentTag] = currentTagContent.join(' ').trim();
  }

  return {
    description: description.join(' ').trim(),
    tags
  };
}

/**
 * 解析导出声明
 */
function parseExportDeclaration(node: ts.ExportDeclaration, sourceFile: ts.SourceFile, basePath: string, apiItems: ApiItem[]): void {
  // 如果没有导出子句或模块说明符，则不处理
  if (!node.exportClause || !node.moduleSpecifier) {
    return;
  }
  
  // 获取模块路径
  const moduleSpecifier = node.moduleSpecifier.getText().replace(/['"]/g, '');
  let modulePath: string;
  
  // 处理相对路径
  if (moduleSpecifier.startsWith('.')) {
    const dir = path.dirname(sourceFile.fileName);
    modulePath = path.resolve(dir, moduleSpecifier);
    
    // 添加扩展名（如果没有）
    if (!path.extname(modulePath)) {
      const extensions = ['.ts', '.tsx'];
      for (const ext of extensions) {
        const fullPath = `${modulePath}${ext}`;
        if (fs.existsSync(fullPath)) {
          modulePath = fullPath;
          break;
        }
      }
    }
  } else {
    // 处理非相对路径（如node_modules中的模块）
    // 这里简化处理，实际上可能需要更复杂的解析逻辑
    modulePath = path.join(basePath, 'node_modules', moduleSpecifier);
  }
  
  // 检查文件是否存在
  if (!fs.existsSync(modulePath)) {
    console.warn(`找不到模块: ${modulePath}`);
    return;
  }
  
  // 避免循环引用
  if (processedFiles.has(modulePath)) {
    return;
  }
  processedFiles.add(modulePath);
  
  // 解析导入的文件
  const importedApiItems = parseTypeScriptFile(modulePath);
  
  // 如果是命名导出，只保留指定的导出项
  if (ts.isNamedExports(node.exportClause)) {
    const exportNames = node.exportClause.elements.map(e => e.name.text);
    const filteredItems = importedApiItems.filter(item => exportNames.includes(item.name));
    apiItems.push(...filteredItems);
  } else {
    // 如果是命名空间导出或其他形式，保留所有导出项
    apiItems.push(...importedApiItems);
  }
}

/**
 * 解析TypeScript文件并提取API信息
 */
function parseTypeScriptFile(filePath: string): ApiItem[] {
  if (!fs.existsSync(filePath)) {
    console.warn(`文件不存在: ${filePath}`);
    return [];
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const apiItems: ApiItem[] = [];
  const basePath = process.cwd();

  // 遍历AST节点
  function visit(node: ts.Node) {
    // 处理导出声明（二次导出）
    if (ts.isExportDeclaration(node)) {
      parseExportDeclaration(node, sourceFile, basePath, apiItems);
    }
    
    // 获取节点的JSDoc注释
    const jsDocComment = ts.getJSDocCommentsAndTags(node).map((doc: any) => doc.getText()).join('\n');
    
    // 接口声明
    if (ts.isInterfaceDeclaration(node) && node.name) {
      const interfaceName = node.name.text;
      const { description, tags } = jsDocComment ? parseTSDocComment(jsDocComment) : { description: '', tags: {} };
      
      const properties = node.members.map(member => {
        if (ts.isPropertySignature(member) && member.name) {
          const propName = member.name.getText();
          const propType = member.type ? member.type.getText() : 'any';
          const propJsDoc = ts.getJSDocCommentsAndTags(member).map((doc: any) => doc.getText()).join('\n');
          const { description: propDesc, tags: propTags } = propJsDoc ? parseTSDocComment(propJsDoc) : { description: '', tags: {} };
          
          return {
            name: propName,
            type: propType,
            description: propDesc,
            default: propTags.defaultValue,
            required: !member.questionToken
          };
        }
        return null;
      }).filter(Boolean) as any[];

      apiItems.push({
        name: interfaceName,
        type: 'interface',
        description,
        properties
      });
    }
    
    // 类声明
    else if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;
      const { description, tags } = jsDocComment ? parseTSDocComment(jsDocComment) : { description: '', tags: {} };
      
      const properties = node.members
        .filter(member => !ts.isMethodDeclaration(member) && !ts.isConstructorDeclaration(member))
        .map(member => {
          if (ts.isPropertyDeclaration(member) && member.name) {
            const propName = member.name.getText();
            const propType = member.type ? member.type.getText() : 'any';
            const propJsDoc = ts.getJSDocCommentsAndTags(member).map((doc: any) => doc.getText()).join('\n');
            const { description: propDesc, tags: propTags } = propJsDoc ? parseTSDocComment(propJsDoc) : { description: '', tags: {} };
            
            return {
              name: propName,
              type: propType,
              description: propDesc,
              default: propTags.defaultValue,
              required: true
            };
          }
          return null;
        }).filter(Boolean) as any[];

      const methods = node.members
        .filter(member => ts.isMethodDeclaration(member))
        .map(member => {
          if (ts.isMethodDeclaration(member) && member.name) {
            const methodName = member.name.getText();
            const methodJsDoc = ts.getJSDocCommentsAndTags(member).map((doc: any) => doc.getText()).join('\n');
            const { description: methodDesc, tags: methodTags } = methodJsDoc ? parseTSDocComment(methodJsDoc) : { description: '', tags: {} };
            
            const params = member.parameters.map(param => {
              const paramName = param.name.getText();
              const paramType = param.type ? param.type.getText() : 'any';
              const paramDesc = methodTags[`param ${paramName}`] || methodTags[`param`] || '';
              const hasDefault = param.initializer !== undefined;
              const defaultValue = hasDefault ? param.initializer?.getText() : undefined;
              
              return {
                name: paramName,
                type: paramType,
                description: paramDesc,
                default: defaultValue,
                required: !param.questionToken && !hasDefault
              };
            });

            const returnType = member.type ? member.type.getText() : 'void';
            const returns = {
              type: returnType,
              description: methodTags.returns || ''
            };

            return {
              name: methodName,
              type: 'method',
              description: methodDesc,
              params,
              returns
            };
          }
          return null;
        }).filter(Boolean) as any[];

      apiItems.push({
        name: className,
        type: 'class',
        description,
        properties,
        methods
      });
    }
    
    // 类型别名
    else if (ts.isTypeAliasDeclaration(node) && node.name) {
      const typeName = node.name.text;
      const typeValue = node.type.getText();
      const { description, tags } = jsDocComment ? parseTSDocComment(jsDocComment) : { description: '', tags: {} };
      
      apiItems.push({
        name: typeName,
        type: 'type',
        description,
        value: typeValue
      });
    }
    
    // 函数声明
    else if (ts.isFunctionDeclaration(node) && node.name) {
      const funcName = node.name.text;
      const { description, tags } = jsDocComment ? parseTSDocComment(jsDocComment) : { description: '', tags: {} };
      
      const params = node.parameters.map(param => {
        const paramName = param.name.getText();
        const paramType = param.type ? param.type.getText() : 'any';
        const paramDesc = tags[`param ${paramName}`] || tags[`param`] || '';
        const hasDefault = param.initializer !== undefined;
        const defaultValue = hasDefault ? param.initializer?.getText() : undefined;
        
        return {
          name: paramName,
          type: paramType,
          description: paramDesc,
          default: defaultValue,
          required: !param.questionToken && !hasDefault
        };
      });

      const returnType = node.type ? node.type.getText() : 'void';
      const returns = {
        type: returnType,
        description: tags.returns || ''
      };

      apiItems.push({
        name: funcName,
        type: 'function',
        description,
        params,
        returns
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return apiItems;
}

/**
 * 监听文件变化
 */
function watchFile(filePath: string, onUpdate: () => void) {
  // 如果已经在监听该文件，先移除旧的监听器
  if (fileWatchers.has(filePath)) {
    const watcher = fileWatchers.get(filePath);
    watcher?.close();
    fileWatchers.delete(filePath);
  }

  // 添加新的监听器
  const watcher = fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      console.log(`文件 ${filePath} 已更改，重新解析`);
      onUpdate();
    }
  });

  fileWatchers.set(filePath, watcher);
}

/**
 * 查找并解析TS文件
 */
function findAndParseFile(filePattern: string, api: IApi): ApiItem[] | null {
  // 清空已处理文件集合，避免缓存影响
  processedFiles.clear();
  
  // 从配置中获取源文件路径
  const config = api.config.themeConfig as Record<string, any> || {};
  const apiConfig = config.apiConfig || {};
  
  const basePath = process.cwd();
  const srcPath = path.join(basePath, apiConfig.sourcePath || 'src');
  const tsPath = apiConfig.tsPath || 'ts';
  const tsDir = path.join(srcPath, tsPath);
  
  // 支持的文件扩展名
  const possibleExtensions = apiConfig.extensions || ['.ts', '.tsx'];
  
  // 尝试直接查找文件
  for (const ext of possibleExtensions) {
    // 检查指定的ts目录
    const filePath = path.join(tsDir, `${filePattern}${ext}`);
    if (fs.existsSync(filePath)) {
      // 如果缓存中没有该文件的解析结果，或者需要重新解析
      if (!apiCache.has(filePath)) {
        const apiItems = parseTypeScriptFile(filePath);
        apiCache.set(filePath, apiItems);
        
        // 监听文件变化
        watchFile(filePath, () => {
          processedFiles.clear(); // 清空已处理文件集合
          const updatedApiItems = parseTypeScriptFile(filePath);
          apiCache.set(filePath, updatedApiItems);
        });
      }
      
      return apiCache.get(filePath);
    }
    
    // 检查src目录
    const srcFilePath = path.join(srcPath, `${filePattern}${ext}`);
    if (fs.existsSync(srcFilePath)) {
      if (!apiCache.has(srcFilePath)) {
        const apiItems = parseTypeScriptFile(srcFilePath);
        apiCache.set(srcFilePath, apiItems);
        
        watchFile(srcFilePath, () => {
          processedFiles.clear(); // 清空已处理文件集合
          const updatedApiItems = parseTypeScriptFile(srcFilePath);
          apiCache.set(srcFilePath, updatedApiItems);
        });
      }
      
      return apiCache.get(srcFilePath);
    }
  }
  
  return null;
}

/**
 * 生成API表格的Markdown内容
 */
function generateApiTable(apiItems: ApiItem[]): string {
  if (!apiItems || apiItems.length === 0) {
    return '<div style="color: red">未找到API定义</div>';
  }
  
  let markdown = '';
  
  apiItems.forEach(item => {
    markdown += `## ${item.name}\n\n`;
    markdown += item.description ? `${item.description}\n\n` : '';
    
    if (item.type === 'interface' || item.type === 'class') {
      // 属性表格
      if (item.properties && item.properties.length > 0) {
        markdown += `### 属性\n\n`;
        markdown += `| 名称 | 类型 | 默认值 | 描述 |\n`;
        markdown += `| ---- | ---- | ------ | ---- |\n`;
        
        item.properties.forEach(prop => {
          const defaultValue = prop.default ? prop.default : '-';
          markdown += `| ${prop.name}${prop.required ? '' : '?'} | \`${prop.type}\` | ${defaultValue} | ${prop.description || '-'} |\n`;
        });
        
        markdown += '\n';
      }
      
      // 方法表格（仅适用于类）
      if (item.type === 'class' && item.methods && item.methods.length > 0) {
        markdown += `### 方法\n\n`;
        
        item.methods.forEach((method: any) => {
          markdown += `#### ${method.name}\n\n`;
          markdown += method.description ? `${method.description}\n\n` : '';
          
          // 参数表格
          if (method.params && method.params.length > 0) {
            markdown += `**参数:**\n\n`;
            markdown += `| 名称 | 类型 | 默认值 | 描述 |\n`;
            markdown += `| ---- | ---- | ------ | ---- |\n`;
            
            method.params.forEach((param: any) => {
              const defaultValue = param.default ? param.default : '-';
              markdown += `| ${param.name}${param.required ? '' : '?'} | \`${param.type}\` | ${defaultValue} | ${param.description || '-'} |\n`;
            });
            
            markdown += '\n';
          }
          
          // 返回值
          if (method.returns) {
            markdown += `**返回值:** \`${method.returns.type}\`${method.returns.description ? ` - ${method.returns.description}` : ''}\n\n`;
          }
        });
      }
    } else if (item.type === 'function') {
      // 函数参数表格
      if (item.params && item.params.length > 0) {
        markdown += `**参数:**\n\n`;
        markdown += `| 名称 | 类型 | 默认值 | 描述 |\n`;
        markdown += `| ---- | ---- | ------ | ---- |\n`;
        
        item.params.forEach(param => {
          const defaultValue = param.default ? param.default : '-';
          markdown += `| ${param.name}${param.required ? '' : '?'} | \`${param.type}\` | ${defaultValue} | ${param.description || '-'} |\n`;
        });
        
        markdown += '\n';
      }
      
      // 返回值
      if (item.returns) {
        markdown += `**返回值:** \`${item.returns.type}\`${item.returns.description ? ` - ${item.returns.description}` : ''}\n\n`;
      }
    } else if (item.type === 'type') {
      markdown += `**类型定义:** \`${item.value}\`\n\n`;
    }
  });
  
  return markdown;
}

export default (api: IApi) => {
  // 初始化阶段扫描所有TS文件
  const scanTsFiles = () => {
    // 清空已处理文件集合
    processedFiles.clear();
    
    // 从配置中获取源文件路径
    const config = api.config.themeConfig as Record<string, any> || {};
    const apiConfig = config.apiConfig || {};
    
    const basePath = process.cwd();
    const srcPath = path.join(basePath, apiConfig.sourcePath || 'src');
    const tsPath = apiConfig.tsPath || 'ts';
    const tsDir = path.join(srcPath, tsPath);
    
    // 检查TS目录是否存在
    if (fs.existsSync(tsDir)) {
      const files = fs.readdirSync(tsDir);
      files.forEach(file => {
        const ext = path.extname(file);
        const possibleExtensions = apiConfig.extensions || ['.ts', '.tsx'];
        
        if (possibleExtensions.includes(ext)) {
          const filePath = path.join(tsDir, file);
          const apiItems = parseTypeScriptFile(filePath);
          apiCache.set(filePath, apiItems);
          
          // 监听文件变化
          watchFile(filePath, () => {
            processedFiles.clear(); // 清空已处理文件集合
            const updatedApiItems = parseTypeScriptFile(filePath);
            apiCache.set(filePath, updatedApiItems);
          });
        }
      });
    }
  };

  // 在开发服务器启动时扫描文件
  api.register({
    key: 'onDevCompileDone',
    fn: scanTsFiles,
  });

  // 在构建前扫描文件
  api.register({
    key: 'onBuildBefore',
    fn: scanTsFiles,
  });

  // 注册自定义Markdown标签解析器
  api.register({
    key: 'dumi.registerCompiler',
    fn: ({ parser }: any) => {
      parser.mdParser.use((md: any) => {
        const originRule = md.renderer.rules.html_block;
        md.renderer.rules.html_block = (tokens: any[], idx: number, options: any, env: any, self: any) => {
          const token = tokens[idx];
          const content = token.content;
          
          // 匹配<ApiTable src="文件名" />标签
          const apiTableMatch = content.match(/<ApiTable\s+src="([^"]+)"\s*\/?>/);
          if (apiTableMatch) {
            const filePath = apiTableMatch[1];
            const apiItems = findAndParseFile(filePath, api);
            
            // 返回处理后的内容
            if (apiItems) {
              return generateApiTable(apiItems);
            } else {
              return `<div style="color: red">未找到文件: ${filePath}</div>`;
            }
          }
          
          return originRule(tokens, idx, options, env, self);
        };
      });
    },
  });

  // 注册ApiTable组件
  api.register({
    key: 'dumi.registerBuildins',
    fn: () => {
      return {
        ApiTable: path.join(__dirname, './builtins/ApiTable.tsx'),
      };
    },
  });

  // 注册API路由中间件，用于前端获取API数据
  api.onBeforeMiddleware(({ app }: { app: any }) => {
    app.get('/api/ts-api', (req: any, res: any) => {
      const filePath = req.query.path as string;
      if (!filePath) {
        return res.status(400).json({ error: '缺少path参数' });
      }
      
      const apiItems = findAndParseFile(filePath, api);
      if (apiItems) {
        res.json(apiItems);
      } else {
        res.status(404).json({ error: `未找到文件: ${filePath}` });
      }
    });
  });
}; 