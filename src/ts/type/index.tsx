import { noop } from 'antd/es/_util/warning';
import React from 'react';

/** 头像组件 */
interface AvatarProps {
    /** 头像 */
    avatar?: string;

    /** 用户UID */
    suid?: string;

    /** 昵称 */
    name?: string;

    /** 用户介绍 */
    source?: string;

    /** vip 徽标 */
    vipIconURL?: string;

    /** 点击头像 */
    onClick?: (data: { suid: string, avatar: string, name: string, source: string }) => void;

    /** 根节点类名 */
    className?: string;
  }
  

  export const Avatar = (props: AvatarProps) => {
    const {
      avatar = '',
      vipIconURL = '',
      onClick = noop,
      name = '',
      suid = '',
      source = '',
    } = props || {};
  
    if (!avatar) return null;
  
    return (
      <div>
      </div>
    );
  };
  