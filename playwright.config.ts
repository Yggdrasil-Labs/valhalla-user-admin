import { existsSync } from 'node:fs'
import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * 安全获取storageState配置
 * 如果文件不存在且不是setup项目，则返回undefined
 */
function getStorageState(projectName: string): string | undefined {
  const storageStatePath = 'storageState.json'

  // Setup项目不需要storageState
  if (projectName === 'setup') {
    return undefined
  }

  // 如果文件不存在，返回undefined（让Playwright处理）
  if (!existsSync(storageStatePath)) {
    console.warn(`警告: ${storageStatePath} 文件不存在，项目 ${projectName} 将不使用认证状态`)
    return undefined
  }

  return storageStatePath
}

/**
 * Playwright 配置文件
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试目录
  testDir: './tests/e2e/specs',

  // 全局测试超时时间（30秒）
  timeout: 30 * 1000,

  // 每个测试的超时时间（10秒）
  expect: {
    timeout: 10 * 1000,
  },

  // 失败时重试次数
  retries: process.env.CI ? 2 : 0,

  // 并行运行的工作进程数
  workers: process.env.CI ? 1 : undefined,

  // 报告器配置
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never', // 避免自动打开报告
    }],
    ['json', {
      outputFile: 'test-results/results.json',
    }],
    ['junit', {
      outputFile: 'test-results/results.xml',
    }],
    // 在 CI 环境中使用简洁的报告器
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  // 全局测试配置
  use: {
    // 基础 URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',

    // 浏览器上下文选项
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 为所有测试添加 e2e 标识
    extraHTTPHeaders: {
      'X-E2E-Test': 'true',
    },
  },

  // 项目配置 - 测试不同的浏览器
  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*setup\/e2e\.ts/,
    },
    // Authenticated tests
    {
      name: 'authenticated-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: getStorageState('authenticated-chromium'),
      },
      dependencies: ['setup'],
    },
    {
      name: 'authenticated-firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: getStorageState('authenticated-firefox'),
      },
      dependencies: ['setup'],
    },
    // Unauthenticated tests (login page tests)
    {
      name: 'unauthenticated-chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 确保不使用任何存储状态，以测试未认证场景
        storageState: undefined,
      },
      testMatch: /.*login.*\.spec\.ts/,
    },
    // Mobile tests
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: getStorageState('Mobile Chrome'),
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        storageState: getStorageState('Mobile Safari'),
      },
      dependencies: ['setup'],
    },
  ],

  // Web 服务器配置
  webServer: {
    command: process.env.CI ? 'pnpm preview' : 'pnpm dev',
    port: 5173,
    // 在非 CI 环境中复用已存在的服务器，CI 环境中总是启动新服务器
    reuseExistingServer: !process.env.CI,
    // 增加超时时间以确保服务器完全启动
    timeout: 120 * 1000,
    // 等待服务器就绪的配置
    stdout: process.env.CI ? 'pipe' : 'ignore',
    stderr: process.env.CI ? 'pipe' : 'ignore',
    // 设置环境变量以确保服务器在测试模式下运行
    env: {
      NODE_ENV: 'test',
      // 确保在测试环境中运行
      VITE_ENV: 'test',
    },
  },
})
