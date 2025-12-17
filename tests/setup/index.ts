// 测试环境设置索引文件
export * from './e2e'
export * from './integration'
export * from './unit'

export type TestEnvironment = 'unit' | 'integration' | 'e2e'

export const testEnvironments = {
  unit: {
    name: '单元测试',
    description: '测试单个函数、组件或模块的独立功能',
    setupFile: './tests/setup/unit.ts',
    timeout: 10000,
    parallel: true,
  },
  integration: {
    name: '集成测试',
    description: '测试多个模块之间的交互和集成',
    setupFile: './tests/setup/integration.ts',
    timeout: 30000,
    parallel: false,
  },
  e2e: {
    name: '端到端测试',
    description: '测试完整的用户流程和应用程序行为',
    configFile: './playwright.config.ts',
    setupFile: './tests/setup/e2e.ts',
    timeout: 60000,
    parallel: false,
  },
} as const

export function getTestEnvironmentConfig(env: TestEnvironment) {
  return testEnvironments[env]
}
