# AGENTS.md

本文件是智能体的唯一入口，保持为"地图而不是手册"。

## 项目概述

Valhalla User Admin 是 Valhalla 用户体系的管理后台前端，基于 Vue 3 + TypeScript + Vite 7 + Naive UI 构建。为管理员提供用户、角色、权限和 API 资源的 CRUD 管理面板，消费 valhalla-user 后端 REST API。支持中英文国际化，通过 Docker + Nginx 部署，单镜像多环境复用。

## 全局规范

1. 智能体优先遵循项目规范（`AGENTS.md`、`ARCHITECTURE.md`、`docs/design-docs/`）。项目约束 > 智能体全局约束。
2. Git Conventional Commits，message 中文。格式：`<type>(<scope>): <中文描述>`。
3. 文档与代码冲突时以代码为准并回写文档。

## 导航

### A. 长期约束（只读，修改需架构 RFC）

- 系统边界与依赖方向：[`ARCHITECTURE.md`](./ARCHITECTURE.md)
- 工程信条：[`docs/design-docs/core-beliefs.md`](./docs/design-docs/core-beliefs.md)
- 业务领域划分：[`docs/DOMAINS.md`](./docs/DOMAINS.md)

### B. 流转文档

- 活跃版本：[`docs/active/index.md`](./docs/active/index.md)
- 版本归档：[`docs/archive/index.md`](./docs/archive/index.md)
- 技术债：[`docs/active/tech-debt-tracker.md`](./docs/active/tech-debt-tracker.md)
- 设计决策：[`docs/design-docs/index.md`](./docs/design-docs/index.md)

### C. 参考与产物

- 自动生成的文档（禁止手改）：[`docs/generated/`](./docs/generated/)

## 决策地图

| 改什么            | 去哪里                                                                     |
| ----------------- | -------------------------------------------------------------------------- |
| 新增/修改页面     | `src/pages/` — 文件系统路由，目录结构即路由                                |
| 新增 API 调用     | `src/api/modules/` — 按领域分文件，通过 `http.ts` 封装                     |
| 新增/修改组件     | `src/components/` — 按功能分类（common/layout/feedback/form/data-display） |
| 状态管理变更      | `src/stores/` — Pinia + persist，Store 是唯一 API 消费者                   |
| 国际化文案        | `src/locales/{zh-CN,en-US}/` — 按模块分 JSON 文件                          |
| 类型定义          | `src/types/` — API 响应类型（api 子目录）和 Store 类型（store 子目录）     |
| 环境变量/部署配置 | `src/config/env.ts` + `public/config.js` + `entrypoint.sh`                 |
| 样式变量/全局样式 | `src/assets/scss/base/` — variables + mixins                               |
| 添加 composable   | `src/composables/` — 组合函数统一导出                                      |

## 开发命令

```bash
pnpm dev              # 本地开发（默认 5173 端口）
pnpm build            # 生产构建
pnpm preview          # 预览构建产物
pnpm test             # 运行 Vitest（watch 模式）
pnpm test:run         # 运行 Vitest（单次）
pnpm test:coverage    # 测试覆盖率
pnpm test:e2e         # Playwright E2E 测试
pnpm lint             # ESLint 检查
pnpm lint:fix         # ESLint 自动修复
pnpm type-check       # TypeScript 类型检查（vue-tsc）
```
