/**
 * 角色相关 API 接口
 * 提供角色信息管理等功能
 */

import type { ApiResponse } from '@/types/api'
import type {
  AssignRolePermissionRequest,
  CreateRoleRequest,
  GetRolesParams,
  PaginatedRoleResponse,
  SingleRoleResponse,
  UpdateRoleRequest,
} from '@/types/store'
import http from '@/api/http'

/**
 * 分页查询角色列表
 * @param params 查询参数
 */
export function getRolesApi(params?: GetRolesParams): Promise<PaginatedRoleResponse> {
  return http.get('/api/v1/roles', params)
}

/**
 * 获取角色详情
 * @param id 角色ID
 */
export function getRoleApi(id: string): Promise<SingleRoleResponse> {
  return http.get(`/api/v1/roles/${id}`)
}

/**
 * 创建角色
 * @param data 角色数据
 */
export function createRoleApi(data: CreateRoleRequest): Promise<SingleRoleResponse> {
  return http.post('/api/v1/roles', data)
}

/**
 * 更新角色
 * @param id 角色ID
 * @param data 角色数据
 */
export function updateRoleApi(id: string, data: UpdateRoleRequest): Promise<SingleRoleResponse> {
  return http.put(`/api/v1/roles/${id}`, { ...data, id })
}

/**
 * 删除角色
 * @param id 角色ID
 */
export function deleteRoleApi(id: string): Promise<ApiResponse<void>> {
  return http.delete(`/api/v1/roles/${id}`)
}

/**
 * 分配角色权限
 * @param id 角色ID
 * @param data 权限数据（只需要 permissionIds，roleId 会自动填充）
 */
export function assignRolePermissionsApi(id: string, data: Omit<AssignRolePermissionRequest, 'roleId'>): Promise<ApiResponse<void>> {
  return http.post(`/api/v1/roles/${id}/permissions`, { ...data, roleId: id })
}
