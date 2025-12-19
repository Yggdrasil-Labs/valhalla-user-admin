# FormDialog 组件

可复用的表单对话框组件，封装 Naive UI 的 `n-modal` 和 `n-form`，提供统一的表单配置接口。

## 功能特性

- ✅ 动态表单配置（字段定义、验证规则）
- ✅ 表单验证和提交逻辑
- ✅ 加载状态和错误处理
- ✅ 支持多种字段类型（input、textarea、select、number、switch、date）
- ✅ 自动表单验证

## 使用方法

### 基础用法

```vue
<script setup lang="ts">
import { FormDialog } from '@/components/FormDialog'

const visible = ref(false)

const fields = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    placeholder: '请输入用户名',
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    required: true,
    rule: (value: string) => {
      if (!value.includes('@')) {
        return '请输入有效的邮箱地址'
      }
      return true
    },
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    required: true,
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
]

const initialValues = {
  username: '',
  email: '',
  status: 1,
}

function handleSubmit(values: Record<string, any>) {
  console.log('提交表单:', values)
  // 执行提交逻辑
  visible.value = false
}

function handleCancel() {
  visible.value = false
}
</script>

<template>
  <FormDialog
    v-model:visible="visible"
    title="创建用户"
    :fields="fields"
    :initial-values="initialValues"
    :loading="loading"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>
```

### 编辑模式

```vue
<script setup lang="ts">
const visible = ref(false)
const editingUser = ref(null)

function openEditDialog(user: any) {
  editingUser.value = user
  visible.value = true
}

const initialValues = computed(() => {
  if (!editingUser.value) {
    return {}
  }
  return {
    username: editingUser.value.username,
    email: editingUser.value.email,
    status: editingUser.value.status,
  }
})
</script>

<template>
  <FormDialog
    v-model:visible="visible"
    :title="editingUser ? '编辑用户' : '创建用户'"
    :fields="fields"
    :initial-values="initialValues"
    @submit="handleSubmit"
  />
</template>
```

## Props

| 属性          | 类型                  | 默认值  | 说明           |
| ------------- | --------------------- | ------- | -------------- |
| visible       | `boolean`             | 必填    | 是否显示对话框 |
| title         | `string`              | 必填    | 对话框标题     |
| fields        | `FormField[]`         | 必填    | 表单字段配置   |
| initialValues | `Record<string, any>` | `{}`    | 表单初始值     |
| loading       | `boolean`             | `false` | 是否加载中     |
| submitText    | `string`              | `''`    | 提交按钮文本   |
| cancelText    | `string`              | `''`    | 取消按钮文本   |
| width         | `string \| number`    | `600`   | 表单宽度       |

## FormField 类型

```typescript
interface FormField {
  key: string // 字段 key
  label: string // 字段标签
  type?: 'input' | 'textarea' | 'select' | 'number' | 'switch' | 'date'
  placeholder?: string // 占位符
  required?: boolean // 是否必填
  options?: Array<{ // 选项（用于 select 类型）
    label: string
    value: any
  }>
  rule?: (value: any) => boolean | string // 验证规则
  disabled?: boolean // 是否禁用
}
```

## Events

| 事件           | 参数                            | 说明               |
| -------------- | ------------------------------- | ------------------ |
| update:visible | `(visible: boolean)`            | 对话框显示状态变化 |
| submit         | `(values: Record<string, any>)` | 表单提交事件       |
| cancel         | `()`                            | 取消事件           |

## 注意事项

1. 表单验证会在提交时自动触发
2. 自定义验证规则返回 `string` 表示错误信息，返回 `true` 表示验证通过
3. 对话框关闭时会自动重置表单验证状态
