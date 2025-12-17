/**
 * Store Mock 配置
 * 专门用于 Pinia Store 相关的 Mock 数据和方法
 */

import { vi } from 'vitest'

/**
 * 用户 Store Mock
 */
export const userStoreMocks = {
  state: {
    userInfo: null as any,
    token: null,
    isLoggedIn: false,
    loginTime: null,
    lastActivity: null,
    loading: false,
    error: null,
  },

  actions: {
    login: vi.fn(),
    logout: vi.fn(),
    getUserInfo: vi.fn(),
    updateUserInfo: vi.fn(),
    refreshToken: vi.fn(),
    clearUserData: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
    updateActivity: vi.fn(),
  },

  getters: {
    displayName: vi.fn().mockReturnValue('testUser'),
    avatar: vi.fn().mockReturnValue('/avatar.jpg'),
    roles: vi.fn().mockReturnValue(['user']),
    permissions: vi.fn().mockReturnValue(['read']),
    hasRole: vi.fn().mockReturnValue(true),
    hasPermission: vi.fn().mockReturnValue(true),
    sessionDuration: vi.fn().mockReturnValue(0),
    isInactive: vi.fn().mockReturnValue(false),
  },
}

/**
 * 统一的 Store Mock 配置
 */
export const storeMocks = {
  user: userStoreMocks,
}

/**
 * Store Mock 工具函数
 */
export const storeMockUtils = {
  /**
   * 创建用户 Store Mock
   */
  createUserStoreMock: (overrides = {}) => {
    const defaultState = {
      userInfo: {
        id: 1,
        username: 'testUser',
        email: 'test@example.com',
        avatar: '/avatar.jpg',
        roles: ['user'],
        permissions: ['read'],
      },
      token: 'mock-jwt-token',
      isLoggedIn: true,
      loginTime: new Date(),
      lastActivity: new Date(),
      loading: false,
      error: null,
    }

    return {
      state: { ...defaultState, ...overrides },
      actions: userStoreMocks.actions,
      getters: userStoreMocks.getters,
    }
  },

  /**
   * 重置所有 Store Mock
   */
  resetAll: () => {
    Object.values(userStoreMocks.actions).forEach((mock) => {
      if ('mockReset' in mock && typeof mock.mockReset === 'function') {
        mock.mockReset()
      }
    })
    Object.values(userStoreMocks.getters).forEach((mock) => {
      if ('mockReset' in mock && typeof mock.mockReset === 'function') {
        mock.mockReset()
      }
    })
  },
}
