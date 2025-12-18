<div align="center">

# valhalla-user-admin

[![CI](https://github.com/Yggdrasil-Labs/valhalla-user-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/Yggdrasil-Labs/valhalla-user-admin/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Yggdrasil-Labs/valhalla-user-admin/graph/badge.svg?token=8PGPHIE04N)](https://codecov.io/gh/Yggdrasil-Labs/valhalla-user-admin)

</div>

Valhalla User Admin - 用户管理后台系统

## 📚 文档

详细的开发文档和最佳实践请查看 [docs/README.md](./docs/README.md)。

### 快速导航

- 🚀 [项目设置](./docs/project-setup.md) - 环境配置、依赖安装、启动项目
- 📖 [开发指南](./docs/development-guide.md) - 项目结构、技术栈、开发流程
- 📋 [编码规范](./docs/coding-standards.md) - Vue、TypeScript、ESLint 规范
- 🔄 [Git 工作流](./docs/git-workflow.md) - 分支管理、提交规范、代码审查
- 🧪 [测试指南](./docs/testing-guide.md) - 单元测试、集成测试、E2E 测试
- 🚀 [部署指南](./docs/deployment-guide.md) - 构建、发布、CI/CD 流程
- 💡 [最佳实践](./docs/best-practices.md) - 性能优化、安全、可维护性
- ❓ [故障排除](./docs/troubleshooting.md) - 常见问题和解决方案

## Project Structure

```
valhalla-user-admin
├── node_modules
├── public              # 静态资源（favicon、manifest 等）
├── src
│   ├── api             # 请求封装与接口模块
|   |   ├── https.ts    # Axios 封装
|   |   ├── request.ts  # 全局拦截器
|   |   └── modules     # 各业务模块API
│   ├── assets          # 静态资源
│   ├── components      # 通用组件
│   ├── composables     # 组合式函数
│   ├── layouts         # 布局
│   ├── locales         # 国际化
│   ├── pages           # 页面
│   ├── router          # 路由
│   ├── stores          # 状态管理
│   ├── types           # 类型声明
│   ├── utils           # 工具类
│   ├── App.vue
│   └── main.ts
├── .env.example        # 环境变量示例
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 项目特色

- ⚡ **现代化技术栈**: Vue 3 + TypeScript + Vite
- 🔧 **开箱即用**: 预配置 ESLint、Prettier、Husky
- 🧪 **完整测试**: Vitest + Playwright + Testing Library
- 🌍 **国际化支持**: Vue I18n 多语言支持
- 📦 **自动导入**: 组件和 API 自动导入
- 🚀 **性能优化**: 代码分割、懒加载、缓存策略
- 🔒 **类型安全**: 完整的 TypeScript 类型定义
- 📱 **响应式设计**: 移动端适配和 PWA 支持

## Core Dependencies

- [@vueuse/core](https://vueuse.org/): 组合式函数工具库
- [axios](https://axios-http.com/zh/docs/intro): 基于promise可以用于浏览器和node.js的网络请求库
- [vue](https://cn.vuejs.org/): 渐进式Javascript框架
- [vue-i18n](https://vue-i18n.intlify.dev/): Vue多语言插件
- [vue-router](https://router.vuejs.org/zh/): Vue路由
- [pinia](https://pinia.vuejs.org/zh/): Vue状态管理库

## Project Setup

```sh
# install dependencies
pnpm install

# serve with hot reload at localhost:5173
pnpm run dev

# build for production with minification
pnpm run build

# lint
pnpm run lint

# run tests
pnpm test

# run tests with coverage
pnpm test:coverage

# run tests in watch mode
pnpm test:watch

# open test UI
pnpm test:ui

# check dependencies
pnpm run dep:check

# dry run release
pnpm run release:dry-run
```
