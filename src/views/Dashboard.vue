<template>
    <div class="dashboard-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h2 class="logo">Salesforce Accounts Dashboard</h2>
        <div class="email">{{ authStore.email }}</div>
        <nav>
          <a href="#" class="nav-link" @click.prevent="refreshDashboard">Refresh Dashboard</a>
        </nav>
        <button class="logout-btn" @click="logout">Logout</button>
      </aside>
  
      <!-- Main Content -->
      <main class="main">
        <div class="content-card">
          <div v-if="loading" class="status-text">Loading accounts...</div>
          <div v-else-if="accounts.length === 0" class="status-text">No accounts found.</div>
  
          <div v-else>
            <table class="accounts-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Industry</th>
                  <th>Phone</th>
                  <th>Account ID</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="account in accounts" :key="account.Id">
                  <td>{{ account.Name }}</td>
                  <td>{{ account.Industry || '—' }}</td>
                  <td>{{ account.Phone || '—' }}</td>
                  <td>{{ account.Id }}</td>
                </tr>
              </tbody>
            </table>
  
            <div class="pagination">
              <button @click="prevPage" :disabled="page === 1">Previous</button>
              <span>Page {{ page }} of {{ Math.ceil(total / limit) }}</span>
              <button @click="nextPage" :disabled="page * limit >= total">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '@/axios'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  
  interface Account {
    Id: string;
    Name: string;
    Industry?: string;
    Phone?: string;
  }
  
  const accounts = ref<Account[]>([])
  const loading = ref(true)
  const router = useRouter()
  const authStore = useAuthStore()
  
  const page = ref(1)
  const limit = 10
  const total = ref(0)
  
  const fetchAccounts = async () => {
    loading.value = true
    try {
      const res = await api.get('/api/dashboard', {
        params: { page: page.value, limit }
      })
      accounts.value = res.data.accounts || []
      total.value = res.data.total || 0
    } catch (err) {
      console.error('Failed to load accounts:', err)
    } finally {
      loading.value = false
    }
  }
  
  const nextPage = () => {
    if (page.value * limit < total.value) {
      page.value++
      fetchAccounts()
    }
  }
  
  const prevPage = () => {
    if (page.value > 1) {
      page.value--
      fetchAccounts()
    }
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  const refreshDashboard = () => fetchAccounts()
  
  onMounted(() => {
    if (!authStore.token) {
      router.push('/login')
      return
    }
    fetchAccounts()
  })
  </script>
  
  <style scoped>
  .dashboard-wrapper {
    display: flex;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    background: #f2f3f5;
  }
  
  .sidebar {
    width: 220px;
    background-color: #3f4eae;
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 2rem;
  }
  
  .logo {
    font-size: 1.3rem;
    font-weight: bold;
  }
  
  .email {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-top: -1rem;
  }
  
  .nav-link {
    color: #fff;
    text-decoration: none;
    padding: 0.4rem;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.15);
    text-align: center;
  }
  
  .logout-btn {
    margin-top: auto;
    padding: 0.5rem;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .logout-btn:hover {
    background-color: #c0392b;
  }
  
  .main {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }
  
  .content-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    width: 850px;
  }
  
  .accounts-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .accounts-table th,
  .accounts-table td {
    text-align: left;
    padding: 0.75rem;
    border-bottom: 1px solid #ddd;
  }
  
  .accounts-table th {
    background-color: #f4f6f8;
    font-weight: 600;
  }
  
  .status-text {
    text-align: center;
    padding: 1rem;
    color: #888;
  }
  
  .pagination {
    margin-top: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination button {
    background-color: #3498db;
    border: none;
    padding: 0.5rem 1rem;
    color: white;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>