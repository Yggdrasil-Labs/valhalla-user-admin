import type { Locale } from '@locales/types'
import env from '@/config/env'

/**
 * 初始化应用设置
 * 统一管理 HTML 属性设置
 */
export function initAppSettings() {
  useTitle(env.APP_NAME)

  const isDocumentLangSupported = useSupported(() => 'lang' in document.documentElement)

  // 设置初始语言属性（会在 i18n 初始化后更新）
  if (isDocumentLangSupported.value) {
    document.documentElement.lang = 'zh-CN'
  }
}

/**
 * 更新语言属性
 * 在语言切换时调用
 */
export function updateLanguageAttribute(locale: Locale) {
  const isDocumentLangSupported = useSupported(() => 'lang' in document.documentElement)

  if (isDocumentLangSupported.value) {
    document.documentElement.lang = locale
  }
}

/**
 * 更新页面标题
 * 可以根据当前页面或语言动态更新
 */
export function updatePageTitle(title?: string) {
  const baseTitle = env.APP_NAME
  const documentTitle = useTitle()
  documentTitle.value = title ? `${title} - ${baseTitle}` : baseTitle
}
