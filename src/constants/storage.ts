/**
 * 本地存储键名常量
 * 统一管理应用中使用的 localStorage/sessionStorage 键名
 */

export const STORAGE_KEYS = {
  /** 应用语言设置 */
  LOCALE: 'locale',
  /** 用户偏好设置 */
  USER_PREFERENCES: 'user-preferences',
  /** 主题设置 */
  THEME: 'theme',
  /** 用户认证信息 */
  AUTH_TOKEN: 'auth-token',
} as const

// 导出类型，方便 TypeScript 类型检查
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
