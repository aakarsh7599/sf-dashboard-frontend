import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './axios'
import { useAuthStore } from './store/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

//Restore token from localStorage before using router
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  const authStore = useAuthStore()
  authStore.setToken(token)
}

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})