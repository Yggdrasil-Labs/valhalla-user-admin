import { expect, test } from '@playwright/test'
import { ServerHealthPage } from '../pages/ServerHealthPage'

test.describe('服务器健康检查', () => {
  let serverHealthPage: ServerHealthPage

  test.beforeEach(async ({ page }) => {
    serverHealthPage = new ServerHealthPage(page)
  })

  test('服务器基本功能验证', async () => {
    // 检查根路径访问
    const response = await serverHealthPage.checkServerHealth()
    expect(response).toBeLessThan(400)

    // 检查页面标题
    await serverHealthPage.expectTitleToContain(/Valhalla User Admin/)

    // 检查页面内容
    await serverHealthPage.expectElementVisible(serverHealthPage.getPage().locator('body'))
  })
})
