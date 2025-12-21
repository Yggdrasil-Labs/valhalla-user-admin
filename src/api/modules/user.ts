/**
 * 用户相关 API 接口
 * 提供用户信息管理等功能
 */

import type { ApiResponse } from '@/types/api'
import type {
  AssignUserRoleRequest,
  CreateUserRequest,
  GetUsersParams,
  PaginatedUserResponse,
  SingleUserResponse,
  UpdateUserRequest,
  UserInfo,
} from '@/types/store'
import http from '@/api/http'

/**
 * 获取用户信息（当前登录用户）
 */
export function getUserInfoApi(): Promise<ApiResponse<UserInfo>> {
  return http.get('/user/info')
}

/**
 * 更新用户信息（当前登录用户）
 */
export function updateUserInfoApi(userInfo: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
  return http.put('/user/info', userInfo)
}

/**
 * 分页查询用户列表
 * @param params 查询参数
 */
export function getUsersApi(params?: GetUsersParams): Promise<PaginatedUserResponse> {
  return http.get('/api/v1/users', params)
}

/**
 * 获取用户详情
 * @param id 用户ID
 */
export function getUserApi(id: string): Promise<SingleUserResponse> {
  return http.get(`/api/v1/users/${id}`)
}

/**
 * 创建用户
 * @param data 用户数据
 */
export function createUserApi(data: CreateUserRequest): Promise<SingleUserResponse> {
  return http.post('/api/v1/users', data)
}

/**
 * 更新用户
 * @param id 用户ID
 * @param data 用户数据
 */
export function updateUserApi(id: string, data: UpdateUserRequest): Promise<SingleUserResponse> {
  return http.put(`/api/v1/users/${id}`, { ...data, id })
}

/**
 * 删除用户
 * @param id 用户ID
 */
export function deleteUserApi(id: string): Promise<ApiResponse<void>> {
  return http.delete(`/api/v1/users/${id}`)
}

/**
 * 分配用户角色
 * @param id 用户ID
 * @param data 角色数据
 */
export function assignUserRolesApi(id: string, data: AssignUserRoleRequest): Promise<ApiResponse<void>> {
  return http.post(`/api/v1/users/${id}/roles`, data)
}
