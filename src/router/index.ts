import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } //Protected route
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//Global Route Guard using localStorage (no Pinia timing issues)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }
  if (to.path === '/login' && token) {
    //Already logged in — redirect away from login page
    return next('/dashboard')
  }

  next()
})

export default router