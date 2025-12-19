# DataTable 组件

可复用的数据表格组件，封装 Naive UI 的 `n-data-table`，提供统一的配置接口。

## 功能特性

- ✅ 列定义和数据源配置
- ✅ 分页功能
- ✅ 搜索功能
- ✅ 筛选功能
- ✅ 前端排序功能
- ✅ 加载状态
- ✅ 错误处理
- ✅ 自定义操作列（通过 slots）

## 使用方法

### 基础用法

```vue
<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { DataTable } from '@/components/DataTable'

const columns: DataTableColumns = [
  {
    title: 'ID',
    key: 'id',
    sortable: true,
  },
  {
    title: '用户名',
    key: 'username',
    sortable: true,
  },
  {
    title: '邮箱',
    key: 'email',
  },
]

const data = ref([
  { id: 1, username: 'user1', email: 'user1@example.com' },
  { id: 2, username: 'user2', email: 'user2@example.com' },
])

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 100,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onUpdatePage: (page: number) => {
    pagination.value.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
  },
})
</script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :loading="loading"
  />
</template>
```

### 带搜索和筛选

```vue
<script setup lang="ts">
const searchValue = ref('')
const filterValue = ref(undefined)

const filterOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]

function handleSearch(value: string) {
  console.log('搜索:', value)
  // 执行搜索逻辑
}

function handleFilter(value: any) {
  console.log('筛选:', value)
  // 执行筛选逻辑
}
</script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :pagination="pagination"
    searchable
    :search-value="searchValue"
    search-placeholder="搜索用户名..."
    filterable
    :filter-options="filterOptions"
    :filter-value="filterValue"
    @search="handleSearch"
    @filter="handleFilter"
  />
</template>
```

### 带排序

```vue
<script setup lang="ts">
const defaultSortState = {
  columnKey: 'id',
  order: 'ascend' as const,
}

function handleSorterChange(sorter: DataTableSortState | null) {
  console.log('排序变化:', sorter)
  // 执行排序逻辑
}
</script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :default-sort-state="defaultSortState"
    @update:sorter="handleSorterChange"
  />
</template>
```

### 自定义操作列

```vue
<script setup lang="ts">
const columns: DataTableColumns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return h('div', [
        h('n-button', {
          size: 'small',
          onClick: () => handleEdit(row),
        }, '编辑'),
        h('n-button', {
          size: 'small',
          type: 'error',
          onClick: () => handleDelete(row),
        }, '删除'),
      ])
    },
  },
]
</script>
```

## Props

| 属性              | 类型                         | 默认值  | 说明           |
| ----------------- | ---------------------------- | ------- | -------------- |
| columns           | `DataTableColumns`           | 必填    | 表格列定义     |
| data              | `any[]`                      | 必填    | 数据源         |
| loading           | `boolean`                    | `false` | 是否加载中     |
| pagination        | `object`                     | -       | 分页配置       |
| searchable        | `boolean`                    | `false` | 是否显示搜索框 |
| searchValue       | `string`                     | `''`    | 搜索值         |
| searchPlaceholder | `string`                     | `''`    | 搜索占位符     |
| filterable        | `boolean`                    | `false` | 是否显示筛选器 |
| filterOptions     | `Array`                      | -       | 筛选选项       |
| filterValue       | `any`                        | -       | 当前筛选值     |
| defaultSortState  | `DataTableSortState \| null` | `null`  | 默认排序状态   |
| bordered          | `boolean`                    | `true`  | 是否显示边框   |
| striped           | `boolean`                    | `false` | 是否显示条纹   |
| error             | `string \| null`             | `null`  | 错误信息       |

## Events

| 事件               | 参数                                   | 说明         |
| ------------------ | -------------------------------------- | ------------ |
| update:searchValue | `(value: string)`                      | 搜索值变化   |
| update:filterValue | `(value: any)`                         | 筛选值变化   |
| update:sorter      | `(sorter: DataTableSortState \| null)` | 排序状态变化 |
| search             | `(value: string)`                      | 搜索事件     |
| filter             | `(value: any)`                         | 筛选事件     |

## 注意事项

1. 排序功能基于当前已加载的数据（前端排序）
2. 搜索和筛选需要父组件实现具体的逻辑
3. 操作列可以通过 `render` 函数自定义
