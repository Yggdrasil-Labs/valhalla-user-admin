import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * 基础页面类，包含通用的页面操作方法
 */
export class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * 导航到指定URL
   */
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit', timeout?: number }) {
    await this.page.goto(url, options)
  }

  /**
   * 等待页面加载完成
   */
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle') {
    await this.page.waitForLoadState(state)
  }

  /**
   * 等待指定时间
   */
  async wait(timeout: number) {
    await this.page.waitForTimeout(timeout)
  }

  /**
   * 获取页面标题
   */
  async getTitle() {
    return await this.page.title()
  }

  /**
   * 检查页面标题是否包含指定文本
   */
  async expectTitleToContain(text: string | RegExp) {
    await expect(this.page).toHaveTitle(text)
  }

  /**
   * 获取当前URL
   */
  getCurrentUrl() {
    return this.page.url()
  }

  /**
   * 检查URL是否匹配指定模式
   */
  async expectUrlToMatch(url: string | RegExp) {
    await expect(this.page).toHaveURL(url)
  }

  /**
   * 设置视口大小
   */
  async setViewportSize(size: { width: number, height: number }) {
    await this.page.setViewportSize(size)
  }

  /**
   * 截图
   */
  async screenshot(options?: { path?: string, fullPage?: boolean }) {
    return await this.page.screenshot(options)
  }

  /**
   * 清除cookies和权限
   */
  async clearContext() {
    await this.page.context().clearCookies()
    await this.page.context().clearPermissions()
  }

  /**
   * 等待元素可见
   */
  async waitForElement(locator: Locator, timeout?: number) {
    await locator.waitFor({ state: 'visible', timeout })
  }

  /**
   * 等待元素隐藏
   */
  async waitForElementHidden(locator: Locator, timeout?: number) {
    await locator.waitFor({ state: 'hidden', timeout })
  }

  /**
   * 检查元素是否可见
   */
  async expectElementVisible(locator: Locator) {
    await expect(locator).toBeVisible()
  }

  /**
   * 检查元素是否隐藏
   */
  async expectElementHidden(locator: Locator) {
    await expect(locator).toBeHidden()
  }

  /**
   * 检查元素是否包含指定文本
   */
  async expectElementToContainText(locator: Locator, text: string | RegExp) {
    await expect(locator).toContainText(text)
  }

  /**
   * 检查元素数量
   */
  async expectElementCount(locator: Locator, count: number) {
    await expect(locator).toHaveCount(count)
  }

  /**
   * 点击元素
   */
  async clickElement(locator: Locator) {
    await locator.click()
  }

  /**
   * 填写输入框
   */
  async fillInput(locator: Locator, value: string) {
    await locator.fill(value)
  }

  /**
   * 清空输入框并填写
   */
  async clearAndFillInput(locator: Locator, value: string) {
    await locator.clear()
    await locator.fill(value)
  }

  /**
   * 获取元素文本内容
   */
  async getElementText(locator: Locator) {
    return await locator.textContent()
  }

  /**
   * 检查复选框是否选中
   */
  async expectCheckboxChecked(locator: Locator) {
    await expect(locator).toBeChecked()
  }

  /**
   * 检查复选框是否未选中
   */
  async expectCheckboxUnchecked(locator: Locator) {
    await expect(locator).not.toBeChecked()
  }

  /**
   * 选中复选框
   */
  async checkCheckbox(locator: Locator) {
    await locator.check()
  }

  /**
   * 取消选中复选框
   */
  async uncheckCheckbox(locator: Locator) {
    await locator.uncheck()
  }

  /**
   * 键盘操作
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key)
  }

  /**
   * 等待网络请求完成
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * 监听网络响应
   */
  onResponse(callback: (response: any) => void) {
    this.page.on('response', callback)
  }

  /**
   * 获取页面响应状态
   */
  async getResponseStatus(url: string) {
    const response = await this.page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    return response?.status()
  }
}
