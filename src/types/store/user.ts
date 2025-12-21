/**
 * 用户相关类型定义
 */

import type { ApiResponse } from '@/types/api'

// 用户信息类型（用于当前登录用户）
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// 用户数据对象（与后端 API 一致）
export interface UserCO {
  id: string
  username: string
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  status: number // 0-禁用，1-启用
  metadata?: string // 扩展信息（JSON）
  roleIds?: string[]
  createTime?: string
  updateTime?: string
}

// 创建用户请求
export interface CreateUserRequest {
  username: string // 必填
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  status?: number // 0-禁用，1-启用（默认启用）
  metadata?: string // 扩展信息（JSON）
  roleIds?: string[]
}

// 更新用户请求
export interface UpdateUserRequest {
  id: string // 必填
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  status?: number // 0-禁用，1-启用
  metadata?: string // 扩展信息（JSON）
  version?: number // 乐观锁版本号
}

// 查询用户列表参数
export interface GetUsersParams {
  username?: string // 用户名（模糊匹配）
  status?: number // 状态：0-禁用，1-启用
  pageNum?: number // 页码（从1开始，默认1）
  pageSize?: number // 每页数量（默认10）
}

// 分页用户列表响应（后端实际返回格式）
export interface PaginatedUserResponse extends ApiResponse<UserCO[]> {
  // 注意：根据后端 API 文档，分页信息可能在其他字段中
  // 如果后端返回分页信息，需要根据实际响应调整
}

// 单个用户响应（后端实际返回格式）
export type SingleUserResponse = ApiResponse<UserCO>

// 分配用户角色请求
export interface AssignUserRoleRequest {
  roleIds: string[]
}
