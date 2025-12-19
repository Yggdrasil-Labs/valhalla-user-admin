<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { useI18nHelper } from '@/composables/useI18n'

interface Props {
  /** 当前状态值 */
  value: boolean | number
  /** 启用时的值 */
  activeValue?: boolean | number
  /** 禁用时的值 */
  inactiveValue?: boolean | number
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 切换前确认提示 */
  confirmBeforeToggle?: boolean
  /** 确认对话框标题 */
  confirmTitle?: string
  /** 确认对话框内容 */
  confirmContent?: string
  /** 切换成功提示 */
  successMessage?: string
  /** 切换失败提示 */
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeValue: true,
  inactiveValue: false,
  loading: false,
  disabled: false,
  confirmBeforeToggle: true,
  confirmTitle: '',
  confirmContent: '',
  successMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  'update:value': [value: boolean | number]
  'change': [value: boolean | number]
  'toggle': [value: boolean | number]
}>()

const { t } = useI18nHelper()
const dialog = useDialog()

// 当前状态
const currentValue = computed({
  get: () => props.value,
  set: (value: boolean | number) => {
    emit('update:value', value)
    emit('change', value)
  },
})

// 是否处于激活状态
const isActive = computed(() => {
  return props.value === props.activeValue
})

// 处理切换
async function handleToggle() {
  if (props.disabled || props.loading) {
    return
  }

  // 切换前确认
  if (props.confirmBeforeToggle) {
    const confirmed = await new Promise<boolean>((resolve) => {
      dialog.warning({
        title: props.confirmTitle || t('confirm.resetConfirm'),
        content: props.confirmContent || (isActive.value
          ? '确定要禁用吗？'
          : '确定要启用吗？'),
        positiveText: t('button.confirm'),
        negativeText: t('button.cancel'),
        onPositiveClick: () => {
          resolve(true)
        },
        onNegativeClick: () => {
          resolve(false)
        },
      })
    })

    if (!confirmed) {
      return
    }
  }

  // 切换状态
  const newValue = isActive.value ? props.inactiveValue : props.activeValue
  currentValue.value = newValue
  emit('toggle', newValue)
}
</script>

<template>
  <n-switch
    :value="isActive"
    :loading="loading"
    :disabled="disabled"
    @update:value="handleToggle"
  />
</template>

<style scoped lang="scss">
// 样式由 Naive UI 提供
</style>
