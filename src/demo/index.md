---
nav: Components
title: demo渲染增强
toc: content
demo:
  cols: 2
---

## demo预览的两种方式
### 使用code标签
1. 可以使用分栏 ✨
2. 组件必须使用默认导出，一个code标签只能渲染一个组件
3. debug,仅在开发环境生效
4. title,description，添加组件标题和描述
5. iframe,组件与页面隔离
6. 组件代码可以实时编辑 ✨

<code src='./demo1.tsx'></code>
<code src='./demo2.tsx' title='demo2' description='我是demo2'></code>
<code src='./demo3.tsx' iframe></code>
<code src='./demo4.tsx' debug></code>

### 使用代码块引入
1. 不能使用分栏
2. 可以渲染多个组件，且可以给组件传值
3. 组件必须使用命名导出

```tsx
import { Demo5, Demo6 } from './demo5';
import Demo7 from './demo6';

export default () => {
    return (
        <>
            <Demo5 title="hello" description="world" code="code" />
            <Demo6 title="hello" description="world" code="code" />
            <Demo7 title="hello" description="world" code="code" />
        </>
    )
}
```