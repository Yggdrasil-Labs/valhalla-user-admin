<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import type { CreateRoleRequest, GetRolesParams, RoleCO, UpdateRoleRequest } from '@/types/store'
import type { BindingDialogConfig } from '@/types/store/binding'
import { NButton, NTag, useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import { getPermissionsApi } from '@/api/modules/permission'
import { assignRolePermissionsApi, createRoleApi, deleteRoleApi, getRolesApi, updateRoleApi } from '@/api/modules/role'

import { BindingDialog } from '@/components/BindingDialog'
import { DataTable } from '@/components/DataTable'
import { FormDialog } from '@/components/FormDialog'
import { useI18nHelper } from '@/composables/useI18n'

const { t } = useI18nHelper()
const message = useMessage()
const dialog = useDialog()

// 角色列表数据
const roles = ref<RoleCO[]>([])
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
    fetchRoles()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    fetchRoles()
  },
})

// 搜索和筛选
const searchValue = ref('')
const filterValue = ref<boolean | undefined>(undefined)

// 排序状态
const sortState = ref<DataTableSortState | null>(null)

// 表单对话框
const formDialogVisible = ref(false)
const formDialogTitle = ref('')
const editingRole = ref<RoleCO | null>(null)
const formLoading = ref(false)

// 分配权限对话框
const assignPermissionDialogVisible = ref(false)
const assigningRole = ref<RoleCO | null>(null)
const assignPermissionLoading = ref(false)

// 权限模块选项（用于筛选）
const permissionModuleOptions = ref<Array<{ label: string, value: string }>>([])

// 获取权限模块列表
async function fetchPermissionModules() {
  try {
    // 获取所有权限以提取模块列表
    const response = await getPermissionsApi({ pageSize: 1000 })
    if (response.success && response.data) {
      const modules = new Set<string>()
      response.data.forEach((permission) => {
        if (permission.module) {
          modules.add(permission.module)
        }
      })
      permissionModuleOptions.value = Array.from(modules).map(module => ({ label: module, value: module }))
    }
  }
  catch {
    // 忽略错误，使用空列表
    permissionModuleOptions.value = []
  }
}

// 绑定对话框配置
const permissionBindingConfig = computed<BindingDialogConfig>(() => ({
  fetchData: getPermissionsApi,
  searchField: 'permissionName',
  filterField: 'module',
  filterOptions: permissionModuleOptions.value,
  displayField: t('permission.management.columns.permissionName'),
  columns: [
    { title: t('permission.management.columns.module'), key: 'module', width: 120 },
    { title: t('permission.management.columns.permissionCode'), key: 'permissionCode', width: 200 },
    { title: t('permission.management.columns.permissionName'), key: 'permissionName', width: 150 },
    { title: t('permission.management.columns.description'), key: 'description', width: 200 },
  ],
}))

// 表格列定义
const columns = computed<DataTableColumns<RoleCO>>(() => [
  {
    title: t('role.management.columns.roleCode'),
    key: 'roleCode',
    sorter: 'default',
    width: 150,
    align: 'left',
  },
  {
    title: t('role.management.columns.roleName'),
    key: 'roleName',
    sorter: 'default',
    width: 150,
    align: 'left',
  },
  {
    title: t('role.management.columns.description'),
    key: 'description',
    width: 200,
    align: 'left',
  },
  {
    title: t('role.management.columns.isSystem'),
    key: 'isSystem',
    width: 100,
    align: 'center',
    render: (row: RoleCO) => {
      return h(NTag, {
        type: row.isSystem ? 'warning' : 'default',
      }, { default: () => row.isSystem ? t('role.management.status.system') : t('role.management.status.custom') })
    },
  },
  {
    title: t('role.management.columns.permissionIds'),
    key: 'permissionIds',
    width: 150,
    align: 'right',
    render: (row: RoleCO) => {
      const count = row.permissionIds?.length || 0
      return count > 0 ? `${count} ${t('label.count')}` : '-'
    },
  },
  {
    title: t('role.management.columns.createTime'),
    key: 'createTime',
    sorter: 'default',
    width: 180,
    align: 'left',
  },
  {
    title: t('role.management.columns.actions'),
    key: 'actions',
    width: 250,
    fixed: 'right',
    align: 'center',
    render: (row: RoleCO) => {
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
          onClick: () => handleAssignPermissions(row),
        }, { default: () => t('role.management.assignPermissions') }),
        h(NButton, {
          size: 'small',
          type: 'error',
          disabled: row.isSystem,
          onClick: () => handleDelete(row),
        }, { default: () => t('button.delete') }),
      ])
    },
  },
])

// 筛选选项
const filterOptions = [
  { label: t('role.management.status.system'), value: true },
  { label: t('role.management.status.custom'), value: false },
]

// 表单字段配置
const formFields = computed(() => [
  {
    key: 'roleCode',
    label: t('role.management.form.roleCode'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
    disabled: !!editingRole.value, // 编辑时禁用角色代码
  },
  {
    key: 'roleName',
    label: t('role.management.form.roleName'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
  {
    key: 'description',
    label: t('role.management.form.description'),
    type: 'textarea' as const,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
  {
    key: 'isSystem',
    label: t('role.management.form.isSystem'),
    type: 'switch' as const,
    disabled: !!editingRole.value, // 编辑时禁用系统角色设置
  },
])

// 表单初始值
const formInitialValues = computed(() => {
  if (editingRole.value) {
    return {
      roleCode: editingRole.value.roleCode,
      roleName: editingRole.value.roleName,
      description: editingRole.value.description || '',
      isSystem: editingRole.value.isSystem,
    }
  }
  return {
    roleCode: '',
    roleName: '',
    description: '',
    isSystem: false,
  }
})

// 获取角色列表
async function fetchRoles() {
  loading.value = true
  error.value = null

  try {
    const params: GetRolesParams = {
      pageNum: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    if (searchValue.value) {
      // 支持按角色名称搜索（后端支持模糊匹配）
      params.roleName = searchValue.value
    }

    const response = await getRolesApi(params)

    if (response.success && response.data) {
      let filteredRoles = response.data

      // 前端筛选系统角色
      if (filterValue.value !== undefined) {
        filteredRoles = filteredRoles.filter(role => role.isSystem === filterValue.value)
      }

      roles.value = filteredRoles
      pagination.value.itemCount = filteredRoles.length
    }
    else {
      error.value = response.errMessage || t('role.management.messages.loadFailed')
      message.error(error.value)
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('role.management.messages.loadFailed')
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
  fetchRoles()
}

// 处理筛选
function handleFilter(value: boolean | undefined) {
  filterValue.value = value
  pagination.value.page = 1
  fetchRoles()
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

  const sortedRoles = [...roles.value].sort((a, b) => {
    for (const sortRule of sorters) {
      const { columnKey, order } = sortRule

      if (order === false) {
        continue
      }

      const aVal = a[columnKey as keyof RoleCO]
      const bVal = b[columnKey as keyof RoleCO]

      const result = compareValues(aVal, bVal, order as 'ascend' | 'descend')
      if (result !== 0) {
        return result
      }
    }

    return 0
  })

  roles.value = sortedRoles
}

// 打开新增对话框
function handleAdd() {
  editingRole.value = null
  formDialogTitle.value = t('role.management.addRole')
  formDialogVisible.value = true
}

// 打开编辑对话框
function handleEdit(role: RoleCO) {
  editingRole.value = role
  formDialogTitle.value = t('role.management.editRole')
  formDialogVisible.value = true
}

// 处理表单提交
async function handleFormSubmit(values: Record<string, any>) {
  formLoading.value = true

  try {
    if (editingRole.value) {
      // 更新角色
      const updateData: UpdateRoleRequest = {
        id: editingRole.value.id,
        roleName: values.roleName,
        description: values.description,
      }

      const response = await updateRoleApi(editingRole.value.id, updateData)

      if (response.success) {
        message.success(t('role.management.messages.updateSuccess'))
        formDialogVisible.value = false
        await fetchRoles()
      }
      else {
        message.error(response.errMessage || t('role.management.messages.updateFailed'))
      }
    }
    else {
      // 创建角色
      const createData: CreateRoleRequest = {
        roleCode: values.roleCode,
        roleName: values.roleName,
        description: values.description,
        isSystem: values.isSystem || false,
      }

      const response = await createRoleApi(createData)

      if (response.success) {
        message.success(t('role.management.messages.createSuccess'))
        formDialogVisible.value = false
        await fetchRoles()
      }
      else {
        message.error(response.errMessage || t('role.management.messages.createFailed'))
      }
    }
  }
  catch (err) {
    let errorMessage: string
    if (err instanceof Error) {
      errorMessage = err.message
    }
    else if (editingRole.value) {
      errorMessage = t('role.management.messages.updateFailed')
    }
    else {
      errorMessage = t('role.management.messages.createFailed')
    }
    message.error(errorMessage)
  }
  finally {
    formLoading.value = false
  }
}

// 处理删除
function handleDelete(role: RoleCO) {
  if (role.isSystem) {
    message.warning(t('role.management.messages.cannotDeleteSystemRole'))
    return
  }

  dialog.warning({
    title: t('confirm.deleteConfirm'),
    content: t('role.management.confirm.deleteRole', { roleName: role.roleName }),
    positiveText: t('button.confirm'),
    negativeText: t('button.cancel'),
    onPositiveClick: async () => {
      try {
        const response = await deleteRoleApi(role.id)

        if (response.success) {
          message.success(t('role.management.messages.deleteSuccess'))
          await fetchRoles()
        }
        else {
          message.error(response.errMessage || t('role.management.messages.deleteFailed'))
        }
      }
      catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('role.management.messages.deleteFailed')
        message.error(errorMessage)
      }
    },
  })
}

// 打开分配权限对话框
async function handleAssignPermissions(role: RoleCO) {
  assigningRole.value = role
  assignPermissionDialogVisible.value = true
  // 如果模块选项为空，则加载模块列表
  if (permissionModuleOptions.value.length === 0) {
    await fetchPermissionModules()
  }
}

// 处理分配权限提交
async function handleAssignPermissionsConfirm(selectedIds: string[]) {
  if (!assigningRole.value) {
    return
  }

  assignPermissionLoading.value = true

  try {
    const response = await assignRolePermissionsApi(assigningRole.value.id, {
      permissionIds: selectedIds,
    })

    if (response.success) {
      message.success(t('role.management.messages.assignPermissionsSuccess'))
      assignPermissionDialogVisible.value = false
      await fetchRoles()
    }
    else {
      message.error(response.errMessage || t('role.management.messages.assignPermissionsFailed'))
    }
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('role.management.messages.assignPermissionsFailed')
    message.error(errorMessage)
  }
  finally {
    assignPermissionLoading.value = false
  }
}

// 获取已绑定的权限ID列表
const boundPermissionIds = computed(() => {
  return assigningRole.value?.permissionIds || []
})

// 初始化
onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <div class="role-management-page">
    <div class="page-content">
      <DataTable
        :columns="columns"
        :data="roles"
        :loading="loading"
        :pagination="pagination"
        :searchable="true"
        :search-value="searchValue"
        :search-placeholder="t('form.placeholder.searchPlaceholder')"
        :filterable="true"
        :filter-options="filterOptions"
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
            {{ t('role.management.addRole') }}
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

    <!-- 分配权限对话框 -->
    <BindingDialog
      v-model:visible="assignPermissionDialogVisible"
      :title="assigningRole ? t('role.management.assignPermissionsHint', { roleName: assigningRole.roleName }) : t('role.management.assignPermissions')"
      :bound-ids="boundPermissionIds"
      :config="permissionBindingConfig"
      :loading="assignPermissionLoading"
      @confirm="handleAssignPermissionsConfirm"
    />
  </div>
</template>

<style scoped lang="scss">
.role-management-page {
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
