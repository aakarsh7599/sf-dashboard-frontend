<template>
  <div class="container">
    <form class="auth-card" @submit.prevent="handleSubmit">
      <h2>{{ isLoginMode ? 'Login' : 'Register' }}</h2>

      <label>Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        required
        autofocus
      />

      <label>Password</label>
      <input
        v-model="password"
        type="password"
        placeholder="Enter your password"
        required
      />

      <button :disabled="loading" type="submit">
        <span v-if="loading">
          {{ isLoginMode ? '🔄 Logging in...' : '🔄 Registering...' }}
        </span>
        <span v-else>{{ isLoginMode ? 'Login' : 'Register' }}</span>
      </button>

      <p class="error" v-if="errorMessage">{{ errorMessage }}</p>

      <p class="toggle-mode">
        <span>
          {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
        </span>
        <a href="#" @click.prevent="toggleMode">
          {{ isLoginMode ? 'Register here' : 'Login instead' }}
        </a>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const isLoginMode = ref(true)

const toggleMode = () => {
  errorMessage.value = ''
  email.value = ''
  password.value = ''
  isLoginMode.value = !isLoginMode.value
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    if (isLoginMode.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }
    router.push('/dashboard')
  } catch {
    errorMessage.value = isLoginMode.value
      ? 'Login failed. Please check your credentials.'
      : 'Registration failed. Try a different email.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Same card and input styles */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  background-color: #1e1e1e;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.auth-card h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #fff;
}

input {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: #2a2a2a;
  color: #fff;
}

input::placeholder {
  color: #999;
}

button {
  padding: 0.6rem;
  background-color: #2962ff;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: -0.5rem;
}

.toggle-mode {
  font-size: 0.9rem;
  color: #ccc;
  text-align: center;
}

.toggle-mode a {
  color: #69f0ae;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.2rem;
}
</style>