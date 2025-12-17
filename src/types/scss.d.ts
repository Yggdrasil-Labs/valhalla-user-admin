/**
 * 样式文件模块类型声明
 */

// CSS 模块声明（CSS Modules）
declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// SCSS 模块声明
declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// SASS 模块声明
declare module '*.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// 为 @scss 别名路径提供类型支持
declare module '@scss/*' {
  const classes: { readonly [key: string]: string }
  export default classes
}
