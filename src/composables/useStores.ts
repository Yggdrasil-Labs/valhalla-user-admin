/**
 * Store 相关的 Composables
 * 提供便捷的 Store 使用方式
 */

import { computed } from 'vue'
import { useUserStore } from '@/stores'

/**
 * 用户管理 Composable
 */
export function useUser() {
  const userStore = useUserStore()

  return {
    // 状态
    loading: computed(() => userStore.loading),
    error: computed(() => userStore.error),
    userInfo: computed(() => userStore.userInfo),

    // 计算属性
    displayName: computed(() => userStore.displayName),
    avatar: computed(() => userStore.avatar),
    roles: computed(() => userStore.roles),
    permissions: computed(() => userStore.permissions),

    // 方法
    fetchUserInfo: () => userStore.fetchUserInfo(),
    updateUserInfo: (userInfo: any) => userStore.updateUserInfo(userInfo),
    hasRole: (role: string) => userStore.hasRole(role),
    hasPermission: (permission: string) => userStore.hasPermission(permission),
    canAccess: (permission: string) => userStore.hasPermission(permission),
    isAdmin: () => userStore.hasRole('admin'),
    isUser: () => userStore.hasRole('user'),
    setError: (error: string | null) => userStore.setError(error),
    clearError: () => userStore.clearError(),
  }
}

/**
 * 组合所有 Store 的 Composable
 */
export function useStores() {
  return {
    user: useUser(),
  }
}
