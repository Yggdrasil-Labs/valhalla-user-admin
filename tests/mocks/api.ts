/**
 * API Mock 配置
 * 专门用于 API 相关的 Mock 数据和方法
 */

import { vi } from 'vitest'

/**
 * 用户 API Mock
 */
export const userApiMocks = {
  login: vi.fn().mockResolvedValue({
    code: 200,
    message: '登录成功',
    data: {
      user: {
        id: 1,
        username: 'testUser',
        email: 'test@example.com',
        avatar: '/avatar.jpg',
        roles: ['user'],
        permissions: ['read'],
      },
      token: 'mock-jwt-token',
    },
  }),

  logout: vi.fn().mockResolvedValue({
    code: 200,
    message: '登出成功',
    data: null,
  }),

  getUserInfo: vi.fn().mockResolvedValue({
    code: 200,
    message: '获取用户信息成功',
    data: {
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      avatar: '/avatar.jpg',
      roles: ['user'],
      permissions: ['read'],
    },
  }),

  updateUserInfo: vi.fn().mockResolvedValue({
    code: 200,
    message: '更新用户信息成功',
    data: {
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      avatar: '/avatar.jpg',
      roles: ['user'],
      permissions: ['read'],
    },
  }),

  refreshToken: vi.fn().mockResolvedValue({
    code: 200,
    message: '刷新令牌成功',
    data: {
      token: 'new-mock-jwt-token',
    },
  }),
}

/**
 * 通用 API Mock
 */
export const commonApiMocks = {
  success: vi.fn().mockResolvedValue({
    code: 200,
    message: 'success',
    data: {},
  }),

  error: vi.fn().mockRejectedValue({
    code: 400,
    message: '请求失败',
    data: null,
  }),

  networkError: vi.fn().mockRejectedValue(new Error('Network Error')),

  timeout: vi.fn().mockRejectedValue(new Error('Request Timeout')),
}

/**
 * 统一的 API Mock 配置
 */
export const apiMocks = {
  user: userApiMocks,
  common: commonApiMocks,
}

/**
 * API Mock 工具函数
 */
export const apiMockUtils = {
  /**
   * 创建 API 成功响应 Mock
   */
  createSuccessResponse: (data: any, message = 'success') => {
    return vi.fn().mockResolvedValue({
      code: 200,
      message,
      data,
    })
  },

  /**
   * 创建 API 错误响应 Mock
   */
  createErrorResponse: (code: number, message: string) => {
    return vi.fn().mockRejectedValue({
      code,
      message,
      data: null,
    })
  },

  /**
   * 重置所有 API Mock
   */
  resetAll: () => {
    Object.values(userApiMocks).forEach((mock) => {
      if ('mockReset' in mock && typeof mock.mockReset === 'function') {
        mock.mockReset()
      }
    })
    Object.values(commonApiMocks).forEach((mock) => {
      if ('mockReset' in mock && typeof mock.mockReset === 'function') {
        mock.mockReset()
      }
    })
  },
}
