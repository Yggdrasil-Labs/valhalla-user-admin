<script setup lang="ts">
interface StatusConfig {
  label: string
  type: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

interface Props {
  /** 状态值 */
  status: string | number
  /** 状态映射配置 */
  statusMap?: Record<string | number, StatusConfig>
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 是否显示边框 */
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  bordered: false,
})

// 默认状态映射
const defaultStatusMap: Record<string, StatusConfig> = {
  1: { label: '启用', type: 'success' },
  0: { label: '禁用', type: 'error' },
  true: { label: '是', type: 'success' },
  false: { label: '否', type: 'default' },
  active: { label: '活跃', type: 'success' },
  inactive: { label: '非活跃', type: 'default' },
}

const statusConfig = computed(() => {
  const map = props.statusMap || defaultStatusMap
  const key = String(props.status)
  return map[key] || { label: String(props.status), type: 'default' as const }
})

// 尺寸映射
const sizeMap = {
  small: {
    height: '20px',
    padding: '0 8px',
    fontSize: '11px',
  },
  medium: {
    height: '24px',
    padding: '0 10px',
    fontSize: '12px',
  },
  large: {
    height: '28px',
    padding: '0 12px',
    fontSize: '14px',
  },
}

const currentSize = computed(() => sizeMap[props.size])

// 类型颜色映射
const typeColors = {
  default: {
    bg: 'var(--color-gray-100)',
    text: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
  },
  primary: {
    bg: 'var(--color-primary-light)',
    text: 'var(--color-primary)',
    border: 'var(--color-primary)',
  },
  success: {
    bg: 'var(--color-success-light)',
    text: 'var(--color-success)',
    border: 'var(--color-success)',
  },
  warning: {
    bg: 'var(--color-warning-light)',
    text: 'var(--color-warning)',
    border: 'var(--color-warning)',
  },
  error: {
    bg: 'var(--color-error-light)',
    text: 'var(--color-error)',
    border: 'var(--color-error)',
  },
}

const currentColors = computed(() => typeColors[statusConfig.value.type])
</script>

<template>
  <span
    class="status-badge"
    :class="[
      `status-badge--${statusConfig.type}`,
      `status-badge--${size}`,
      { 'status-badge--bordered': bordered },
    ]"
    :style="{
      height: currentSize.height,
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      backgroundColor: currentColors.bg,
      color: currentColors.text,
      borderColor: bordered ? currentColors.border : 'transparent',
    }"
  >
    {{ statusConfig.label }}
  </span>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: map.get($border-radius, sm); // 4px
  font-weight: map.get($font-weights, medium);
  line-height: 1;
  white-space: nowrap;
  transition: all map.get($transitions, fast);
  border: 1px solid transparent;

  &--bordered {
    border-width: 1px;
    border-style: solid;
  }
}
</style>
