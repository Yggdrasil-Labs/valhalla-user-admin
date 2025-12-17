/**
 * 全局类型声明
 */

// SVG 文件模块声明
declare module '*.svg' {
  const svgUrl: string
  export default svgUrl
}

// 全局常量声明
declare const __APP_VERSION__: string
