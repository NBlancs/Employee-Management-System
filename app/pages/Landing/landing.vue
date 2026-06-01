<script setup lang="ts">
import { ref } from 'vue'
import { authenticateDummy } from '~/utils/dummyAuth'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isSigningIn = ref(false)
const authCookie = useCookie<string | null>('ems_auth')
const userCookie = useCookie<string | null>('ems_user')

async function onSubmit() {
  errorMessage.value = ''

  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Username and password are required.'
    return
  }

  isSigningIn.value = true

  await new Promise((resolve) => setTimeout(resolve, 400))

  const result = authenticateDummy(username.value, password.value)

  if (!result.ok) {
    authCookie.value = null
    userCookie.value = null
    errorMessage.value = result.message
    isSigningIn.value = false
    return
  }

  authCookie.value = 'true'
  userCookie.value = JSON.stringify(result.user)
  isSigningIn.value = false
  await navigateTo('/main?login=success&tab=overview')
}
</script>

<template>
  <main class="landing">
    <section class="card">
      <h1>Employee Management System</h1>
      <p>Sign in to continue (demo mode, no backend)</p>
      <p class="hint">Demo: <strong>admin</strong> / <strong>admin123</strong></p>

      <form @submit.prevent="onSubmit">
        <label for="username">Username</label>
        <input id="username" v-model="username" type="text" autocomplete="username" />

        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password" />

        <button type="submit" :disabled="isSigningIn">
          {{ isSigningIn ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </section>
  </main>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f8fafc;
  padding: 16px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

h1 {
  margin: 0 0 8px;
  font-size: 1.3rem;
}

p {
  margin: 0 0 12px;
  color: #475569;
}

form {
  display: grid;
  gap: 8px;
}

label {
  font-size: 0.9rem;
}

input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
}

button {
  margin-top: 8px;
  border: 1px solid #4f46e5;
  background: #4f46e5;
  color: #fff;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.hint {
  font-size: 0.85rem;
  color: #64748b;
}

.error {
  margin-top: 10px;
  color: #dc2626;
}
</style>
