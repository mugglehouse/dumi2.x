// Foo.tsx
import React, { type FC } from 'react';

const Foo: FC<{ barValue: string }> = (props) => (
  <h1>当前 barValue 属性值为：{props.barValue}</h1>
);

export default Foo;