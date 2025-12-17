/**
 * 组件 Mock 配置
 * 专门用于 Vue 组件相关的 Mock 数据和方法
 */

import { vi } from 'vitest'

/**
 * Vue Router Mock
 */
export const routerMocks = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      name: 'home',
      params: {},
      query: {},
      hash: '',
    },
  },
}

/**
 * Vue I18n Mock
 */
export const i18nMocks = {
  t: vi.fn((key: string) => key),
  tc: vi.fn((key: string) => key),
  te: vi.fn(() => true),
  d: vi.fn((value: any) => value),
  n: vi.fn((value: any) => value),
  locale: {
    value: 'zh-CN',
  },
}

/**
 * Pinia Mock
 */
export const piniaMocks = {
  state: {
    value: {},
  },
  $patch: vi.fn(),
  $reset: vi.fn(),
  $subscribe: vi.fn(),
}

/**
 * 统一的组件 Mock 配置
 */
export const componentMocks = {
  router: routerMocks,
  i18n: i18nMocks,
  pinia: piniaMocks,
}

/**
 * 组件 Mock 工具函数
 */
export const componentMockUtils = {
  /**
   * 创建路由 Mock
   */
  createRouterMock: (route = {}) => {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      currentRoute: {
        value: {
          path: '/',
          name: 'home',
          params: {},
          query: {},
          hash: '',
          ...route,
        },
      },
    }
  },

  /**
   * 创建 I18n Mock
   */
  createI18nMock: (locale = 'zh-CN') => {
    return {
      t: vi.fn((key: string) => key),
      tc: vi.fn((key: string) => key),
      te: vi.fn(() => true),
      d: vi.fn((value: any) => value),
      n: vi.fn((value: any) => value),
      locale: {
        value: locale,
      },
    }
  },

  /**
   * 重置所有组件 Mock
   */
  resetAll: () => {
    Object.values(routerMocks).forEach((mock) => {
      if ('mockReset' in mock && typeof mock.mockReset === 'function') {
        mock.mockReset()
      }
    })
    Object.values(i18nMocks).forEach((mock) => {
      if ('mockReset' in mock && typeof mock.mockReset === 'function') {
        mock.mockReset()
      }
    })
    Object.values(piniaMocks).forEach((mock) => {
      if ('mockReset' in mock && typeof mock.mockReset === 'function') {
        mock.mockReset()
      }
    })
  },
}
