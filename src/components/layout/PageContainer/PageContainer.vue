<script setup lang="ts">
interface Props {
  /** 页面标题 */
  title?: string
  /** 是否显示背景 */
  showBackground?: boolean
  /** 自定义类名 */
  customClass?: string
  /** 内容内边距 */
  padding?: string | number
}

withDefaults(defineProps<Props>(), {
  showBackground: true,
  padding: 24,
})
</script>

<template>
  <div
    class="page-container"
    :class="[customClass, { 'no-background': !showBackground }]"
  >
    <slot name="header" />
    <div class="page-container-content" :style="{ padding: typeof padding === 'number' ? `${padding}px` : padding }">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.page-container {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 64px);
  background: map.get($colors, background);
  transition: background map.get($transitions, base);
  display: flex;
  flex-direction: column;

  &.no-background {
    background: transparent;
  }
}

.page-container-content {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; // 允许 flex 子元素收缩
  padding-bottom: map.get($spacings, 6); // 24px - 底部保留空隙
}

// 响应式设计
@media (max-width: 768px) {
  .page-container-content {
    padding: map.get($spacings, 4) !important; // 16px
  }
}
</style>
