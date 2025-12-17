/**
 * Mock 系统统一导出
 * 提供所有 Mock 相关功能的统一入口
 */

// 导出各种 Mock 配置
export * from './api'
// 重新导出主要的 Mock 配置（保持向后兼容）
export { apiMocks, apiMockUtils } from './api'
export * from './components'

export { componentMocks, componentMockUtils } from './components'
export * from './store'
export { storeMocks, storeMockUtils } from './store'

/**
 * Mock 系统使用说明
 */
export const mockSystemGuide = {
  /**
   * 快速开始
   */
  quickStart: {
    description: '快速使用 Mock 系统',
    steps: [
      '导入需要的 Mock 配置',
      '在测试中使用 Mock 数据',
      '测试完成后清理 Mock',
    ],
    example: `
      import { apiMocks, storeMocks } from '@/tests/mocks'
      
      // 设置 Mock
      apiMocks.user.login.mockResolvedValue(mockResponse)
      
      // 测试代码...
      
      // 清理
      apiMocks.user.login.mockReset()
    `,
  },

  /**
   * Mock 类型说明
   */
  mockTypes: {
    api: 'API 相关的 Mock 配置，包括用户 API 和通用 API',
    store: 'Pinia Store 相关的 Mock 配置',
    components: 'Vue 组件相关的 Mock 配置（Router、I18n、Pinia）',
  },

  /**
   * 最佳实践
   */
  bestPractices: {
    organization: '按功能模块拆分 Mock 文件，便于维护',
    naming: '使用清晰的命名约定，如 userApiMocks、routerMocks',
    cleanup: '测试完成后及时清理 Mock 状态',
    isolation: '每个测试用例使用独立的 Mock 状态',
  },

  /**
   * 常用模式
   */
  commonPatterns: {
    apiTesting: '使用 apiMocks 测试 API 调用',
    componentTesting: '使用 componentMocks 测试组件交互',
    storeTesting: '使用 storeMocks 测试状态管理',
    integrationTesting: '组合多个 Mock 进行集成测试',
  },
} as const
