import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由后置守卫
router.afterEach((to) => {
  // 更新页面标题
  const title = to.meta.title
  if (title && typeof title === 'string') {
    document.title = `${title} - Valhalla User Admin`
  }
})

export default router
