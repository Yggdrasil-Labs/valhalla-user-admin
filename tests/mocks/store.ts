import { vi } from 'vitest'

/**
 * 用户 Store Mock
 */
export const mockUserStore = {
  // 状态
  loading: false,
  error: null,
  userInfo: null,

  // Getters
  displayName: '测试用户',
  avatar: '/default-avatar.png',
  roles: ['user'],
  permissions: ['read'],
  hasRole: vi.fn().mockReturnValue(false),
  hasPermission: vi.fn().mockReturnValue(false),

  // Actions
  fetchUserInfo: vi.fn().mockResolvedValue({
    success: true,
    message: '获取用户信息成功',
    data: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['read'],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
  }),
  updateUserInfo: vi.fn().mockResolvedValue({
    success: true,
    message: '更新用户信息成功',
    data: {},
  }),
  setError: vi.fn(),
  clearError: vi.fn(),
}

/**
 * 创建已登录状态的用户 Store Mock
 */
export const mockLoggedInUserStore = {
  ...mockUserStore,
  userInfo: {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    roles: ['admin', 'user'],
    permissions: ['read', 'write'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  displayName: 'testuser',
  roles: ['admin', 'user'],
  permissions: ['read', 'write'],
  hasRole: vi.fn().mockImplementation((role: string) => {
    return ['admin', 'user'].includes(role)
  }),
  hasPermission: vi.fn().mockImplementation((permission: string) => {
    return ['read', 'write'].includes(permission)
  }),
}
