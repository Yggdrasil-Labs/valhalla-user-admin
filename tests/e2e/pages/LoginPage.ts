import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 登录页面对象类
 */
export class LoginPage extends BasePage {
  // 主要元素定位器
  private readonly loginContainer: Locator
  private readonly loginTitle: Locator
  private readonly usernameInput: Locator
  private readonly passwordInput: Locator
  private readonly rememberMeCheckbox: Locator
  private readonly loginButton: Locator
  private readonly errorMessages: Locator
  private readonly demoInfo: Locator
  private readonly loadingSpinner: Locator

  constructor(page: Page) {
    super(page)

    // 初始化定位器
    this.loginContainer = page.locator('.login-container')
    this.loginTitle = page.locator('.login-header h1')
    this.usernameInput = page.locator('#username')
    this.passwordInput = page.locator('#password')
    this.rememberMeCheckbox = page.locator('.checkbox-input')
    this.loginButton = page.locator('.login-button')
    this.errorMessages = page.locator('.error-message')
    this.demoInfo = page.locator('.demo-info')
    this.loadingSpinner = page.locator('.loading-spinner')
  }

  /**
   * 导航到登录页面
   */
  async navigateToLogin() {
    await this.clearContext()
    await this.goto('/login')
    await this.waitForLoadState()
    await this.expectUrlToMatch(/\/login/)
  }

  /**
   * 验证页面标题
   */
  async verifyPageTitle() {
    await this.expectTitleToContain(/Valhalla User Admin/)
  }

  /**
   * 验证登录页面基本元素
   */
  async verifyLoginPageElements() {
    await this.expectElementVisible(this.loginContainer)
    await this.expectElementToContainText(this.loginTitle, '欢迎登录')
  }

  /**
   * 验证表单元素
   */
  async verifyFormElements() {
    await this.expectElementVisible(this.usernameInput)
    await this.expectElementVisible(this.passwordInput)
    await this.expectElementVisible(this.rememberMeCheckbox)
    await this.expectElementVisible(this.loginButton)
  }

  /**
   * 验证表单标签
   */
  async verifyFormLabels() {
    await this.expectElementToContainText(this.page.locator('label[for="username"]'), '用户名')
    await this.expectElementToContainText(this.page.locator('label[for="password"]'), '密码')
    await this.expectElementToContainText(this.page.locator('.checkbox-text'), '记住我')
  }

  /**
   * 验证演示信息
   */
  async verifyDemoInfo() {
    await this.expectElementToContainText(this.demoInfo, '演示账号')
    await this.expectElementToContainText(this.demoInfo, '用户名：demo')
    await this.expectElementToContainText(this.demoInfo, '密码：password')
  }

  /**
   * 填写登录表单
   */
  async fillLoginForm(username: string, password: string) {
    await this.fillInput(this.usernameInput, username)
    await this.fillInput(this.passwordInput, password)
  }

  /**
   * 点击登录按钮
   */
  async clickLoginButton() {
    await this.clickElement(this.loginButton)
  }

  /**
   * 测试用户名验证
   */
  async testUsernameValidation() {
    // 先清空输入框，确保干净状态
    await this.fillInput(this.usernameInput, '')

    await this.clickElement(this.usernameInput)
    await this.usernameInput.blur()
    await this.expectElementToContainText(this.errorMessages.first(), '请输入用户名')

    await this.fillInput(this.usernameInput, 'ab')
    await this.usernameInput.blur()
    await this.expectElementToContainText(this.errorMessages.first(), '用户名至少3个字符')
  }

  /**
   * 测试密码验证
   */
  async testPasswordValidation() {
    // 先清空输入框，确保干净状态
    await this.fillInput(this.passwordInput, '')

    await this.clickElement(this.passwordInput)
    await this.passwordInput.blur()
    await this.expectElementToContainText(this.errorMessages.last(), '请输入密码')

    await this.fillInput(this.passwordInput, '12345')
    await this.passwordInput.blur()
    await this.expectElementToContainText(this.errorMessages.last(), '密码至少6个字符')
  }

  /**
   * 测试输入时清除错误信息
   */
  async testInputClearsError() {
    // 先清空输入框，确保干净状态
    await this.fillInput(this.usernameInput, '')

    // 触发用户名错误
    await this.clickElement(this.usernameInput)
    await this.usernameInput.blur()
    await this.expectElementToContainText(this.errorMessages.first(), '请输入用户名')

    // 输入有效内容应该清除错误
    await this.fillInput(this.usernameInput, 'testuser')
    await this.usernameInput.blur()

    // 等待一下让错误信息消失
    await this.wait(100)

    // 检查错误信息是否消失（可能仍然存在，但内容应该改变）
    const errorText = await this.getElementText(this.errorMessages.first())
    expect(errorText).not.toContain('请输入用户名')
  }

  /**
   * 测试记住我复选框切换
   */
  async testRememberMeCheckboxToggle() {
    await this.expectCheckboxUnchecked(this.rememberMeCheckbox)

    await this.clickElement(this.rememberMeCheckbox)
    await this.expectCheckboxChecked(this.rememberMeCheckbox)

    await this.clickElement(this.rememberMeCheckbox)
    await this.expectCheckboxUnchecked(this.rememberMeCheckbox)
  }

  /**
   * 验证登录按钮加载状态
   */
  async verifyLoginButtonLoadingState() {
    await this.expectElementVisible(this.loadingSpinner)
    await this.expectElementToContainText(this.loginButton, '登录中...')
    await expect(this.loginButton).toHaveClass(/loading/)
  }

  /**
   * 验证响应式设计
   */
  async verifyResponsiveDesign() {
    // 测试桌面端
    await this.setViewportSize({ width: 1200, height: 800 })
    await this.expectElementVisible(this.loginContainer)

    // 测试移动端
    await this.setViewportSize({ width: 375, height: 667 })
    await this.expectElementVisible(this.loginContainer)
  }

  /**
   * 验证无障碍访问
   */
  async verifyAccessibility() {
    await this.expectElementVisible(this.page.locator('label[for="username"]'))
    await this.expectElementVisible(this.page.locator('label[for="password"]'))

    await expect(this.usernameInput).toHaveAttribute('autocomplete', 'username')
    await expect(this.passwordInput).toHaveAttribute('autocomplete', 'current-password')
  }
}
