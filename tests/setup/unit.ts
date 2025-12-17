/**
 * 单元测试环境设置
 * 专门用于单元测试的全局配置和 Mock 设置
 */

import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
// 导入实际的语言包
import enUSMessages from '@/locales/en-US/common.json'
import zhCNMessages from '@/locales/zh-CN/common.json'
import '@testing-library/jest-dom'
import './shared'

// 全局测试清理
beforeEach(() => {
  // 清理所有 Mock
  vi.clearAllMocks()

  // 清理 DOM
  document.body.innerHTML = ''

  // 清理存储
  localStorage.clear()
  sessionStorage.clear()

  // 重置时间
  vi.useRealTimers()

  // 重置 Pinia 实例以避免重复注册警告
  const pinia = createPinia()
  setActivePinia(pinia)
})

afterEach(() => {
  // 清理所有 Mock
  vi.clearAllMocks()

  // 恢复所有 Mock
  vi.restoreAllMocks()

  // 清理 DOM
  document.body.innerHTML = ''
})

// 全局错误处理 - 过滤 Vue 警告
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    const message = args[0]
    if (typeof message === 'string') {
      // 过滤 Vue 相关的警告
      if (
        message.includes('App already provides property')
        || (message.includes('Component') && message.includes('has already been registered'))
        || (message.includes('Directive') && message.includes('has already been registered'))
        || message.includes('Warning: ReactDOM.render is no longer supported')
      ) {
        return
      }
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// 创建测试用的 i18n 实例（使用实际语言包）
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCNMessages,
    'en-US': enUSMessages,
  },
})

// 全局测试配置 - 移除全局插件配置，改为在测试工具中按需创建
// 这样可以避免重复注册警告
config.global.mocks = {
  $t: (_key: string) => _key,
  $tc: (_key: string) => _key,
  $te: (_key: string) => true,
  $d: (value: any) => value,
  $n: (value: any) => value,
}

// 全局组件
config.global.components = {}

// 全局指令
config.global.directives = {}

// 导出测试用的插件实例，供测试工具使用
export { i18n }

// 模拟 console 方法（测试时减少输出）
if (import.meta.env.MODE === 'test') {
  globalThis.console = {
    ...console,
    // 在测试环境中静默警告和错误
    warn: vi.fn(),
    error: vi.fn(),
  }
}
