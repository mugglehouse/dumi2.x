import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'muggle-ui',
    logo: 'https://avatars.githubusercontent.com/u/104442427?s=200&v=4',
    footer: 'Copyright © 2025 dumi2.x',
    github: 'https://github.com/mugglehouse/dumi2.x',
    apiHeader: {
      pkg: 'muggle API',
      match: ['muggle-ui'],
      source: 'https://github.com/mugglehouse/dumi2.x/blob/main/src',
      docUrl: 'https://github.com/mugglehouse/dumi2.x/blob/main/src',
    },
    footerConfig:{
      bottom: 'this is muggle-ui',
      copyright: 'Copyright © 2025 dumi2.x',
      theme: 'dark',
      columns:[
        {
          title: 'Muggle House',
          items: [
            {
              title: 'Github',
              url: 'https://github.com/mugglehouse/dumi2.x',
              openExternal: true,
            }
          ]
        }
      ]
    },
    // 自定义API解析器配置
    apiConfig: {
      // 源代码所在路径，默认为 'src'
      sourcePath: 'src',
      // TypeScript文件所在子目录，默认为 'ts'
      tsPath: 'ts',
      // 支持的文件扩展名，默认为 ['.ts', '.tsx']
      extensions: ['.ts', '.tsx']
    }
  },
  apiParser: {},
  resolve: {
    entryFile: './src/index.ts',
  },
  // 加载自定义插件
  // plugins: [path.join(__dirname, '.dumi/theme/plugin')],
  // presets: ['@dumijs/preset-vue'],
});
