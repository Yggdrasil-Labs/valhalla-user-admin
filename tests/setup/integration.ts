/**
 * 集成测试环境设置
 * 专门用于集成测试的全局配置和环境设置
 */

import { afterEach, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import './shared'

// 集成测试全局设置
beforeEach(() => {
  // 重置 Mock 状态
  vi.clearAllMocks()
})

afterEach(() => {
  // 恢复 Mock 状态
  vi.restoreAllMocks()
})
