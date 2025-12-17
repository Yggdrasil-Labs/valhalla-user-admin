import process from 'node:process'
import { expect, test } from '@playwright/test'

// 配置常量
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173'
const LOGIN_URL = `${BASE_URL}/login`
const USERNAME = process.env.TEST_USERNAME || 'demo'
const PASSWORD = process.env.TEST_PASSWORD || 'password'
const STORAGE_STATE_PATH = process.env.STORAGE_STATE_PATH || 'storageState.json'
const MAX_RETRIES = 3
const RETRY_DELAY = 2000

// 等待服务器就绪的辅助函数
async function waitForServerReady(page: any, url: string, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
      if (response && response.status() < 500) {
        return true
      }
    }
    catch (error: any) {
      console.log(`服务器就绪检查 ${i + 1}/${maxAttempts} 失败:`, error.message)
    }

    if (i < maxAttempts - 1) {
      await page.waitForTimeout(1000)
    }
  }
  return false
}

// 登录辅助函数
async function performLogin(page: any) {
  // 等待登录页面加载
  await page.waitForLoadState('networkidle')

  // 确保在登录页面
  await expect(page).toHaveURL(/\/login/)

  // 填写登录信息
  await page.fill('#username', USERNAME)
  await page.fill('#password', PASSWORD)

  // 点击登录按钮
  await page.click('.login-button')

  // 等待登录处理完成
  await page.waitForLoadState('networkidle')

  // 验证登录成功
  await expect(page).toHaveURL(/\/$/)

  // 额外验证：检查是否真的登录成功
  await expect(page.locator('.navbar')).toBeVisible()
}

test('auth setup', async ({ page }) => {
  console.log('开始认证设置...')

  // 重试机制
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`认证尝试 ${attempt}/${MAX_RETRIES}`)

      // 等待服务器就绪
      const serverReady = await waitForServerReady(page, LOGIN_URL)
      if (!serverReady) {
        throw new Error('服务器未就绪')
      }

      // 执行登录
      await performLogin(page)

      // 保存登录状态
      await page.context().storageState({ path: STORAGE_STATE_PATH })

      console.log('认证设置成功')
      return
    }
    catch (error: any) {
      console.error(`认证尝试 ${attempt} 失败:`, error.message)

      if (attempt === MAX_RETRIES) {
        throw new Error(`认证设置失败，已重试 ${MAX_RETRIES} 次: ${error.message}`)
      }

      // 等待后重试
      await page.waitForTimeout(RETRY_DELAY)
    }
  }
})
