import { useDark } from '@vueuse/core'
import { STORAGE_KEYS } from '@/constants/storage'

/**
 * 主题组合函数
 * 提供深色模式管理功能
 */
export function useTheme() {
  // 深色模式 - 使用 useDark 自动管理
  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: STORAGE_KEYS.THEME,
  })

  // 切换深色模式
  const toggleDark = () => {
    isDark.value = !isDark.value
  }

  // 设置深色模式
  const setDark = (dark: boolean) => {
    isDark.value = dark
  }

  return {
    // 深色模式
    isDark,
    toggleDark,
    setDark,
  }
}
