/**
 * API 相关类型定义
 */

import type { ApiResponse } from '@/types/api'

// API 数据对象（与后端 API 一致）
export interface ApiCO {
  id: string
  apiCode: string
  version?: string // 接口版本
  apiName: string
  resourcePath: string
  resourceMethod: string // HTTP方法（GET、POST、PUT、DELETE等）
  status?: string // 接口状态
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
  version?: string // 接口版本（可选，如未指定则默认为 "v1"）
  status?: string // 接口状态（可选，如未指定则默认为 "ENABLED"）
  description?: string
  metadata?: string // 扩展信息（JSON）
}

// 更新 API 请求
export interface UpdateApiRequest {
  id: string // 必填
  apiName: string // 必填
  status?: string // 接口状态（可选，支持状态变更）
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
  totalCount?: number // 总记录数
  pageSize?: number // 每页数量
  pageIndex?: number // 当前页码
  totalPages?: number // 总页数
  notEmpty?: boolean // 是否非空
  empty?: boolean // 是否为空
}

// 单个 API 响应（后端实际返回格式）
export type SingleApiResponse = ApiResponse<ApiCO>
