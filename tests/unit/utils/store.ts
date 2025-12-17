/**
 * Store 测试工具函数
 * 专门用于 Pinia Store 测试的辅助函数
 */

import type { UserInfo } from '@/types/store'
import { createPinia, setActivePinia } from 'pinia'
import { expect } from 'vitest'

/**
 * 创建测试用的 Pinia 实例
 * @param _initialState 初始状态
 * @returns Pinia 实例
 */
export function createTestPinia(_initialState: Record<string, any> = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Store 测试辅助函数
 */
export const storeTestUtils = {
  /**
   * 重置所有 Store 状态
   */
  resetAllStores: () => {
    // 清除 localStorage
    localStorage.clear()
    sessionStorage.clear()

    // 重置 Pinia 实例
    const pinia = createPinia()
    setActivePinia(pinia)
  },

  /**
   * 创建用户 Store 测试数据
   */
  createUserStoreData: (overrides: Partial<UserInfo> = {}): UserInfo => ({
    id: '1',
    username: 'testUser',
    email: 'test@example.com',
    avatar: '/default-avatar.png',
    roles: ['user'],
    permissions: ['read'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  /**
   * 创建登录信息
   */
  createLoginData: (overrides: Record<string, any> = {}) => ({
    username: 'testUser',
    password: 'password123',
    ...overrides,
  }),

  /**
   * 验证 Store 状态
   */
  expectStoreState: (store: any, expectedState: Record<string, any>) => {
    Object.keys(expectedState).forEach((key) => {
      expect(store[key]).toEqual(expectedState[key])
    })
  },

  /**
   * 等待 Store 状态更新
   */
  waitForStoreUpdate: async (store: any, condition: (store: any) => boolean, timeout = 1000) => {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      if (condition(store)) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    throw new Error(`Store condition not met within ${timeout}ms`)
  },
}

/**
 * Store 测试数据工厂
 */
export const storeDataFactory = {
  /**
   * 创建用户数据
   */
  createUser: (overrides: Partial<UserInfo> = {}): UserInfo => ({
    id: Math.random().toString(36).substring(2, 8),
    username: `user${Math.random().toString(36).substring(2, 8)}`,
    email: `test${Math.random().toString(36).substring(2, 8)}@example.com`,
    avatar: '/default-avatar.png',
    roles: ['user'],
    permissions: ['read'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  /**
   * 创建多个用户数据
   */
  createUsers: (count: number, overrides: Partial<UserInfo> = {}): UserInfo[] => {
    return Array.from({ length: count }, (_, index) =>
      storeDataFactory.createUser({
        id: (index + 1).toString(),
        username: `user${index + 1}`,
        ...overrides,
      }))
  },

  /**
   * 创建登录信息
   */
  createLoginInfo: (overrides: Record<string, any> = {}) => ({
    username: `user${Math.random().toString(36).substring(2, 8)}`,
    password: 'password123',
    ...overrides,
  }),
}
