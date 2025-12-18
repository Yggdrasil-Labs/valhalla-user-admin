/**
 * 测试工具库
 */

import process from 'node:process'
import { createPinia, setActivePinia } from 'pinia'
import { expect, vi } from 'vitest'
import { i18n } from '../setup/unit'

// ========== 测试环境管理 ==========
export const testCleanup = {
  cleanup: () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
    localStorage.clear()
    sessionStorage.clear()
    vi.useRealTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
  },
}

export const testConfig = {
  getPlugins: () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    return [pinia, i18n]
  },
  getMocks: () => ({
    $t: (_key: string) => _key,
    $tc: (_key: string) => _key,
    $te: (_key: string) => true,
    $d: (value: any) => value,
    $n: (value: any) => value,
  }),
  getGlobalConfig: () => ({
    plugins: testConfig.getPlugins(),
    mocks: testConfig.getMocks(),
    components: {},
    directives: {},
  }),
}

export const envUtils = {
  isTestEnv: () => import.meta.env.MODE === 'test',
  isCI: () => process.env.CI === 'true',
  getTestEnvVar: (key: string, defaultValue?: string) => process.env[key] || defaultValue,
}

// ========== 基础等待工具 ==========
export const testWait = {
  nextTick: () => new Promise(resolve => setTimeout(resolve, 0)),
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  waitFor: async (condition: () => boolean, timeout = 1000, interval = 10) => {
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
      if (condition())
        return
      await testWait.wait(interval)
    }
    throw new Error(`Condition not met within ${timeout}ms`)
  },
}

// ========== 常用数据工厂 ==========
export const testDataFactory = {
  createUser: (overrides: Record<string, any> = {}) => ({
    id: '1',
    username: 'testUser',
    email: 'test@example.com',
    avatar: '/avatar.jpg',
    roles: ['user'],
    permissions: ['read'],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    ...overrides,
  }),
  createApiResponse: (data: any, message = 'success', code = 200) => ({ code, message, data }),
  createErrorResponse: (message = 'error', code = 400) => ({ code, message, data: null }),
}

// ========== 断言工具 ==========
export const testAssertions = {
  assertApiResponse: (response: any) => {
    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('message')
    expect(response).toHaveProperty('data')
  },
  assertUserData: (user: any) => {
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('username')
    expect(user).toHaveProperty('email')
  },
}
