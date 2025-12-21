/**
 * 权限相关 API 接口
 * 提供权限信息管理等功能
 */

import type { ApiResponse } from '@/types/api'
import type {
  AssignPermissionApiRequest,
  CreatePermissionRequest,
  GetPermissionsParams,
  PaginatedPermissionResponse,
  SinglePermissionResponse,
  UpdatePermissionRequest,
} from '@/types/store'
import http from '@/api/http'

/**
 * 分页查询权限列表
 * @param params 查询参数
 */
export function getPermissionsApi(params?: GetPermissionsParams): Promise<PaginatedPermissionResponse> {
  return http.get('/api/v1/permissions', params)
}

/**
 * 获取权限详情
 * @param id 权限ID
 */
export function getPermissionApi(id: string): Promise<SinglePermissionResponse> {
  return http.get(`/api/v1/permissions/${id}`)
}

/**
 * 创建权限
 * @param data 权限数据
 */
export function createPermissionApi(data: CreatePermissionRequest): Promise<SinglePermissionResponse> {
  return http.post('/api/v1/permissions', data)
}

/**
 * 更新权限
 * @param id 权限ID
 * @param data 权限数据
 */
export function updatePermissionApi(id: string, data: UpdatePermissionRequest): Promise<SinglePermissionResponse> {
  return http.put(`/api/v1/permissions/${id}`, { ...data, id })
}

/**
 * 删除权限
 * @param id 权限ID
 */
export function deletePermissionApi(id: string): Promise<ApiResponse<void>> {
  return http.delete(`/api/v1/permissions/${id}`)
}

/**
 * 分配权限 API
 * @param id 权限ID
 * @param data API 数据（只需要 apiIds，permissionId 会自动填充）
 */
export function assignPermissionApisApi(id: string, data: Omit<AssignPermissionApiRequest, 'permissionId'>): Promise<ApiResponse<void>> {
  return http.post(`/api/v1/permissions/${id}/apis`, { ...data, permissionId: id })
}
