import React, { type FC } from 'react';

interface Demo5Props {
    /**
     * @description 描述1
     * @default 'hello'
     */
    title: string;
    /**
     * @description 描述1
     * @default 'world'
     */
    description: string;
    /**
     * @description 代码1
     * @default 'code'
     */
    code: string | string[];
}

export const Demo5: FC<Demo5Props> = ({ title, description, code }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{description}</p>
            <code>{code}</code>
        </>
    )
}   

interface Demo6Props {
    /**
     * @description 描述2
     * @default 'hello'
     */
    title: string;
    /**
     * @description 描述2
     * @default 'world'
     */
    description: string;
    /**
     * @description 代码2
     * @default 'code'
     */
    code: string | string[];
}

export const Demo6: FC<Demo6Props> = ({ title, description, code }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{description}</p>
            <code>{code}</code>
        </>
    )
}
// export { Test1, Test2 };