/**
 * 用户信息 Store
 * 管理用户认证状态和个人信息
 */

import type { ActionResult, LoginInfo, StoreState, UserInfo } from '@/types/store'
import { defineStore } from 'pinia'
import { getUserInfoApi, loginApi, logoutApi, refreshTokenApi, updateUserInfoApi } from '@/api/modules/user'

// 扩展 Window 接口以支持 axios
declare global {
  interface Window {
    axios?: any
    i18n?: any
  }
}

interface UserState extends StoreState {
  userInfo: UserInfo | null
  token: string | null
  isLoggedIn: boolean
  loginTime: number | null
  lastActivity: number | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    loading: false,
    error: null,
    userInfo: null,
    token: null,
    isLoggedIn: false,
    loginTime: null,
    lastActivity: null,
  }),

  getters: {
    /**
     * 用户显示名称
     */
    displayName: (state): string => {
      return state.userInfo?.username || '未登录用户'
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

    /**
     * 登录状态持续时间（分钟）
     */
    sessionDuration: (state): number => {
      if (!state.loginTime)
        return 0
      return Math.floor((Date.now() - state.loginTime) / (1000 * 60))
    },

    /**
     * 是否长时间未活动（30分钟）
     */
    isInactive: (state): boolean => {
      if (!state.lastActivity)
        return false
      return Date.now() - state.lastActivity > 30 * 60 * 1000
    },
  },

  actions: {
    /**
     * 用户登录
     */
    async login(loginInfo: LoginInfo): Promise<ActionResult> {
      this.loading = true
      this.error = null

      try {
        // 调用登录 API
        const response = await loginApi(loginInfo)

        if (response.code === 200) {
          // 保存用户信息和 token
          this.userInfo = response.data.user
          this.token = response.data.token
          this.isLoggedIn = true
          this.loginTime = Date.now()
          this.lastActivity = Date.now()

          // 设置 axios 默认 token
          this.setAuthToken(response.data.token)

          return {
            success: true,
            message: '登录成功',
            data: response.data,
          }
        }
        else {
          throw new Error(response.message || '登录失败')
        }
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : '登录失败'
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
     * 用户登出
     */
    async logout(): Promise<ActionResult> {
      this.loading = true
      this.error = null

      try {
        // 调用登出 API
        await logoutApi()

        // 清除状态
        this.clearUserData()

        // 清除 axios 默认 token
        this.clearAuthToken()

        return {
          success: true,
          message: '登出成功',
        }
      }
      catch (error) {
        // 即使 API 调用失败，也要清除本地状态
        this.clearUserData()
        this.clearAuthToken()

        this.error = error instanceof Error ? error.message : '登出失败'
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
     * 获取用户信息
     */
    async fetchUserInfo(): Promise<ActionResult> {
      if (!this.token) {
        return { success: false, message: '未登录' }
      }

      this.loading = true
      this.error = null

      try {
        const response = await getUserInfoApi()

        if (response.code === 200) {
          this.userInfo = response.data
          this.lastActivity = Date.now()

          return {
            success: true,
            message: '获取用户信息成功',
            data: response.data,
          }
        }
        else {
          throw new Error(response.message || '获取用户信息失败')
        }
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : '获取用户信息失败'

        // 如果是认证错误，清除登录状态
        if (this.isAuthError(error)) {
          await this.logout()
        }

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
      if (!this.token || !this.userInfo) {
        return { success: false, message: '未登录' }
      }

      this.loading = true
      this.error = null

      try {
        const response = await updateUserInfoApi(userInfo)

        if (response.code === 200) {
          this.userInfo = { ...this.userInfo, ...response.data }
          this.lastActivity = Date.now()

          return {
            success: true,
            message: '更新用户信息成功',
            data: response.data,
          }
        }
        else {
          throw new Error(response.message || '更新用户信息失败')
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
     * 刷新 token
     */
    async refreshToken(): Promise<ActionResult> {
      if (!this.token) {
        return { success: false, message: '未登录' }
      }

      try {
        const response = await refreshTokenApi()

        if (response.code === 200) {
          this.token = response.data.token
          this.lastActivity = Date.now()
          this.setAuthToken(response.data.token)

          return {
            success: true,
            message: 'Token 刷新成功',
            data: response.data,
          }
        }
        else {
          throw new Error(response.message || 'Token 刷新失败')
        }
      }
      catch (error) {
        // Token 刷新失败，清除登录状态
        await this.logout()
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Token 刷新失败',
        }
      }
    },

    /**
     * 从本地存储恢复登录状态
     */
    async restoreFromStorage(): Promise<boolean> {
      try {
        // 验证 token 是否仍然有效
        if (this.token && this.userInfo) {
          const result = await this.fetchUserInfo()
          return result.success
        }
      }
      catch (error) {
        console.warn('Failed to restore user session:', error)
      }

      return false
    },

    /**
     * 更新活动时间
     */
    updateActivity() {
      this.lastActivity = Date.now()
    },

    /**
     * 清除用户数据
     */
    clearUserData() {
      this.userInfo = null
      this.token = null
      this.isLoggedIn = false
      this.loginTime = null
      this.lastActivity = null
    },

    /**
     * 设置 axios 认证 token
     */
    setAuthToken(token: string) {
      // 这里需要根据实际的 axios 配置来设置
      // 假设在 request.ts 中有设置默认 headers 的方法
      if (typeof window !== 'undefined' && window.axios) {
        window.axios.defaults.headers.common.Authorization = `Bearer ${token}`
      }
    },

    /**
     * 清除 axios 认证 token
     */
    clearAuthToken() {
      if (typeof window !== 'undefined' && window.axios) {
        delete window.axios.defaults.headers.common.Authorization
      }
    },

    /**
     * 判断是否为认证错误
     */
    isAuthError(error: any): boolean {
      return error?.response?.status === 401
        || error?.message?.includes('Unauthorized')
        || error?.message?.includes('Token')
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
