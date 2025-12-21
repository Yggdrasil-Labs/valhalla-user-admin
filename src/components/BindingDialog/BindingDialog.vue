<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import type { BindingDialogConfig, BindingItem } from '@/types/store/binding'
import { NButton, NDataTable, NInput, NModal, NSelect, NSpace, useMessage } from 'naive-ui'
import { useI18nHelper } from '@/composables/useI18n'

interface Props {
  /** 是否显示对话框 */
  visible: boolean
  /** 对话框标题 */
  title: string
  /** 已绑定的项ID列表 */
  boundIds: string[]
  /** 绑定配置 */
  config: BindingDialogConfig
  /** 对话框宽度 */
  width?: string | number
  /** 是否加载中 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '80vw',
  loading: false,
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'confirm': [selectedIds: string[]]
  'cancel': []
}>()

const { t } = useI18nHelper()
const message = useMessage()

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emit('update:visible', value)
  },
})

// 可绑定项列表
const items = ref<BindingItem[]>([])
const loadingItems = ref(false)
const error = ref<string | null>(null)

// 分页参数
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onUpdatePage: (page: number) => {
    pagination.value.page = page
    fetchItems()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    fetchItems()
  },
})

// 搜索和筛选
const searchValue = ref('')
const filterValue = ref<any>(undefined)

// 选中的项ID列表
const selectedIds = ref<string[]>([])

// 表格列定义（添加复选框列）
const columns = computed<DataTableColumns<BindingItem>>(() => {
  const baseColumns = props.config.columns.map(col => ({
    ...col,
    render: col.render || ((row: BindingItem) => row[col.key] || '-'),
  }))

  return [
    {
      type: 'selection',
      width: 50,
      align: 'center',
    },
    ...baseColumns,
  ]
})

// 获取可绑定项列表
async function fetchItems() {
  loadingItems.value = true
  error.value = null

  try {
    const params: Record<string, any> = {
      pageNum: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    // 添加搜索参数
    if (searchValue.value && props.config.searchField) {
      const searchFields = Array.isArray(props.config.searchField)
        ? props.config.searchField
        : [props.config.searchField]
      searchFields.forEach((field) => {
        params[field] = searchValue.value
      })
    }

    // 添加筛选参数
    if (filterValue.value !== undefined && props.config.filterField) {
      params[props.config.filterField] = filterValue.value
    }

    const response = await props.config.fetchData(params)

    if (response.success && response.data) {
      items.value = response.data
      // 注意：如果后端返回分页信息，需要根据实际响应调整
      pagination.value.itemCount = response.data.length

      // 同步选中状态（保持已绑定项的选中状态）
      nextTick(() => {
        syncSelectedState()
      })
    }
    else {
      const errorMsg = response.errMessage || t('binding.messages.loadFailed')
      error.value = errorMsg
      message.error(errorMsg)
    }
  }
  catch (err) {
    const errorMsg = err instanceof Error ? err.message : t('binding.messages.loadFailed')
    error.value = errorMsg
    message.error(errorMsg)
  }
  finally {
    loadingItems.value = false
  }
}

// 同步选中状态（确保已绑定项被选中）
function syncSelectedState() {
  // 合并当前选中的项和已绑定的项
  const allSelected = new Set([
    ...selectedIds.value,
    ...props.boundIds,
  ])
  selectedIds.value = Array.from(allSelected)
}

// 处理搜索
function handleSearch(value: string) {
  searchValue.value = value
  pagination.value.page = 1
  fetchItems()
}

// 处理筛选
function handleFilter(value: any) {
  filterValue.value = value
  pagination.value.page = 1
  fetchItems()
}

// 处理选择变化
function handleSelectionChange(selectedRowKeys: Array<string | number>) {
  selectedIds.value = selectedRowKeys.map(String)
}

// 处理确认
function handleConfirm() {
  // 检查是否有变更
  const boundSet = new Set(props.boundIds)
  const selectedSet = new Set(selectedIds.value)

  // 比较两个集合是否相同
  if (boundSet.size === selectedSet.size
    && [...boundSet].every(id => selectedSet.has(id))) {
    message.info(t('binding.messages.noChanges'))
    return
  }

  emit('confirm', selectedIds.value)
}

// 处理取消
function handleCancel() {
  dialogVisible.value = false
  // 重置状态
  searchValue.value = ''
  filterValue.value = undefined
  selectedIds.value = []
  emit('cancel')
}

// 监听对话框打开
watch(() => props.visible, (visible) => {
  if (visible) {
    // 初始化选中状态为已绑定的项
    selectedIds.value = [...props.boundIds]
    // 重置分页和搜索
    pagination.value.page = 1
    searchValue.value = ''
    filterValue.value = undefined
    // 加载数据
    fetchItems()
  }
})

// 监听已绑定项变化
watch(() => props.boundIds, () => {
  if (props.visible) {
    syncSelectedState()
  }
}, { deep: true })

// 行类名（用于高亮已绑定项）
function getRowClassName(row: BindingItem) {
  return props.boundIds.includes(row.id) ? 'bound-row' : ''
}

// 对话框样式
const dialogStyle = computed(() => ({
  width: props.width,
  maxWidth: props.width,
}))
</script>

<template>
  <NModal
    v-model:show="dialogVisible"
    :style="dialogStyle"
    preset="dialog"
    :mask-closable="false"
    :close-on-esc="true"
    :show-icon="false"
  >
    <template #header>
      <div class="dialog-title">
        {{ title }}
      </div>
    </template>

    <div class="binding-dialog-content">
      <!-- 搜索和筛选栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <!-- 筛选器 -->
          <div v-if="config.filterOptions && config.filterOptions.length > 0" class="filter-box">
            <NSelect
              v-model:value="filterValue"
              :options="config.filterOptions"
              :placeholder="t('button.filter')"
              clearable
              style="width: 200px"
              @update:value="handleFilter"
            />
          </div>

          <!-- 搜索输入框 -->
          <div v-if="config.searchField" class="search-input">
            <NInput
              v-model:value="searchValue"
              :placeholder="t('binding.searchPlaceholder', { field: config.displayField || t('label.name') })"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch(searchValue)"
            />
          </div>

          <!-- 搜索按钮 -->
          <div v-if="config.searchField" class="search-button">
            <NButton
              type="primary"
              @click="handleSearch(searchValue)"
            >
              {{ t('button.search') }}
            </NButton>
          </div>
        </div>

        <!-- 选中数量提示 -->
        <div class="selected-count">
          {{ t('binding.selectedCount', { count: selectedIds.length }) }}
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-container">
        <NDataTable
          :columns="columns"
          :data="items"
          :loading="loadingItems || loading"
          :pagination="pagination"
          :row-key="(row: BindingItem) => row.id"
          :row-class-name="getRowClassName"
          :checked-row-keys="selectedIds"
          max-height="calc(80vh - 200px)"
          @update:checked-row-keys="handleSelectionChange"
        />
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <template #action>
      <NSpace>
        <NButton
          :disabled="loading"
          @click="handleCancel"
        >
          {{ t('button.cancel') }}
        </NButton>
        <NButton
          type="primary"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ t('button.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.dialog-title {
  text-align: center;
  font-size: map.get($font-sizes, xl);
  font-weight: 600;
  color: map.get($colors, gray-800);
  width: 100%;
}

.binding-dialog-content {
  padding: 16px 0;
  min-height: calc(80vh - 200px);
  max-height: calc(80vh - 200px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  .toolbar-left {
    display: flex;
    gap: 12px;
    align-items: center;
    flex: 1;
  }

  .selected-count {
    color: map.get($colors, gray-600);
    font-size: map.get($font-sizes, sm);
  }
}

.table-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.error-message {
  color: map.get($colors, red-500);
  font-size: map.get($font-sizes, sm);
  margin-top: 8px;
  text-align: center;
}

// 已绑定项高亮样式
:deep(.bound-row) {
  background-color: map.get($colors, blue-50) !important;

  &:hover {
    background-color: map.get($colors, blue-100) !important;
  }
}

// 覆盖 Naive UI Modal 的默认宽度限制
:deep(.n-dialog.n-modal) {
  width: 80vw !important;
  max-width: 80vw !important;
}
</style>
