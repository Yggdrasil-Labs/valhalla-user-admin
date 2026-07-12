# 环境变量配置文档

<!-- ⚠️ 本文件由脚本自动生成，请勿手动编辑 -->

Last generated: 2026-07-12

## 概述

本项目采用三层环境变量机制，优先级从高到低：

1. **运行时注入**（Docker 容器启动时通过 `entrypoint.sh` 生成 `config.js`）
2. **构建时环境变量**（Vite `.env` 文件或构建命令 `VITE_*` 变量）
3. **代码内默认值**（`src/config/env.ts` 中按 MODE 区分的 `ENV_DEFAULTS`）

## 环境变量清单

| 变量名 | 来源 | 默认值 | 说明 | 注入方式 |
|--------|------|--------|------|----------|
| `VITE_APP_NAME` | `.env.example`, `src/config/env.ts` | `Valhalla User Admin` (dev: `Valhalla User Admin (Development)`, test: `Valhalla User Admin (Test)`, prod: `Valhalla User Admin (Production)`) | 应用名称，用于页面标题和品牌展示 | 构建时（Vite env） |
| `VITE_API_BASE_URL` | `.env.example`, `src/config/env.ts`, `public/config.js`, `entrypoint.sh` | `http://localhost:8080` (dev), `https://test-api.yggdrasil-labs.com` (test), `https://api.yggdrasil-labs.com` (prod) | API 基础地址，所有 HTTP 请求的 baseURL | 运行时优先（Docker `entrypoint.sh` → `window.__APP_RUNTIME_CONFIG__`），回退到构建时 env，再回退到按 MODE 的默认值 |
| `CONFIG_PATH` | `entrypoint.sh` | `/usr/share/nginx/html/config.js` | Docker 容器内 `config.js` 的输出路径 | 运行时（Docker 环境变量） |
| `MODE` | Vite 内置 (`import.meta.env.MODE`) | `development` | Vite 构建模式，决定加载哪套默认配置。取值：`development` / `test` / `production` | 构建时（Vite 自动注入） |
| `DEV` | Vite 内置 (`import.meta.env.DEV`) | `true`（开发模式） | 是否为开发模式（boolean） | 构建时（Vite 自动注入） |
| `PROD` | Vite 内置 (`import.meta.env.PROD`) | `false`（开发模式） | 是否为生产模式（boolean） | 构建时（Vite 自动注入） |
| `__APP_VERSION__` | `vite.config.ts` (define) | `package.json` 中的 `version` 字段 | 应用版本号，编译时注入为全局常量 | 构建时（Vite define） |

## 运行时配置机制

### Docker 部署流程

```
Docker -e VITE_API_BASE_URL=xxx
  → entrypoint.sh 生成 /usr/share/nginx/html/config.js
    → window.__APP_RUNTIME_CONFIG__ = { VITE_API_BASE_URL: "xxx" }
      → src/config/env.ts 中 resolveApiBaseUrl() 优先读取此值
```

### 优先级链（VITE_API_BASE_URL）

```
window.__APP_RUNTIME_CONFIG__.VITE_API_BASE_URL   （最高 - 运行时）
  ↓ 为空时回退
import.meta.env.VITE_API_BASE_URL                 （中 - 构建时）
  ↓ 为空时回退
ENV_DEFAULTS[MODE].API_BASE_URL                   （最低 - 代码默认值）
```

### 运行时配置接口

```typescript
interface AppRuntimeConfig {
  VITE_API_BASE_URL?: string
}

// 全局挂载点
window.__APP_RUNTIME_CONFIG__?: AppRuntimeConfig
```

## 环境模式映射

| Vite MODE | APP_ENV | 说明 |
|-----------|---------|------|
| `development` | `dev` | 本地开发 |
| `test` | `test` | 测试环境 |
| `production` | `prod` | 生产环境 |

## 导出的环境配置对象

`src/config/env.ts` 导出以下值供应用使用：

```typescript
export const env = {
  MODE,        // 'development' | 'test' | 'production'
  APP_ENV,     // 'dev' | 'test' | 'prod'
  APP_NAME,    // 应用名称
  APP_VERSION, // 版本号
  API_BASE_URL // API 基础地址（经过三层优先级解析）
} as const

export const isDev: boolean   // import.meta.env.DEV
export const isProd: boolean  // import.meta.env.PROD
export const isTest: boolean  // import.meta.env.MODE === 'test'
```

## 文件说明

| 文件 | 用途 |
|------|------|
| `.env.example` | 环境变量模板，开发者参考用 |
| `src/config/env.ts` | 环境变量封装模块，统一解析和验证 |
| `public/config.js` | 运行时配置占位文件（开发时为空对象） |
| `entrypoint.sh` | Docker 容器启动脚本，根据环境变量生成 `config.js` |
