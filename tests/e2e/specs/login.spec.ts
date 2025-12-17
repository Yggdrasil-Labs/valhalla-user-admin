import { test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

test.describe('登录页面功能测试', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.navigateToLogin()
  })

  test('页面基本功能验证', async () => {
    await loginPage.verifyPageTitle()
    await loginPage.verifyLoginPageElements()
    await loginPage.verifyFormElements()
    await loginPage.verifyFormLabels()
    await loginPage.verifyDemoInfo()
  })

  test('表单验证和交互', async () => {
    // 用户名验证
    await loginPage.testUsernameValidation()

    // 密码验证
    await loginPage.testPasswordValidation()

    // 输入清除错误
    await loginPage.testInputClearsError()

    // 记住我复选框
    await loginPage.testRememberMeCheckboxToggle()
  })

  test('登录流程测试', async () => {
    await loginPage.fillLoginForm('demo', 'password')
    await loginPage.clickLoginButton()
    await loginPage.verifyLoginButtonLoadingState()
  })

  test('响应式和无障碍访问', async () => {
    await loginPage.verifyResponsiveDesign()
    await loginPage.verifyAccessibility()
  })
})
