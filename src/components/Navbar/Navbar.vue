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
  z-index: map.get($z-indexes, fixed);
  height: 64px;
  background: rgba(map.get($colors, surface), 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid map.get($colors, border);
  box-shadow: map.get($shadows, sm);
  transition: all map.get($transitions, base);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 map.get($spacings, 6); // 24px
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  flex: 0 0 auto;

  .brand-title {
    margin: 0;
    font-size: map.get($font-sizes, xl); // 20px
    font-weight: map.get($font-weights, semibold);
    color: map.get($colors, text-primary);
    letter-spacing: -0.02em;
    transition: color map.get($transitions, base);
  }
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: map.get($spacings, 4); // 16px
  flex: 0 0 auto;
}

.action-item {
  display: flex;
  align-items: center;
}

// 响应式设计
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 map.get($spacings, 4); // 16px
  }

  .brand-title {
    font-size: map.get($font-sizes, base); // 16px
  }

  .navbar-actions {
    gap: map.get($spacings, 2); // 8px
  }
}
</style>
