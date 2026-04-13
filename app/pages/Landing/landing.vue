<script setup lang="ts">
import { ref } from 'vue'
import employeeLogo from '~/assets/svg/employee-logo.svg'

const EXPECTED_USERNAME = 'admin'
const EXPECTED_PASSWORD = '123'

const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')
const isLoginModalOpen = ref(false)
const isCheckingLogin = ref(false)
const loginStatusText = ref('')
const isLoginSuccess = ref(false)
const authCookie = useCookie<string | null>('ems_auth')

async function onSubmit() {
  usernameError.value = ''
  passwordError.value = ''

  if (!username.value.trim()) {
    usernameError.value = 'Username is required.'
  }

  if (!password.value.trim()) {
    passwordError.value = 'Password is required.'
  }

  if (usernameError.value || passwordError.value) {
    return
  }

  isLoginModalOpen.value = true
  isCheckingLogin.value = true
  isLoginSuccess.value = false
  loginStatusText.value = 'Signing in...'

  await new Promise((resolve) => setTimeout(resolve, 1200))

  isCheckingLogin.value = false

  const isMatch = username.value === EXPECTED_USERNAME && password.value === EXPECTED_PASSWORD

  if (isMatch) {
    isLoginSuccess.value = true
    loginStatusText.value = 'Login successful. Redirecting to dashboard...'
    authCookie.value = 'true'

    await new Promise((resolve) => setTimeout(resolve, 900))
    await navigateTo({
      path: '/main',
      query: { login: 'success' },
    })
    return
  }

  loginStatusText.value = 'Invalid username or password. Please try again.'
}

definePageMeta({
  middleware: 'middleware',
})
</script>

<template>
  <div>
    <div class="landing-header">
      <img :src="employeeLogo" alt="Employee logo" class="landing-logo" />
      <h1>Employee Management System</h1>
    </div>

    <div class="content">
      <div class="left-side">
        <h1>“Know who’s in, when it matters.”</h1>
        <p>
          Our Employee Attendance Monitoring System gives you 
          real-time insights, automates attendance tracking, and
          helps you run a smarter, more efficient workplace.
        </p>
      </div>

      <div class="right-side">
        <Card title="Welcome Back" subtitle="Please enter your credentials to sign in.">
          <template #header-top>
            <img :src="employeeLogo" alt="Employee logo" class="welcome-logo" />
          </template>

          <form class="login-form" @submit.prevent="onSubmit">
            <IconInput
              id="username"
              v-model="username"
              label="Username"
              name="username"
              placeholder="Enter your username"
              :error="usernameError"
              required
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </template>
            </IconInput>

            <IconInput
              id="password"
              v-model="password"
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              :error="passwordError"
              required
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V8a4 4 0 1 1 8 0v2" />
                </svg>
              </template>
            </IconInput>

            <Button id="login-button" type="submit" variant="solid" custom-color="#635bff" block>
              Sign In
            </Button>

            <h1 class="forgot-password">
              Forgot password?
            </h1>
          </form>
        </Card>
      </div>
    </div>

    <Modal v-model:open="isLoginModalOpen" title="" description="" :dismissible="!isCheckingLogin" hide-trigger>
      <div class="login-loading-modal">
        <div v-if="isCheckingLogin" class="loading-spinner" aria-hidden="true"></div>
        <p :class="['login-status-text', { 'login-status-text--success': isLoginSuccess, 'login-status-text--error': !isCheckingLogin && !isLoginSuccess }]">
          {{ loginStatusText }}
        </p>

        <Button
          v-if="!isCheckingLogin && !isLoginSuccess"
          type="button"
          variant="soft"
          custom-color="#635bff"
          @click="isLoginModalOpen = false"
        >
          Close
        </Button>
      </div>
    </Modal>
  </div>
</template>