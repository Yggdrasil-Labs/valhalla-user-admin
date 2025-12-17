/**
 * Pinia Store 入口文件
 * 统一导出所有 Store 模块
 */

export { useUserStore } from './user'

// 导出类型
export type * from '@/types/store'
