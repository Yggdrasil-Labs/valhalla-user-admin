/**
 * API 响应相关类型定义
 */

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success?: boolean
  timestamp?: number
}
