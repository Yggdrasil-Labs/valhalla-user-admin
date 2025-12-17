# 编码规范

本文档定义了 Asgard Frontend Template 项目的编码规范和最佳实践，确保代码质量和团队协作的一致性。

## 📋 目录

- [Vue 组件规范](#vue-组件规范)
- [TypeScript 规范](#typescript-规范)
- [ESLint 配置](#eslint-配置)
- [文件命名规范](#文件命名规范)
- [代码组织规范](#代码组织规范)
- [注释规范](#注释规范)
- [Git 提交规范](#git-提交规范)

## 🎯 Vue 组件规范

### 组件结构

Vue 组件应按照以下顺序组织：

```vue
<script setup lang="ts">
// 1. 导入语句
import type { ComponentProps } from './types'
import { computed, onMounted, ref } from 'vue'

// 2. 接口定义
interface Props {
  title: string
  count?: number
}

// 3. Props 定义
const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

// 4. Emits 定义
const emit = defineEmits<{
  update: [value: string]
  change: [id: number]
}>()

// 5. 响应式数据
const isLoading = ref(false)
const data = ref<Data[]>([])

// 6. 计算属性
const filteredData = computed(() => {
  return data.value.filter(item => item.active)
})

// 7. 方法定义
function handleClick() {
  emit('update', 'new value')
}

// 8. 生命周期钩子
onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <div />
  <!-- 模板内容 -->
</template>

<style scoped lang="scss">
/* 组件样式 */
</style>
```

### 组件命名规范

- **组件文件名**: 使用 PascalCase，如 `UserProfile.vue`
- **组件名**: 使用 PascalCase，如 `UserProfile`
- **多单词组件名**: 避免单个单词，如 `User` → `UserProfile`

### Props 规范

```typescript
// ✅ 推荐：使用 TypeScript 接口定义 Props
interface Props {
  title: string
  count?: number
  items: Array<{ id: number, name: string }>
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

// ❌ 不推荐：使用运行时 Props 定义
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0,
  },
})
```

### Emits 规范

```typescript
// ✅ 推荐：使用 TypeScript 定义 Emits
const emit = defineEmits<{
  update: [value: string]
  change: [id: number]
  delete: [id: number]
}>()

// ❌ 不推荐：使用字符串数组
const emit = defineEmits(['update', 'change', 'delete'])
```

### 组合式函数规范

```typescript
// ✅ 推荐：使用 use 前缀
export function useUserData() {
  const user = ref<User | null>(null)

  const fetchUser = async (id: string) => {
    // 获取用户数据
  }

  return {
    user: readonly(user),
    fetchUser,
  }
}

// ✅ 推荐：返回响应式数据和方法
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  return {
    count: readonly(count),
    increment,
    decrement,
    reset,
  }
}
```

## 🔧 TypeScript 规范

### 类型定义

```typescript
// ✅ 推荐：使用 interface 定义对象类型
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

// ✅ 推荐：使用 type 定义联合类型
type Status = 'pending' | 'approved' | 'rejected'

// ✅ 推荐：使用泛型
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// ✅ 推荐：使用工具类型
type PartialUser = Partial<User>
type UserEmail = Pick<User, 'email'>
type UserWithoutId = Omit<User, 'id'>
```

### 函数类型

```typescript
// ✅ 推荐：明确的参数和返回值类型
function formatDate(date: Date): string {
  return date.toISOString()
}

// ✅ 推荐：异步函数类型
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// ✅ 推荐：事件处理函数类型
function handleSubmit(event: Event): void {
  event.preventDefault()
  // 处理逻辑
}
```

### 类型导入导出

```typescript
import type { ComputedRef, Ref } from 'vue'
import type { ComponentProps } from './types'

// ✅ 推荐：使用 type 关键字导入类型
import type { ApiResponse, User } from '@/types/api'
// ✅ 推荐：类型和值分别导入
import { computed, ref } from 'vue'
```

### 严格类型检查

```typescript
// ✅ 推荐：避免 any 类型
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase()
  }
  return ''
}

// ✅ 推荐：使用类型断言
const element = document.getElementById('app') as HTMLElement

// ✅ 推荐：使用类型守卫
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj
}
```

## 📏 ESLint 配置

### 核心规则

```javascript
// eslint.config.js
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
  testRules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
  },
})
```

### 自定义规则

```javascript
// 可以添加项目特定的规则
const customRules = {
  // Vue 相关规则
  'vue/multi-word-component-names': 'error',
  'vue/no-unused-vars': 'error',

  // TypeScript 相关规则
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/explicit-function-return-type': 'warn',

  // 通用规则
  'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
  'prefer-const': 'error',
  'no-var': 'error',
}
```

## 📁 文件命名规范

### 目录结构

```
src/
├── components/           # 通用组件
│   ├── BaseButton.vue   # 基础组件
│   ├── UserProfile.vue  # 业务组件
│   └── index.ts         # 组件导出
├── pages/               # 页面组件
│   ├── index.vue        # 首页
│   ├── user-profile.vue # 用户资料页
│   └── admin/           # 管理页面
│       └── dashboard.vue
├── composables/         # 组合式函数
│   ├── useAuth.ts       # 认证相关
│   ├── useApi.ts        # API 相关
│   └── index.ts         # 导出文件
├── stores/              # 状态管理
│   ├── user.ts          # 用户状态
│   ├── auth.ts          # 认证状态
│   └── index.ts         # Store 导出
├── types/               # 类型定义
│   ├── api.ts           # API 类型
│   ├── user.ts          # 用户类型
│   └── index.ts         # 类型导出
└── utils/               # 工具函数
    ├── date.ts          # 日期工具
    ├── string.ts        # 字符串工具
    └── index.ts         # 工具导出
```

### 命名约定

- **组件文件**: PascalCase (`UserProfile.vue`)
- **页面文件**: kebab-case (`user-profile.vue`)
- **工具文件**: camelCase (`formatDate.ts`)
- **类型文件**: camelCase (`userTypes.ts`)
- **常量文件**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **测试文件**: `*.test.ts` 或 `*.spec.ts`

## 🗂 代码组织规范

### 导入顺序

```typescript
import type { UserProps } from './types'
import fs from 'node:fs'

// 1. Node.js 内置模块
import path from 'node:path'
import axios from 'axios'
import dayjs from 'dayjs'

// 2. 第三方库
import { computed, ref } from 'vue'
import { API_ENDPOINTS } from '@/constants/api'
// 3. 内部模块（按路径深度排序）
import { useUserStore } from '@/stores/user'

import { formatDate } from '@/utils/date'
// 4. 相对导入
import UserCard from './UserCard.vue'

// 5. 样式导入
import './style.scss'
```

### 导出规范

```typescript
// ✅ 推荐：命名导出
export function formatDate(date: Date): string {
  return date.toISOString()
}

export function parseDate(dateString: string): Date {
  return new Date(dateString)
}

// ✅ 推荐：默认导出（用于主要功能）
export default class DateUtils {
  static format(date: Date): string {
    return date.toISOString()
  }
}

// ✅ 推荐：重新导出
export { formatDate, parseDate } from './date'
export type { DateFormat } from './types'
```

## 💬 注释规范

### JSDoc 注释

````typescript
/**
 * 格式化日期为指定格式
 * @param date - 要格式化的日期
 * @param format - 日期格式，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 * @example
 * ```typescript
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
 * // '2024-01-01 12:00:00'
 * ```
 */
export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  return date.toISOString()
}
````

### Vue 组件注释

```vue
<script setup lang="ts">
/**
 * 用户信息卡片组件
 * 用于显示用户的基本信息，包括头像、姓名和邮箱
 */
interface Props {
  /** 用户信息对象 */
  user: User
  /** 是否显示详细信息 */
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
})
</script>

<template>
  <!-- 用户信息卡片 -->
  <div class="user-card">
    <!-- 用户头像 -->
    <img :src="user.avatar" :alt="user.name">

    <!-- 用户基本信息 -->
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>
```

### 复杂逻辑注释

```typescript
// 计算用户权限等级
// 根据用户的角色和权限计算最终的权限等级
function calculateUserLevel(user: User): UserLevel {
  // 基础等级从用户角色获取
  let level = user.role.level

  // 如果是管理员，直接返回最高等级
  if (user.role.name === 'admin') {
    return UserLevel.ADMIN
  }

  // 根据用户积分调整等级
  if (user.points > 1000) {
    level = Math.max(level, UserLevel.VIP)
  }

  return level
}
```

## 📝 Git 提交规范

### 提交格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI/CD 相关
- `build`: 构建系统相关

### 提交示例

```bash
# 新功能
git commit -m "feat(auth): add login with social media"

# 修复 bug
git commit -m "fix(router): resolve navigation issue in mobile"

# 文档更新
git commit -m "docs: update API documentation"

# 重构
git commit -m "refactor(components): extract common button logic"

# 性能优化
git commit -m "perf(api): optimize data fetching with caching"
```

### 提交信息最佳实践

1. **使用现在时态**: "add feature" 而不是 "added feature"
2. **首字母小写**: "fix bug" 而不是 "Fix bug"
3. **简洁明了**: 描述做了什么，而不是为什么做
4. **包含作用域**: 指明修改的模块或功能
5. **详细说明**: 在 body 中解释为什么和怎么做

## 🔍 代码审查规范

### 审查清单

- [ ] 代码符合项目规范
- [ ] 类型定义完整且正确
- [ ] 错误处理完善
- [ ] 测试覆盖充分
- [ ] 性能考虑合理
- [ ] 安全性检查通过
- [ ] 文档更新完整

### 审查要点

1. **功能正确性**: 代码是否实现了预期功能
2. **代码质量**: 是否遵循编码规范和最佳实践
3. **可维护性**: 代码是否易于理解和修改
4. **性能影响**: 是否对性能产生负面影响
5. **安全性**: 是否存在安全漏洞
6. **测试覆盖**: 是否有足够的测试用例

## 📚 相关文档

- [开发指南](./development-guide.md) - 项目结构和开发流程
- [测试指南](./testing-guide.md) - 测试策略和工具使用
- [最佳实践](./best-practices.md) - 性能优化和安全指南

---

**下一步**: 查看 [测试指南](./testing-guide.md) 了解测试规范和策略。
