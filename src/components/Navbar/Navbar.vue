<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- 左侧：品牌/标题 -->
      <div class="navbar-brand">
        <h1 class="brand-title">
          Valhalla User Admin
        </h1>
      </div>

      <!-- 右侧：操作按钮组 -->
      <div class="navbar-actions">
        <!-- 国际化切换 -->
        <div class="action-item">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(map.get($colors, white), 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid map.get($colors, gray-200);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px; // 1.5rem = 24px
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  flex: 0 0 auto;

  .brand-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: map.get($colors, gray-800);
    transition: color 0.3s ease;
  }
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: map.get($spacings, 2); // 8px (0.5rem)
  flex: 0 0 auto;
}

.action-item {
  display: flex;
  align-items: center;
}
// 响应式设计
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 map.get($spacings, 4); // 16px (1rem)
  }

  .brand-title {
    font-size: map.get($font-sizes, base); // 16px (1rem) - 保留 rem 便于整体缩放
  }

  .navbar-actions {
    gap: map.get($spacings, 1); // 4px (0.25rem)
  }
}
</style>
