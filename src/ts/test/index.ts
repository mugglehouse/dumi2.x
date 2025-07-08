// src/index.ts
/** 
 * muggle interface
 * */
export interface MuggleInterface {
    /** 属性1 
     * @defaultValue hellp
     * @readonly
     * @deprecated
    */
    key1: number;
  
    /** 属性2 */
    key2: string;
  }
  
  /** 类 */
  export class MyClass {
    /** 类的属性 */
    prop1: number
  
    /** 构造函数 */
    constructor() {
      this.prop1 = this.privateMethod1(1, 2)
    }
  
    /**
     * 静态方法
     * @param param - 参数，字符串列表
     * @returns 返回 Promise 对象
     */
    static staticMethod1(param: string[]) {
      return Promise.resolve(param)
    }
  
    /**
     * 私有方法
     * @param param1 第一个参数
     * @param param2 第二个参数
     * @returns 两数之和
     */
    private privateMethod1(param1: number, param2: number) {
      return param1 + param2
    }
    
    /** 公共方法 */
    publicMethod(param1: number, param2: number) {
      return this.prop1 + param1 + param2
    }
  }
  
  /** 类型 */
  export enum MyType {
    A = 1,
    B = 2,
    C = 3,
    D = 4
  }

export interface AddParams {
    a: number;
    b: MyType;
  }
/**
 * 这是一个加法函数。
 * @param params - 加数
 * @returns 两个加数的和
 */
export function add(params:AddParams): number {
  return params.b.reduce((acc, curr) => acc + curr, params.a);
}
  