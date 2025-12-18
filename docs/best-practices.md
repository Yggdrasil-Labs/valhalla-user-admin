# 最佳实践

本文档介绍了 Valhalla User Admin 项目的性能优化、安全性和可维护性最佳实践。

## 📋 目录

- [性能优化](#性能优化)
- [安全性最佳实践](#安全性最佳实践)
- [可维护性指南](#可维护性指南)
- [代码质量](#代码质量)
- [用户体验优化](#用户体验优化)

## ⚡ 性能优化

### 代码分割与懒加载

#### 路由懒加载

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
  {
    path: '/admin',
    component: () => import('@/pages/admin/index.vue'),
    meta: { requiresAuth: true },
  },
]
```

#### 组件懒加载

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)
</script>

<template>
  <div>
    <Suspense>
      <template #default>
        <HeavyComponent />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </div>
</template>
```

### 资源优化

#### 图片优化

```vue
<script setup lang="ts">
function getResponsiveImage(url: string, width: number) {
  return `${url}?w=${width}&q=80`
}

function getResponsiveImageSet(url: string, widths: number[]) {
  return widths.map(w => `${url}?w=${w}&q=80 ${w}w`).join(', ')
}
</script>

<template>
  <!-- 使用 WebP 格式，提供降级方案 -->
  <picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description" loading="lazy">
  </picture>

  <!-- 响应式图片 -->
  <img
    :src="getResponsiveImage(imageUrl, 400)"
    :srcset="getResponsiveImageSet(imageUrl, [400, 800, 1200])"
    sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
    alt="Description"
    loading="lazy"
  >
</template>
```

#### 字体优化

```css
/* 字体预加载 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2');
  font-display: swap; /* 优化字体加载 */
}

/* 字体子集化 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font-subset.woff2') format('woff2');
  unicode-range: U+0000-00FF; /* 仅包含拉丁字符 */
}

```

### 缓存策略

#### HTTP 缓存

```typescript
// api/request.ts
const httpClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
})

// 请求缓存
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

httpClient.interceptors.request.use((config) => {
  if (config.method === 'get' && config.cache) {
    const cacheKey = `${config.url}${JSON.stringify(config.params)}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Promise.resolve({ ...cached.data, fromCache: true })
    }
  }

  return config
})

httpClient.interceptors.response.use((response) => {
  if (response.config.method === 'get' && response.config.cache) {
    const cacheKey = `${response.config.url}${JSON.stringify(response.config.params)}`
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    })
  }

  return response
})
```

#### 浏览器存储

```typescript
// utils/storage.ts
export const storage = {
  // LocalStorage 封装
  set<T>(key: string, value: T, expire?: number): void {
    const data = {
      value,
      expire: expire ? Date.now() + expire : null,
    }
    localStorage.setItem(key, JSON.stringify(data))
  },

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    if (!item)
      return null

    const data = JSON.parse(item)
    if (data.expire && Date.now() > data.expire) {
      localStorage.removeItem(key)
      return null
    }

    return data.value
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },
}
```

### 虚拟滚动

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  containerHeight: number
}

const props = defineProps<Props>()

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

const totalHeight = computed(() => props.items.length * props.itemHeight)
const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight))
const endIndex = computed(() => Math.min(startIndex.value + visibleCount.value, props.items.length))
const offsetY = computed(() => startIndex.value * props.itemHeight)

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

onMounted(() => {
  containerRef.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div ref="containerRef" class="virtual-list">
    <div
      class="virtual-list-content"
      :style="{ height: `${totalHeight}px` }"
    >
      <div
        class="virtual-list-items"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="virtual-list-item"
          :style="{ height: `${itemHeight}px` }"
        >
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>
```

## 🔒 安全性最佳实践

### 输入验证与清理

```typescript
// utils/validation.ts
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // 移除 HTML 标签
    .replace(/javascript:/gi, '') // 移除 JavaScript 协议
    .trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  // 至少8位，包含大小写字母、数字和特殊字符
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}
```

### XSS 防护

```vue
<script setup lang="ts">
import DOMPurify from 'dompurify'

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html)
}
</script>

<template>
  <!-- ✅ 安全：使用 v-text 或插值表达式 -->
  <div v-text="userInput" />
  <div>{{ userInput }}</div>

  <!-- ❌ 危险：使用 v-html -->
  <div v-html="userInput" />

  <!-- ✅ 安全：如果需要 HTML，使用 sanitize 函数 -->
  <div v-html="sanitizeHtml(userInput)" />
</template>
```

### CSRF 防护

```typescript
// api/request.ts
import { getCsrfToken } from '@/utils/csrf'

const httpClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
})

// 自动添加 CSRF Token
httpClient.interceptors.request.use(async (config) => {
  if (config.method !== 'get') {
    const csrfToken = await getCsrfToken()
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})
```

### 敏感信息保护

```typescript
// utils/security.ts
export function maskSensitiveData(data: any): any {
  const sensitiveFields = ['password', 'token', 'secret', 'key']

  const maskValue = (value: string) => '*'.repeat(Math.min(value.length, 8))

  const processObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null)
      return obj

    if (Array.isArray(obj)) {
      return obj.map(processObject)
    }

    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        result[key] = maskValue(String(value))
      }
      else if (typeof value === 'object') {
        result[key] = processObject(value)
      }
      else {
        result[key] = value
      }
    }
    return result
  }

  return processObject(data)
}
```

## 🛠 可维护性指南

### 代码组织

#### 模块化设计

```typescript
// composables/useAuth.ts
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export function useAuth(): AuthState & AuthActions {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      user.value = response.user
      // 存储 token
      storage.set('token', response.token)
    }
    catch (error) {
      throw new Error('Login failed')
    }
    finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    storage.remove('token')
  }

  const refreshToken = async () => {
    // 刷新 token 逻辑
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    logout,
    refreshToken,
  }
}
```

#### 错误处理

```typescript
// utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR')
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR')
}

// composables/useErrorHandler.ts
export function useErrorHandler() {
  const errors = ref<AppError[]>([])

  const addError = (error: AppError) => {
    errors.value.push(error)
    // 自动移除错误（5秒后）
    setTimeout(() => {
      removeError(error)
    }, 5000)
  }

  const removeError = (error: AppError) => {
    const index = errors.value.indexOf(error)
    if (index > -1) {
      errors.value.splice(index, 1)
    }
  }

  const clearErrors = () => {
    errors.value = []
  }

  return {
    errors: readonly(errors),
    addError,
    removeError,
    clearErrors,
  }
}
```

### 配置管理

```typescript
// config/app.ts
export interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  features: {
    enableAnalytics: boolean
    enableErrorReporting: boolean
    enablePerformanceMonitoring: boolean
  }
  ui: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    animations: boolean
  }
}

export const defaultConfig: AppConfig = {
  api: {
    baseUrl: env.API_BASE_URL,
    timeout: 10000,
    retries: 3,
  },
  features: {
    enableAnalytics: !!env.ANALYTICS_ID,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
  },
  ui: {
    theme: 'auto',
    language: 'zh-CN',
    animations: true,
  },
}

export const config = reactive<AppConfig>({ ...defaultConfig })
```

### 文档化

#### JSDoc 注释

````typescript
/**
 * 用户认证服务
 * @description 提供用户登录、登出、权限验证等功能
 * @example
 * ```typescript
 * const authService = new AuthService()
 * await authService.login('user@example.com', 'password')
 * ```
 */
export class AuthService {
  /**
   * 用户登录
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns Promise<User> 用户信息
   * @throws {AuthError} 认证失败时抛出
   */
  async login(email: string, password: string): Promise<User> {
    // 实现逻辑
  }

  /**
   * 检查用户权限
   * @param permission - 权限名称
   * @returns boolean 是否有权限
   */
  hasPermission(permission: string): boolean {
    return true
  }
}
````

#### README 文档

````markdown
# UserCard Component

用户信息卡片组件，用于显示用户的基本信息。

## Props

| 属性        | 类型    | 默认值 | 描述             |
| ----------- | ------- | ------ | ---------------- |
| user        | User    | -      | 用户信息对象     |
| showDetails | boolean | false  | 是否显示详细信息 |
| editable    | boolean | false  | 是否可编辑       |

## Events

| 事件名 | 参数           | 描述               |
| ------ | -------------- | ------------------ |
| update | user: User     | 用户信息更新时触发 |
| delete | userId: number | 删除用户时触发     |

## 使用示例

```vue
<UserCard
  :user="currentUser"
  :show-details="true"
  @update="handleUserUpdate"
/>
```

## 📊 代码质量

### 类型安全

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 严格的 API 类型定义
export interface UserApi {
  getUsers: (params: GetUsersParams) => Promise<PaginatedResponse<User>>
  getUser: (id: number) => Promise<ApiResponse<User>>
  createUser: (user: CreateUserRequest) => Promise<ApiResponse<User>>
  updateUser: (id: number, user: UpdateUserRequest) => Promise<ApiResponse<User>>
  deleteUser: (id: number) => Promise<ApiResponse<void>>
}
```

### 代码审查

#### 审查清单

- [ ] **功能正确性**: 代码是否实现了预期功能
- [ ] **代码质量**: 是否遵循编码规范和最佳实践
- [ ] **性能考虑**: 是否存在性能问题
- [ ] **安全性**: 是否存在安全漏洞
- [ ] **可维护性**: 代码是否易于理解和修改
- [ ] **测试覆盖**: 是否有足够的测试用例
- [ ] **文档更新**: 相关文档是否已更新

#### 审查要点

```typescript
// ✅ 好的代码示例
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

// ❌ 需要改进的代码
export function calc(items: any[]): any {
  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].qty
  }
  return total
}
```

## 🎨 用户体验优化

### 加载状态管理

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserList } from '@/composables/useUserList'

const { users, isLoading, error, loadUsers, retry } = useUserList()

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-list">
    <div v-if="isLoading" class="loading-skeleton">
      <div v-for="i in 5" :key="i" class="skeleton-item" />
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error.message }}</p>
      <button @click="retry">
        重试
      </button>
    </div>

    <div v-else class="user-list-content">
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
      />
    </div>
  </div>
</template>

<style scoped>
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-item {
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

### 错误边界

```vue
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorMessage.value = error.message

  // 发送错误到监控服务
  console.error('Error captured:', error)

  return false // 阻止错误继续传播
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h2>出现了一些问题</h2>
      <p>{{ errorMessage }}</p>
      <button class="retry-button" @click="retry">
        重试
      </button>
    </div>
  </div>
  <slot v-else />
</template>
```

### 无障碍访问

```vue
<script setup lang="ts">
// 键盘导航支持
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // 聚焦到模态框
  nextTick(() => {
    modalRef.value?.focus()
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <div class="modal-content">
      <h2 id="modal-title">
        {{ title }}
      </h2>

      <button
        class="close-button"
        aria-label="关闭对话框"
        @click="close"
      >
        <span aria-hidden="true">&times;</span>
      </button>

      <div class="modal-body">
        <slot />
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary"
          @click="close"
        >
          取消
        </button>
        <button
          class="btn btn-primary"
          :disabled="isLoading"
          @click="confirm"
        >
          {{ isLoading ? '处理中...' : '确认' }}
        </button>
      </div>
    </div>
  </div>
</template>
```

## 📚 相关文档

- [开发指南](./development-guide.md) - 项目结构和开发流程
- [编码规范](./coding-standards.md) - 编码规范和最佳实践
- [测试指南](./testing-guide.md) - 测试策略和工具使用
- [部署指南](./deployment-guide.md) - 构建和部署流程

---

**下一步**: 查看 [故障排除](./troubleshooting.md) 了解常见问题和解决方案。

````
