import { fireEvent, render, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { RouterView } from 'vue-router'
import router from '@/router'
import '../setup/integration'

// Mock VueUse 函数
vi.mock('@vueuse/core', () => ({
  useWindowSize: () => ({ width: { value: 1024 }, height: { value: 768 } }),
  useMouse: () => ({ x: { value: 0 }, y: { value: 0 } }),
  useDark: () => ({ value: false }),
  useSupported: () => ({ value: true }),
  useEventListener: () => {},
  useLocalStorage: () => ({ value: 'zh-CN' }),
  syncRef: () => {},
  useCycleList: () => ({ next: () => 'en-US' }),
}))

// Mock Vue i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'zh-CN' },
    t: (key: string) => key,
    tc: (key: string) => key,
    te: (_key: string) => true,
    d: (value: any) => value,
    n: (value: any) => value,
  }),
  createI18n: () => ({
    global: {
      setLocaleMessage: vi.fn(),
      locale: { value: 'zh-CN' },
    },
  }),
}))

// Mock locales 模块
vi.mock('@/locales/i18n', () => ({
  getCurrentLocale: () => 'zh-CN',
  setLocale: vi.fn(),
  SUPPORTED_LOCALES: ['zh-CN', 'en-US'],
}))

vi.mock('@/locales/config', () => ({
  getLanguageDisplayName: (locale: string) => locale === 'zh-CN' ? '中文' : 'English',
}))

vi.mock('@/utils/initApp', () => ({
  updatePageTitle: vi.fn(),
}))

vi.mock('@/constants/storage', () => ({
  STORAGE_KEYS: {
    LOCALE: 'locale',
  },
}))

describe('登录成功跳转首页', () => {
  it('输入 demo/password 登录后跳转到首页并显示状态', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    // 直接渲染 RouterView，以便真实路由跳转
    const { getByLabelText, getByText, getAllByText } = render({
      render() {
        return h(RouterView)
      },
    }, {
      global: {
        plugins: [pinia, router],
      },
    })

    // 先进入登录页
    await router.push('/login')
    await router.isReady()

    // 填写正确账号
    await fireEvent.update(getByLabelText('用户名'), 'demo')
    await fireEvent.update(getByLabelText('密码'), 'password')

    // 提交
    await fireEvent.submit(getByLabelText('用户名').closest('form') as HTMLFormElement)

    // 等待登录完成和路由跳转
    await waitFor(async () => {
      await router.isReady()
    }, { timeout: 5000 })

    // 等待页面跳转到首页
    await waitFor(() => {
      getAllByText('登出')
    }, { timeout: 5000 })

    // 现在应当在首页看到登录后的状态
    // 验证页面包含预期的内容
    const demoElements = getAllByText('demo')
    expect(demoElements.length).toBeGreaterThan(0)

    getByText('已登录')
  })
})
