# 环境变量配置文档 - 变更日志

<!-- ⚠️ 本文件由脚本自动生成，请勿手动编辑 -->

## 2026-07-12 — 初始生成

- 初始生成环境变量配置文档
- 数据源：`.env.example`、`src/config/env.ts`、`public/config.js`、`entrypoint.sh`
- 记录 7 个环境变量（2 个自定义 VITE_* + 1 个 Docker 专用 + 4 个 Vite 内置/构建注入）
- 记录运行时配置机制和三层优先级链
