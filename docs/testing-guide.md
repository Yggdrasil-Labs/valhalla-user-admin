# 测试指南

本文档介绍了 Valhalla User Admin 项目的测试策略、工具使用和最佳实践。

## 📋 目录

- [测试策略](#测试策略)
- [单元测试](#单元测试)
- [集成测试](#集成测试)
- [端到端测试](#端到端测试)
- [测试工具配置](#测试工具配置)
- [测试最佳实践](#测试最佳实践)

## 🎯 测试策略

### 测试金字塔

项目采用测试金字塔策略，确保测试覆盖的全面性和效率：

```
        E2E Tests (少量)
       /              \
      /                \
     /  Integration Tests \
    /                      \
   /    Unit Tests (大量)     \
  /__________________________\
```

### 测试类型说明

1. **单元测试 (Unit Tests)**
   - 测试单个函数、组件或类的功能
   - 运行速度快，反馈及时
   - 覆盖大部分业务逻辑

2. **集成测试 (Integration Tests)**
   - 测试多个模块之间的交互
   - 验证 API 调用、路由、状态管理
   - 确保组件间协作正常

3. **端到端测试 (E2E Tests)**
   - 测试完整的用户流程
   - 验证真实浏览器环境下的功能
   - 覆盖关键业务场景

### 测试覆盖率目标

- **单元测试**: 80%+ 代码覆盖率
- **集成测试**: 覆盖主要业务流程
- **E2E 测试**: 覆盖关键用户路径

## 🧪 单元测试

### 工具配置

项目使用 **Vitest** 作为单元测试框架：

```typescript
// vitest.config.ts
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup/unit.ts'],
    include: ['tests/unit/**/*.{test,spec}.{js,ts,vue}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

### 组件测试

使用 `@testing-library/vue` 进行组件测试：

```typescript
import userEvent from '@testing-library/user-event'
// tests/unit/components/UserCard.test.ts
import { render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import UserCard from '@/components/UserCard.vue'

describe('UserCard', () => {
  it('renders user information correctly', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg',
    }

    render(UserCard, {
      props: { user },
    })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'avatar.jpg')
  })

  it('emits update event when edit button is clicked', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    }

    const { emitted } = render(UserCard, {
      props: { user },
    })

    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(emitted().update).toBeTruthy()
    expect(emitted().update[0]).toEqual([user.id])
  })

  it('shows loading state when user is being updated', () => {
    render(UserCard, {
      props: {
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        isLoading: true,
      },
    })

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
```

### 组合式函数测试

```typescript
// tests/unit/composables/useCounter.test.ts
import { describe, expect, it } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('initializes with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('increments counter', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })

  it('decrements counter', () => {
    const { count, decrement } = useCounter(5)
    decrement()
    expect(count.value).toBe(4)
  })

  it('resets counter to initial value', () => {
    const { count, increment, reset } = useCounter(0)
    increment()
    increment()
    reset()
    expect(count.value).toBe(0)
  })
})
```

### Store 测试

```typescript
import { createPinia, setActivePinia } from 'pinia'
// tests/unit/stores/user.test.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { useUserStore } from '@/stores/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty user', () => {
    const store = useUserStore()
    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('sets user data', () => {
    const store = useUserStore()
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' }

    store.setUser(user)

    expect(store.user).toEqual(user)
    expect(store.isLoggedIn).toBe(true)
  })

  it('clears user data on logout', () => {
    const store = useUserStore()
    const user = { id: 1, name: 'John Doe', email: 'john@example.com' }

    store.setUser(user)
    store.logout()

    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })
})
```

## 🔗 集成测试

### API 集成测试

```typescript
import axios from 'axios'
// tests/integration/api/user.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createUser, getUserById, updateUser } from '@/api/modules/user'

// Mock axios
vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('User API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    mockedAxios.post.mockResolvedValueOnce({
      data: { id: 1, ...userData },
    })

    const result = await createUser(userData)

    expect(mockedAxios.post).toHaveBeenCalledWith('/users', userData)
    expect(result).toEqual({ id: 1, ...userData })
  })

  it('handles API errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

    await expect(createUser({ name: 'John', email: 'john@example.com' }))
      .rejects
      .toThrow('Network error')
  })
})
```

### 路由集成测试

```typescript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
// tests/integration/router/auth.test.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/login.vue'
import { useUserStore } from '@/stores/user'

describe('Authentication Router Integration', () => {
  let router: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/login', component: LoginPage },
        { path: '/dashboard', component: () => import('@/pages/dashboard.vue') },
      ],
    })
  })

  it('redirects unauthenticated user to login', async () => {
    const store = useUserStore()
    store.logout()

    await router.push('/dashboard')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('allows authenticated user to access protected routes', async () => {
    const store = useUserStore()
    store.setUser({ id: 1, name: 'John Doe', email: 'john@example.com' })

    await router.push('/dashboard')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})
```

## 🌐 端到端测试

### Playwright 配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E 测试示例

```typescript
// tests/e2e/specs/login.spec.ts
import { expect, test } from '@playwright/test'

test.describe('Login Flow', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // 填写登录表单
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')

    // 点击登录按钮
    await page.click('[data-testid="login-button"]')

    // 验证跳转到仪表板
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('shows error message for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[data-testid="email-input"]', 'invalid@example.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-button"]')

    // 验证错误消息
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials')
  })

  test('form validation works correctly', async ({ page }) => {
    await page.goto('/login')

    // 尝试提交空表单
    await page.click('[data-testid="login-button"]')

    // 验证验证错误
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  })
})
```

### 页面对象模式

```typescript
// tests/e2e/pages/LoginPage.ts
import { Locator, Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('[data-testid="email-input"]')
    this.passwordInput = page.locator('[data-testid="password-input"]')
    this.loginButton = page.locator('[data-testid="login-button"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }
}
```

## 🛠 测试工具配置

### 测试环境设置

```typescript
// tests/setup/unit.ts
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 全局测试配置
config.global.mocks = {
  $t: (key: string) => key, // i18n mock
}

// Mock 全局组件
config.global.components = {
  RouterLink: { template: '<a><slot /></a>' },
  RouterView: { template: '<div><slot /></div>' },
}

// Mock 全局属性
config.global.plugins = []

// 设置全局测试工具
globalThis.vi = vi
```

### Mock 配置

```typescript
// tests/mocks/api.ts
import { vi } from 'vitest'

export function mockApiResponse<T>(data: T) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  }
}

export function mockApiError(message: string, status = 500) {
  const error = new Error(message)
  // @ts-expect-error xxx
  error.response = {
    status,
    statusText: 'Internal Server Error',
    data: { message },
  }
  return error
}

// Mock axios
export const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}
```

## 📊 测试最佳实践

### 测试命名规范

```typescript
// ✅ 推荐：描述性的测试名称
describe('UserCard Component', () => {
  it('should display user name and email', () => {})
  it('should emit update event when edit button is clicked', () => {})
  it('should show loading spinner when isLoading is true', () => {})
})

// ❌ 不推荐：模糊的测试名称
describe('UserCard', () => {
  it('works', () => {})
  it('test 1', () => {})
})
```

### 测试结构 (AAA 模式)

```typescript
it('should calculate total price correctly', () => {
  // Arrange - 准备测试数据
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ]

  // Act - 执行被测试的功能
  const total = calculateTotal(items)

  // Assert - 验证结果
  expect(total).toBe(35)
})
```

### 测试数据管理

```typescript
// tests/utils/testData.ts
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
}

export const mockUsers = [
  mockUser,
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://example.com/avatar2.jpg',
  },
]

export function createMockUser(overrides = {}) {
  return {
    ...mockUser,
    ...overrides,
  }
}
```

### 异步测试

```typescript
// ✅ 推荐：使用 async/await
it('should fetch user data', async () => {
  const user = await fetchUser(1)
  expect(user).toEqual(mockUser)
})

// ✅ 推荐：测试异步错误
it('should handle fetch error', async () => {
  vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Network error'))

  await expect(fetchUser(1)).rejects.toThrow('Network error')
})
```

## 📈 测试覆盖率

### 覆盖率配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts',
        'src/main.ts',
        'src/types/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
})
```

### 覆盖率报告

```bash
# 生成覆盖率报告
pnpm test:coverage

# 查看 HTML 报告
open coverage/index.html
```

## 🚀 测试命令

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行集成测试
pnpm test:integration

# 运行 E2E 测试
pnpm test:e2e

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 监听模式运行测试
pnpm test:watch

# 运行特定测试文件
pnpm test tests/unit/components/UserCard.test.ts

# 运行测试并更新快照
pnpm test --update-snapshots
```

## 📚 相关文档

- [开发指南](./development-guide.md) - 项目结构和开发流程
- [编码规范](./coding-standards.md) - 编码规范和最佳实践
- [部署指南](./deployment-guide.md) - 构建和部署流程

---

**下一步**: 查看 [部署指南](./deployment-guide.md) 了解构建和部署流程。
