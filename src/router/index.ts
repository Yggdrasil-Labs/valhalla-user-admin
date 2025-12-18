import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  try {
    // 更新用户活动时间
    const { useUserStore } = await import('@/stores')
    const userStore = useUserStore()
    userStore.updateActivity()

    // 检查是否需要认证
    const requiresAuth = to.meta.requiresAuth !== false
    const isLoggedIn = userStore.isLoggedIn

    console.log('Router Guard:', {
      to: to.path,
      from: from.path,
      requiresAuth,
      isLoggedIn,
      meta: to.meta,
    })

    // 如果访问登录页面且已登录，重定向到首页（但在开发环境中跳过，以便测试）
    if (to.path === '/login' && isLoggedIn && import.meta.env.PROD) {
      console.log('Redirecting logged-in user from login to home')
      next('/')
      return
    }

    // 如果需要认证但未登录，重定向到登录页面
    if (requiresAuth && !isLoggedIn && to.path !== '/login') {
      console.log('Redirecting unauthenticated user to login')
      next('/login')
      return
    }

    // 检查权限
    if (to.meta.permissions && isLoggedIn) {
      const hasPermission = userStore.hasPermission(to.meta.permissions as string)
      if (!hasPermission) {
        console.log('User lacks permission, redirecting to 403')
        next('/403')
        return
      }
    }

    console.log('Navigation allowed')
    next()
  }
  catch (error) {
    console.error('Router guard error:', error)
    // 发生错误时允许导航继续
    next()
  }
})

// 路由后置守卫
router.afterEach((to) => {
  // 更新页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Valhalla User Admin`
  }
})

export default router
