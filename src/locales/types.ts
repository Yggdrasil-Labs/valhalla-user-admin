// 从统一配置导入类型
export type { Locale } from './config'

// JSON 格式的语言包类型定义 - 更灵活的结构
export type LocaleMessageSchema = Record<string, any>

// 核心通用翻译类型 - 用于类型提示和验证
export interface CoreMessages {
  button: Record<string, string>
  status: Record<string, string>
  message: Record<string, string>
  label: Record<string, string>
  confirm: Record<string, string>
  form: {
    field: Record<string, string>
    validation: Record<string, string>
    placeholder: Record<string, string>
  }
  navigation: Record<string, string>
  user: Record<string, string>
  time: Record<string, string>
}
