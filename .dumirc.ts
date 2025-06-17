import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'muggle-ui',
    logo: 'https://avatars.githubusercontent.com/u/104442427?s=200&v=4',
    footer: 'Copyright © 2025 dumi2.x',
  },
  apiParser: {},
  resolve: {
    entryFile: './src/index.ts',
  },
  // presets: ['@dumijs/preset-vue'],
});
