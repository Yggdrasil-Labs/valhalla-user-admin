/**
 * 单元测试工具统一导出文件
 * 专门用于单元测试的工具函数
 */

// 组件测试工具
export * from './component'

// 重新导出常用工具
export {
  assertUtils,
  createTestWrapper,
  nextTick,
  simulateClick,
  simulateInput,
  simulateKeydown,
  simulateSubmit,
  wait,
  waitForCondition,
  waitForElement,
} from './component'

// Store 测试工具
export * from './store'

export {
  createTestPinia,
  storeDataFactory,
  storeTestUtils,
} from './store'

/**
 * 单元测试工具使用说明
 *
 * 组件测试：
 * - createTestWrapper: 创建组件测试包装器
 * - simulateClick, simulateInput: 模拟用户交互
 * - waitForElement: 等待元素出现
 * - assertUtils: 断言工具
 *
 * Store 测试：
 * - createTestPinia: 创建测试 Pinia 实例
 * - storeTestUtils: Store 测试辅助函数
 * - storeDataFactory: Store 测试数据工厂
 */
