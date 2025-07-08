/**
 * 箭头函数示例
 * @param text - 要处理的文本
 * @returns 处理后的文本
 */
export const processText = (text: string): string => {
  return text.toUpperCase();
};

/**
 * 函数表达式示例
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @returns 两数之和
 */
export const sum = function(a: number, b: number): number {
  return a + b;
};

/**
 * 默认参数示例
 * @param name - 名称
 * @param greeting - 问候语
 * @returns 完整问候语
 */
export const greet = (name: string, greeting: string = "Hello"): string => {
  return `${greeting}, ${name}!`;
};

export interface WizardInterface {
  /** 属性1 
   * @defaultValue hellp
   * @readonly
   * @deprecated
  */
  key1: number;

  /** 属性2 */
  key2: string;
}