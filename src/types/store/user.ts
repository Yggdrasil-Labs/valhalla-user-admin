/**
 * 用户相关类型定义
 */

// 用户信息类型
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// 用户登录信息
export interface LoginInfo {
  username: string
  password: string
  remember?: boolean
}
