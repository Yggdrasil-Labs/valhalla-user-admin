<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import type { CreatePermissionRequest, GetPermissionsParams, PermissionCO, UpdatePermissionRequest } from '@/types/store'
import type { BindingDialogConfig } from '@/types/store/binding'
import { NButton, useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import { getApisApi } from '@/api/modules/api'
import { assignPermissionApisApi, createPermissionApi, deletePermissionApi, getPermissionsApi, updatePermissionApi } from '@/api/modules/permission'

import { BindingDialog } from '@/components/BindingDialog'
import { DataTable } from '@/components/DataTable'
import { FormDialog } from '@/components/FormDialog'
import { useI18nHelper } from '@/composables/useI18n'

const { t } = useI18nHelper()
const message = useMessage()
const dialog = useDialog()

// 权限列表数据
const permissions = ref<PermissionCO[]>([])
const loading = ref(false)
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
    fetchPermissions()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    fetchPermissions()
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
const editingPermission = ref<PermissionCO | null>(null)
const formLoading = ref(false)

// 分配API对话框
const assignApiDialogVisible = ref(false)
const assigningPermission = ref<PermissionCO | null>(null)
const assignApiLoading = ref(false)

// HTTP 方法选项（用于筛选）
const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
const apiMethodOptions = computed(() => {
  return httpMethods.map(method => ({ label: method, value: method }))
})

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

// 绑定对话框配置
const apiBindingConfig = computed<BindingDialogConfig>(() => ({
  fetchData: getApisApi,
  searchField: ['apiCode', 'resourcePath'],
  filterField: 'resourceMethod',
  filterOptions: apiMethodOptions.value,
  displayField: t('api.management.columns.apiCode'),
  columns: [
    { title: t('api.management.columns.apiCode'), key: 'apiCode', width: 150 },
    { title: t('api.management.columns.apiName'), key: 'apiName', width: 150 },
    { title: t('api.management.columns.resourcePath'), key: 'resourcePath', width: 250 },
    {
      title: t('api.management.columns.resourceMethod'),
      key: 'resourceMethod',
      width: 120,
      render: (row: any) => {
        return h('span', {
          style: {
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: getMethodTagType(row.resourceMethod) === 'info' ? '#e0f2fe' : getMethodTagType(row.resourceMethod) === 'success' ? '#dcfce7' : getMethodTagType(row.resourceMethod) === 'warning' ? '#fef3c7' : getMethodTagType(row.resourceMethod) === 'error' ? '#fee2e2' : '#f3f4f6',
            color: getMethodTagType(row.resourceMethod) === 'info' ? '#0369a1' : getMethodTagType(row.resourceMethod) === 'success' ? '#166534' : getMethodTagType(row.resourceMethod) === 'warning' ? '#92400e' : getMethodTagType(row.resourceMethod) === 'error' ? '#991b1b' : '#374151',
          },
        }, row.resourceMethod)
      },
    },
    { title: t('api.management.columns.description'), key: 'description', width: 200 },
  ],
}))

// 表格列定义
const columns = computed<DataTableColumns<PermissionCO>>(() => [
  {
    title: t('permission.management.columns.module'),
    key: 'module',
    sorter: 'default',
    width: 120,
    align: 'left',
  },
  {
    title: t('permission.management.columns.resource'),
    key: 'resource',
    sorter: 'default',
    width: 120,
    align: 'left',
  },
  {
    title: t('permission.management.columns.action'),
    key: 'action',
    sorter: 'default',
    width: 100,
    align: 'left',
  },
  {
    title: t('permission.management.columns.permissionCode'),
    key: 'permissionCode',
    width: 200,
    align: 'left',
  },
  {
    title: t('permission.management.columns.permissionName'),
    key: 'permissionName',
    sorter: 'default',
    width: 150,
    align: 'left',
  },
  {
    title: t('permission.management.columns.description'),
    key: 'description',
    width: 200,
    align: 'left',
  },
  {
    title: t('permission.management.columns.apiIds'),
    key: 'apiIds',
    width: 100,
    align: 'right',
    render: (row: PermissionCO) => {
      const count = row.apiIds?.length || 0
      return count > 0 ? `${count} ${t('label.count')}` : '-'
    },
  },
  {
    title: t('permission.management.columns.createTime'),
    key: 'createTime',
    sorter: 'default',
    width: 180,
    align: 'left',
  },
  {
    title: t('permission.management.columns.actions'),
    key: 'actions',
    width: 250,
    fixed: 'right',
    align: 'center',
    render: (row: PermissionCO) => {
      return h('div', { class: 'action-buttons' }, [
        h(NButton, {
          size: 'small',
          type: 'primary',
          style: { marginRight: '8px' },
          onClick: () => handleEdit(row),
        }, { default: () => t('button.edit') }),
        h(NButton, {
          size: 'small',
          type: 'info',
          style: { marginRight: '8px' },
          onClick: () => handleAssignApis(row),
        }, { default: () => t('permission.management.assignApis') }),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handleDelete(row),
        }, { default: () => t('button.delete') }),
      ])
    },
  },
])

// 获取所有模块用于筛选
const moduleOptions = computed(() => {
  const modules = new Set<string>()
  permissions.value.forEach((permission) => {
    if (permission.module) {
      modules.add(permission.module)
    }
  })
  return Array.from(modules).map(module => ({ label: module, value: module }))
})

// 表单字段配置
const formFields = computed(() => [
  {
    key: 'module',
    label: t('permission.management.form.module'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
    disabled: !!editingPermission.value, // 编辑时禁用模块
  },
  {
    key: 'resource',
    label: t('permission.management.form.resource'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
    disabled: !!editingPermission.value, // 编辑时禁用资源
  },
  {
    key: 'action',
    label: t('permission.management.form.action'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
    disabled: !!editingPermission.value, // 编辑时禁用操作
  },
  {
    key: 'permissionName',
    label: t('permission.management.form.permissionName'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
  {
    key: 'description',
    label: t('permission.management.form.description'),
    type: 'textarea' as const,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
])

// 表单初始值
const formInitialValues = computed(() => {
  if (editingPermission.value) {
    return {
      module: editingPermission.value.module,
      resource: editingPermission.value.resource,
      action: editingPermission.value.action,
      permissionName: editingPermission.value.permissionName,
      description: editingPermission.value.description || '',
    }
  }
  return {
    module: '',
    resource: '',
    action: '',
    permissionName: '',
    description: '',
  }
})

// 获取权限列表
async function fetchPermissions() {
  loading.value = true
  error.value = null

  try {
    const params: GetPermissionsParams = {
      pageNum: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    if (searchValue.value) {
      // 支持按权限名称搜索（后端支持模糊匹配）
      params.permissionName = searchValue.value
    }

    if (filterValue.value) {
      params.module = filterValue.value
    }

    const response = await getPermissionsApi(params)

    if (response.success && response.data) {
      let filteredPermissions = response.data

      // 如果同时有搜索和筛选，需要在前端再次筛选
      if (searchValue.value && filterValue.value) {
        filteredPermissions = filteredPermissions.filter(
          permission => permission.module === filterValue.value,
        )
      }

      permissions.value = filteredPermissions
      pagination.value.itemCount = filteredPermissions.length
    }
    else {
      error.value = response.errMessage || t('permission.management.messages.loadFailed')
      message.error(error.value)
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('permission.management.messages.loadFailed')
    message.error(error.value)
  }
  finally {
    loading.value = false
  }
}

// 处理搜索
function handleSearch(value: string) {
  searchValue.value = value
  pagination.value.page = 1
  fetchPermissions()
}

// 处理筛选
function handleFilter(value: string | undefined) {
  filterValue.value = value
  pagination.value.page = 1
  fetchPermissions()
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

  const sortedPermissions = [...permissions.value].sort((a, b) => {
    for (const sortRule of sorters) {
      const { columnKey, order } = sortRule

      if (order === false) {
        continue
      }

      const aVal = a[columnKey as keyof PermissionCO]
      const bVal = b[columnKey as keyof PermissionCO]

      const result = compareValues(aVal, bVal, order as 'ascend' | 'descend')
      if (result !== 0) {
        return result
      }
    }

    return 0
  })

  permissions.value = sortedPermissions
}

// 打开新增对话框
function handleAdd() {
  editingPermission.value = null
  formDialogTitle.value = t('permission.management.addPermission')
  formDialogVisible.value = true
}

// 打开编辑对话框
function handleEdit(permission: PermissionCO) {
  editingPermission.value = permission
  formDialogTitle.value = t('permission.management.editPermission')
  formDialogVisible.value = true
}

// 处理表单提交
async function handleFormSubmit(values: Record<string, any>) {
  formLoading.value = true

  try {
    if (editingPermission.value) {
      // 更新权限
      const updateData: UpdatePermissionRequest = {
        id: editingPermission.value.id,
        permissionName: values.permissionName,
        description: values.description,
      }

      const response = await updatePermissionApi(editingPermission.value.id, updateData)

      if (response.success) {
        message.success(t('permission.management.messages.updateSuccess'))
        formDialogVisible.value = false
        await fetchPermissions()
      }
      else {
        message.error(response.errMessage || t('permission.management.messages.updateFailed'))
      }
    }
    else {
      // 创建权限
      const createData: CreatePermissionRequest = {
        module: values.module,
        resource: values.resource,
        action: values.action,
        permissionName: values.permissionName,
        description: values.description,
      }

      const response = await createPermissionApi(createData)

      if (response.success) {
        message.success(t('permission.management.messages.createSuccess'))
        formDialogVisible.value = false
        await fetchPermissions()
      }
      else {
        message.error(response.errMessage || t('permission.management.messages.createFailed'))
      }
    }
  }
  catch (err) {
    let errorMessage: string
    if (err instanceof Error) {
      errorMessage = err.message
    }
    else if (editingPermission.value) {
      errorMessage = t('permission.management.messages.updateFailed')
    }
    else {
      errorMessage = t('permission.management.messages.createFailed')
    }
    message.error(errorMessage)
  }
  finally {
    formLoading.value = false
  }
}

// 处理删除
function handleDelete(permission: PermissionCO) {
  dialog.warning({
    title: t('confirm.deleteConfirm'),
    content: t('permission.management.confirm.deletePermission', { permissionName: permission.permissionName }),
    positiveText: t('button.confirm'),
    negativeText: t('button.cancel'),
    onPositiveClick: async () => {
      try {
        const response = await deletePermissionApi(permission.id)

        if (response.success) {
          message.success(t('permission.management.messages.deleteSuccess'))
          await fetchPermissions()
        }
        else {
          message.error(response.errMessage || t('permission.management.messages.deleteFailed'))
        }
      }
      catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('permission.management.messages.deleteFailed')
        message.error(errorMessage)
      }
    },
  })
}

// 打开分配API对话框
function handleAssignApis(permission: PermissionCO) {
  assigningPermission.value = permission
  assignApiDialogVisible.value = true
}

// 处理分配API提交
async function handleAssignApisConfirm(selectedIds: string[]) {
  if (!assigningPermission.value) {
    return
  }

  assignApiLoading.value = true

  try {
    const response = await assignPermissionApisApi(assigningPermission.value.id, {
      apiIds: selectedIds,
    })

    if (response.success) {
      message.success(t('permission.management.messages.assignApisSuccess'))
      assignApiDialogVisible.value = false
      await fetchPermissions()
    }
    else {
      message.error(response.errMessage || t('permission.management.messages.assignApisFailed'))
    }
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('permission.management.messages.assignApisFailed')
    message.error(errorMessage)
  }
  finally {
    assignApiLoading.value = false
  }
}

// 获取已绑定的API ID列表
const boundApiIds = computed(() => {
  return assigningPermission.value?.apiIds || []
})

// 初始化
onMounted(() => {
  fetchPermissions()
})
</script>

<template>
  <div class="permission-management-page">
    <div class="page-content">
      <DataTable
        :columns="columns"
        :data="permissions"
        :loading="loading"
        :pagination="pagination"
        :searchable="true"
        :search-value="searchValue"
        :search-placeholder="t('form.placeholder.searchPlaceholder')"
        :filterable="true"
        :filter-options="moduleOptions"
        :filter-value="filterValue"
        :sort-state="sortState"
        :error="error"
        :filter-width="200"
        @search="handleSearch"
        @filter="handleFilter"
        @update:sorter="handleSorterChange"
      >
        <template #toolbar>
          <NButton
            type="primary"
            @click="handleAdd"
          >
            {{ t('permission.management.addPermission') }}
          </NButton>
        </template>
      </DataTable>
    </div>

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

    <!-- 分配API对话框 -->
    <BindingDialog
      v-model:visible="assignApiDialogVisible"
      :title="assigningPermission ? t('permission.management.assignApisHint', { permissionName: assigningPermission.permissionName }) : t('permission.management.assignApis')"
      :bound-ids="boundApiIds"
      :config="apiBindingConfig"
      :loading="assignApiLoading"
      @confirm="handleAssignApisConfirm"
    />
  </div>
</template>

<style scoped lang="scss">
.permission-management-page {
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
