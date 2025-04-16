<template>
  <div class="min-h-screen bg-zinc-900 text-white px-8 py-6 relative">
    <!-- Top nav -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-blue-400">Dashboard</h1>
      <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>

    <!-- Welcome -->
    <div class="mb-4">
      <p class="text-xl text-gray-300">Welcome!</p>
    </div>

    <!-- Accounts -->
    <div>
      <h2 class="text-2xl font-semibold text-blue-300 mb-4">Accounts from Salesforce</h2>

      <div v-if="loading" class="text-gray-400 animate-pulse">Loading accounts...</div>

      <div v-else-if="accounts.length === 0" class="text-gray-500">No accounts found.</div>

      <ul v-else class="space-y-2">
        <li
          v-for="account in accounts"
          :key="account.Id"
          class="bg-zinc-800 p-4 rounded shadow hover:bg-zinc-700 transition"
        >
          <p class="text-lg font-medium text-white">{{ account.Name }}</p>
          <p class="text-sm text-gray-400">ID: {{ account.Id }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useRouter } from 'vue-router'

interface Account {
  Id: string;
  Name: string;
  Industry?: string;
  Phone?: string;
}

const accounts = ref<Account[]>([])
const router = useRouter()
const loading = ref(true)

const fetchAccounts = async () => {
  try {
    const res = await axios.get('/dashboard')
    console.log('Accounts:', res.data)
    accounts.value = res.data.accounts || []
  } catch (err) {
    console.error('Failed to load accounts:', err)
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  fetchAccounts()
})
</script>