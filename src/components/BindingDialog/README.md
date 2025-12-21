# BindingDialog 绑定对话框组件

用于管理实体之间绑定关系的通用对话框组件，支持分页数据获取、搜索、筛选、多选等功能。

## 功能特性

- ✅ 分页数据获取和展示
- ✅ 搜索功能（支持配置搜索字段）
- ✅ 筛选功能（支持配置筛选选项）
- ✅ 多选功能（支持已绑定项预选）
- ✅ 已绑定项高亮显示
- ✅ 加载状态和错误处理

## 使用方法

### 基础用法

```vue
<script setup lang="ts">
import type { BindingDialogConfig } from '@/types/store/binding'
import { getRolesApi } from '@/api/modules/role'
import { BindingDialog } from '@/components/BindingDialog'

const dialogVisible = ref(false)
const boundRoleIds = ref<string[]>([])

const config: BindingDialogConfig = {
  fetchData: getRolesApi,
  searchField: 'roleName',
  displayField: '角色名称',
  columns: [
    { title: '角色代码', key: 'roleCode', width: 150 },
    { title: '角色名称', key: 'roleName', width: 150 },
    { title: '描述', key: 'description', width: 200 },
  ],
}

function handleConfirm(selectedIds: string[]) {
  // 处理绑定确认
  console.log('选中的ID:', selectedIds)
  dialogVisible.value = false
}
</script>

<template>
  <BindingDialog
    v-model:visible="dialogVisible"
    title="为用户分配角色"
    :bound-ids="boundRoleIds"
    :config="config"
    @confirm="handleConfirm"
  />
</template>
```

### 带筛选功能

```vue
<script setup lang="ts">
const config: BindingDialogConfig = {
  fetchData: getPermissionsApi,
  searchField: 'permissionName',
  filterField: 'module',
  filterOptions: [
    { label: '用户模块', value: 'user' },
    { label: '角色模块', value: 'role' },
    { label: '权限模块', value: 'permission' },
  ],
  columns: [
    { title: '权限代码', key: 'permissionCode', width: 200 },
    { title: '权限名称', key: 'permissionName', width: 150 },
    { title: '模块', key: 'module', width: 120 },
  ],
}
</script>
```

### 多字段搜索

```vue
<script setup lang="ts">
const config: BindingDialogConfig = {
  fetchData: getApisApi,
  searchField: ['apiCode', 'resourcePath'], // 支持多个搜索字段
  displayField: '接口代码或路径',
  columns: [
    { title: '接口代码', key: 'apiCode', width: 150 },
    { title: '接口名称', key: 'apiName', width: 150 },
    { title: '资源路径', key: 'resourcePath', width: 250 },
  ],
}
</script>
```

## Props

| 属性     | 类型                  | 默认值  | 说明                     |
| -------- | --------------------- | ------- | ------------------------ |
| visible  | `boolean`             | `false` | 是否显示对话框           |
| title    | `string`              | -       | 对话框标题               |
| boundIds | `string[]`            | `[]`    | 已绑定的项ID列表         |
| config   | `BindingDialogConfig` | -       | 绑定配置                 |
| width    | `string \| number`    | `800`   | 对话框宽度               |
| loading  | `boolean`             | `false` | 是否加载中（用于提交时） |

## Events

| 事件名         | 参数                      | 说明                       |
| -------------- | ------------------------- | -------------------------- |
| update:visible | `(visible: boolean)`      | 更新显示状态               |
| confirm        | `(selectedIds: string[])` | 确认绑定，返回选中的ID列表 |
| cancel         | -                         | 取消绑定                   |

## BindingDialogConfig 配置

| 属性          | 类型                                    | 说明                                   |
| ------------- | --------------------------------------- | -------------------------------------- |
| fetchData     | `(params) => Promise<ApiResponse<T[]>>` | 数据获取函数，接收分页、搜索、筛选参数 |
| searchField   | `string \| string[]`                    | 搜索字段，可以是单个字段或多个字段数组 |
| filterField   | `string`                                | 筛选字段                               |
| filterOptions | `Array<{label: string, value: any}>`    | 筛选选项列表                           |
| columns       | `Array<Column>`                         | 表格列定义                             |
| displayField  | `string`                                | 显示字段（用于搜索提示）               |

## 注意事项

1. `fetchData` 函数需要返回符合 `ApiResponse<T[]>` 格式的响应
2. 已绑定的项会自动预选并高亮显示
3. 如果没有变更，点击确认会提示用户
4. 搜索和筛选会重置到第一页
5. 分页状态会在切换页面时保持选中项
