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
            欢迎来到 <span class="gradient-text">Valhalla User Admin</span>
          </h1>
          <p class="welcome-subtitle">
            用户管理后台系统
          </p>
          <div v-if="userStore.userInfo" class="user-welcome">
            <p class="welcome-message">
              欢迎，{{ userStore.displayName }}！
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name {
  font-weight: 500;
  color: #374151;
}

// 主要内容区域
.main-section {
  padding: 10rem 2rem 4rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.welcome-section {
  color: white;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.gradient-text {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.user-welcome {
  margin-top: 2rem;
}

.welcome-message {
  font-size: 1.1rem;
  opacity: 0.95;
}

// 响应式设计
@media (max-width: 768px) {
  .main-section {
    padding: 8rem 2rem 2rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .nav-container {
    padding: 0 1rem;
  }

  .nav-brand h1 {
    font-size: 1.25rem;
  }
}
</style>
