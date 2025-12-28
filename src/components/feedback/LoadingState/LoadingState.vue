<script setup lang="ts">
interface Props {
  /** 加载文本 */
  text?: string
  /** 加载类型：spinner | skeleton */
  type?: 'spinner' | 'skeleton'
  /** 骨架屏行数（type=skeleton时） */
  rows?: number
  /** 骨架屏列数（type=skeleton时） */
  cols?: number
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  type: 'skeleton',
  rows: 5,
  cols: 1,
})
</script>

<template>
  <div class="loading-state">
    <div v-if="type === 'spinner'" class="loading-spinner">
      <n-spin size="large" />
      <p v-if="text" class="loading-text">
        {{ text }}
      </p>
    </div>
    <div v-else class="loading-skeleton">
      <n-skeleton
        v-for="i in rows"
        :key="i"
        :text="cols === 1"
        :round="false"
        :height="20"
        :style="{ marginBottom: i < rows ? '12px' : '0' }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: map.get($spacings, 12); // 48px
  min-height: 300px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: map.get($spacings, 4); // 16px
}

.loading-text {
  margin: 0;
  font-size: map.get($font-sizes, sm); // 14px
  color: map.get($colors, text-secondary);
}

.loading-skeleton {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
}

// 响应式设计
@media (max-width: 768px) {
  .loading-state {
    padding: map.get($spacings, 8); // 32px
    min-height: 200px;
  }
}
</style>
