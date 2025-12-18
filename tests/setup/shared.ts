/**
 * 共享测试配置
 * 包含所有测试环境通用的配置和 Mock
 */

import { vi } from 'vitest'

// 模拟环境变量
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_APP_TITLE: 'Valhalla User Admin',
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    DEV: true,
    PROD: false,
    SSR: false,
    MODE: 'test',
  },
  writable: true,
})

// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => {
    const mediaQuery = {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
    return mediaQuery
  }),
})

// 模拟 IntersectionObserver
;(globalThis as any).IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 ResizeObserver
;(globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 VueUse 相关的浏览器 API
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 768,
})

Object.defineProperty(window, 'outerWidth', {
  writable: true,
  value: 1024,
})

Object.defineProperty(window, 'outerHeight', {
  writable: true,
  value: 768,
})

// 模拟 localStorage
Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
})

// 模拟 sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
})
