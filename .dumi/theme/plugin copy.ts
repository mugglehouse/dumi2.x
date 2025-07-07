import { IApi } from 'dumi';
import * as fs from 'fs';
import * as path from 'path';
import { Application, TSConfigReader, TypeDocReader } from 'typedoc';

// TypeDoc内容缓存
const typeDocCache = new Map<string, string>();

export default (api: IApi) => {
  // 初始化TypeDoc应用
  let app: Application;
  
  // 生成TypeDoc内容并缓存
  const generateTypeDoc = async () => {
    try {
      // 指定输出目录
      const outputDirectory = path.join(process.cwd(), '.dumi/tmp/typedoc');
      
      // 确保输出目录存在
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }
      
      // 使用命令行方式运行TypeDoc，确保文档生成
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);
      
      console.log('开始生成TypeDoc文档...');
      await execPromise(`npx typedoc --out "${outputDirectory}" --plugin typedoc-plugin-markdown --theme markdown ./src/ts/*.ts`);
      console.log('TypeDoc命令执行完成');
      
      // 清空缓存
      typeDocCache.clear();
      
      // 读取生成的文件并缓存
      const loadTypeDocFiles = (dir: string, baseDir = outputDirectory) => {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          console.log(`目录 ${dir} 中的文件:`, files);
          
          files.forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              loadTypeDocFiles(filePath, baseDir);
            } else if (file.endsWith('.md')) {
              const relativePath = path.relative(baseDir, filePath).replace(/\.md$/, '');
              const content = fs.readFileSync(filePath, 'utf-8');
              typeDocCache.set(relativePath, content);
              console.log('缓存文档:', relativePath);
            }
          });
        } else {
          console.log(`目录不存在: ${dir}`);
        }
      };
      
      loadTypeDocFiles(outputDirectory);
      console.log('TypeDoc文档生成成功并缓存到内存');
      console.log('缓存键数量:', typeDocCache.size);
      console.log('缓存键:', Array.from(typeDocCache.keys()));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('TypeDoc文档生成失败:', errorMessage);
    }
  };

  // 在构建前生成TypeDoc
  api.register({
    key: 'onBuildBefore',
    fn: generateTypeDoc,
  });

  // 在开发服务器启动时生成TypeDoc
  api.register({
    key: 'onDevCompileDone',
    fn: generateTypeDoc,
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
          
          // 匹配<AutoApi src="相对路径" />标签
          const autoApiMatch = content.match(/<AutoApi\s+src="([^"]+)"\s*\/>/);
          if (autoApiMatch) {
            const relativePath = autoApiMatch[1];
            
            // 从缓存中获取内容
            if (typeDocCache.has(relativePath)) {
              return typeDocCache.get(relativePath);
            } else {
              return `<div style="color: red">API文档不存在: ${relativePath}</div>`;
            }
          }
          
          return originRule(tokens, idx, options, env, self);
        };
      });
    },
  });

  // 注册API路由中间件
  api.onBeforeMiddleware(({ app }) => {
    app.get('/api/typedoc', (req, res) => {
      const docPath = req.query.path;
      console.log('请求路径参数:', req.query, docPath);
      
      if (!docPath) {
        return res.status(400).send('缺少path参数');
      }
  
      // 从缓存中获取内容
      if (typeDocCache.has(docPath as string)) {
        res.send(typeDocCache.get(docPath as string));
      } else {
        console.log('缓存中不存在:', docPath);
        console.log('当前缓存键:', Array.from(typeDocCache.keys()));
        res.status(404).send(`API文档不存在: ${docPath}`);
      }
    });
  });

  // 注册AutoApi组件
  api.register({
    key: 'dumi.registerBuildins',
    fn: () => {
      return {
        AutoApi: path.join(__dirname, './builtins/TypeDoc.tsx'),
      };
    },
  });
};