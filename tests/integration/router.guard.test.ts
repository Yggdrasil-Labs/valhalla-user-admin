import { render } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { RouterView } from 'vue-router'
import router from '@/router'
import '../setup/integration'

describe('路由守卫 - 未登录访问受保护页面应跳转登录', () => {
  it('访问 / 时未登录会被重定向到 /login', async () => {
    // Arrange
    const pinia = createPinia()
    setActivePinia(pinia)

    const { findByText } = render({
      render() {
        return h(RouterView)
      },
    }, {
      global: {
        plugins: [pinia, router],
      },
    })

    // Act
    const pushSpy = vi.spyOn(router, 'push')
    await router.push('/')
    await router.isReady()

    // Assert - 应出现登录页的标题/文案
    await findByText('欢迎登录')
    expect(pushSpy).toHaveBeenCalled()
  })
})
