<script setup lang="ts">
import { h } from 'vue'

interface Props {
  /** 标题 */
  title: string
  /** 数值 */
  value: string | number
  /** 趋势（上升/下降） */
  trend?: 'up' | 'down' | 'neutral'
  /** 趋势值 */
  trendValue?: string
  /** 图标 */
  icon?: any
  /** 卡片颜色主题 */
  theme?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** 是否显示图标 */
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  trend: 'neutral',
  theme: 'primary',
  showIcon: true,
})

// 主题颜色映射
const themeColors = {
  primary: {
    bg: 'var(--color-primary-light)',
    icon: 'var(--color-primary)',
    text: 'var(--color-primary)',
  },
  success: {
    bg: 'var(--color-success-light)',
    icon: 'var(--color-success)',
    text: 'var(--color-success)',
  },
  warning: {
    bg: 'var(--color-warning-light)',
    icon: 'var(--color-warning)',
    text: 'var(--color-warning)',
  },
  error: {
    bg: 'var(--color-error-light)',
    icon: 'var(--color-error)',
    text: 'var(--color-error)',
  },
  info: {
    bg: 'var(--color-info-light)',
    icon: 'var(--color-info)',
    text: 'var(--color-info)',
  },
}

const currentTheme = computed(() => themeColors[props.theme])

// 默认图标
function defaultIcon() {
  return h('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'width': '24',
    'height': '24',
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    h('line', { x1: '12', y1: '1', x2: '12', y2: '23' }),
    h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }),
  ])
}
</script>

<template>
  <div class="stat-card" :class="`stat-card--${theme}`">
    <div class="stat-card-header">
      <div v-if="showIcon && icon" class="stat-card-icon" :style="{ backgroundColor: currentTheme.bg, color: currentTheme.icon }">
        <component :is="icon" />
      </div>
      <div v-else-if="showIcon" class="stat-card-icon" :style="{ backgroundColor: currentTheme.bg, color: currentTheme.icon }">
        <component :is="defaultIcon" />
      </div>
      <div class="stat-card-content">
        <div class="stat-card-title">
          {{ title }}
        </div>
        <div class="stat-card-value">
          {{ value }}
        </div>
        <div v-if="trend !== 'neutral' && trendValue" class="stat-card-trend" :class="`stat-card-trend--${trend}`">
          <n-icon v-if="trend === 'up'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </n-icon>
          <n-icon v-else-if="trend === 'down'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          </n-icon>
          <span>{{ trendValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.stat-card {
  background: map.get($colors, surface);
  border-radius: map.get($border-radius, md); // 8px
  border: 1px solid map.get($colors, border);
  padding: map.get($spacings, 6); // 24px
  transition: all map.get($transitions, base);
  box-shadow: map.get($shadows, base);

  &:hover {
    box-shadow: map.get($shadows, md);
    transform: translateY(-2px);
  }
}

.stat-card-header {
  display: flex;
  align-items: flex-start;
  gap: map.get($spacings, 4); // 16px
}

.stat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: map.get($border-radius, base); // 6px
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card-content {
  flex: 1;
  min-width: 0;
}

.stat-card-title {
  font-size: map.get($font-sizes, sm); // 14px
  color: map.get($colors, text-secondary);
  margin-bottom: map.get($spacings, 2); // 8px
  line-height: 1.5;
}

.stat-card-value {
  font-size: map.get($font-sizes, 2xl); // 24px
  font-weight: map.get($font-weights, semibold);
  color: map.get($colors, text-primary);
  line-height: 1.2;
  margin-bottom: map.get($spacings, 2); // 8px
}

.stat-card-trend {
  display: inline-flex;
  align-items: center;
  gap: map.get($spacings, 1); // 4px
  font-size: map.get($font-sizes, sm); // 14px
  font-weight: map.get($font-weights, medium);
  padding: 2px 8px;
  border-radius: map.get($border-radius, sm); // 4px

  &--up {
    color: map.get($colors, success);
    background: map.get($colors, success-light);
  }

  &--down {
    color: map.get($colors, error);
    background: map.get($colors, error-light);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .stat-card {
    padding: map.get($spacings, 4); // 16px
  }

  .stat-card-value {
    font-size: map.get($font-sizes, xl); // 20px
  }
}
</style>
