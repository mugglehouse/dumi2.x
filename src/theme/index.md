---
title: 自定义主题
toc: content
---
<!-- <Foo barValue="red"></Foo> -->
## 主题结构
<Tree>
  <ul>
    <li>
      theme
      <ul>
        <li>
          builtins
          <small>全局组件，注册的组件可直接在 Markdown 中使用</small>
          <ul>
            <li>
              Hello
              <small>{Component}/index.tsx 会被识别，可在 md 里使用 &lt;Hello&gt;&lt;/Hello&gt;</small>
              <ul>
                <li>index.tsx</li>
              </ul>
            </li>
            <li>
              World.tsx
              <small>{Component}.tsx 会被识别，可在 md 里使用 &lt;World&gt;&lt;/World&gt;</small>
            </li>
          </ul>
        </li>
        <li>
          locales
          <small>国际化文案，通过 `import { useIntl, FormattedMessage } from 'dumi'` 来调用文案，自动根据当前的 locale 切换</small>
          <ul>
            <li>zh-CN.json</li>
          </ul>
        </li>
        <li>
          layouts
          <small>布局组件，会被 dumi 直接引用</small>
          <ul>
            <li>
              GlobalLayout
              <small>全局 Layout，通常用来放置 ConfigProvider</small>
            </li>
            <li>
              DocLayout
              <small>文档 Layout，包含导航、侧边菜单、TOC 等，包裹 Markdown 正文做渲染</small>
            </li>
            <li>
              DemoLayout
              <small>组件示例 Layout，需要控制 demo 独立访问页（`/~demos/:id`）的布局时使用</small>
            </li>
          </ul>
        </li>
        <li>
          slots
          <small>局部组件（具体有哪些组件取决于主题包实现，应由布局组件引用，以下仅为举例示意）</small>
          <ul>
            <li>Navbar <small>导航栏</small></li>
            <li>NavbarLogo <small>导航栏 LOGO 区域</small></li>
            <li>SideMenu <small>侧边栏</small></li>
            <li>Homepage <small>首页内容</small></li>
            <li>HomepageHero <small>首页 Hero 区域</small></li>
          </ul>
        </li>
        <li>
          plugin
          <small>dumi 插件文件夹，plugin/index.ts（也可以是 plugin.ts）会被自动注册为插件</small>
          <ul>
            <li>index.ts</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</Tree>

## 全局组件
<ColorPicker></ColorPicker>