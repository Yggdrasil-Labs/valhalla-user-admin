<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import type { CreateUserRequest, GetUsersParams, UpdateUserRequest, UserCO } from '@/types/store'
import { useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
  updateUserApi,
} from '@/api/modules/user'
import { DataTable } from '@/components/DataTable'
import { FormDialog } from '@/components/FormDialog'
import { StatusSwitch } from '@/components/StatusSwitch'
import { useI18nHelper } from '@/composables/useI18n'

const { t } = useI18nHelper()
const message = useMessage()
const dialog = useDialog()

// 用户列表数据
const users = ref<UserCO[]>([])
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
    fetchUsers()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    fetchUsers()
  },
})

// 搜索和筛选
const searchValue = ref('')
const filterValue = ref<number | undefined>(undefined)

// 排序状态
const sortState = ref<DataTableSortState | null>(null)

// 表单对话框
const formDialogVisible = ref(false)
const formDialogTitle = ref('')
const editingUser = ref<UserCO | null>(null)
const formLoading = ref(false)

// 表格列定义
const columns = computed<DataTableColumns<UserCO>>(() => [
  {
    title: t('user.management.columns.id'),
    key: 'id',
    sortable: true,
    width: 80,
  },
  {
    title: t('user.management.columns.username'),
    key: 'username',
    sortable: true,
    width: 150,
  },
  {
    title: t('user.management.columns.email'),
    key: 'email',
    sortable: true,
    width: 200,
  },
  {
    title: t('user.management.columns.phone'),
    key: 'phone',
    width: 150,
  },
  {
    title: t('user.management.columns.nickname'),
    key: 'nickname',
    width: 150,
  },
  {
    title: t('user.management.columns.status'),
    key: 'status',
    width: 100,
    render: (row: UserCO) => {
      return h(StatusSwitch, {
        value: row.status,
        activeValue: 1,
        inactiveValue: 0,
        loading: false,
        confirmBeforeToggle: true,
        confirmTitle: t('confirm.resetConfirm'),
        confirmContent: row.status === 1
          ? t('user.management.confirm.disableUser', { username: row.username })
          : t('user.management.confirm.enableUser', { username: row.username }),
        onToggle: (value: number | boolean) => handleStatusToggle(row, Number(value)),
      })
    },
  },
  {
    title: t('user.management.columns.createTime'),
    key: 'createTime',
    sortable: true,
    width: 180,
  },
  {
    title: t('user.management.columns.actions'),
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: (row: UserCO) => {
      return h('div', { class: 'action-buttons' }, [
        h('n-button', {
          size: 'small',
          type: 'primary',
          style: { marginRight: '8px' },
          onClick: () => handleEdit(row),
        }, { default: () => t('button.edit') }),
        h('n-button', {
          size: 'small',
          type: 'error',
          onClick: () => handleDelete(row),
        }, { default: () => t('button.delete') }),
      ])
    },
  },
])

// 筛选选项
const filterOptions = [
  { label: t('user.management.status.enabled'), value: 1 },
  { label: t('user.management.status.disabled'), value: 0 },
]

// 表单字段配置
const formFields = computed(() => [
  {
    key: 'username',
    label: t('user.management.form.username'),
    type: 'input' as const,
    required: true,
    placeholder: t('form.placeholder.pleaseEnter'),
    disabled: !!editingUser.value, // 编辑时禁用用户名
  },
  {
    key: 'email',
    label: t('user.management.form.email'),
    type: 'input' as const,
    placeholder: t('form.placeholder.emailPlaceholder'),
    rule: (value: string) => {
      if (value && !value.includes('@')) {
        return t('form.validation.invalidEmail')
      }
      return true
    },
  },
  {
    key: 'phone',
    label: t('user.management.form.phone'),
    type: 'input' as const,
    placeholder: t('form.placeholder.phonePlaceholder'),
  },
  {
    key: 'nickname',
    label: t('user.management.form.nickname'),
    type: 'input' as const,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
  {
    key: 'avatar',
    label: t('user.management.form.avatar'),
    type: 'input' as const,
    placeholder: t('form.placeholder.pleaseEnter'),
  },
  {
    key: 'status',
    label: t('user.management.form.status'),
    type: 'select' as const,
    options: [
      { label: t('user.management.status.enabled'), value: 1 },
      { label: t('user.management.status.disabled'), value: 0 },
    ],
  },
])

// 表单初始值
const formInitialValues = computed(() => {
  if (editingUser.value) {
    return {
      username: editingUser.value.username,
      email: editingUser.value.email || '',
      phone: editingUser.value.phone || '',
      nickname: editingUser.value.nickname || '',
      avatar: editingUser.value.avatar || '',
      status: editingUser.value.status,
    }
  }
  return {
    username: '',
    email: '',
    phone: '',
    nickname: '',
    avatar: '',
    status: 1,
  }
})

// 获取用户列表
async function fetchUsers() {
  loading.value = true
  error.value = null

  try {
    const params: GetUsersParams = {
      pageNum: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }

    if (searchValue.value) {
      params.username = searchValue.value
    }

    if (filterValue.value !== undefined) {
      params.status = filterValue.value
    }

    const response = await getUsersApi(params)

    if (response.success && response.data) {
      users.value = response.data
      // 注意：如果后端返回分页信息，需要根据实际响应调整
      // 这里假设 itemCount 在 response 的其他字段中，暂时使用数据长度
      pagination.value.itemCount = response.data.length
    }
    else {
      error.value = response.errMessage || t('user.management.messages.loadFailed')
      message.error(error.value)
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('user.management.messages.loadFailed')
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
  fetchUsers()
}

// 处理筛选
function handleFilter(value: number | undefined) {
  filterValue.value = value
  pagination.value.page = 1
  fetchUsers()
}

// 处理排序
function handleSorterChange(sorter: DataTableSortState | null) {
  sortState.value = sorter
  // 前端排序，直接对当前数据进行排序
  if (sorter) {
    const { columnKey, order } = sorter
    users.value.sort((a, b) => {
      const aVal = a[columnKey as keyof UserCO]
      const bVal = b[columnKey as keyof UserCO]

      if (aVal === undefined || aVal === null) {
        return 1
      }
      if (bVal === undefined || bVal === null) {
        return -1
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'ascend'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'ascend' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }
}

// 打开新增对话框
function handleAdd() {
  editingUser.value = null
  formDialogTitle.value = t('user.management.addUser')
  formDialogVisible.value = true
}

// 打开编辑对话框
function handleEdit(user: UserCO) {
  editingUser.value = user
  formDialogTitle.value = t('user.management.editUser')
  formDialogVisible.value = true
}

// 处理表单提交
async function handleFormSubmit(values: Record<string, any>) {
  formLoading.value = true

  try {
    if (editingUser.value) {
      // 更新用户
      const updateData: UpdateUserRequest = {
        id: editingUser.value.id,
        email: values.email,
        phone: values.phone,
        nickname: values.nickname,
        avatar: values.avatar,
        status: values.status,
      }

      const response = await updateUserApi(editingUser.value.id, updateData)

      if (response.success) {
        message.success(t('user.management.messages.updateSuccess'))
        formDialogVisible.value = false
        await fetchUsers()
      }
      else {
        message.error(response.errMessage || t('user.management.messages.updateFailed'))
      }
    }
    else {
      // 创建用户
      const createData: CreateUserRequest = {
        username: values.username,
        email: values.email,
        phone: values.phone,
        nickname: values.nickname,
        avatar: values.avatar,
        status: values.status || 1,
      }

      const response = await createUserApi(createData)

      if (response.success) {
        message.success(t('user.management.messages.createSuccess'))
        formDialogVisible.value = false
        await fetchUsers()
      }
      else {
        message.error(response.errMessage || t('user.management.messages.createFailed'))
      }
    }
  }
  catch (err) {
    let errorMessage: string
    if (err instanceof Error) {
      errorMessage = err.message
    }
    else if (editingUser.value) {
      errorMessage = t('user.management.messages.updateFailed')
    }
    else {
      errorMessage = t('user.management.messages.createFailed')
    }
    message.error(errorMessage)
  }
  finally {
    formLoading.value = false
  }
}

// 处理删除
function handleDelete(user: UserCO) {
  dialog.warning({
    title: t('confirm.deleteConfirm'),
    content: t('user.management.confirm.deleteUser', { username: user.username }),
    positiveText: t('button.confirm'),
    negativeText: t('button.cancel'),
    onPositiveClick: async () => {
      try {
        const response = await deleteUserApi(user.id)

        if (response.success) {
          message.success(t('user.management.messages.deleteSuccess'))
          await fetchUsers()
        }
        else {
          message.error(response.errMessage || t('user.management.messages.deleteFailed'))
        }
      }
      catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('user.management.messages.deleteFailed')
        message.error(errorMessage)
      }
    },
  })
}

// 处理状态切换
async function handleStatusToggle(user: UserCO, newStatus: number) {
  try {
    const updateData: UpdateUserRequest = {
      id: user.id,
      status: newStatus,
    }

    const response = await updateUserApi(user.id, updateData)

    if (response.success) {
      message.success(t('user.management.messages.statusChangeSuccess'))
      await fetchUsers()
    }
    else {
      message.error(response.errMessage || t('user.management.messages.statusChangeFailed'))
      // 恢复原状态
      await fetchUsers()
    }
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : t('user.management.messages.statusChangeFailed')
    message.error(errorMessage)
    // 恢复原状态
    await fetchUsers()
  }
}

// 初始化
onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="user-management-page">
    <div class="page-header">
      <h1 class="page-title">
        {{ t('user.management.title') }}
      </h1>
      <p class="page-description">
        {{ t('user.management.description') }}
      </p>
    </div>

    <div class="page-content">
      <div class="toolbar">
        <n-button
          type="primary"
          @click="handleAdd"
        >
          {{ t('user.management.addUser') }}
        </n-button>
      </div>

      <DataTable
        :columns="columns"
        :data="users"
        :loading="loading"
        :pagination="pagination"
        :searchable="true"
        :search-value="searchValue"
        :search-placeholder="t('form.placeholder.searchPlaceholder')"
        :filterable="true"
        :filter-options="filterOptions"
        :filter-value="filterValue"
        :default-sort-state="sortState"
        :error="error"
        @search="handleSearch"
        @filter="handleFilter"
        @update:sorter="handleSorterChange"
      />
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
  </div>
</template>

<style scoped lang="scss">
.user-management-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #1f2937;
  }

  .page-description {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

.page-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
