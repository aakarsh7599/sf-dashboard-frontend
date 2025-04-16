import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

// ✅ Interceptor grabs token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('🔐 Token attached from localStorage:', token)
  } else {
    console.warn('🚫 No token found in localStorage')
  }
  return config
})

export default api