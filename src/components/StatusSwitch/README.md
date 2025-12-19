# StatusSwitch 组件

可复用的状态切换组件，封装 Naive UI 的 `n-switch`，提供统一的状态切换逻辑。

## 功能特性

- ✅ 切换前确认对话框
- ✅ 切换后 API 调用和状态更新
- ✅ 加载状态和错误处理
- ✅ 支持自定义激活/禁用值

## 使用方法

### 基础用法

```vue
<script setup lang="ts">
import { StatusSwitch } from '@/components/StatusSwitch'

const status = ref(1) // 1-启用，0-禁用

function handleToggle(value: number) {
  console.log('状态切换:', value)
  // 调用 API 更新状态
  updateUserStatus(userId, value)
}
</script>

<template>
  <StatusSwitch
    v-model:value="status"
    :active-value="1"
    :inactive-value="0"
    @toggle="handleToggle"
  />
</template>
```

### 带确认对话框

```vue
<script setup lang="ts">
const status = ref(true)

function handleToggle(value: boolean) {
  // 调用 API
  updateStatus(value)
    .then(() => {
      // 显示成功提示
      message.success('状态更新成功')
    })
    .catch(() => {
      // 显示错误提示
      message.error('状态更新失败')
      // 恢复原状态
      status.value = !value
    })
}
</script>

<template>
  <StatusSwitch
    v-model:value="status"
    confirm-before-toggle
    confirm-title="确认切换状态"
    confirm-content="确定要切换状态吗？"
    @toggle="handleToggle"
  />
</template>
```

### 带加载状态

```vue
<script setup lang="ts">
const status = ref(true)
const loading = ref(false)

async function handleToggle(value: boolean) {
  loading.value = true
  try {
    await updateStatus(value)
    message.success('状态更新成功')
  }
  catch (error) {
    message.error('状态更新失败')
    status.value = !value
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <StatusSwitch
    v-model:value="status"
    :loading="loading"
    @toggle="handleToggle"
  />
</template>
```

## Props

| 属性                | 类型                | 默认值  | 说明                     |
| ------------------- | ------------------- | ------- | ------------------------ |
| value               | `boolean \| number` | 必填    | 当前状态值               |
| activeValue         | `boolean \| number` | `true`  | 启用时的值               |
| inactiveValue       | `boolean \| number` | `false` | 禁用时的值               |
| loading             | `boolean`           | `false` | 是否加载中               |
| disabled            | `boolean`           | `false` | 是否禁用                 |
| confirmBeforeToggle | `boolean`           | `true`  | 切换前是否显示确认对话框 |
| confirmTitle        | `string`            | `''`    | 确认对话框标题           |
| confirmContent      | `string`            | `''`    | 确认对话框内容           |
| successMessage      | `string`            | `''`    | 切换成功提示             |
| errorMessage        | `string`            | `''`    | 切换失败提示             |

## Events

| 事件         | 参数                         | 说明         |
| ------------ | ---------------------------- | ------------ |
| update:value | `(value: boolean \| number)` | 状态值变化   |
| change       | `(value: boolean \| number)` | 状态变化事件 |
| toggle       | `(value: boolean \| number)` | 切换事件     |

## 注意事项

1. 切换前会显示确认对话框（如果 `confirmBeforeToggle` 为 `true`）
2. 切换后需要父组件调用 API 更新状态
3. 如果 API 调用失败，需要手动恢复原状态
