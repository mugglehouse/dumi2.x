import React, { type FC } from 'react';

interface ObjProps {
    /**
     * @description a
     * @default 'a'
     */
    a: string;
    /**
     * @description b
     * @default 1
     */
    b: number;
    /**
     * @description c
     * @default true
     */
    c: boolean;
}

interface Test4bProps {
    /**
     * @description 描述3
     * @default 'hello'
     */
    title: string;
    /** 
     * @description 描述3
     * @default 'world'
     */
    description: string;
    /**
     * @description 代码3
     * @default 'code'
     */
    code: string | string[];
    /**
     * @description ObjProps
     * @default {a: 'a', b: 1, c: true}
     */
    obj: ObjProps;
}

export const Test4: FC<Test4bProps> = ({ title, description, code, obj }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{description}</p>
            <code>{code}</code>
            <div>
                <div>a: {obj.a}</div>
                <div>b: {obj.b}</div>
                <div>c: {String(obj.c)}</div>
            </div>
        </>
    )
}

export default Test4;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Obj = React.forwardRef((props: ObjProps, ref) => (<></>)) 

export interface PlayerProps {
    /**
     * @description 播放资源vid
     */
    vid: string;
    /**
     * @description 播放器容器样式
     */

    posterConfig?: {
      /**
       * @description 使用图片地址指定封面图
       */
      src?: string;
      /**
       * @description 使用转码出来的第一帧图片作为封面图，默认 false
       */
      vidFirstPic?: boolean;
      /**
       * @description 视频 vid
       * 使用 *vidFirstPic* 时建议设置该值，否则重播时无封面图（中台播放器 bug）。
       */
      vid?: string;
      /**
       * @description hz - 横图，vt - 竖图
       */
      dir?: 'hz' | 'vt';
    },
    /**
     * @description 是否启用自定义封面图
     * 使用 *enableCustomPoster* 时，posterConfig 要有src 指定封面图 。
     * @default false
     */
    enableCustomPoster?: boolean;
    /**
     * @description 是否开启双倍速播放
     * @default false
     */
    enableDoubleSpeedPlaybackByLongPress: boolean;
    /**
     * @description 播放器是否使用cover属性
     * @default false
     */
    isPosterCover?: boolean;
    /**
     * @description 播放器高度
     */
    height?: string | number;
    /**
     * @description 播放器宽度
     */
    width?: string | number;
    /**
     * @description 容器className
     */
    className?: string;
    /**
     * @description 播放器起播点
     * @default 0
     */
    startTime?: number;
    /**
     * @description player className
     */
    playerClassName?: string;
    /**
     * @description disableCtrlbar
     */
    disableCtrlbar?: boolean;
    /**
     * @description 播放器事件的回调
     */
 
    hideProgress?: boolean;
    /**
     * @description 是否隐藏试看的提示tip
     */
    hidePreviewTip?: boolean;

    /**
     * @description 播放器创建的 config 参数
     */
    playerInitConfig?: {
      /**
       * @description 是否启用 vinfo 缓存能力
       */
      enableVinfoCache?: boolean;
      /**
       * @description vinfo缓存的最大条数
       */
      maxVinfoCacheCount?: number;
      /**
       * @description 其他配置
       */
      [key: string]: any;
    };
    /**
     * @description 播放器创建的 options 参数
     */
    playerOptions?: {
      /**
       * @description 自定义播放器版本号，如 '1.33.0'
       */
      version?: string;
      /**
       * @description 自定义播放器js资源缓存时间，单位：秒
       */
      cacheMaxAge?: number;
      /**
       * @description 其他配置
       */
      [key: string]: any;
    };
    /**
     * @description 播放器进度条展示控制
     * [progressBarVisibleSeconds] 内视频隐藏进度条，滑动进度条区域时才进行显示
     */
    progressBarVisibleSeconds?: number;
    /**
     * @description 透传 props 给 Player 容器
     */
    playerContainerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    /**
     * @description 是否开启双击点赞功能
     * @default false
     */
    enableDoubleClickLike?: boolean
    /**
     * @description 识别为双击事件的毫秒数
     * @default 300
     */
    doubleClickDelayTime?: number;
    /**
     * @description 双击事件
     */
    onDoubleClick?: (e: MouseEvent) => void;
    /**
    /**
     * @description 视频播放器点击，如果对容器点击默认行为想修改，可以传该方法
     */
    onPlayerContainerClick?: (e: React.MouseEvent) => void;
    /**
     * @description 点击播放按钮
     */
    onPlayIconClick?: (e: React.MouseEvent) => void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PlayerPropsData = (props: PlayerProps) => (<></>);
