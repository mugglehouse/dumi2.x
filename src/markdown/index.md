---
title: markdown渲染增强
toc: content
---
## 树形结构
<Tree>
  <ul>
    <li>
      src
      <ul>
        <li>components 
        <ul>
            <li>index.tsx</li>
            <li>index.md</li>
        </ul>
        </li>
      </ul>
    </li>
    <li>package.json</li>
  </ul>
</Tree>

## 代码块行高亮
```jsx {5} | pure
import React from 'react';

export default () => (
  <div>
    <h1>Hello dumi!</h1>
  </div>
);
```

## 代码块分组展示
:::code-group

```bash [npm]
npm install -D dumi
```

```bash [yarn]
yarn add -D dumi
```

```bash [pnpm]
pnpm add -D dumi
```

```ts [.dumirc.ts] {3}
import { defineConfig } from 'dumi';

export default defineConfig({
  // ...
});
```
:::


## 信息条

:::info{title=自定义标题}
这是一条普通信息
:::

:::success{title="Custom success title"}
这是一条成功信息
:::

:::warning
这是一条警告信息
:::

:::error
这是一条错误信息
:::