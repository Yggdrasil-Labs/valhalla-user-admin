# 部署指南

本文档介绍了 Asgard Frontend Template 项目的构建、部署和 CI/CD 流程。

## 📋 目录

- [构建配置](#构建配置)
- [环境配置](#环境配置)
- [构建流程](#构建流程)
- [部署策略](#部署策略)
- [CI/CD 配置](#cicd-配置)
- [发布流程](#发布流程)

## 🔧 构建配置

### Vite 构建配置

项目使用 Vite 作为构建工具，配置文件位于 `vite.config.ts`：

```typescript
// vite.config.ts
export default defineConfig(({ mode, command }) => {
  const isDev = command === 'serve'
  const isProd = command === 'build'

  return {
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: isDev,
      minify: isProd ? 'esbuild' : false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
            'ui-vendor': ['@vueuse/core'],
            'http-vendor': ['axios'],
            'i18n-vendor': ['vue-i18n'],
            'store-vendor': ['pinia', 'pinia-plugin-persistedstate'],
            'common': ['src/utils', 'src/composables'],
          },
        },
      },
    },
  }
})
```

### 构建优化

1. **代码分割**: 按功能模块分割代码，提高加载性能
2. **资源优化**: 自动压缩和优化静态资源
3. **Tree Shaking**: 移除未使用的代码
4. **预加载**: 关键资源预加载

## 🌍 环境配置

### 环境变量

项目支持多环境配置，通过 `.env` 文件管理：

```bash
# .env.local (本地开发)
VITE_APP_TITLE=Asgard Frontend Template
VITE_API_BASE_URL=http://localhost:8080
VITE_PORT=5173
VITE_HTTPS=false

# .env.test (测试环境)
VITE_APP_TITLE=Asgard Frontend Template (Test)
VITE_API_BASE_URL=https://api-test.example.com
VITE_CDN_URL=https://cdn-test.example.com

# .env.production (生产环境)
VITE_APP_TITLE=Asgard Frontend Template
VITE_API_BASE_URL=https://api.example.com
VITE_CDN_URL=https://cdn.example.com
VITE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 环境变量类型定义

```typescript
// src/config/env.ts
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_PORT: string
  readonly VITE_HTTPS: string
  readonly VITE_CDN_URL?: string
  readonly VITE_ANALYTICS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export const env = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  PORT: Number(import.meta.env.VITE_PORT) || 5173,
  HTTPS: import.meta.env.VITE_HTTPS === 'true',
  CDN_URL: import.meta.env.VITE_CDN_URL,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
}
```

## 🏗 构建流程

### 构建命令

```bash
# 开发环境构建
pnpm dev

# 测试环境构建
pnpm build:test

# 生产环境构建
pnpm build

# 预览构建结果
pnpm preview
```

### 构建步骤

1. **依赖检查**: 验证所有依赖是否正确安装
2. **类型检查**: 运行 TypeScript 类型检查
3. **代码检查**: 运行 ESLint 检查
4. **测试**: 运行单元测试和集成测试
5. **构建**: 使用 Vite 构建生产版本
6. **优化**: 压缩和优化资源

### 构建脚本

```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "build:test": "vite build --mode test",
    "preview": "vite preview",
    "preview:test": "vite preview --mode test",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint . --ext .ts,.vue,.json",
    "test": "vitest run",
    "build:ci": "pnpm type-check && pnpm lint && pnpm test && pnpm build"
  }
}
```

## 🚀 部署策略

### 静态文件部署

#### Nginx 配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name example.com;
    root /var/www/asgard-frontend/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Docker 部署

```dockerfile
# Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - '80:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### CDN 部署

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // CDN 路径配置
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.css$/.test(assetInfo.name)) {
            return `static/css/[name]-[hash].${ext}`
          }
          if (/\.(?:png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `static/images/[name]-[hash].${ext}`
          }
          return `static/[ext]/[name]-[hash].${ext}`
        },
      },
    },
  },
})
```

## 🔄 CI/CD 配置

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: pnpm

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Unit tests
        run: pnpm test:run

      - name: E2E tests
        run: pnpm test:e2e

      - name: Build
        run: pnpm build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build for production
        run: pnpm build
        env:
          VITE_API_BASE_URL: ${{ secrets.PROD_API_BASE_URL }}
          VITE_CDN_URL: ${{ secrets.CDN_URL }}

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/asgard-frontend
            git pull origin main
            pnpm install
            pnpm build
            sudo systemctl reload nginx
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '22'

test:
  stage: test
  image: node:${NODE_VERSION}-alpine
  before_script:
    - npm install -g pnpm
    - pnpm install
  script:
    - pnpm type-check
    - pnpm lint
    - pnpm test:run
    - pnpm test:e2e
  artifacts:
    reports:
      junit: test-results/results.xml
    paths:
      - coverage/

build:
  stage: build
  image: node:${NODE_VERSION}-alpine
  before_script:
    - npm install -g pnpm
    - pnpm install
  script:
    - pnpm build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan -H $SERVER_HOST >> ~/.ssh/known_hosts
  script:
    - scp -r dist/* $SERVER_USER@$SERVER_HOST:/var/www/asgard-frontend/
    - ssh $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"
  only:
    - main
```

## 📦 发布流程

### Semantic Release 配置

项目使用 `semantic-release` 自动化版本管理和发布：

```json
// package.json
{
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      [
        "@semantic-release/changelog",
        {
          "changelogFile": "CHANGELOG.md"
        }
      ],
      [
        "@semantic-release/npm",
        {
          "npmPublish": false
        }
      ],
      "@semantic-release/github",
      [
        "@semantic-release/git",
        {
          "assets": ["CHANGELOG.md", "package.json"],
          "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
          "gitOptions": {
            "signed": true
          }
        }
      ]
    ]
  }
}
```

### 发布命令

```bash
# 本地验证发布流程（不实际发布）
pnpm release:dry-run

# CI 环境发布
pnpm release:ci

# 手动发布
pnpm release
```

### 版本管理

项目遵循 [Semantic Versioning](https://semver.org/) 规范：

- **MAJOR**: 不兼容的 API 变更
- **MINOR**: 向后兼容的功能新增
- **PATCH**: 向后兼容的问题修复

### 提交信息规范

```bash
# 功能新增
git commit -m "feat: add user authentication"

# 问题修复
git commit -m "fix: resolve login validation issue"

# 破坏性变更
git commit -m "feat!: remove deprecated API endpoint"

# 文档更新
git commit -m "docs: update deployment guide"
```

## 📊 监控与日志

### 性能监控

```typescript
// src/utils/analytics.ts
export function trackPageView(page: string) {
  if (typeof gtag !== 'undefined') {
    gtag('config', env.ANALYTICS_ID, {
      page_title: page,
      page_location: window.location.href,
    })
  }
}

export function trackEvent(action: string, category: string, label?: string) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    })
  }
}
```

### 错误监控

```typescript
// src/utils/errorTracking.ts
export function initErrorTracking() {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // 发送错误到监控服务
    sendErrorToMonitoring(event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // 发送错误到监控服务
    sendErrorToMonitoring(event.reason)
  })
}

function sendErrorToMonitoring(error: Error) {
  // 实现错误上报逻辑
  fetch('/api/errors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }),
  }).catch(console.error)
}
```

### 构建监控

```typescript
// scripts/build-monitor.ts
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const buildInfo = {
  version: process.env.npm_package_version,
  buildTime: new Date().toISOString(),
  gitCommit: execSync('git rev-parse HEAD').toString().trim(),
  gitBranch: execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
}

// 生成构建信息文件
fs.writeFileSync(
  path.join('dist', 'build-info.json'),
  JSON.stringify(buildInfo, null, 2)
)

console.log('Build info generated:', buildInfo)
```

## 🔒 安全配置

### 内容安全策略 (CSP)

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
"
/>

```

### HTTPS 配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: env.HTTPS
      ? {
          key: fs.readFileSync('path/to/key.pem'),
          cert: fs.readFileSync('path/to/cert.pem'),
        }
      : false,
  },
})
```

## 📚 相关文档

- [开发指南](./development-guide.md) - 项目结构和开发流程
- [测试指南](./testing-guide.md) - 测试策略和工具使用
- [最佳实践](./best-practices.md) - 性能优化和安全指南

---

**下一步**: 查看 [最佳实践](./best-practices.md) 了解性能优化和安全指南。
