/**
 * 用户相关 API 接口
 * 提供用户认证、信息管理等功能
 */

import type { ApiResponse } from '@/types/api'
import type { LoginInfo, UserInfo } from '@/types/store'

/**
 * 用户登录
 */
export function loginApi(loginInfo: LoginInfo): Promise<ApiResponse<{
  token: string
  user: UserInfo
}>> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      if (loginInfo.username === 'demo' && loginInfo.password === 'password') {
        resolve({
          code: 200,
          message: '登录成功',
          data: {
            token: `mock-jwt-token-${Date.now()}`,
            user: {
              id: '1',
              username: 'demo',
              email: 'demo@example.com',
              avatar: '/default-avatar.png',
              roles: ['user'],
              permissions: ['read', 'write'],
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          },
          timestamp: Date.now(),
        })
      }
      else {
        resolve({
          code: 401,
          message: '用户名或密码错误',
          data: null as any,
          timestamp: Date.now(),
        })
      }
    }, 1000)
  })
}

/**
 * 用户登出
 */
export function logoutApi(): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '登出成功',
        data: null,
        timestamp: Date.now(),
      })
    }, 500)
  })
}

/**
 * 获取用户信息
 */
export function getUserInfoApi(): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取用户信息成功',
        data: {
          id: '1',
          username: 'demo',
          email: 'demo@example.com',
          avatar: '/default-avatar.png',
          roles: ['user'],
          permissions: ['read', 'write'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        timestamp: Date.now(),
      })
    }, 500)
  })
}

/**
 * 更新用户信息
 */
export function updateUserInfoApi(userInfo: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '更新用户信息成功',
        data: {
          id: '1',
          username: 'demo',
          email: 'demo@example.com',
          avatar: '/default-avatar.png',
          roles: ['user'],
          permissions: ['read', 'write'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString(),
          ...userInfo,
        },
        timestamp: Date.now(),
      })
    }, 500)
  })
}

/**
 * 刷新 Token
 */
export function refreshTokenApi(): Promise<ApiResponse<{ token: string }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'Token 刷新成功',
        data: {
          token: `mock-jwt-token-refreshed-${Date.now()}`,
        },
        timestamp: Date.now(),
      })
    }, 500)
  })
}
