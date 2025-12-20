<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { useI18nHelper } from '@/composables/useI18n'

type SortState = DataTableSortState | DataTableSortState[] | null

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
  /** 排序状态 */
  sortState?: SortState
  /** 排序模式：'single' 单列排序，'multiple' 多列排序 */
  sortMode?: 'single' | 'multiple'
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示条纹 */
  striped?: boolean
  /** 错误信息 */
  error?: string | null
  /** 是否启用列宽调整 */
  resizable?: boolean
  /** 搜索和筛选框宽度 */
  filterWidth?: string | number
  /** 表格高度，支持数字（px）或 'auto' */
  height?: number | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: false,
  searchValue: '',
  searchPlaceholder: '',
  filterable: false,
  filterValue: undefined,
  sortState: null,
  sortMode: 'single',
  bordered: true,
  striped: false,
  error: null,
  resizable: true,
  filterWidth: 200,
  height: 600,
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:filterValue': [value: any]
  'update:sorter': [sorter: SortState]
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

// 排序状态双向绑定
const sortStateModel = computed({
  get: () => props.sortState,
  set: (value: SortState) => {
    emit('update:sorter', value)
  },
})

// 处理排序变化
function handleSorterChange(sorter: SortState) {
  sortStateModel.value = sorter
}

// 处理列宽调整
const resizableColumns = computed(() => {
  if (!props.resizable) {
    return props.columns
  }
  return props.columns.map((column) => {
    // 如果列已经有 resizable 属性，保持原样
    if ('resizable' in column && column.resizable !== undefined) {
      return column
    }
    // 否则默认启用 resizable
    return {
      ...column,
      resizable: true,
    }
  })
})
</script>

<template>
  <div class="data-table-wrapper">
    <!-- 整体容器：包含 toolbar 和表格 -->
    <div class="data-table-container">
      <!-- 搜索和筛选栏 -->
      <div v-if="searchable || filterable || $slots.toolbar" class="data-table-toolbar">
        <div class="toolbar-left">
          <!-- 搜索框 -->
          <div v-if="searchable" class="search-box">
            <n-input
              v-model:value="searchValueModel"
              :placeholder="searchPlaceholder || t('button.search')"
              clearable
              :style="{ width: typeof filterWidth === 'number' ? `${filterWidth}px` : filterWidth }"
            />
          </div>

          <!-- 筛选器 -->
          <div v-if="filterable && filterOptions" class="filter-box">
            <n-select
              v-model:value="filterValueModel"
              :options="filterOptions"
              :placeholder="t('button.filter')"
              clearable
              :style="{ width: typeof filterWidth === 'number' ? `${filterWidth}px` : filterWidth }"
            />
          </div>
        </div>

        <!-- 右侧操作按钮插槽 -->
        <div v-if="$slots.toolbar" class="toolbar-right">
          <slot name="toolbar" />
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-alert">
        <n-alert
          type="error"
          :title="t('status.error')"
        >
          {{ error }}
        </n-alert>
      </div>

      <!-- 数据表格 -->
      <div class="data-table-content">
        <n-data-table
          :columns="resizableColumns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :bordered="bordered"
          :striped="striped"
          :sort="sortStateModel"
          :sort-mode="sortMode"
          :remote="false"
          :max-height="height === 'auto' ? undefined : height"
          @update:sorter="handleSorterChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table-wrapper {
  width: 100%;
}

.data-table-container {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  padding: 16px;

  &:hover {
    box-shadow:
      0 6px 24px rgba(0, 0, 0, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .data-table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    padding: 0;

    .toolbar-left {
      display: flex;
      gap: 16px;
      align-items: center;
      flex: 1;
    }

    .toolbar-right {
      flex-shrink: 0;
    }

    .search-box {
      flex-shrink: 0;
    }

    .filter-box {
      flex-shrink: 0;
    }
  }

  .error-alert {
    margin-bottom: 16px;
  }

  .data-table-content {
    :deep(.n-data-table) {
      background: transparent;
    }

    :deep(.n-data-table-wrapper) {
      border-radius: 8px;
      overflow: hidden;
    }

    :deep(.n-data-table-thead) {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    :deep(.n-data-table-tbody) {
      background: transparent;
    }

    :deep(.n-data-table-td) {
      background: transparent;
      border-color: rgba(0, 0, 0, 0.06);
    }

    :deep(.n-data-table-th) {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-color: rgba(0, 0, 0, 0.06);
    }

    :deep(.n-data-table-tr:hover .n-data-table-td) {
      background: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>
