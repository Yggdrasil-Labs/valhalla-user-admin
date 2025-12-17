/**
 * 测试相关的核心类型定义
 */

import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'

/**
 * 测试包装器类型
 */
export type TestWrapper<T = any> = VueWrapper<T>

/**
 * 测试组件类型
 */
export type TestComponent = Component

/**
 * 测试挂载选项
 */
export interface TestMountOptions {
  props?: Record<string, any>
  slots?: Record<string, any>
  global?: {
    plugins?: any[]
    mocks?: Record<string, any>
    components?: Record<string, any>
    directives?: Record<string, any>
  }
  attachTo?: HTMLElement | string
  shallow?: boolean
}

/**
 * API 响应类型
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * API 错误响应类型
 */
export interface ApiErrorResponse {
  code: number
  message: string
  data: null
}

/**
 * 测试环境配置
 */
export interface TestEnvironmentConfig {
  apiBaseUrl: string
  timeout: number
  retries: number
  parallel: boolean
}

/**
 * 测试配置类型
 */
export interface TestConfig {
  environment: 'happy-dom' | 'jsdom' | 'node'
  globals: boolean
  setupFiles: string[]
  timeout: number
  retries: number
  parallel: boolean
  coverage: {
    provider: 'v8' | 'c8' | 'istanbul'
    reporter: string[]
    thresholds: {
      global: {
        branches: number
        functions: number
        lines: number
        statements: number
      }
    }
  }
}

/**
 * Mock 函数类型
 */
export type MockFunction<T extends (...args: any[]) => any> = T & {
  mockClear: () => void
  mockReset: () => void
  mockRestore: () => void
  mockImplementation: (fn: T) => void
  mockReturnValue: (value: ReturnType<T>) => void
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => void
  mockRejectedValue: (error: any) => void
  mockCalls: Parameters<T>[]
  mockResults: Array<{ type: 'return' | 'throw', value: any }>
}
