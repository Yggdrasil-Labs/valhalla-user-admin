# 模块依赖图 - 变更日志

<!-- ⚠️ 本文件由脚本自动生成，请勿手动编辑 -->

## 2026-07-12 — 初始生成

- 初始生成模块依赖图文档
- 数据源：`src/` 目录结构 + TypeScript/Vue import 语句分析
- 识别 13 个一级模块（含 `main.ts` 入口）
- 记录 31 条模块间依赖关系
- 生成 Mermaid 依赖图
- 标注架构约束偏离：Pages 直接调用 API modules（与 ARCHITECTURE.md 规则存在偏差）
