<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'

const sidebarRef = ref<InstanceType<typeof Sidebar> | null>(null)
const sidebarWidth = ref(240)

// 监听侧边栏宽度变化
onMounted(() => {
  if (sidebarRef.value) {
    // 使用 watch 监听 sidebarWidth 的变化
    watch(() => sidebarRef.value?.sidebarWidth, (newWidth) => {
      if (newWidth !== undefined) {
        sidebarWidth.value = newWidth
      }
    }, { immediate: true })
  }
})
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <div class="app">
          <Navbar />
          <div class="app-layout">
            <Sidebar ref="sidebarRef" />
            <main class="app-main" :style="{ 'margin-left': `${sidebarWidth}px`, '--sidebar-width': `${sidebarWidth}px` }">
              <RouterView />
            </main>
          </div>
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.app {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  background-color: map.get($colors, white);
  overflow-x: hidden; // 防止水平滚动
}

.app-layout {
  display: flex;
  padding-top: 64px; // 为固定导航栏留出空间
  min-height: calc(100vh - 64px);
  width: 100%;
  overflow-x: hidden; // 防止水平滚动
}

.app-main {
  flex: 1;
  padding: 0;
  height: calc(100vh - 64px);
  transition: margin-left 0.3s ease;
  width: calc(100vw - var(--sidebar-width, 240px));
  max-width: calc(100vw - var(--sidebar-width, 240px));
  overflow-x: hidden; // 防止内容溢出导致水平滚动
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

// 响应式设计
@media (max-width: 768px) {
  .app-main {
    padding: 0;
    width: calc(100vw - var(--sidebar-width, 64px));
    max-width: calc(100vw - var(--sidebar-width, 64px));
  }
}
</style>
