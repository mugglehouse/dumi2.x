import React, { type FC } from 'react';

interface Demo7Props {
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

export const Demo7: FC<Demo7Props> = ({ title, description, code }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{description}</p>
            <code>{code}</code>
        </>
    )
}
export default Demo7;