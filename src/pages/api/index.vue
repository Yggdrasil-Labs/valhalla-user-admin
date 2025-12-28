<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import type { ApiCO, CreateApiRequest, GetApisParams, UpdateApiRequest } from '@/types/store'
import { NButton, NTag, useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import {
  createApiApi,
  deleteApiApi,
  getApisApi,
  updateApiApi,
} from '@/api/modules/api'
import { Card, EmptyState, ErrorState, LoadingState, PageContainer, PageHeader } from '@/components'
import { DataTable } from '@/components/DataTable'
import { FormDialog } from '@/components/FormDialog'
import { useI18nHelper } from '@/composables/useI18n'

const { t } = useI18nHelper()
const message = useMessage()
const dialog = useDialog()

// API 列表数据
const apis = ref<ApiCO[]>([])
const loading = ref(false)
const initialLoading = ref(true) // 首次加载状态，用于控制骨架屏
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
    fetchApis()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    fetchApis()
  },
})

// 搜索和筛选
const searchValue = ref('')
const filterValue = ref<string | undefined>(undefined)

// 排序状态
const sortState = ref<DataTableSortState | null>(null)

// 表单对话框
const formDialogVisible = ref(false)
const formDialogTitle = ref('')
const editingApi = ref<ApiCO | null>(null)
const formLoading = ref(false)

// HTTP 方法选项
const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

// API 状态选项
const apiStatusOptions = [
  { label: t('api.management.status.enabled'), value: 'ENABLED' },
  { label: t('api.management.status.deprecated'), value: 'DEPRECATED' },
  { label: t('api.management.status.disabled'), value: 'DISABLED' },
]

// 表格列定义
const columns = computed<DataTableColumns<ApiCO>>(() => [
  {
    title: t('api.management.columns.apiCode'),
    key: 'apiCode',
    sorter: 'default',
    width: 150,
    align: 'left',
  },
  {
    title: t('api.management.columns.version'),
    key: 'version',
    width: 100,
    align: 'left',
  },
  {
    title: t('api.management.columns.apiName'),
    key: 'apiName',
    sorter: 'default',
    width: 150,
    align: 'left',
  },
  {
    title: t('api.management.columns.resourcePath'),
    key: 'resourcePath',
    sorter: 'default',
    width: 250,
    align: 'left',
  },
  {
    title: t('api.management.columns.resourceMethod'),
    key: 'resourceMethod',
    width: 120,
    align: 'center',
    render: (row: ApiCO) => {
      return h(NTag, {
        type: getMethodTagType(row.resourceMethod),
      }, { default: () => row.resourceMethod })
    },
  },
  {
    title: t('api.management.columns.status'),
    key: 'status',
    width: 100,
    align: 'center',
    render: (row: ApiCO) => {
      let statusType: 'success' | 'warning' | 'default' = 'default'
      let statusText = ''

      if (row.status === 'ENABLED') {
        statusType = 'success'
        statusText = t('api.management.status.enabled')
      }
      else if (row.status === 'DEPRECATED') {
        statusType = 'warning'
        statusText = t('api.management.status.deprecated')
      }
      else if (row.status === 'DISABLED') {
        statusType = 'default'
        statusText = t('api.management.status.disabled')
      }
      else {
        statusText = row.status || ''
      }

      return h(NTag, {
        type: statusType,
      }, { default: () => statusText })
    },
  },
  {
    title: t('api.management.columns.description'),
    key: 'description',
    width: 200,
    align: 'left',
  },
  {
    title: t('api.management.columns.createTime'),
    key: 'createTime',
    sorter: 'default',
    width: 180,
    align: 'left',
  },
  {
    title: t('api.management.columns.actions'),
    key: 'actions',
    width: 200,
    fixed: 'right',
    align: 'center',
    render: (row: ApiCO) => {
      return h('div', { class: 'action-buttons' }, [
        h(NButton, {
          size: 'small',
          type: 'primary',
          style: { marginRight: '8px' },
          onClick: () => handleEdit(row),
        }, { default: () => t('button.edit') }),
        h(NButton, {
          size: 'small',
          type: 'error',
          disabled: row.status !== 'DISABLED', // 只有禁用状态才能删除
          onClick: () => handleDelete(row),
        }, { default: () => t('button.delete') }),
      ])
    },
  },
])

// 获取 HTTP 方法的标签类型
function getMethodTagType(method: string): 'default' | 'error' | 'info' | 'success' | 'warning' {
  const methodUpper = method.toUpperCase()
  switch (methodUpper) {
    case 'GET':
      return 'info'
    case 'POST':
      return 'success'
    case 'PUT':
      return 'warning'
    case 'DELETE':
      return 'error'
    case 'PATCH':
      return 'default'
    default:
      return 'default'
  }
}

// 筛选选项（HTTP 方法）
const filterOptions = computed(() => {
  return httpMethods.map(method => ({ label: method, value: method }))
})

// 表单字段配置
const formFields = computed(() => [
  {
    key: 'apiCode',
    label: t('api.management.form.apiCode'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
    disabled: !!editingApi.value, // 编辑时禁用接口代码
  },
  {
    key: 'apiName',
    label: t('api.management.form.apiName'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
  {
    key: 'resourcePath',
    label: t('api.management.form.resourcePath'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
    disabled: !!editingApi.value, // 编辑时禁用资源路径
  },
  {
    key: 'resourceMethod',
    label: t('api.management.form.resourceMethod'),
    type: 'select' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseSelect'),
    options: httpMethods.map(method => ({ label: method, value: method })),
    disabled: !!editingApi.value, // 编辑时禁用 HTTP 方法
  },
  ...(editingApi.value
    ? []
    : [
        {
          key: 'version',
          label: t('api.management.form.version'),
          type: 'input' as const,
          placeholder: t('form.placeholder.pleaseEnter'),
        },
      ]),
  {
    key: 'status',
    label: t('api.management.form.status'),
    type: 'select' as const,
    placeholder: t('form.placeholder.pleaseSelect'),
    options: apiStatusOptions,
  },
  {
    key: 'description',
    label: t('api.management.form.description'),
    type: 'textarea' as const,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
])

// 表单初始值
const formInitialValues = computed(() => {
  if (editingApi.value) {
    return {
      apiCode: editingApi.value.apiCode,
      apiName: editingApi.value.apiName,
      resourcePath: editingApi.value.resourcePath,
      resourceMethod: editingApi.value.resourceMethod,
      status: editingApi.value.status || 'ENABLED',
      description: editingApi.value.description || '',
    }
  }
  return {
    apiCode: '',
    apiName: '',
    resourcePath: '',
    resourceMethod: '',
    version: 'v1', // 默认版本
    status: 'ENABLED', // 默认状态
    description: '',
  }
})

// 获取 API 列表
async function fetchApis() {
  loading.value = true
  error.value = null

  try {
    const params: GetApisParams = {
      pageNum: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    // 支持按接口代码或资源路径搜索（后端支持模糊匹配）
    if (searchValue.value) {
      // 后端支持同时按 apiCode 和 resourcePath 搜索
      params.apiCode = searchValue.value
      params.resourcePath = searchValue.value
    }

    // 按 HTTP 方法筛选（后端处理）
    if (filterValue.value) {
      params.resourceMethod = filterValue.value
    }

    const response = await getApisApi(params)

    if (response.success && response.data) {
      apis.value = response.data
      // 使用后端返回的总记录数（后端已经根据过滤条件返回正确的总数）
      const totalCount = (response as any).totalCount
      if (totalCount !== undefined && totalCount !== null && totalCount > 0) {
        pagination.value.itemCount = totalCount
      }
      else {
        // 如果 totalCount 不存在，根据当前页数据长度估算
        const dataLength = response.data.length
        if (dataLength === pagination.value.pageSize) {
          pagination.value.itemCount = pagination.value.page * pagination.value.pageSize + 1
        }
        else {
          pagination.value.itemCount = (pagination.value.page - 1) * pagination.value.pageSize + dataLength
        }
      }
    }
    else {
      error.value = response.errMessage || t('api.management.messages.loadFailed')
      message.error(error.value)
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('api.management.messages.loadFailed')
    message.error(error.value)
  }
  finally {
    loading.value = false
    // 首次加载完成后，关闭骨架屏
    if (initialLoading.value) {
      initialLoading.value = false
    }
  }
}

// 处理搜索
function handleSearch(value: string) {
  searchValue.value = value
  pagination.value.page = 1
  fetchApis()
}

// 处理筛选
function handleFilter(value: string | undefined) {
  filterValue.value = value
  pagination.value.page = 1
  fetchApis()
}

// 比较两个值的辅助函数
function compareValues(a: any, b: any, order: 'ascend' | 'descend' | false): number {
  if (order === false) {
    return 0
  }

  if (a === undefined || a === null) {
    return (b === undefined || b === null) ? 0 : 1
  }
  if (b === undefined || b === null) {
    return -1
  }

  if (typeof a === 'string' && typeof b === 'string') {
    const result = a.localeCompare(b)
    return order === 'ascend' ? result : -result
  }

  if (typeof a === 'number' && typeof b === 'number') {
    const result = a - b
    return order === 'ascend' ? result : -result
  }

  const aStr = String(a)
  const bStr = String(b)
  const result = aStr.localeCompare(bStr)
  return order === 'ascend' ? result : -result
}

// 处理排序
function handleSorterChange(sorter: DataTableSortState | DataTableSortState[] | null) {
  if (!sorter) {
    sortState.value = null
    return
  }

  const sorters = Array.isArray(sorter) ? sorter : [sorter]
  sortState.value = sorters[0] || null

  const sortedApis = [...apis.value].sort((a, b) => {
    for (const sortRule of sorters) {
      const { columnKey, order } = sortRule

      if (order === false) {
        continue
      }

      const aVal = a[columnKey as keyof ApiCO]
      const bVal = b[columnKey as keyof ApiCO]

      const result = compareValues(aVal, bVal, order as 'ascend' | 'descend')
      if (result !== 0) {
        return result
      }
    }

    return 0
  })

  apis.value = sortedApis
}

// 打开新增对话框
function handleAdd() {
  editingApi.value = null
  formDialogTitle.value = t('api.management.addApi')
  formDialogVisible.value = true
}

// 打开编辑对话框
function handleEdit(api: ApiCO) {
  editingApi.value = api
  formDialogTitle.value = t('api.management.editApi')
  formDialogVisible.value = true
}

// 处理表单提交
async function handleFormSubmit(values: Record<string, any>) {
  formLoading.value = true

  try {
    if (editingApi.value) {
      // 更新 API（只能修改 apiName、status、description、metadata）
      const updateData: UpdateApiRequest = {
        id: editingApi.value.id,
        apiName: values.apiName,
        status: values.status,
        description: values.description,
      }

      const response = await updateApiApi(editingApi.value.id, updateData)

      if (response.success) {
        message.success(t('api.management.messages.updateSuccess'))
        formDialogVisible.value = false
        await fetchApis()
      }
      else {
        message.error(response.errMessage || t('api.management.messages.updateFailed'))
      }
    }
    else {
      // 创建 API（包含 version 和 status）
      const createData: CreateApiRequest = {
        apiCode: values.apiCode,
        apiName: values.apiName,
        resourcePath: values.resourcePath,
        resourceMethod: values.resourceMethod,
        version: values.version,
        status: values.status,
        description: values.description,
      }

      const response = await createApiApi(createData)

      if (response.success) {
        message.success(t('api.management.messages.createSuccess'))
        formDialogVisible.value = false
        await fetchApis()
      }
      else {
        message.error(response.errMessage || t('api.management.messages.createFailed'))
      }
    }
  }
  catch (err) {
    let errorMessage: string
    if (err instanceof Error) {
      errorMessage = err.message
    }
    else if (editingApi.value) {
      errorMessage = t('api.management.messages.updateFailed')
    }
    else {
      errorMessage = t('api.management.messages.createFailed')
    }
    message.error(errorMessage)
  }
  finally {
    formLoading.value = false
  }
}

// 处理删除
function handleDelete(api: ApiCO) {
  // 只有禁用状态的接口才能删除
  if (api.status !== 'DISABLED') {
    message.warning(t('api.management.messages.cannotDeleteNonDisabled'))
    return
  }

  dialog.warning({
    title: t('confirm.deleteConfirm'),
    content: t('api.management.confirm.deleteApi', { apiName: api.apiName }),
    positiveText: t('button.confirm'),
    negativeText: t('button.cancel'),
    onPositiveClick: async () => {
      try {
        const response = await deleteApiApi(api.id)

        if (response.success) {
          message.success(t('api.management.messages.deleteSuccess'))
          await fetchApis()
        }
        else {
          message.error(response.errMessage || t('api.management.messages.deleteFailed'))
        }
      }
      catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('api.management.messages.deleteFailed')
        message.error(errorMessage)
      }
    },
  })
}

// 初始化
onMounted(() => {
  fetchApis()
})
</script>

<template>
  <PageContainer>
    <PageHeader
      :title="t('api.management.title')"
      :description="t('api.management.description')"
    >
      <template #actions>
        <NButton
          type="primary"
          @click="handleAdd"
        >
          {{ t('api.management.addApi') }}
        </NButton>
      </template>
    </PageHeader>

    <Card>
      <LoadingState v-if="initialLoading" type="skeleton" :rows="5" />
      <ErrorState
        v-else-if="error"
        :title="t('api.management.messages.loadFailed')"
        :description="error"
        @retry="fetchApis"
      />
      <EmptyState
        v-else-if="apis.length === 0 && !searchValue && !filterValue"
        :title="t('api.management.empty.title')"
        :description="t('api.management.empty.description')"
        :action-text="t('api.management.addApi')"
        @action="handleAdd"
      />
      <DataTable
        v-else
        :columns="columns"
        :data="apis"
        :loading="loading"
        :pagination="pagination"
        :searchable="true"
        :search-value="searchValue"
        :search-placeholder="t('form.placeholder.searchPlaceholder')"
        :filterable="true"
        :filter-options="filterOptions"
        :filter-value="filterValue"
        :sort-state="sortState"
        :error="null"
        :filter-width="200"
        @search="handleSearch"
        @filter="handleFilter"
        @update:sorter="handleSorterChange"
      />
    </Card>

    <!-- 表单对话框 -->
    <FormDialog
      v-model:visible="formDialogVisible"
      :title="formDialogTitle"
      :fields="formFields"
      :initial-values="formInitialValues"
      :loading="formLoading"
      @submit="handleFormSubmit"
      @cancel="() => { formDialogVisible = false }"
    />
  </PageContainer>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.action-buttons {
  display: flex;
  gap: map.get($spacings, 2); // 8px

  :deep(.n-button) {
    height: 28px;
    padding: 0 12px;
    font-size: 12px;
    border-radius: map.get($border-radius, base); // 6px
    transition: all map.get($transitions, fast);

    &:hover {
      transform: translateY(-1px);
      box-shadow: map.get($shadows, sm);
    }
  }
}
</style>
