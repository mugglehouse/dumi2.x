import React, { type FC } from 'react';

interface Test3bProps {
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
}

export const Test3: FC<Test3bProps> = ({ title, description, code }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{description}</p>
            <code>{code}</code>
        </>
    )
}

export default Test3;
