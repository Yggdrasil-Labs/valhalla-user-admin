<script setup lang="ts">
interface Props {
  /** 错误标题 */
  title?: string
  /** 错误描述 */
  description?: string
  /** 重试按钮文本 */
  retryText?: string
  /** 是否显示重试按钮 */
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '加载失败',
  description: '无法加载数据，请稍后重试',
  retryText: '重试',
  showRetry: true,
})

const emit = defineEmits<{
  retry: []
}>()

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <div class="error-state">
    <n-result
      status="error"
      :title="title"
      :description="description"
    >
      <template #footer>
        <n-button
          v-if="showRetry"
          type="primary"
          @click="handleRetry"
        >
          {{ retryText }}
        </n-button>
        <slot name="footer" />
      </template>
    </n-result>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: map.get($spacings, 12); // 48px
  min-height: 300px;
}

// 响应式设计
@media (max-width: 768px) {
  .error-state {
    padding: map.get($spacings, 8); // 32px
    min-height: 200px;
  }
}
</style>
