import React, { type FC } from 'react';

interface Test1bProps {
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

export const Test1: FC<Test1bProps> = ({ title, description, code }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{description}</p>
            <code>{code}</code>
        </>
    )
}   

interface Test2Props {
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

export const Test2: FC<Test2Props> = ({ title, description, code }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{description}</p>
            <code>{code}</code>
        </>
    )
}
// export { Test1, Test2 };