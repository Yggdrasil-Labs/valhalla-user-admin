import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserStore } from '@/stores'

// 模拟 API 模块
vi.mock('@/api/modules/user', () => ({
  getUserInfoApi: vi.fn(),
  updateUserInfoApi: vi.fn(),
}))

describe('useUserStore', () => {
  let store: any

  beforeEach(async () => {
    // 清除 localStorage 以防止持久化干扰
    localStorage.clear()

    // 创建一个不包含持久化插件的 Pinia 实例
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useUserStore()

    // 强制重置 store 状态
    store.$patch({
      userInfo: null,
      loading: false,
      error: null,
    })

    // 清除所有 mock 调用记录
    vi.clearAllMocks()
  })

  describe('用户信息 getters', () => {
    beforeEach(() => {
      // 设置用户信息用于测试 getters
      store.$patch({
        userInfo: {
          id: '1',
          username: 'testUser',
          email: 'test@example.com',
          avatar: '/avatar.jpg',
          roles: ['admin', 'user'],
          permissions: ['read', 'write'],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      })
    })

    it('应该正确计算显示名称', () => {
      expect(store.displayName).toBe('testUser')
    })

    it('应该在没有用户信息时返回默认显示名称', () => {
      store.$patch({ userInfo: null })
      expect(store.displayName).toBe('用户')
    })

    it('应该正确计算头像', () => {
      expect(store.avatar).toBe('/avatar.jpg')
    })

    it('应该在没有头像时返回默认头像', () => {
      store.$patch({ userInfo: { ...store.userInfo, avatar: undefined } })
      expect(store.avatar).toBe('/default-avatar.png')
    })

    it('应该正确计算角色', () => {
      expect(store.roles).toEqual(['admin', 'user'])
    })

    it('应该正确计算权限', () => {
      expect(store.permissions).toEqual(['read', 'write'])
    })

    it('应该正确检查角色', () => {
      expect(store.hasRole('admin')).toBe(true)
      expect(store.hasRole('guest')).toBe(false)
    })

    it('应该正确检查权限', () => {
      expect(store.hasPermission('read')).toBe(true)
      expect(store.hasPermission('delete')).toBe(false)
    })
  })

  describe('获取用户信息', () => {
    it('应该成功获取用户信息', async () => {
      const { getUserInfoApi } = await import('@/api/modules/user')
      const mockUserInfo = {
        id: '1',
        username: 'testUser',
        email: 'test@example.com',
        roles: ['user'],
        permissions: ['read'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      }

      ;(getUserInfoApi as any).mockResolvedValue({
        code: 200,
        message: '获取用户信息成功',
        data: mockUserInfo,
      })

      const result = await store.fetchUserInfo()

      expect(result.success).toBe(true)
      expect(store.userInfo).toEqual(mockUserInfo)
      expect(store.loading).toBe(false)
    })

    it('应该处理获取用户信息失败', async () => {
      const { getUserInfoApi } = await import('@/api/modules/user')
      ;(getUserInfoApi as any).mockResolvedValue({
        code: 500,
        message: '获取用户信息失败',
        data: null,
      })

      const result = await store.fetchUserInfo()

      expect(result.success).toBe(false)
      expect(store.error).toBe('获取用户信息失败')
      expect(store.loading).toBe(false)
    })
  })

  describe('更新用户信息', () => {
    beforeEach(() => {
      store.$patch({
        userInfo: {
          id: '1',
          username: 'testUser',
          email: 'test@example.com',
          roles: ['user'],
          permissions: ['read'],
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      })
    })

    it('应该成功更新用户信息', async () => {
      const { updateUserInfoApi } = await import('@/api/modules/user')
      const updatedInfo = {
        email: 'newemail@example.com',
      }

      ;(updateUserInfoApi as any).mockResolvedValue({
        code: 200,
        message: '更新用户信息成功',
        data: {
          ...store.userInfo,
          ...updatedInfo,
        },
      })

      const result = await store.updateUserInfo(updatedInfo)

      expect(result.success).toBe(true)
      expect(store.userInfo.email).toBe('newemail@example.com')
      expect(store.loading).toBe(false)
    })

    it('应该在用户信息不存在时返回错误', async () => {
      store.$patch({ userInfo: null })

      const result = await store.updateUserInfo({ email: 'new@example.com' })

      expect(result.success).toBe(false)
      expect(result.message).toBe('用户信息不存在')
    })
  })

  describe('工具方法', () => {
    it('应该正确设置和清除错误', () => {
      store.setError('测试错误')
      expect(store.error).toBe('测试错误')

      store.clearError()
      expect(store.error).toBeNull()
    })
  })
})
