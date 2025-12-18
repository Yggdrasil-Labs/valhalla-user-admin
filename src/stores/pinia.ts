/**
 * Pinia 配置和初始化
 * 创建和配置 Pinia 实例
 */

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * 创建 Pinia 实例
 */
export function createAppPinia() {
  const pinia = createPinia()

  // 注册官方持久化插件
  pinia.use(piniaPluginPersistedstate)

  return pinia
}

/**
 * 重置所有 Store
 * 在应用重置时调用
 */
export async function resetStores() {
  const { useUserStore } = await import('./index')

  // 重置所有 Store
  const userStore = useUserStore()
  userStore.$patch({
    userInfo: null,
    loading: false,
    error: null,
  })
}

// 默认导出
export default createAppPinia
