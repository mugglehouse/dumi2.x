---
title: API表格示例
toc: content
---

# API表格示例

本页面展示了如何使用自动生成的API表格。

这将自动解析`src/ts/test.ts`文件中的类型定义，并生成API表格。

## 支持的类型

目前支持以下类型的API文档生成：

- Interface (接口)
- Class (类)
- Type (类型别名)
- Function (函数)

## 如何使用

1. 在TS/TSX文件中编写符合TSDoc规范的注释
2. 在Markdown文档中使用`<ApiTable src="文件路径" />`标签
3. 文件路径是相对于`src/ts`目录的路径，无需扩展名

## TSDoc示例

```ts
/**
 * 这是一个接口描述
 */
export interface MyInterface {
  /**
   * 属性描述
   * @defaultValue 默认值
   */
  property: string;
}

/**
 * 这是一个函数描述
 * @param param1 参数1描述
 * @param param2 参数2描述
 * @returns 返回值描述
 */
export function myFunction(param1: string, param2: number): boolean {
  return true;
}
``` 

## 使用ApiTable组件

<ApiTable id="MuggleInterface"></ApiTable>

<ApiTable id="MyClass"></ApiTable>

<ApiTable id="MyType"></ApiTable>

<ApiTable id="add"></ApiTable>

22222

