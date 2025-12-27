<script setup lang="ts">
interface Props {
  /** 标题 */
  title?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示阴影 */
  shadow?: boolean
  /** 内边距 */
  padding?: string | number
  /** 自定义类名 */
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  bordered: true,
  shadow: true,
  padding: 24,
})
</script>

<template>
  <div
    class="card"
    :class="[
      customClass,
      {
        'card-bordered': bordered,
        'card-shadow': shadow,
        'card-no-shadow': !shadow,
      },
    ]"
  >
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">
          {{ title }}
        </h3>
      </slot>
    </div>
    <div class="card-body" :style="{ padding: typeof padding === 'number' ? `${padding}px` : padding }">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.card {
  background: map.get($colors, surface);
  border-radius: map.get($border-radius, md); // 8px
  transition: all map.get($transitions, base);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; // 允许 flex 子元素收缩

  &.card-bordered {
    border: 1px solid map.get($colors, border);
  }

  &.card-shadow {
    box-shadow: map.get($shadows, base);

    &:hover {
      box-shadow: map.get($shadows, md);
    }
  }

  &.card-no-shadow {
    box-shadow: none;
  }
}

.card-header {
  padding: map.get($spacings, 6) map.get($spacings, 6) map.get($spacings, 4); // 24px 24px 16px
  border-bottom: 1px solid map.get($colors, border);
}

.card-title {
  margin: 0;
  font-size: map.get($font-sizes, xl); // 20px
  font-weight: map.get($font-weights, semibold);
  line-height: 1.3;
  color: map.get($colors, text-primary);
}

.card-body {
  // padding 通过 style 动态设置
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; // 允许 flex 子元素收缩
  overflow: hidden; // 防止内容溢出
}

.card-footer {
  padding: map.get($spacings, 4) map.get($spacings, 6); // 16px 24px
  border-top: 1px solid map.get($colors, border);
  background: map.get($colors, gray-50);
}

// 响应式设计
@media (max-width: 768px) {
  .card-header {
    padding: map.get($spacings, 4); // 16px
  }

  .card-body {
    padding: map.get($spacings, 4) !important; // 16px
  }

  .card-footer {
    padding: map.get($spacings, 3) map.get($spacings, 4); // 12px 16px
  }
}
</style>
