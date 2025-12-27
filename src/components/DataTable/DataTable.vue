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
  /** 是否独立模式（单独使用，显示边框、圆角、阴影） */
  standalone?: boolean
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
  standalone: false,
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:filterValue': [value: any]
  'update:sorter': [sorter: SortState]
  'search': [value: string]
  'filter': [value: any]
}>()

const { t } = useI18nHelper()

// 使用内部 ref 管理搜索值，确保输入框可以正常输入
const internalSearchValue = ref(props.searchValue || '')

// 同步 props 的变化到内部值
watch(() => props.searchValue, (newValue) => {
  if (newValue !== undefined && newValue !== internalSearchValue.value) {
    internalSearchValue.value = newValue
  }
}, { immediate: true })

// 搜索值双向绑定（仅更新值，不自动触发查询）
const searchValueModel = computed({
  get: () => internalSearchValue.value,
  set: (value: string) => {
    internalSearchValue.value = value
    emit('update:searchValue', value)
  },
})

// 处理搜索按钮点击
function handleSearchClick() {
  emit('search', searchValueModel.value)
}

// 使用内部 ref 管理筛选值
const internalFilterValue = ref(props.filterValue)

// 同步 props 的变化到内部值
watch(() => props.filterValue, (newValue) => {
  if (newValue !== internalFilterValue.value) {
    internalFilterValue.value = newValue
  }
}, { immediate: true })

// 筛选值双向绑定
const filterValueModel = computed({
  get: () => internalFilterValue.value,
  set: (value: any) => {
    internalFilterValue.value = value
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
    <div class="data-table-container" :class="{ 'data-table-container--standalone': standalone }">
      <!-- 搜索和筛选栏 -->
      <div v-if="searchable || filterable || $slots.toolbar" class="data-table-toolbar">
        <div class="toolbar-left">
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

          <!-- 搜索输入框 -->
          <div v-if="searchable" class="search-input">
            <n-input
              v-model:value="searchValueModel"
              :placeholder="searchPlaceholder || t('button.search')"
              clearable
              :style="{ width: typeof filterWidth === 'number' ? `${filterWidth}px` : filterWidth }"
              @keyup.enter="handleSearchClick"
            />
          </div>

          <!-- 搜索按钮 -->
          <div v-if="searchable" class="search-button">
            <n-button
              type="primary"
              @click="handleSearchClick"
            >
              {{ t('button.search') }}
            </n-button>
          </div>
        </div>

        <!-- 右侧操作按钮插槽 -->
        <div v-if="$slots.toolbar" class="toolbar-right">
          <slot name="toolbar" />
        </div>
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
          :max-height="height === 'auto' ? '100%' : height"
          @update:sorter="handleSorterChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.data-table-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; // 允许 flex 子元素收缩
}

.data-table-container {
  // 默认模式（嵌入在 Card 等容器内）：无边框、无圆角、无阴影、无背景
  padding: 0;
  background: transparent;
  border-radius: 0;
  border: none;
  box-shadow: none;
  min-height: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; // 允许 flex 子元素收缩

  .data-table-toolbar {
    padding: map.get($spacings, 6); // 24px
    padding-bottom: map.get($spacings, 4); // 16px
    margin-bottom: 0;
  }

  .data-table-content {
    padding: map.get($spacings, 4) map.get($spacings, 6) map.get($spacings, 6); // 16px 24px 24px
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; // 允许 flex 子元素收缩
    overflow: hidden;
  }

  // 独立模式（单独使用）：显示边框、圆角、阴影、背景
  &.data-table-container--standalone {
    padding: map.get($spacings, 6); // 24px
    background: map.get($colors, surface);
    border-radius: map.get($border-radius, md); // 8px
    border: 1px solid map.get($colors, border);
    box-shadow: map.get($shadows, base);
    min-height: 400px;

    .data-table-toolbar {
      padding: 0;
      padding-bottom: map.get($spacings, 4); // 16px
      margin-bottom: map.get($spacings, 4); // 16px
    }

    .data-table-content {
      padding-top: map.get($spacings, 4); // 16px
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0; // 允许 flex 子元素收缩
      overflow: hidden;
    }
  }

  .data-table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: map.get($spacings, 4); // 16px
    border-bottom: 1px solid map.get($colors, border);

    .toolbar-left {
      display: flex;
      gap: map.get($spacings, 4); // 16px
      align-items: center;
      flex: 1;
    }

    .toolbar-right {
      flex-shrink: 0;
    }

    .filter-box {
      flex-shrink: 0;
    }

    .search-input {
      flex-shrink: 0;
    }

    .search-button {
      flex-shrink: 0;
    }
  }
}

// 优化表格样式
:deep(.n-data-table) {
  .n-data-table-tr {
    height: 48px; // 紧凑模式，提升信息密度
    transition: background map.get($transitions, fast);

    &:hover {
      background: map.get($colors, gray-100);
    }
  }

  .n-data-table-th {
    background: map.get($colors, gray-50);
    color: map.get($colors, text-primary);
    font-weight: map.get($font-weights, semibold);
    font-size: map.get($font-sizes, sm); // 14px
    padding: 12px 16px;
    border-bottom: 1px solid map.get($colors, border);
  }

  .n-data-table-td {
    padding: 12px 16px;
    font-size: map.get($font-sizes, sm); // 14px
    color: map.get($colors, text-primary);
    border-bottom: 1px solid map.get($colors, border);
  }

  // 斑马纹（可选）
  .n-data-table-tbody .n-data-table-tr:nth-child(even) {
    background: map.get($colors, gray-50);
  }
}
</style>
