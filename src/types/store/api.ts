/**
 * API 相关类型定义
 */

import type { ApiResponse } from '@/types/api'

// API 数据对象（与后端 API 一致）
export interface ApiCO {
  id: string
  apiCode: string
  apiName: string
  resourcePath: string
  resourceMethod: string // HTTP方法（GET、POST、PUT、DELETE等）
  description?: string
  metadata?: string // 扩展信息（JSON）
  createTime?: string
  updateTime?: string
}

// 创建 API 请求
export interface CreateApiRequest {
  apiCode: string // 必填
  apiName: string // 必填
  resourcePath: string // 必填
  resourceMethod: string // 必填，HTTP方法（GET、POST、PUT、DELETE等）
  description?: string
  metadata?: string // 扩展信息（JSON）
}

// 更新 API 请求
export interface UpdateApiRequest {
  id: string // 必填
  apiName: string // 必填
  description?: string
  metadata?: string // 扩展信息（JSON）
}

// 查询 API 列表参数
export interface GetApisParams {
  apiCode?: string // 接口代码（模糊匹配）
  resourcePath?: string // 资源路径（模糊匹配）
  resourceMethod?: string // HTTP方法
  pageNum?: number // 页码（从1开始，默认1）
  pageSize?: number // 每页数量（默认10）
}

// 分页 API 列表响应（后端实际返回格式）
export interface PaginatedApiResponse extends ApiResponse<ApiCO[]> {
  // 注意：根据后端 API 文档，分页信息可能在其他字段中
  // 如果后端返回分页信息，需要根据实际响应调整
}

// 单个 API 响应（后端实际返回格式）
export type SingleApiResponse = ApiResponse<ApiCO>
