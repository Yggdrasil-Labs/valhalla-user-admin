/**
 * 绑定管理相关类型定义
 */

/**
 * 绑定项通用接口
 * 所有可绑定项（角色、权限、API等）都应包含 id 和至少一个显示字段
 */
export interface BindingItem {
  /** 唯一标识符 */
  id: string
  /** 显示名称（用于列表展示） */
  name?: string
  /** 显示代码（用于列表展示） */
  code?: string
  /** 描述信息 */
  description?: string
  /** 其他扩展字段 */
  [key: string]: any
}

/**
 * 绑定对话框配置
 */
export interface BindingDialogConfig {
  /** 数据获取函数，返回 Promise<ApiResponse<T[]>> */
  fetchData: (params: {
    pageNum?: number
    pageSize?: number
    [key: string]: any
  }) => Promise<any>
  /** 搜索字段配置（用于构建搜索参数） */
  searchField?: string | string[]
  /** 筛选字段配置（用于构建筛选参数） */
  filterField?: string
  /** 筛选选项列表 */
  filterOptions?: Array<{
    label: string
    value: any
  }>
  /** 表格列定义 */
  columns: Array<{
    title: string
    key: string
    width?: number
    align?: 'left' | 'center' | 'right'
    render?: (row: BindingItem) => any
  }>
  /** 显示字段（用于搜索时的提示） */
  displayField?: string
}

/**
 * 绑定对话框 Props
 */
export interface BindingDialogProps {
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

/**
 * 绑定对话框事件
 */
export interface BindingDialogEmits {
  /** 更新显示状态 */
  'update:visible': [visible: boolean]
  /** 确认绑定 */
  'confirm': [selectedIds: string[]]
  /** 取消绑定 */
  'cancel': []
}
