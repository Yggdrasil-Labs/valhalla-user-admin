import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 首页页面对象类
 */
export class HomePage extends BasePage {
  // 主要元素定位器
  private readonly navbar: Locator
  private readonly navBrandTitle: Locator
  private readonly heroTitle: Locator
  private readonly gradientText: Locator
  private readonly heroSubtitle: Locator
  private readonly featureCards: Locator
  private readonly statusLabels: Locator
  private readonly statusValues: Locator
  private readonly demoContentHeaders: Locator
  private readonly demoContentParagraphs: Locator
  private readonly envKeys: Locator
  private readonly logoutButton: Locator
  private readonly updateActivityButton: Locator
  private readonly floatingCards: Locator
  private readonly heroContent: Locator

  constructor(page: Page) {
    super(page)

    // 初始化定位器
    this.navbar = page.locator('.navbar')
    this.navBrandTitle = page.locator('.nav-brand h1')
    this.heroTitle = page.locator('.hero-title')
    this.gradientText = page.locator('.gradient-text')
    this.heroSubtitle = page.locator('.hero-subtitle')
    this.featureCards = page.locator('.feature-card')
    this.statusLabels = page.locator('.status-label')
    this.statusValues = page.locator('.status-value')
    this.demoContentHeaders = page.locator('.demo-content h4')
    this.demoContentParagraphs = page.locator('.demo-content p')
    this.envKeys = page.locator('.env-key')
    this.logoutButton = page.locator('.logout-btn')
    this.updateActivityButton = page.locator('.cta-button.secondary')
    this.floatingCards = page.locator('.floating-card')
    this.heroContent = page.locator('.hero-content')
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
    await this.expectTitleToContain(/Asgard Frontend/)
  }

  /**
   * 验证导航栏
   */
  async verifyNavbar() {
    await this.expectElementVisible(this.navbar)
    await this.expectElementToContainText(this.navBrandTitle, 'Asgard Frontend')
  }

  /**
   * 验证Hero区域
   */
  async verifyHeroSection() {
    await this.expectElementToContainText(this.heroTitle, '欢迎来到')
    await this.expectElementToContainText(this.gradientText, 'Asgard Frontend')
    await this.expectElementToContainText(this.heroSubtitle, '基于 Vue 3 + TypeScript + Vite 的现代化前端模板')
  }

  /**
   * 验证功能卡片
   */
  async verifyFeatureCards() {
    await this.expectElementCount(this.featureCards, 3)
    await this.expectElementToContainText(this.featureCards.first(), 'Pinia 状态管理')
    await this.expectElementToContainText(this.featureCards.nth(1), 'VueUse 工具集')
    await this.expectElementToContainText(this.featureCards.nth(2), '环境信息')
  }

  /**
   * 验证用户状态信息
   */
  async verifyUserStatus() {
    await this.expectElementToContainText(this.statusLabels.nth(0), '登录状态')
    await this.expectElementToContainText(this.statusValues.nth(0), '已登录')
    await this.expectElementToContainText(this.statusLabels.nth(1), '用户名')
    await this.expectElementToContainText(this.statusValues.nth(1), 'demo')
  }

  /**
   * 验证VueUse功能演示
   */
  async verifyVueUseDemo() {
    await this.expectElementToContainText(this.demoContentHeaders.nth(0), '窗口尺寸')
    await this.expectElementToContainText(this.demoContentHeaders.nth(1), '鼠标位置')
    await this.expectElementToContainText(this.demoContentHeaders.nth(2), '深色模式')

    // 检查数值显示格式
    const windowSizeText = await this.getElementText(this.demoContentParagraphs.nth(0))
    expect(windowSizeText).toMatch(/\d+ × \d+/)

    const mousePositionText = await this.getElementText(this.demoContentParagraphs.nth(1))
    expect(mousePositionText).toMatch(/\(\d+, \d+\)/)
  }

  /**
   * 验证环境信息
   */
  async verifyEnvironmentInfo() {
    const expectedEnvKeys = [
      '运行模式',
      '应用环境',
      '应用名称',
      '应用版本',
      'API 地址',
      '开发模式',
      '生产模式',
      '测试模式',
    ]

    for (let i = 0; i < expectedEnvKeys.length; i++) {
      await this.expectElementToContainText(this.envKeys.nth(i), expectedEnvKeys[i]!)
    }
  }

  /**
   * 验证浮动卡片
   */
  async verifyFloatingCards() {
    await this.expectElementCount(this.floatingCards, 7)

    const expectedTechs = ['Vue 3', 'Vite', 'Vitest', 'VueUse', 'Router', 'Pinia', 'Vue-i18n']

    for (let i = 0; i < expectedTechs.length; i++) {
      await this.expectElementToContainText(this.floatingCards.nth(i).locator('h3'), expectedTechs[i]!)
    }
  }

  /**
   * 验证响应式设计
   */
  async verifyResponsiveDesign() {
    // 测试桌面端
    await this.setViewportSize({ width: 1200, height: 800 })
    await this.expectElementVisible(this.heroContent)

    // 测试移动端
    await this.setViewportSize({ width: 375, height: 667 })
    await this.expectElementVisible(this.heroContent)
  }

  /**
   * 执行登出操作并验证跳转
   */
  async logoutAndVerifyRedirect() {
    await this.clickElement(this.logoutButton)
    await this.expectUrlToMatch('/login')
  }

  /**
   * 执行更新活动操作
   */
  async updateActivity() {
    await this.clickElement(this.updateActivityButton)
    await this.wait(100) // 等待状态更新
    await this.expectElementVisible(this.updateActivityButton)
  }
}
