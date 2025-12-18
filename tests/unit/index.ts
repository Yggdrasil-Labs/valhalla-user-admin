/**
 * 单元测试索引文件
 * 提供统一的测试入口和工具函数导出
 */

// 组件测试
export * from './components/LanguageSwitcher.test'
// Composable 测试
export * from './composables/useI18n.test'
// Store 测试
export * from './stores/user.test'

// 单元测试专用工具
export * from './utils'

/**
 * 单元测试运行器配置
 */
export const unitTestConfig = {
  // 单元测试目录
  unitTestDir: 'tests/unit',

  // 集成测试目录
  integrationTestDir: 'tests/integration',

  // E2E 测试目录
  e2eTestDir: 'tests/e2e',

  // 测试文件模式
  testPatterns: [
    'tests/unit/**/*.test.{ts,js}',
    'tests/integration/**/*.test.{ts,js}',
    'tests/e2e/**/*.test.{ts,js}',
  ],

  // 覆盖率配置
  coverage: {
    include: [
      'src/**/*.{ts,js,vue}',
    ],
    exclude: [
      'src/**/*.d.ts',
      'src/**/*.test.{ts,js}',
      'src/**/*.spec.{ts,js}',
      'src/main.ts',
      'src/vite-env.d.ts',
    ],
    thresholds: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

/**
 * 测试分类
 */
export const testCategories = {
  unit: '单元测试',
  integration: '集成测试',
  e2e: '端到端测试',
} as const

/**
 * 测试模块
 */
export const testModules = {
  components: '组件测试',
  stores: '状态管理测试',
  composables: '组合式函数测试',
  api: 'API 测试',
  utils: '工具函数测试',
} as const
