/**
 * 权限相关类型定义
 */

import type { ApiResponse } from '@/types/api'

// 权限数据对象（与后端 API 一致）
export interface PermissionCO {
  id: string
  module: string // 模块
  resource: string // 资源
  action: string // 操作
  permissionCode: string // 权限代码（格式：模块:资源:操作）
  permissionName: string // 权限名称
  description?: string
  metadata?: string // 扩展信息（JSON）
  apiIds?: string[] // API ID列表
  createTime?: string
  updateTime?: string
}

// 创建权限请求
export interface CreatePermissionRequest {
  module: string // 必填
  resource: string // 必填
  action: string // 必填
  permissionName: string // 必填
  description?: string
  metadata?: string // 扩展信息（JSON）
  apiIds?: string[] // API ID列表
}

// 更新权限请求
export interface UpdatePermissionRequest {
  id: string // 必填
  permissionName: string // 必填
  description?: string
  metadata?: string // 扩展信息（JSON）
}

// 查询权限列表参数
export interface GetPermissionsParams {
  module?: string // 模块
  permissionName?: string // 权限名称（模糊匹配）
  pageNum?: number // 页码（从1开始，默认1）
  pageSize?: number // 每页数量（默认10）
}

// 分页权限列表响应（后端实际返回格式）
export interface PaginatedPermissionResponse extends ApiResponse<PermissionCO[]> {
  // 注意：根据后端 API 文档，分页信息可能在其他字段中
  // 如果后端返回分页信息，需要根据实际响应调整
}

// 单个权限响应（后端实际返回格式）
export type SinglePermissionResponse = ApiResponse<PermissionCO>

// 分配权限 API 请求
export interface AssignPermissionApiRequest {
  permissionId: string // 权限ID
  apiIds: string[] // API ID列表
}
