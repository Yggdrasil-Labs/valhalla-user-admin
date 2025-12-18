import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 服务器健康检查页面类
 */
export class ServerHealthPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  /**
   * 检查服务器健康状态
   */
  async checkServerHealth() {
    const response = await this.getResponseStatus('/')
    return response
  }

  /**
   * 获取页面对象（用于访问页面元素）
   */
  getPage() {
    return this.page
  }
}
