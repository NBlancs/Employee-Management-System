<script setup lang="ts">
import { ref } from 'vue'
import employeeLogo from '~/assets/svg/employee-logo.svg'
import { UsersIcon, ClockIcon, CalendarDaysIcon, CreditCardIcon } from '@heroicons/vue/24/outline'

const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')
const loginStatusText = ref('')
const isSigningIn = ref(false)
const loginButtonText = ref('Sign In')
// const authCookie = useCookie<string | null>('ems_auth')
// const userCookie = useCookie<string | null>('ems_user')
// const config = useRuntimeConfig()

// async function onSubmit() {
//   usernameError.value = ''
//   passwordError.value = ''

//   if (!username.value.trim()) {
//     usernameError.value = 'Username is required.'
//   }

//   if (!password.value.trim()) {
//     passwordError.value = 'Password is required.'
//   }

//   if (usernameError.value || passwordError.value) {
//     return
//   }

//   // start button state
//   loginStatusText.value = ''
//   isSigningIn.value = true
//   loginButtonText.value = 'Signing In'

//   try {
//     const response = await $fetch<{ success: boolean; data: {
//       employeeId: number
//       accountId: number
//       username: string
//       firstName: string
//       middleName: string
//       lastName: string
//         suffix: string
//       displayName: string
//       role: string
//       department: string
//     } }>(`${config.public.apiBaseUrl}/api/auth/login`, {
//       method: 'POST',
//       body: {
//         username: username.value,
//         password: password.value,
//       },
//     })

//     authCookie.value = 'true'
//     userCookie.value = JSON.stringify({
//       employeeId: response.data.employeeId,
//       accountId: response.data.accountId,
//       username: response.data.username,
//       firstName: response.data.firstName,
//       middleName: response.data.middleName,
//       lastName: response.data.lastName,
//         suffix: response.data.suffix,
//       displayName: response.data.displayName,
//       role: response.data.role,
//       department: response.data.department,
//     })

//     await navigateTo('/main?login=success&tab=overview')
//   } catch (error: any) {
//     authCookie.value = null
//     userCookie.value = null
//     loginStatusText.value = error?.data?.message || 'Invalid username or password. Please try again.'
//     isSigningIn.value = false
//     loginButtonText.value = 'Sign In'
//   }
// }

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

  loginStatusText.value = ''
  isSigningIn.value = true
  loginButtonText.value = 'Signing In'

  // simulate loading
  setTimeout(async () => {
    await navigateTo('/Main?login=success&tab=overview')
  }, 1000)
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
        <div class="left-side-content">
          <h1>"Know who's in, when it matters."</h1>
          <p>
            Our Employee Attendance Monitoring System gives you 
            real-time insights, automates attendance tracking, and
            helps you run a smarter, more efficient workplace.
          </p>
        </div>

        <div class="icon-scatter">
          <div class="scattered-icon scattered-icon--sm scatter-pos-1">
            <UsersIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--md scatter-pos-2">
            <ClockIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--sm scatter-pos-3">
            <CalendarDaysIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--lg scatter-pos-4">
            <CreditCardIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--sm scatter-pos-5">
            <UsersIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--md scatter-pos-6">
            <ClockIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--sm scatter-pos-7">
            <CalendarDaysIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--md scatter-pos-8">
            <CreditCardIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--sm scatter-pos-9">
            <UsersIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--lg scatter-pos-10">
            <ClockIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--sm scatter-pos-11">
            <CalendarDaysIcon class="icon" />
          </div>
          <div class="scattered-icon scattered-icon--md scatter-pos-12">
            <CreditCardIcon class="icon" />
          </div>
        </div>
      </div>

      <div class="right-side">
        <Card title="Welcome Back" subtitle="Please enter your credentials to sign in.">
          <template #header-top>
            <img :src="employeeLogo" alt="Employee logo" class="welcome-logo" />
          </template>

          <form class="login-form" method="post" @submit.prevent="onSubmit">
            <IconInput
              id="username"
              v-model="username"
              label="Username"
              name="username"
              placeholder="Enter your username"
              autocomplete="username"
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
              autocomplete="current-password"
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

            <Button
              id="login-button"
              type="button"
              :disabled="isSigningIn"
              @click="onSubmit"
              variant="solid"
              custom-color="#635bff"
              block
            >
              <div class="button-content">
                <template v-if="isSigningIn">
                  <span class="button-spinner-centered" aria-hidden="true">
                    <span class="spinner"></span>
                    <span class="spinner-text">Signing in</span>
                  </span>
                </template>
                <template v-else>
                  <span class="button-label">{{ loginButtonText }}</span>
                </template>
              </div>
            </Button>

            <p class="login-status-text" v-if="loginStatusText">{{ loginStatusText }}</p>

            <h1 class="forgot-password">
              Forgot password?
            </h1>
          </form>
        </Card>
      </div>
    </div>

    <!-- Modal removed: using button state and inline status text instead -->
  </div>
</template>

<style scoped>
.left-side {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.left-side-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
  text-align: left;
  padding-left: 20px;
}

.left-side h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  line-height: 1.2;
  color: #635bff;
  margin-bottom: 1.5rem;
}

.left-side p {
  font-size: 1rem;
  line-height: 1.6;
  color: #848484;
}

.icon-scatter {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.scattered-icon {
  position: absolute;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  opacity: 0.3;
}

.scattered-icon--sm {
  width: 56px;
  height: 56px;
}

.scattered-icon--md {
  width: 72px;
  height: 72px;
}

.scattered-icon--lg {
  width: 92px;
  height: 92px;
}

.scattered-icon .icon {
  width: 34px;
  height: 34px;
  color: #635bff;
}

.scattered-icon--sm .icon {
  width: 26px;
  height: 26px;
}

.scattered-icon--lg .icon {
  width: 42px;
  height: 42px;
}

.scatter-pos-1 {
  top: 8%;
  left: 4%;
}

.scatter-pos-2 {
  top: 20%;
  left: 26%;
}

.scatter-pos-3 {
  top: 6%;
  right: 18%;
}

.scatter-pos-4 {
  top: 28%;
  right: 2%;
}

.scatter-pos-5 {
  top: 42%;
  left: 2%;
}

.scatter-pos-6 {
  top: 56%;
  left: 20%;
}

.scatter-pos-7 {
  top: 48%;
  right: 24%;
}

.scatter-pos-8 {
  top: 60%;
  right: 4%;
}

.scatter-pos-9 {
  bottom: 18%;
  left: 8%;
}

.scatter-pos-10 {
  bottom: 6%;
  left: 30%;
}

.scatter-pos-11 {
  bottom: 12%;
  right: 26%;
}

.scatter-pos-12 {
  bottom: 4%;
  right: 6%;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.login-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.login-header p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.welcome-logo {
  width: 48px;
  height: 48px;
}

.right-side {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.button-label {
  flex: 1;
  text-align: center;
}

.button-spinner {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.spinner-text {
  margin-left: 8px;
  color: #ffffff;
  font-size: 0.95rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.button-spinner-centered {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.login-status-text {
  margin-top: 0.75rem;
  color: #e11d48; /* red-600 */
  font-size: 0.95rem;
  width: 100%;
  text-align: center;
}
</style>