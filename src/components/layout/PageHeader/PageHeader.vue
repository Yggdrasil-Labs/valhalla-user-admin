<script setup lang="ts">
interface Props {
  /** 页面标题 */
  title: string
  /** 标题描述 */
  description?: string
  /** 是否显示返回按钮 */
  showBack?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: false,
})

const emit = defineEmits<{
  back: []
}>()

function handleBack() {
  emit('back')
  // 如果没有监听 back 事件，则使用路由返回
  if (!emit) {
    const router = useRouter()
    router.back()
  }
}
</script>

<template>
  <div class="page-header">
    <div class="page-header-content">
      <div class="page-header-left">
        <n-button
          v-if="showBack"
          quaternary
          circle
          class="back-button"
          @click="handleBack"
        >
          <template #icon>
            <n-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </n-icon>
          </template>
        </n-button>
        <div class="page-header-title-group">
          <h1 class="page-title">
            {{ title }}
          </h1>
          <p v-if="description" class="page-description">
            {{ description }}
          </p>
        </div>
      </div>
      <div v-if="$slots.actions" class="page-header-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.page-header {
  background: map.get($colors, surface);
  border: 1px solid map.get($colors, border);
  border-radius: map.get($border-radius, md); // 8px - 与 Card 保持一致
  box-shadow: map.get($shadows, base); // 与 Card 保持一致
  padding: map.get($spacings, 6) map.get($spacings, 6) map.get($spacings, 4); // 24px 24px 16px
  margin-bottom: map.get($spacings, 6); // 24px
  flex-shrink: 0; // 防止被压缩
  transition: all map.get($transitions, base); // 与 Card 保持一致
}

.page-header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center; // 上下居中
  gap: map.get($spacings, 4); // 16px
}

.page-header-left {
  display: flex;
  align-items: center; // 上下居中
  gap: map.get($spacings, 3); // 12px
  flex: 1;
}

.back-button {
  flex-shrink: 0;
}

.page-header-title-group {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: map.get($font-sizes, 2xl); // 24px
  font-weight: map.get($font-weights, semibold);
  line-height: 1.2;
  color: map.get($colors, text-primary);
  margin-bottom: map.get($spacings, 1); // 4px
}

.page-description {
  margin: 0;
  font-size: map.get($font-sizes, sm); // 14px
  line-height: 1.5;
  color: map.get($colors, text-secondary);
  margin-top: map.get($spacings, 2); // 8px
}

.page-header-actions {
  display: flex;
  align-items: center; // 上下居中
  gap: map.get($spacings, 2); // 8px
  flex-shrink: 0;
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    padding: map.get($spacings, 4); // 16px
  }

  .page-header-content {
    grid-template-columns: 1fr;
    gap: map.get($spacings, 4); // 16px
  }

  .page-header-left {
    justify-self: stretch;
  }

  .page-header-actions {
    justify-self: stretch;
    justify-content: center;
  }

  .page-title {
    font-size: map.get($font-sizes, xl); // 20px
  }
}
</style>
