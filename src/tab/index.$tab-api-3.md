## demo3：二级属性测试
可以定义一个空组件，使得二级属性可以被识别
```tsx
import Test4 from './demo3';

export default () => {
    return <Test4 title="hello" description="world" code="code" obj={{
        a: 'a',
        b: 1,
        c: true
    }} />
}
```

<API id='Test4'></API>
<API id='Obj'></API>
<API id='PlayerPropsData'></API>、