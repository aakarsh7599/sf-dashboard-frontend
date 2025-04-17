import { defineStore } from 'pinia'
import api from '@/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    email: localStorage.getItem('email') || '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setEmail(email: string) {
      this.email = email;
      localStorage.setItem('email', email); //persist email
    },
    logout() {
      this.token = ''
      this.email = ''
      localStorage.removeItem('token')
    },
    async login(email: string, password: string) {
      try {
        const res = await api.post('/api/auth/login', { email, password });
        this.setToken(res.data.token);
        this.setEmail(email);
      } catch (err) {
        throw err
      }
    },
    async register(email: string, password: string) {
      const res = await api.post('/api/auth/register', { email, password });
      this.setToken(res.data.token);
      this.setEmail(email);
    },
  }
})