# 项目设置

本文档介绍了如何设置 Asgard Frontend Template 项目的开发环境。

## 📋 目录

- [环境要求](#环境要求)
- [项目初始化](#项目初始化)
- [开发环境配置](#开发环境配置)
- [IDE 配置](#ide-配置)
- [浏览器扩展](#浏览器扩展)

## 🔧 环境要求

### 必需软件

- **Node.js**: >= 22.14.0
- **pnpm**: >= 10.18.3 (推荐包管理器)
- **Git**: 最新版本

### 推荐软件

- **VS Code**: 推荐的代码编辑器
- **Chrome/Edge**: 用于开发和调试
- **Docker**: 用于容器化部署（可选）

## 🚀 项目初始化

### 1. 克隆项目

```bash
# 克隆项目到本地
git clone <repository-url>
cd asgard-frontend-template
```

### 2. 安装依赖

```bash
# 使用 pnpm 安装依赖（推荐）
pnpm install

# 或者使用 npm
npm install

# 或者使用 yarn
yarn install
```

### 3. 环境配置

```bash
# 复制环境变量示例文件
cp .env.example .env.local

# 编辑环境变量
# 根据实际需求修改 .env.local 文件
```

### 4. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 服务器将在 http://localhost:5173 启动
```

## ⚙️ 开发环境配置

### 环境变量配置

创建 `.env.local` 文件：

```bash
# 应用配置
VITE_APP_TITLE=Asgard Frontend Template
VITE_API_BASE_URL=http://localhost:8080
VITE_PORT=5173
VITE_HTTPS=false

# 开发工具配置
VITE_DEVTOOLS=true
VITE_MOCK_API=false
```

### 代理配置

如果需要代理 API 请求，在 `vite.config.ts` 中配置：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

### 开发工具配置

#### ESLint 配置

项目使用 `@antfu/eslint-config`，配置文件位于 `eslint.config.js`：

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  ignores: [
    '.github/**',
    '.vscode/**',
  ],
  rules: {
    'no-console': ['warn', {
      allow: ['log', 'warn', 'error'],
    }],
  },
  test: true,
})
```

#### Prettier 配置

Prettier 配置已集成到 ESLint 中，无需单独配置。

#### TypeScript 配置

项目使用 TypeScript 5.9+，配置文件位于 `tsconfig.json`：

```json
{
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "files": []
}
```

## 💻 IDE 配置

### VS Code 配置

#### 推荐扩展

安装以下 VS Code 扩展：

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### 工作区设置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.codeActions.enabled": true,
  "vue.complete.casing.tags": "kebab",
  "vue.complete.casing.props": "camel"
}
```

#### 调试配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    },
    {
      "name": "Attach to Chrome",
      "type": "chrome",
      "request": "attach",
      "port": 9222,
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### WebStorm 配置

#### 项目设置

1. 打开 **File > Settings > Languages & Frameworks > TypeScript**
2. 设置 TypeScript 版本为 "Use TypeScript service"
3. 启用 "Enable TypeScript Compiler"

#### 代码格式化

1. 打开 **File > Settings > Editor > Code Style**
2. 选择 "Prettier" 作为代码格式化工具
3. 启用 "Reformat code on save"

## 🌐 浏览器扩展

### 开发工具扩展

#### Vue DevTools

- **Chrome**: [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

#### React DevTools (如果使用)

- **Chrome**: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- **Firefox**: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### 调试工具

#### Redux DevTools (如果使用 Redux)

- **Chrome**: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- **Firefox**: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## 🔧 开发工具

### Git Hooks

项目使用 Husky 管理 Git hooks：

```bash
# 安装 Git hooks
pnpm prepare

# 手动运行 pre-commit hook
pnpm lint-staged
```

### 代码质量检查

```bash
# 运行 ESLint 检查
pnpm lint

# 自动修复 ESLint 问题
pnpm lint:fix

# 运行 TypeScript 类型检查
pnpm type-check
```

### 测试工具

```bash
# 运行单元测试
pnpm test

# 运行 E2E 测试
pnpm test:e2e

# 生成测试覆盖率报告
pnpm test:coverage
```

## 📦 包管理

### pnpm 配置

项目使用 pnpm 作为包管理器，配置文件 `.npmrc`：

```
# 使用国内镜像源
registry=https://registry.npmmirror.com

# 启用严格模式
strict-peer-dependencies=false

# 自动安装 peer dependencies
auto-install-peers=true
```

### 依赖管理

```bash
# 添加依赖
pnpm add <package-name>

# 添加开发依赖
pnpm add -D <package-name>

# 更新依赖
pnpm update

# 检查过时的依赖
pnpm outdated

# 检查依赖安全性
pnpm audit
```

## 🐳 Docker 开发环境

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 5173

# 启动开发服务器
CMD ["pnpm", "dev", "--host"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - '5173:5173'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: pnpm dev --host
```

## 🔍 故障排除

### 常见问题

1. **端口被占用**

   ```bash
   # 查找占用端口的进程
   lsof -i :5173

   # 终止进程
   kill -9 <PID>
   ```

2. **依赖安装失败**

   ```bash
   # 清理缓存
   pnpm store prune

   # 删除 node_modules 重新安装
   rm -rf node_modules
   pnpm install
   ```

3. **TypeScript 类型错误**

   ```bash
   # 运行类型检查
   pnpm type-check

   # 重启 TypeScript 服务
   # VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
   ```

### 获取帮助

- 查看 [故障排除文档](./troubleshooting.md)
- 检查项目 Issues
- 参考相关技术文档

## 📚 相关文档

- [开发指南](./development-guide.md) - 项目结构和开发流程
- [编码规范](./coding-standards.md) - 编码规范和最佳实践
- [测试指南](./testing-guide.md) - 测试策略和工具使用
- [故障排除](./troubleshooting.md) - 常见问题和解决方案

---

**下一步**: 查看 [开发指南](./development-guide.md) 了解项目结构和开发流程。
