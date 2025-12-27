<script setup lang="ts">
import { h } from 'vue'

interface Props {
  /** 空状态图标 */
  icon?: string | any
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 操作按钮文本 */
  actionText?: string
  /** 是否显示操作按钮 */
  showAction?: boolean
  /** 自定义图标大小 */
  iconSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '暂无数据',
  description: '当前没有数据',
  showAction: true,
  iconSize: 64,
})

const emit = defineEmits<{
  action: []
}>()

// 默认图标
function defaultIcon() {
  return h('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'width': props.iconSize,
    'height': props.iconSize,
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    h('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
    h('polyline', { points: '3.27 6.96 12 12.01 20.73 6.96' }),
    h('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' }),
  ])
}

function handleAction() {
  emit('action')
}
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <component :is="icon || defaultIcon" />
    </div>
    <h3 class="empty-state-title">
      {{ title }}
    </h3>
    <p v-if="description" class="empty-state-description">
      {{ description }}
    </p>
    <div v-if="showAction && actionText" class="empty-state-action">
      <n-button type="primary" @click="handleAction">
        {{ actionText }}
      </n-button>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: map.get($spacings, 12); // 48px
  text-align: center;
  min-height: 300px;
}

.empty-state-icon {
  color: map.get($colors, gray-400);
  margin-bottom: map.get($spacings, 4); // 16px
  opacity: 0.6;
}

.empty-state-title {
  margin: 0;
  font-size: map.get($font-sizes, xl); // 20px
  font-weight: map.get($font-weights, semibold);
  line-height: 1.3;
  color: map.get($colors, text-primary);
  margin-bottom: map.get($spacings, 2); // 8px
}

.empty-state-description {
  margin: 0;
  font-size: map.get($font-sizes, sm); // 14px
  line-height: 1.5;
  color: map.get($colors, text-secondary);
  margin-bottom: map.get($spacings, 6); // 24px
  max-width: 400px;
}

.empty-state-action {
  margin-top: map.get($spacings, 2); // 8px
}

// 响应式设计
@media (max-width: 768px) {
  .empty-state {
    padding: map.get($spacings, 8); // 32px
    min-height: 200px;
  }

  .empty-state-title {
    font-size: map.get($font-sizes, lg); // 18px
  }
}
</style>
