<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { useI18nHelper } from '@/composables/useI18n'

interface Props {
  /** 表格列定义 */
  columns: DataTableColumns<any>
  /** 数据源 */
  data: any[]
  /** 是否加载中 */
  loading?: boolean
  /** 分页配置 */
  pagination?: {
    page: number
    pageSize: number
    itemCount?: number
    showSizePicker?: boolean
    pageSizes?: number[]
    onUpdatePage?: (page: number) => void
    onUpdatePageSize?: (pageSize: number) => void
  }
  /** 搜索配置 */
  searchable?: boolean
  /** 搜索值 */
  searchValue?: string
  /** 搜索占位符 */
  searchPlaceholder?: string
  /** 筛选配置 */
  filterable?: boolean
  /** 筛选选项 */
  filterOptions?: Array<{
    label: string
    value: any
  }>
  /** 当前筛选值 */
  filterValue?: any
  /** 默认排序状态 */
  defaultSortState?: DataTableSortState | null
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示条纹 */
  striped?: boolean
  /** 错误信息 */
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: false,
  searchValue: '',
  searchPlaceholder: '',
  filterable: false,
  filterValue: undefined,
  defaultSortState: null,
  bordered: true,
  striped: false,
  error: null,
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:filterValue': [value: any]
  'update:sorter': [sorter: DataTableSortState | null]
  'search': [value: string]
  'filter': [value: any]
}>()

const { t } = useI18nHelper()

// 搜索值双向绑定
const searchValueModel = computed({
  get: () => props.searchValue,
  set: (value: string) => {
    emit('update:searchValue', value)
    emit('search', value)
  },
})

// 筛选值双向绑定
const filterValueModel = computed({
  get: () => props.filterValue,
  set: (value: any) => {
    emit('update:filterValue', value)
    emit('filter', value)
  },
})

// 排序状态
const sortState = ref<DataTableSortState | null>(props.defaultSortState)

// 处理排序变化
function handleSorterChange(sorter: DataTableSortState | null) {
  sortState.value = sorter
  emit('update:sorter', sorter)
}
</script>

<template>
  <div class="data-table-wrapper">
    <!-- 搜索和筛选栏 -->
    <div v-if="searchable || filterable" class="data-table-toolbar">
      <!-- 搜索框 -->
      <div v-if="searchable" class="search-box">
        <n-input
          v-model:value="searchValueModel"
          :placeholder="searchPlaceholder || t('button.search')"
          clearable
        />
      </div>

      <!-- 筛选器 -->
      <div v-if="filterable && filterOptions" class="filter-box">
        <n-select
          v-model:value="filterValueModel"
          :options="filterOptions"
          :placeholder="t('button.filter')"
          clearable
          style="width: 200px"
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <n-alert
      v-if="error"
      type="error"
      :title="t('status.error')"
      style="margin-bottom: 16px"
    >
      {{ error }}
    </n-alert>

    <!-- 数据表格 -->
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      :bordered="bordered"
      :striped="striped"
      :default-sort="defaultSortState"
      @update:sorter="handleSorterChange"
    />
  </div>
</template>

<style scoped lang="scss">
.data-table-wrapper {
  width: 100%;
}

.data-table-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;

  .search-box {
    flex: 1;
    max-width: 300px;
  }

  .filter-box {
    flex-shrink: 0;
  }
}
</style>
