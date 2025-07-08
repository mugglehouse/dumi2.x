/**
 * 基本类型示例
 * @param str - 字符串参数
 * @param num - 数字参数
 * @param bool - 布尔参数
 * @param arr - 数组参数
 * @param obj - 对象参数
 * @param union - 联合类型参数
 * @param intersection - 交叉类型参数
 * @param generic - 泛型参数
 * @param tuple - 元组参数
 * @param nullable - 可空参数
 * @param literal - 字面量类型参数
 * @param func - 函数类型参数
 * @param mapped - 映射类型参数
 * @param conditional - 条件类型参数
 * @returns 返回值
 */
export function testTypes(
  str: string,
  num: number,
  bool: boolean,
  arr: string[],
  obj: { key: string },
  union: string | number,
  intersection: { id: number } & { name: string },
  generic: Array<string>,
  tuple: [string, number],
  nullable: string | null | undefined,
  literal: 'a' | 'b' | 'c' | 1 | 2 | 3,
  func: (a: number) => string,
  mapped: { [K in 'a' | 'b']: boolean },
  conditional: string extends number ? true : false
): string {
  // 使用所有参数以避免lint错误
  console.log({
    str,
    num,
    bool,
    arr,
    obj,
    union,
    intersection,
    generic,
    tuple,
    nullable,
    literal,
    func,
    mapped,
    conditional
  });
  
  return `${str}-${num}`;
}

/**
 * 泛型函数示例
 * @param value - 任意类型的值
 * @returns 与输入相同类型的值
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * 高级类型示例接口
 */
export interface AdvancedTypes {
  /** 索引签名 */
  [key: string]: any;
  
  /** 只读属性 */
  readonly id: number;
  
  /** 可选属性 */
  name?: string;
  
  /** 方法签名 */
  method(param: string): void;
  
  /** 函数属性 */
  callback: (event: Event) => void;
  
  /** 泛型属性 */
  data: Map<string, any>;
  
  /** 嵌套对象 */
  nested: {
    prop1: string;
    prop2: number;
  };
}

/**
 * 箭头函数与复杂类型
 * @param record - 记录类型
 * @param partial - 部分类型
 * @param readonly - 只读类型
 * @param pick - 选取类型
 * @param omit - 省略类型
 * @param required - 必选类型
 * @returns 复杂类型
 */
export const complexTypes = (
  record: Record<string, number>,
  partial: Partial<{ a: string; b: number }>,
  readonly: Readonly<string[]>,
  pick: Pick<AdvancedTypes, 'id' | 'name'>,
  omit: Omit<AdvancedTypes, 'method' | 'callback'>,
  required: Required<{ a?: string; b?: number }>
): ReturnType<typeof identity> => {
  // 使用所有参数以避免lint错误
  console.log({
    record,
    partial,
    readonly,
    pick,
    omit,
    required
  });
  
  return null as any;
};

/**
 * 类型别名示例
 */
export type ComplexType = {
  /** 基本类型 */
  basic: string;
  /** 联合类型 */
  union: string | number | boolean;
  /** 字面量类型 */
  literals: 'small' | 'medium' | 'large' | 1 | 2 | 3;
  /** 嵌套类型 */
  nested: Promise<Array<Map<string, Set<number>>>>;
  /** 函数类型 */
  handler: {
    (event: 'click', x: number, y: number): void;
    (event: 'hover', element: HTMLElement): void;
    (event: 'key', code: string): void;
  };
  /** 条件类型 */
  dynamic: boolean extends true ? string : number;
}; 