import { describe, expect, it } from 'vitest'
import HelloWorld from '@/components/HelloWorld.vue'
import { createTestWrapper, simulateClick } from '../utils'

describe('helloWorld', () => {
  it('应该正确渲染消息', () => {
    const wrapper = createTestWrapper(HelloWorld, {
      props: {
        msg: 'Hello Vitest!',
      },
    })
    expect(wrapper.find('h1').text()).toBe('Hello Vitest!')
    wrapper.unmount()
  })

  it('应该显示初始计数为 0', () => {
    const wrapper = createTestWrapper(HelloWorld, {
      props: {
        msg: 'Hello Vitest!',
      },
    })
    const button = wrapper.find('button')
    expect(button.text()).toContain('count is 0')
    wrapper.unmount()
  })

  it('应该能够增加计数', async () => {
    const wrapper = createTestWrapper(HelloWorld, {
      props: {
        msg: 'Hello Vitest!',
      },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3) // 确保有3个按钮

    const incButton = buttons[0]!
    await simulateClick(incButton.element)

    expect(incButton.text()).toContain('count is 1')
    wrapper.unmount()
  })

  it('应该能够减少计数', async () => {
    const wrapper = createTestWrapper(HelloWorld, {
      props: {
        msg: 'Hello Vitest!',
      },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3) // 确保有3个按钮

    // 先增加计数
    const incButton = buttons[0]!
    await simulateClick(incButton.element)

    // 然后减少计数
    const decButton = buttons[1]!
    await simulateClick(decButton.element)

    expect(incButton.text()).toContain('count is 0')
    wrapper.unmount()
  })

  it('应该能够重置计数', async () => {
    const wrapper = createTestWrapper(HelloWorld, {
      props: {
        msg: 'Hello Vitest!',
      },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3) // 确保有3个按钮

    // 先增加计数
    const incButton = buttons[0]!
    await simulateClick(incButton.element)
    await simulateClick(incButton.element)

    // 然后重置
    const resetButton = buttons[2]!
    await simulateClick(resetButton.element)

    expect(incButton.text()).toContain('count is 0')
    wrapper.unmount()
  })

  it('应该显示编辑提示文本', () => {
    const wrapper = createTestWrapper(HelloWorld, {
      props: {
        msg: 'Hello Vitest!',
      },
    })
    const p = wrapper.find('p')
    // 由于使用了 i18n，实际显示的是翻译后的文本
    expect(p.text()).toContain('编辑')
    expect(p.text()).toContain('components/HelloWorld.vue')
    wrapper.unmount()
  })

  it('应该包含正确的 CSS 类', () => {
    const wrapper = createTestWrapper(HelloWorld, {
      props: {
        msg: 'Hello Vitest!',
      },
    })
    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('.button-group').exists()).toBe(true)
    wrapper.unmount()
  })
})
