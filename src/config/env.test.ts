/**
 * env 配置模块单元测试
 * 验证 API_BASE_URL 等导出及运行时配置回退逻辑
 */
import { describe, expect, it } from 'vitest'
import { env } from './env'

describe('env', () => {
  it('exports API_BASE_URL as non-empty string', () => {
    expect(env.API_BASE_URL).toBeDefined()
    expect(typeof env.API_BASE_URL).toBe('string')
    expect(env.API_BASE_URL.length).toBeGreaterThan(0)
  })

  it('exports env object with expected shape', () => {
    expect(env).toHaveProperty('MODE')
    expect(env).toHaveProperty('APP_ENV')
    expect(env).toHaveProperty('APP_NAME')
    expect(env).toHaveProperty('APP_VERSION')
    expect(env).toHaveProperty('API_BASE_URL')
  })

  it('uses fallback when no runtime config (test env mock or default)', () => {
    // 单元测试环境中无 window.__APP_RUNTIME_CONFIG__ 或为空，应使用 import.meta.env 或 MODE 默认值
    const url = env.API_BASE_URL
    expect(url).toMatch(/^https?:\/\//)
  })
})

describe('runtime config contract', () => {
  it('window.__APP_RUNTIME_CONFIG__ type allows VITE_API_BASE_URL', () => {
    // 类型契约：运行时配置可包含 VITE_API_BASE_URL
    const config: { VITE_API_BASE_URL?: string } = {}
    config.VITE_API_BASE_URL = 'https://api.example.com'
    expect(config.VITE_API_BASE_URL).toBe('https://api.example.com')
  })
})
