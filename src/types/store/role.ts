/**
 * 角色相关类型定义
 */

import type { ApiResponse } from '@/types/api'

// 角色数据对象（与后端 API 一致）
export interface RoleCO {
  id: string
  roleCode: string
  roleName: string
  description?: string
  isSystem: boolean // 是否系统角色（不可删除）
  metadata?: string // 扩展信息（JSON）
  permissionIds?: string[] // 权限ID列表
  createTime?: string
  updateTime?: string
}

// 创建角色请求
export interface CreateRoleRequest {
  roleCode: string // 必填
  roleName: string // 必填
  description?: string
  isSystem?: boolean // 是否系统角色（默认 false）
  metadata?: string // 扩展信息（JSON）
  permissionIds?: string[] // 权限ID列表
}

// 更新角色请求
export interface UpdateRoleRequest {
  id: string // 必填
  roleName: string // 必填
  description?: string
  metadata?: string // 扩展信息（JSON）
}

// 查询角色列表参数
export interface GetRolesParams {
  roleName?: string // 角色名称（模糊匹配）
  roleCode?: string // 角色代码（模糊匹配）
  pageNum?: number // 页码（从1开始，默认1）
  pageSize?: number // 每页数量（默认10）
}

// 分页角色列表响应（后端实际返回格式）
export interface PaginatedRoleResponse extends ApiResponse<RoleCO[]> {
  // 注意：根据后端 API 文档，分页信息可能在其他字段中
  // 如果后端返回分页信息，需要根据实际响应调整
}

// 单个角色响应（后端实际返回格式）
export type SingleRoleResponse = ApiResponse<RoleCO>

// 分配角色权限请求
export interface AssignRolePermissionRequest {
  roleId: string // 角色ID
  permissionIds: string[] // 权限ID列表
}
