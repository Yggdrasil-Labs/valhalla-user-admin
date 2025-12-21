<script setup lang="ts">
import { useUserStore } from '@/stores'

const userStore = useUserStore()
</script>

<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>Valhalla User Admin</h1>
        </div>
        <div class="nav-actions">
          <LanguageSwitcher />
          <div v-if="userStore.userInfo" class="user-info">
            <span class="user-name">{{ userStore.displayName }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <section class="main-section">
      <div class="main-content">
        <div class="welcome-section">
          <h1 class="welcome-title">
            欢迎来到 Valhalla User Admin
          </h1>
          <p class="welcome-subtitle">
            用户管理后台系统
          </p>
          <div v-if="userStore.userInfo" class="user-welcome">
            <p class="welcome-message body-text">
              欢迎，{{ userStore.displayName }}！
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/base/variables' as *;

.home-page {
  height: 100vh;
  background: map.get($colors, white);
  position: relative;
  overflow: hidden; // 防止整个页面产生滚动条
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(map.get($colors, white), 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid map.get($colors, gray-200);
  padding: map.get($spacings, 4) 0; // 16px
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 map.get($spacings, 8); // 32px
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  margin: 0;
  font-size: map.get($font-sizes, 2xl); // 24px
  font-weight: 600;
  color: map.get($colors, gray-900);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: map.get($spacings, 4); // 16px
}

.user-info {
  display: flex;
  align-items: center;
  gap: map.get($spacings, 2); // 8px
}

.user-name {
  font-weight: 500;
  color: map.get($colors, gray-700);
}

// 主要内容区域
.main-section {
  padding: map.get($spacings, 16) map.get($spacings, 8) map.get($spacings, 8); // 160px, 32px, 64px
  height: calc(100vh - 64px); // 减去导航栏高度，避免滚动条
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; // 防止内容溢出产生滚动条
}

.main-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.welcome-section {
  color: map.get($colors, gray-800);
}

.welcome-title {
  font-size: map.get($font-sizes, 3xl); // 30px
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: map.get($spacings, 4); // 16px
  color: map.get($colors, gray-900);
}

.welcome-subtitle {
  font-size: map.get($font-sizes, xl); // 20px
  color: map.get($colors, gray-600);
  margin-bottom: map.get($spacings, 8); // 32px
  line-height: 1.6;
}

.body-text {
  font-size: map.get($font-sizes, sm); // 14px
  line-height: 1.5;
  color: map.get($colors, gray-700);
}

.user-welcome {
  margin-top: map.get($spacings, 8); // 32px
}

.welcome-message {
  font-size: map.get($font-sizes, sm); // 14px
  color: map.get($colors, gray-700);
}

// 响应式设计
@media (max-width: 768px) {
  .main-section {
    padding: map.get($spacings, 12) map.get($spacings, 8) map.get($spacings, 8); // 128px, 32px, 32px
  }

  .welcome-title {
    font-size: map.get($font-sizes, 2xl); // 24px
  }

  .welcome-subtitle {
    font-size: map.get($font-sizes, base); // 16px
  }

  .nav-container {
    padding: 0 map.get($spacings, 4); // 16px
  }

  .nav-brand h1 {
    font-size: map.get($font-sizes, xl); // 20px
  }
}
</style>
