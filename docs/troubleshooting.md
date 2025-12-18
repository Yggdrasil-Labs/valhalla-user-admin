# 故障排除

本文档提供了 Valhalla User Admin 项目中常见问题的解决方案和调试技巧。

## 📋 目录

- [开发环境问题](#开发环境问题)
- [构建问题](#构建问题)
- [运行时问题](#运行时问题)
- [测试问题](#测试问题)
- [部署问题](#部署问题)
- [性能问题](#性能问题)
- [调试技巧](#调试技巧)

## 🛠 开发环境问题

### Node.js 版本问题

**问题**: 项目启动失败，提示 Node.js 版本不兼容

```bash
Error: The engine "node" is incompatible with this module. Expected version ">=22.14.0". Got "18.17.0"
```

**解决方案**:

1. 检查当前 Node.js 版本：

```bash
node --version
```

2. 使用 nvm 切换到正确版本：

```bash
# 安装 nvm (如果未安装)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装并使用 Node.js 22
nvm install 22
nvm use 22
```

3. 或者使用 fnm：

```bash
# 安装 fnm
curl -fsSL https://fnm.vercel.app/install | bash

# 安装并使用 Node.js 22
fnm install 22
fnm use 22
```

### 依赖安装问题

**问题**: `pnpm install` 失败

```bash
Error: ENOENT: no such file or directory, open 'package.json'
```

**解决方案**:

1. 确保在项目根目录：

```bash
pwd
ls -la package.json
```

2. 清理缓存并重新安装：

```bash
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

3. 检查网络连接和代理设置：

```bash
pnpm config get registry
pnpm config set registry https://registry.npmmirror.com
```

### 端口占用问题

**问题**: 开发服务器启动失败，端口被占用

```bash
Error: listen EADDRINUSE: address already in use :::5173
```

**解决方案**:

1. 查找占用端口的进程：

```bash
# Windows
netstat -ano | findstr :5173

# macOS/Linux
lsof -i :5173
```

2. 终止占用端口的进程：

```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

3. 或者使用其他端口：

```bash
pnpm dev --port 3000
```

### 环境变量问题

**问题**: 环境变量未生效

**解决方案**:

1. 检查环境变量文件：

```bash
ls -la .env*
```

2. 确保环境变量以 `VITE_` 开头：

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=My App
```

3. 重启开发服务器：

```bash
pnpm dev
```

## 🏗 构建问题

### TypeScript 类型错误

**问题**: 构建时出现 TypeScript 类型错误

```bash
src/components/UserCard.vue:15:5 - error TS2322: Type 'string' is not assignable to type 'number'
```

**解决方案**:

1. 运行类型检查：

```bash
pnpm type-check
```

2. 修复类型错误：

```typescript
// ❌ 错误
const count: number = '5'

// ✅ 正确
const count: number = 5
// 或者
const count: number = Number.parseInt('5')
```

3. 使用类型断言（谨慎使用）：

```typescript
const count = '5' as unknown as number
```

### ESLint 错误

**问题**: 构建时 ESLint 检查失败

```bash
src/utils/helpers.ts:10:1 - error: 'console.log' is not allowed
```

**解决方案**:

1. 运行 ESLint 检查：

```bash
pnpm lint
```

2. 自动修复可修复的问题：

```bash
pnpm lint:fix
```

3. 手动修复问题：

```typescript
// ❌ 错误
console.log('Debug info')

// ✅ 正确
console.warn('Debug info') // 或者移除调试代码
```

### 构建内存不足

**问题**: 构建过程中内存不足

```bash
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**解决方案**:

1. 增加 Node.js 内存限制：

```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

2. 或者在 package.json 中配置：

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

3. 优化构建配置：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 减少单个 chunk 的大小
          vendor: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
})
```

## 🚀 运行时问题

### 路由问题

**问题**: 页面刷新后出现 404 错误

**解决方案**:

1. 检查服务器配置（Nginx）：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

2. 检查路由配置：

```typescript
// router/index.ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/index.vue'),
    },
  ],
})
```

### API 请求问题

**问题**: API 请求失败

```bash
Error: Network Error
```

**解决方案**:

1. 检查网络连接：

```bash
curl -I https://api.example.com/health
```

2. 检查 CORS 配置：

```typescript
// 后端需要配置 CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true,
}))
```

3. 检查代理配置：

```typescript
// vite.config.ts
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

### 状态管理问题

**问题**: Pinia store 状态不持久化

**解决方案**:

1. 检查持久化插件配置：

```typescript
// stores/pinia.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
```

2. 在 store 中启用持久化：

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  return { user }
}, {
  persist: true, // 启用持久化
})
```

## 🧪 测试问题

### 测试环境问题

**问题**: 测试运行失败

```bash
Error: Cannot find module '@/components/UserCard'
```

**解决方案**:

1. 检查测试配置：

```typescript
// vitest.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

2. 检查测试环境设置：

```typescript
// tests/setup/unit.ts
import { config } from '@vue/test-utils'

config.global.mocks = {
  $t: (key: string) => key,
}
```

### Mock 问题

**问题**: Mock 不生效

**解决方案**:

1. 检查 Mock 文件位置：

```bash
tests/mocks/api.ts
```

2. 正确使用 Mock：

```typescript
// tests/unit/api/user.test.ts
import { vi } from 'vitest'
import { mockApi } from '@/tests/mocks/api'

vi.mock('@/api/request', () => ({
  default: mockApi,
}))

describe('User API', () => {
  it('should fetch users', async () => {
    mockApi.get.mockResolvedValue({ data: [] })
    // 测试逻辑
  })
})
```

### E2E 测试问题

**问题**: Playwright 测试失败

```bash
Error: Timeout 30000ms exceeded
```

**解决方案**:

1. 增加超时时间：

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
})
```

2. 等待元素出现：

```typescript
// tests/e2e/specs/login.spec.ts
test('user can login', async ({ page }) => {
  await page.goto('/login')

  // 等待元素出现
  await page.waitForSelector('[data-testid="email-input"]')

  await page.fill('[data-testid="email-input"]', 'test@example.com')
  await page.fill('[data-testid="password-input"]', 'password123')
  await page.click('[data-testid="login-button"]')
})
```

## 🚀 部署问题

### 构建产物问题

**问题**: 部署后页面空白

**解决方案**:

1. 检查构建产物：

```bash
ls -la dist/
```

2. 检查 index.html：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

3. 检查资源路径：

```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // 确保 base 路径正确
})
```

### 环境变量问题

**问题**: 生产环境环境变量不生效

**解决方案**:

1. 检查环境变量前缀：

```bash
# 必须以 VITE_ 开头
VITE_API_BASE_URL=https://api.example.com
```

2. 检查构建命令：

```bash
VITE_API_BASE_URL=https://api.example.com pnpm build
```

3. 检查服务器配置：

```nginx
# nginx.conf
location / {
  try_files $uri $uri/ /index.html;
}
```

### HTTPS 问题

**问题**: HTTPS 证书问题

**解决方案**:

1. 检查证书配置：

```nginx
server {
  listen 443 ssl;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
}
```

2. 强制 HTTPS 重定向：

```nginx
server {
  listen 80;
  return 301 https://$server_name$request_uri;
}
```

## ⚡ 性能问题

### 首屏加载慢

**问题**: 首屏加载时间过长

**解决方案**:

1. 启用代码分割：

```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('@/pages/dashboard.vue'),
  },
]
```

2. 预加载关键资源：

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/images/hero.jpg" as="image" />

```

3. 使用 CDN：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          'vue': 'Vue',
          'vue-router': 'VueRouter',
        },
      },
    },
  },
})
```

### 内存泄漏

**问题**: 长时间使用后内存占用过高

**解决方案**:

1. 清理事件监听器：

```typescript
// composables/useEventListener.ts
export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener
) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })

  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}
```

2. 清理定时器：

```typescript
export function useInterval(callback: () => void, delay: number) {
  let intervalId: number

  onMounted(() => {
    intervalId = setInterval(callback, delay)
  })

  onUnmounted(() => {
    clearInterval(intervalId)
  })
}
```

3. 清理响应式引用：

```typescript
export function useCleanup() {
  const cleanupFunctions: (() => void)[] = []

  const addCleanup = (fn: () => void) => {
    cleanupFunctions.push(fn)
  }

  onUnmounted(() => {
    cleanupFunctions.forEach(fn => fn())
  })

  return { addCleanup }
}
```

## 🔍 调试技巧

### 浏览器调试

1. **使用 Vue DevTools**:
   - 安装 Vue DevTools 浏览器扩展
   - 查看组件状态和 props
   - 调试 Vuex/Pinia store

2. **使用浏览器开发者工具**:
   - Network 面板：检查 API 请求
   - Console 面板：查看错误和日志
   - Performance 面板：分析性能问题

3. **使用 Source Maps**:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // 开发环境启用
  },
})
```

### 日志调试

```typescript
// utils/logger.ts
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },

  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args)
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },

  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },
}
```

### 错误监控

```typescript
// utils/errorMonitoring.ts
export function initErrorMonitoring() {
  // 全局错误处理
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // 发送到错误监控服务
    sendErrorToMonitoring(event.error)
  })

  // Promise 拒绝处理
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
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

### 性能监控

```typescript
// utils/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
}

// 使用示例
measurePerformance('API call', () => {
  fetch('/api/users').then(response => response.json())
})
```

## 📞 获取帮助

### 社区资源

1. **Vue.js 官方文档**: https://vuejs.org/
2. **Vite 官方文档**: https://vitejs.dev/
3. **TypeScript 官方文档**: https://www.typescriptlang.org/
4. **Pinia 官方文档**: https://pinia.vuejs.org/

### 问题报告

如果遇到本文档未覆盖的问题，请：

1. 检查项目 Issues
2. 搜索相关错误信息
3. 提供详细的错误信息和复现步骤
4. 创建新的 Issue

### 调试信息收集

在报告问题时，请提供以下信息：

```bash
# 系统信息
node --version
pnpm --version
npm --version

# 项目信息
cat package.json | grep -A 5 -B 5 "dependencies"

# 错误日志
pnpm dev 2>&1 | tee error.log
```

## 📚 相关文档

- [开发指南](./development-guide.md) - 项目结构和开发流程
- [编码规范](./coding-standards.md) - 编码规范和最佳实践
- [测试指南](./testing-guide.md) - 测试策略和工具使用
- [部署指南](./deployment-guide.md) - 构建和部署流程
- [最佳实践](./best-practices.md) - 性能优化和安全指南

---

**总结**: 本文档涵盖了项目开发过程中可能遇到的主要问题和解决方案。如果遇到其他问题，请参考相关文档或寻求社区帮助。
