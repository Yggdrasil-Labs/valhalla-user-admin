<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { useLocalStorage } from '@vueuse/core'
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nHelper } from '@/composables/useI18n'

const { t } = useI18nHelper()
const router = useRouter()

// 折叠状态 - 使用 localStorage 持久化
const collapsed = useLocalStorage('sidebar-collapsed', false)

// 菜单选项配置
const menuOptions = computed<MenuOption[]>(() => [
  {
    label: () => t('navigation.home'),
    key: '/',
    icon: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }, [
      h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' }),
    ]),
  },
  {
    label: () => t('navigation.userManagement'),
    key: '/user',
    icon: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
    ]),
  },
  {
    label: () => t('navigation.roleManagement'),
    key: '/role',
    icon: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }, [
      h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
    ]),
  },
  {
    label: () => t('navigation.permissionManagement'),
    key: '/permission',
    icon: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }, [
      h('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
      h('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }),
    ]),
  },
  {
    label: () => t('navigation.apiManagement'),
    key: '/api',
    icon: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }, [
      h('polyline', { points: '16 18 22 12 16 6' }),
      h('polyline', { points: '8 6 2 12 8 18' }),
    ]),
  },
])

// 当前选中的菜单项
const activeKey = computed(() => router.currentRoute.value.path)

// 处理菜单选择
function handleMenuSelect(key: string) {
  router.push(key)
}

// 切换折叠状态
function toggleCollapse() {
  collapsed.value = !collapsed.value
}

// 侧边栏宽度
const sidebarWidth = computed(() => collapsed.value ? 64 : 240)

// 暴露折叠状态和宽度给父组件
defineExpose({
  collapsed,
  sidebarWidth,
})
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }" :style="{ width: `${sidebarWidth}px` }">
    <div class="sidebar-header">
      <n-button
        quaternary
        circle
        class="collapse-button"
        @click="toggleCollapse"
      >
        <template #icon>
          <svg
            v-if="collapsed"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </template>
      </n-button>
    </div>
    <n-menu
      :value="activeKey"
      :options="menuOptions"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      @update:value="handleMenuSelect"
    />
  </aside>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.sidebar {
  position: fixed;
  left: 0;
  top: 64px; // 导航栏高度
  bottom: 0;
  width: 240px;
  background: map.get($colors, surface);
  border-right: 1px solid map.get($colors, border);
  box-shadow: map.get($shadows, sm);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: map.get($z-indexes, sticky);
  transition: width map.get($transitions, base);
  display: flex;
  flex-direction: column;

  &.collapsed {
    width: 64px;
  }

  .sidebar-header {
    padding: map.get($spacings, 3); // 12px
    border-bottom: 1px solid map.get($colors, border);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 56px;
    flex-shrink: 0;

    .collapse-button {
      width: 32px;
      height: 32px;
      transition: all map.get($transitions, fast);

      &:hover {
        background: map.get($colors, gray-100);
      }
    }
  }

  &.collapsed .sidebar-header {
    justify-content: center;
  }

  :deep(.n-menu) {
    flex: 1;
    border-right: none;
    overflow-y: auto;
    padding: map.get($spacings, 2); // 8px

    .n-menu-item {
      border-radius: map.get($border-radius, base); // 6px
      margin-bottom: map.get($spacings, 1); // 4px
      transition: all map.get($transitions, fast);

      &:hover {
        background: map.get($colors, gray-100);
      }

      &.n-menu-item--selected {
        background: map.get($colors, primary-light);
        color: map.get($colors, primary);
        font-weight: map.get($font-weights, semibold);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar {
    width: 200px;

    &.collapsed {
      width: 64px;
    }
  }
}
</style>
