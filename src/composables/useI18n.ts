import type { Locale } from '@locales/types'
import { getLanguageDisplayName } from '@locales/config'
import { getCurrentLocale, setLocale, SUPPORTED_LOCALES } from '@locales/i18n'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/constants/storage'
import { updatePageTitle } from '@/utils/initApp'

/**
 * i18n 组合函数
 * 提供便捷的国际化功能
 */
export function useI18nHelper() {
  const { t, locale } = useI18n()

  // useLocalStorage 持久化语言选择
  const storedLocale = useLocalStorage<Locale>(STORAGE_KEYS.LOCALE, getCurrentLocale())

  // 当前语言 - 使用 ref 而不是 computed，因为需要双向绑定
  const currentLocale = ref<Locale>(storedLocale.value || getCurrentLocale())

  // syncRef 简化双向同步
  syncRef(currentLocale, storedLocale)

  // 语言检测
  const isChinese = computed(() => currentLocale.value === 'zh-CN')
  const isEnglish = computed(() => currentLocale.value === 'en-US')

  // useCycleList 优化语言循环切换
  const { next: nextLanguage } = useCycleList(SUPPORTED_LOCALES, {
    initialValue: currentLocale.value,
  })

  // 切换语言
  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    currentLocale.value = newLocale
  }

  // 切换中英文
  const toggleLanguage = () => {
    const newLocale = isChinese.value ? 'en-US' : 'zh-CN'
    switchLocale(newLocale)
  }

  // 循环切换语言
  const cycleLanguage = () => {
    const nextLocale = nextLanguage()
    switchLocale(nextLocale)
  }

  // 便捷的翻译函数
  const translate = (key: string, params?: Record<string, unknown>) => {
    return t(key, params || {})
  }

  // 获取语言显示名称（使用统一配置）
  const getLocaleDisplayName = (locale: Locale) => {
    return getLanguageDisplayName(locale)
  }

  // 更新页面标题
  const setPageTitle = (title?: string) => {
    updatePageTitle(title)
  }

  return {
    // 基础功能
    t: translate,
    locale,
    currentLocale,

    // 语言检测
    isChinese,
    isEnglish,

    // 语言切换
    switchLocale,
    toggleLanguage,
    cycleLanguage,

    // 工具函数
    getLocaleDisplayName,
    setPageTitle,

    // 常量
    supportedLocales: SUPPORTED_LOCALES,
  }
}
