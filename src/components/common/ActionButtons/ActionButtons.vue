<script setup lang="ts">
interface ActionConfig {
  key: string
  label: string
  type?: 'primary' | 'default' | 'error' | 'warning' | 'info'
  icon?: any
  disabled?: boolean
  show?: boolean | ((row: any) => boolean)
}

interface Props {
  /** 操作按钮配置 */
  actions: ActionConfig[]
  /** 当前行数据 */
  row: any
  /** 按钮尺寸 */
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'small',
})

const emit = defineEmits<{
  action: [{ key: string, row: any }]
}>()

const visibleActions = computed(() => {
  return props.actions.filter((action) => {
    if (action.show === false) {
      return false
    }
    if (typeof action.show === 'function') {
      return action.show(props.row)
    }
    return true
  })
})

function handleAction(key: string) {
  emit('action', { key, row: props.row })
}
</script>

<template>
  <div class="action-buttons">
    <n-button
      v-for="action in visibleActions"
      :key="action.key"
      :type="action.type || 'default'"
      :size="size"
      :disabled="action.disabled"
      @click="handleAction(action.key)"
    >
      <template v-if="action.icon" #icon>
        <n-icon>
          <component :is="action.icon" />
        </n-icon>
      </template>
      {{ action.label }}
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.action-buttons {
  display: flex;
  gap: map.get($spacings, 2); // 8px
  align-items: center;
  flex-wrap: wrap;

  :deep(.n-button) {
    border-radius: map.get($border-radius, base); // 6px
    transition: all map.get($transitions, fast);
    font-weight: map.get($font-weights, medium);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: map.get($shadows, sm);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: map.get($spacings, 1); // 4px

    :deep(.n-button) {
      width: 100%;
    }
  }
}
</style>
