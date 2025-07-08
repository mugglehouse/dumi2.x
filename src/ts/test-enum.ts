/**
 * 颜色枚举
 * 定义基本颜色
 */
export enum Colors {
  /** 红色 */
  Red = '#ff0000',
  /** 绿色 */
  Green = '#00ff00',
  /** 蓝色 */
  Blue = '#0000ff'
}

/**
 * 方向枚举
 * 定义方向常量
 */
export enum Direction {
  /** 上 */
  Up,
  /** 下 */
  Down,
  /** 左 */
  Left,
  /** 右 */
  Right
}

/**
 * 状态枚举
 * 定义不同的状态值
 */
export enum Status {
  /** 成功状态 */
  Success = 200,
  /** 未授权状态 */
  Unauthorized = 401,
  /** 服务器错误状态 */
  ServerError = 500
}

/**
 * 使用枚举的函数示例
 * @param color - 颜色值
 * @param direction - 方向值
 * @returns 状态值
 */
export function processEnum(color: Colors, direction: Direction): Status {
  console.log(`处理颜色: ${color}, 方向: ${direction}`);
  return Status.Success;
} 