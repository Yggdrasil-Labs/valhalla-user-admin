/**
 * Store 状态相关类型定义
 */

// Store 基础状态类型
export interface StoreState {
  loading: boolean
  error: string | null
}

// 操作结果类型
export interface ActionResult {
  success: boolean
  message?: string
  data?: any
}
