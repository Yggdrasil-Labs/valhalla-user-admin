/**
 * 用户相关 API 接口
 * 提供用户信息管理等功能
 */

import type { ApiResponse } from '@/types/api'
import type { UserInfo } from '@/types/store'
import http from '@/api/http'

/**
 * 获取用户信息
 */
export function getUserInfoApi(): Promise<ApiResponse<UserInfo>> {
  return http.get('/user/info')
}

/**
 * 更新用户信息
 */
export function updateUserInfoApi(userInfo: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
  return http.put('/user/info', userInfo)
}
