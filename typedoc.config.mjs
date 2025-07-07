const config = {
    entryPoints: ["./src/ts/*.ts"],
    out: "./.dumi/tmp/typedoc",
    plugin: ["typedoc-plugin-markdown"],
    theme: "markdown",
    readme: "none",
    disableSources: true,
    indexFormat: "table",
    parametersFormat: "table",
    interfacePropertiesFormat: "table",
    classPropertiesFormat: "table",
    typeAliasPropertiesFormat: "table",
    enumMembersFormat: "table",
    propertyMembersFormat: "table",
    typeDeclarationFormat: "table",
    entryFileName: "index",
    skipErrorChecking: true,
    hidePageHeader: true,
    hideBreadcrumbs: true,
    hidePageTitle: true,
    router: "structure",
    // 添加以下配置以生成更适合嵌入的文档
    // excludePrivate: true,
    // excludeProtected: true,
    // excludeExternals: true,
  };
  
  export default config;