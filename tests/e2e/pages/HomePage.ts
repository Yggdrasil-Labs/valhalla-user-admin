import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 首页页面对象类
 */
export class HomePage extends BasePage {
  // 主要元素定位器
  private readonly navbar: Locator
  private readonly navBrandTitle: Locator
  private readonly welcomeTitle: Locator
  private readonly gradientText: Locator
  private readonly welcomeSubtitle: Locator
  private readonly welcomeSection: Locator

  constructor(page: Page) {
    super(page)

    // 初始化定位器
    this.navbar = page.locator('.navbar')
    this.navBrandTitle = page.locator('.nav-brand h1')
    this.welcomeTitle = page.locator('.welcome-title')
    this.gradientText = page.locator('.gradient-text')
    this.welcomeSubtitle = page.locator('.welcome-subtitle')
    this.welcomeSection = page.locator('.welcome-section')
  }

  /**
   * 导航到首页
   */
  async navigateToHome() {
    await this.goto('/')
    await this.waitForLoadState()
  }

  /**
   * 验证页面标题
   */
  async verifyPageTitle() {
    await this.expectTitleToContain(/Valhalla User Admin/)
  }

  /**
   * 验证导航栏
   */
  async verifyNavbar() {
    await this.expectElementVisible(this.navbar)
    await this.expectElementToContainText(this.navBrandTitle, 'Valhalla User Admin')
  }

  /**
   * 验证欢迎区域
   */
  async verifyWelcomeSection() {
    await this.expectElementVisible(this.welcomeSection)
    await this.expectElementToContainText(this.welcomeTitle, '欢迎来到')
    await this.expectElementToContainText(this.gradientText, 'Valhalla User Admin')
    await this.expectElementToContainText(this.welcomeSubtitle, '用户管理后台系统')
  }

  /**
   * 验证响应式设计
   */
  async verifyResponsiveDesign() {
    // 测试桌面端
    await this.setViewportSize({ width: 1200, height: 800 })
    await this.expectElementVisible(this.welcomeSection)

    // 测试移动端
    await this.setViewportSize({ width: 375, height: 667 })
    await this.expectElementVisible(this.welcomeSection)
  }
}
