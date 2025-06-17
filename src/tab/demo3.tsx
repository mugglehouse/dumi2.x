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
export const Obj = (props: ObjProps) => (<></>) 