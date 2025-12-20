<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { useI18nHelper } from '@/composables/useI18n'

interface FormField {
  /** 字段 key */
  key: string
  /** 字段标签 */
  label: string
  /** 字段类型 */
  type?: 'input' | 'textarea' | 'select' | 'number' | 'switch' | 'date'
  /** 占位符 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 选项（用于 select 类型） */
  options?: Array<{
    label: string
    value: any
  }>
  /** 验证规则 */
  rule?: (value: any) => boolean | string
  /** 是否禁用 */
  disabled?: boolean
}

interface Props {
  /** 是否显示对话框 */
  visible: boolean
  /** 对话框标题 */
  title: string
  /** 表单字段配置 */
  fields: FormField[]
  /** 表单初始值 */
  initialValues?: Record<string, any>
  /** 是否加载中 */
  loading?: boolean
  /** 提交按钮文本 */
  submitText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 表单宽度 */
  width?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitText: '',
  cancelText: '',
  width: 600,
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'submit': [values: Record<string, any>]
  'cancel': []
}>()

const { t } = useI18nHelper()

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单数据
const formData = ref<Record<string, any>>({})

// 表单验证规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  props.fields.forEach((field) => {
    if (field.required || field.rule) {
      const fieldRules: FormItemRule[] = []
      if (field.required) {
        fieldRules.push({
          required: true,
          message: t('form.validation.required'),
          trigger: ['input', 'blur'],
        })
      }
      if (field.rule) {
        fieldRules.push({
          validator: (_rule: any, value: any) => {
            const result = field.rule!(value)
            if (typeof result === 'string') {
              return new Error(result)
            }
            return result
          },
          trigger: ['input', 'blur'],
        })
      }
      rules[field.key] = fieldRules
    }
  })
  return rules
})

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emit('update:visible', value)
  },
})

// 初始化表单数据
watch(() => props.visible, (visible) => {
  if (visible) {
    // 重置表单数据
    formData.value = props.initialValues ? { ...props.initialValues } : {}
    // 重置表单验证状态
    nextTick(() => {
      formRef.value?.restoreValidation()
    })
  }
})

// 处理提交
async function handleSubmit() {
  if (!formRef.value) {
    return
  }

  try {
    await formRef.value.validate()
    emit('submit', { ...formData.value })
  }
  catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理取消
function handleCancel() {
  dialogVisible.value = false
  emit('cancel')
}
</script>

<template>
  <n-modal
    v-model:show="dialogVisible"
    :title="title"
    :width="width"
    preset="dialog"
    :mask-closable="false"
    :close-on-esc="true"
  >
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      label-width="100px"
    >
      <template v-for="field in fields" :key="field.key">
        <n-form-item
          :path="field.key"
          :label="field.label"
        >
          <n-input
            v-if="field.type === 'input' || !field.type"
            v-model:value="formData[field.key]"
            :placeholder="field.placeholder || t('form.placeholder.pleaseEnter')"
            :disabled="field.disabled"
          />
          <n-input
            v-else-if="field.type === 'textarea'"
            v-model:value="formData[field.key]"
            type="textarea"
            :rows="3"
            :placeholder="field.placeholder || t('form.placeholder.pleaseEnter')"
            :disabled="field.disabled"
          />
          <n-select
            v-else-if="field.type === 'select'"
            v-model:value="formData[field.key]"
            :placeholder="field.placeholder || t('form.placeholder.pleaseSelect')"
            :options="field.options || []"
            :disabled="field.disabled"
          />
          <n-input-number
            v-else-if="field.type === 'number'"
            v-model:value="formData[field.key]"
            :placeholder="field.placeholder || t('form.placeholder.pleaseEnter')"
            :disabled="field.disabled"
            style="width: 100%"
          />
          <n-switch
            v-else-if="field.type === 'switch'"
            v-model:value="formData[field.key]"
            :disabled="field.disabled"
          />
        </n-form-item>
      </template>
    </n-form>

    <template #action>
      <n-space>
        <n-button
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText || t('button.cancel') }}
        </n-button>
        <n-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ submitText || t('button.submit') }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped lang="scss">
// 表单样式由 Naive UI 提供
</style>
