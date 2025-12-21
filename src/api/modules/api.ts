/**
 * API 相关 API 接口
 * 提供 API 信息管理等功能
 */

import type { ApiResponse } from '@/types/api'
import type {
  CreateApiRequest,
  GetApisParams,
  PaginatedApiResponse,
  SingleApiResponse,
  UpdateApiRequest,
} from '@/types/store'
import http from '@/api/http'

/**
 * 分页查询 API 列表
 * @param params 查询参数
 */
export function getApisApi(params?: GetApisParams): Promise<PaginatedApiResponse> {
  return http.get('/api/v1/apis', params)
}

/**
 * 获取 API 详情
 * @param id API ID
 */
export function getApiApi(id: string): Promise<SingleApiResponse> {
  return http.get(`/api/v1/apis/${id}`)
}

/**
 * 创建 API
 * @param data API 数据
 */
export function createApiApi(data: CreateApiRequest): Promise<SingleApiResponse> {
  return http.post('/api/v1/apis', data)
}

/**
 * 更新 API
 * @param id API ID
 * @param data API 数据
 */
export function updateApiApi(id: string, data: UpdateApiRequest): Promise<SingleApiResponse> {
  return http.put(`/api/v1/apis/${id}`, { ...data, id })
}

/**
 * 删除 API
 * @param id API ID
 */
export function deleteApiApi(id: string): Promise<ApiResponse<void>> {
  return http.delete(`/api/v1/apis/${id}`)
}
