import i18n from '@locales/i18n'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createAppPinia } from '@/stores/pinia'
import { initAppSettings } from '@/utils/initApp'
import '@scss/main.scss'

// 初始化应用设置
initAppSettings()

const app = createApp(App)

// 创建并注册 Pinia
const pinia = createAppPinia()
app.use(pinia)

app.use(router)
app.use(i18n)
app.mount('#app')
