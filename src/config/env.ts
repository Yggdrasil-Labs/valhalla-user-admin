/**
 * 环境变量封装模块
 * 统一从 import.meta.env 获取配置，并提供类型提示和验证
 */

// 构建/运行层面的模式
export type AppMode = 'development' | 'test' | 'production'
// 业务层面的环境标识
export type AppEnv = 'dev' | 'test' | 'prod'

// 环境变量接口定义
export interface ImportMetaEnv {
  readonly VITE_ENV: AppEnv
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
}

// 扩展 ImportMeta 接口
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv & {
      readonly MODE: AppMode
      readonly DEV: boolean
      readonly PROD: boolean
      readonly TEST: boolean
    }
  }
}

// 环境变量默认值配置
const ENV_DEFAULTS = {
  development: {
    API_BASE_URL: 'http://localhost:8080/api',
    APP_NAME: 'Asgard Frontend (Development)',
    APP_ENV: 'dev' as AppEnv,
  },
  test: {
    API_BASE_URL: 'https://test-api.yggdrasil-labs.com/api',
    APP_NAME: 'Asgard Frontend (Test)',
    APP_ENV: 'test' as AppEnv,
  },
  production: {
    API_BASE_URL: 'https://api.yggdrasil-labs.com/api',
    APP_NAME: 'Asgard Frontend (Production)',
    APP_ENV: 'prod' as AppEnv,
  },
} as const

// 环境变量验证函数
function validateEnvVar<T>(value: T | undefined, fallback: T, name: string): T {
  if (value === undefined || value === '') {
    if (import.meta.env.PROD) {
      throw new Error(`[ENV] ${name} 在生产模式未设置，且不允许使用默认值`)
    }
    if (import.meta.env.DEV || import.meta.env.TEST) {
      console.warn(`[ENV] ${name} 未设置，使用默认值: ${fallback}`)
    }
    return fallback
  }
  return value
}

// 获取当前模式
const MODE = import.meta.env.MODE as AppMode

// 验证并获取环境变量
const APP_ENV = validateEnvVar(
  import.meta.env.VITE_ENV as AppEnv,
  ENV_DEFAULTS[MODE].APP_ENV,
  'VITE_ENV',
)

const APP_NAME = validateEnvVar(
  import.meta.env.VITE_APP_NAME,
  ENV_DEFAULTS[MODE].APP_NAME,
  'VITE_APP_NAME',
)

// 版本号来自构建时注入的常量 __APP_VERSION__，不再从 .env 中读取
const APP_VERSION: string = __APP_VERSION__

const API_BASE_URL = validateEnvVar(
  import.meta.env.VITE_API_BASE_URL,
  ENV_DEFAULTS[MODE].API_BASE_URL,
  'VITE_API_BASE_URL',
)

// 环境判断工具函数
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const isTest = import.meta.env.MODE === 'test' || import.meta.env.VITE_ENV === 'test'

// 环境配置对象
export const env = {
  MODE,
  APP_ENV,
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  isDev,
  isProd,
  isTest,
} as const

// 向后兼容的导出
export const {
  MODE: mode,
  APP_ENV: appEnv,
  APP_NAME: appName,
  APP_VERSION: appVersion,
  API_BASE_URL: apiBaseUrl,
} = env

// 默认导出
export default env
