/**
 * 用户信息 Store
 * 管理用户信息
 */

import type { ActionResult, StoreState, UserInfo } from '@/types/store'
import { defineStore } from 'pinia'
import { getUserInfoApi, updateUserInfoApi } from '@/api/modules/user'

interface UserState extends StoreState {
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    loading: false,
    error: null,
    userInfo: null,
  }),

  getters: {
    /**
     * 用户显示名称
     */
    displayName: (state): string => {
      return state.userInfo?.username || '用户'
    },

    /**
     * 用户头像
     */
    avatar: (state): string => {
      return state.userInfo?.avatar || '/default-avatar.png'
    },

    /**
     * 用户角色
     */
    roles: (state): string[] => {
      return state.userInfo?.roles || []
    },

    /**
     * 用户权限
     */
    permissions: (state): string[] => {
      return state.userInfo?.permissions || []
    },

    /**
     * 是否具有指定角色
     */
    hasRole: state => (role: string): boolean => {
      return state.userInfo?.roles.includes(role) || false
    },

    /**
     * 是否具有指定权限
     */
    hasPermission: state => (permission: string): boolean => {
      return state.userInfo?.permissions.includes(permission) || false
    },
  },

  actions: {
    /**
     * 获取用户信息
     */
    async fetchUserInfo(): Promise<ActionResult> {
      this.loading = true
      this.error = null

      try {
        const response = await getUserInfoApi()

        if (response.success && response.data) {
          this.userInfo = response.data

          return {
            success: true,
            message: '获取用户信息成功',
            data: response.data,
          }
        }
        else {
          throw new Error(response.errMessage || '获取用户信息失败')
        }
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : '获取用户信息失败'
        return {
          success: false,
          message: this.error,
        }
      }
      finally {
        this.loading = false
      }
    },

    /**
     * 更新用户信息
     */
    async updateUserInfo(userInfo: Partial<UserInfo>): Promise<ActionResult> {
      if (!this.userInfo) {
        return { success: false, message: '用户信息不存在' }
      }

      this.loading = true
      this.error = null

      try {
        const response = await updateUserInfoApi(userInfo)

        if (response.success && response.data) {
          this.userInfo = { ...this.userInfo, ...response.data }

          return {
            success: true,
            message: '更新用户信息成功',
            data: response.data,
          }
        }
        else {
          throw new Error(response.errMessage || '更新用户信息失败')
        }
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : '更新用户信息失败'
        return {
          success: false,
          message: this.error,
        }
      }
      finally {
        this.loading = false
      }
    },

    /**
     * 设置错误状态
     */
    setError(error: string | null) {
      this.error = error
    },

    /**
     * 清除错误状态
     */
    clearError() {
      this.error = null
    },
  },

  // 持久化配置
  persist: true,
})
