import type { Locale } from './types'
import { createI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/constants/storage'
import { updateLanguageAttribute } from '@/utils/initApp'
import { DEFAULT_LOCALE, LANGUAGE_CONFIGS, SUPPORTED_LOCALES } from './config'

// 重新导出配置，保持向后兼容
export { DEFAULT_LOCALE, SUPPORTED_LOCALES }

// 语言包缓存
const messageCache = new Map<Locale, any>()

// 动态加载语言包
async function loadLocaleMessages(locale: Locale) {
  // 检查缓存
  if (messageCache.has(locale)) {
    return messageCache.get(locale)
  }

  try {
    // 使用动态导入加载 JSON 文件
    const messages = await import(`./${locale}/common.json`)
    const messageData = messages.default

    // 缓存消息
    messageCache.set(locale, messageData)
    return messageData
  }
  catch (error) {
    console.error(`Failed to load locale messages for ${locale}:`, error)

    // 回退到默认语言
    if (locale !== DEFAULT_LOCALE) {
      return loadLocaleMessages(DEFAULT_LOCALE)
    }

    // 如果默认语言也失败，返回空对象
    return {}
  }
}

// 获取浏览器语言偏好
function getBrowserLocale(): Locale {
  const browserLocale = navigator.language || navigator.languages?.[0]

  if (!browserLocale) {
    return DEFAULT_LOCALE
  }

  // 根据配置动态匹配浏览器语言
  for (const config of LANGUAGE_CONFIGS) {
    const [langCode] = config.code.split('-')
    if (langCode && browserLocale.startsWith(langCode)) {
      return config.code as Locale
    }
  }

  // 默认返回配置中的默认语言
  return DEFAULT_LOCALE
}

// 从本地存储获取语言设置
function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE)
    return stored && SUPPORTED_LOCALES.includes(stored as Locale)
      ? (stored as Locale)
      : null
  }
  catch {
    return null
  }
}

// 获取初始语言
function getInitialLocale(): Locale {
  return getStoredLocale() || getBrowserLocale()
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLocale(), // 动态获取初始语言
  // 语言环境继承链配置（处理 zh -> zh-CN, en -> en-US 的回退）
  fallbackLocale: {
    zh: ['zh-CN'],
    en: ['en-US'],
    default: ['en-US'],
  },
  messages: {}, // 初始为空，动态加载
  // 全局属性
  globalInjection: true,
  // 禁用缺失翻译和回退的警告（语言包懒加载的标准做法）
  missingWarn: false,
  fallbackWarn: false,
})

// 语言切换函数
export async function setLocale(locale: Locale): Promise<void> {
  if (SUPPORTED_LOCALES.includes(locale)) {
    try {
      // 动态加载语言包
      const messages = await loadLocaleMessages(locale)
      i18n.global.setLocaleMessage(locale, messages)
      i18n.global.locale.value = locale

      // 保存到本地存储
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale)

      // 更新 HTML lang 属性
      updateLanguageAttribute(locale)
    }
    catch (error) {
      console.error('Failed to load locale messages:', error)
    }
  }
}

// 获取当前语言
export function getCurrentLocale(): Locale {
  return i18n.global.locale.value as Locale
}

// 预加载其他语言包
async function preloadLocales() {
  const otherLocales = SUPPORTED_LOCALES.filter(locale => locale !== getInitialLocale())

  // 并行预加载其他语言包
  Promise.all(
    otherLocales.map(locale => loadLocaleMessages(locale)),
  ).catch((error) => {
    console.warn('Failed to preload some locales:', error)
  })
}

// 初始化语言包
setLocale(getInitialLocale()).then(() => preloadLocales())

export default i18n
