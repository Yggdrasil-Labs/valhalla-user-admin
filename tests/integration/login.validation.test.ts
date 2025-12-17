import { fireEvent, render } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it } from 'vitest'
import LoginPage from '@/pages/login.vue'
import router from '@/router'
import '../setup/integration'

describe('登录页表单校验', () => {
  it('用户名与密码为空时显示错误信息', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const { getByLabelText, getByText } = render(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    // 不输入直接提交
    await fireEvent.submit(getByLabelText('用户名').closest('form') as HTMLFormElement)

    // 校验错误信息
    getByText('请输入用户名')
    getByText('请输入密码')
  })

  it('输入长度不足时显示对应错误', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const { getByLabelText, getByText } = render(LoginPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    const usernameInput = getByLabelText('用户名') as HTMLInputElement
    const passwordInput = getByLabelText('密码') as HTMLInputElement

    await fireEvent.update(usernameInput, 'ab')
    await fireEvent.blur(usernameInput)
    getByText('用户名至少3个字符')

    await fireEvent.update(passwordInput, '12345')
    await fireEvent.blur(passwordInput)
    getByText('密码至少6个字符')
  })
})
