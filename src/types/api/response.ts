/**
 * API 响应相关类型定义
 * 符合 cola5.0 标准返回结果格式
 */

// API 响应类型（后端实际返回格式）
// data 字段可能不存在，可能是对象，可能是数组
export interface ApiResponse<T = any> {
  success: boolean
  errCode?: string
  errMessage?: string
  data?: T
}
