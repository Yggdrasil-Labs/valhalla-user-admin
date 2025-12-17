/**
 * 组件测试工具函数
 * 专门用于 Vue 组件测试的辅助函数
 */

import type { Component } from 'vue'
import type { TestMountOptions, TestWrapper } from '../../types'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '../../setup/unit'

// 测试用的路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: '<div>Home</div>' },
    },
    {
      path: '/login',
      name: 'login',
      component: { template: '<div>Login</div>' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: { template: '<div>Profile</div>' },
    },
  ],
})

/**
 * 创建测试用的 Vue 应用实例
 * @param component 要测试的组件
 * @param options 额外的挂载选项
 * @returns VueWrapper 实例
 */
export function createTestWrapper(
  component: Component,
  options: TestMountOptions = {},
): TestWrapper {
  // 为每个测试创建独立的 Pinia 实例
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(component, {
    global: {
      plugins: [pinia, i18n, router],
      mocks: {
        $t: (_key: string) => _key,
        $tc: (_key: string) => _key,
        $te: (_key: string) => true,
        $d: (value: any) => value,
        $n: (value: any) => value,
      },
    },
    ...options,
  })
}

/**
 * 等待下一个 tick
 */
export function nextTick(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * 等待指定时间
 * @param ms 等待时间（毫秒）
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 模拟用户输入
 * @param element 输入元素
 * @param value 输入值
 */
export async function simulateInput(element: HTMLElement, value: string) {
  const input = element as HTMLInputElement
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

/**
 * 模拟点击事件
 * @param element 点击元素
 */
export async function simulateClick(element: HTMLElement) {
  element.click()
  await nextTick()
}

/**
 * 模拟表单提交
 * @param form 表单元素
 */
export async function simulateSubmit(form: HTMLFormElement) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  await nextTick()
}

/**
 * 模拟键盘事件
 * @param element 目标元素
 * @param key 按键
 * @param options 事件选项
 */
export async function simulateKeydown(
  element: HTMLElement,
  key: string,
  options: KeyboardEventInit = {},
) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  })
  element.dispatchEvent(event)
  await nextTick()
}

/**
 * 等待元素出现
 * @param selector CSS 选择器
 * @param timeout 超时时间（毫秒）
 */
export function waitForElement(selector: string, timeout = 1000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const check = () => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
        return
      }

      setTimeout(check, 10)
    }

    check()
  })
}

/**
 * 等待条件满足
 * @param condition 条件函数
 * @param timeout 超时时间（毫秒）
 * @param interval 检查间隔（毫秒）
 */
export function waitForCondition(
  condition: () => boolean,
  timeout = 1000,
  interval = 10,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const check = () => {
      if (condition()) {
        resolve()
        return
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Condition not met within ${timeout}ms`))
        return
      }

      setTimeout(check, interval)
    }

    check()
  })
}

/**
 * 断言工具
 */
export const assertUtils = {
  /**
   * 断言元素存在
   */
  assertElementExists: (wrapper: TestWrapper, selector: string) => {
    const element = wrapper.find(selector)
    if (!element.exists()) {
      throw new Error(`Element ${selector} not found`)
    }
    return element
  },

  /**
   * 断言元素不存在
   */
  assertElementNotExists: (wrapper: TestWrapper, selector: string) => {
    const element = wrapper.find(selector)
    if (element.exists()) {
      throw new Error(`Element ${selector} should not exist`)
    }
  },

  /**
   * 断言文本内容
   */
  assertTextContent: (wrapper: TestWrapper, selector: string, expectedText: string) => {
    const element = wrapper.find(selector)
    if (!element.exists()) {
      throw new Error(`Element ${selector} not found`)
    }
    if (!element.text().includes(expectedText)) {
      throw new Error(`Expected text "${expectedText}" not found in element ${selector}`)
    }
  },
}
