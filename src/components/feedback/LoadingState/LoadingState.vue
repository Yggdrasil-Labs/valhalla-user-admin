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
  type: 'spinner',
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
      <div
        v-for="i in rows"
        :key="i"
        class="skeleton-row"
      >
        <div
          v-for="j in cols"
          :key="j"
          class="skeleton-item"
          :style="{ width: j === cols && cols > 1 ? '60%' : '100%' }"
        />
      </div>
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
  gap: map.get($spacings, 3); // 12px
}

.skeleton-row {
  display: flex;
  gap: map.get($spacings, 3); // 12px
  align-items: center;
}

.skeleton-item {
  height: 20px;
  background: linear-gradient(
    90deg,
    map.get($colors, gray-200) 25%,
    map.get($colors, gray-100) 50%,
    map.get($colors, gray-200) 75%
  );
  background-size: 200% 100%;
  border-radius: map.get($border-radius, base); // 6px
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .loading-state {
    padding: map.get($spacings, 8); // 32px
    min-height: 200px;
  }
}
</style>
