<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Alert from '~/components/Alert.vue'
import Modal from '~/components/Modal.vue'
import {
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  BellIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authCookie = useCookie<string | null>('ems_auth')
const userCookie = useCookie<string | null>('ems_user')

type LoggedInUser = {
  employeeId: number
  accountId: number
  username: string
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  displayName: string
  role: string
  department: string
}

const loggedInUser = computed<LoggedInUser | null>(() => {
  if (!userCookie.value) {
    return null
  }

  try {
    return JSON.parse(userCookie.value) as LoggedInUser
  } catch {
    return null
  }
})

function getTabFromQuery(queryValue: unknown) {
  if (Array.isArray(queryValue)) {
    return queryValue[0] ?? undefined
  }

  if (typeof queryValue === 'string') {
    return queryValue
  }

  return undefined
}

const activeTab = ref(getTabFromQuery(route.query.tab) || 'overview')
const now = ref(new Date())
const showSignInAlert = ref(false)
const isLogoutConfirmOpen = ref(false)
const isLoggingOutOpen = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let alertTimer: ReturnType<typeof setTimeout> | null = null

// Check for login success query parameter
const loginQuery = getTabFromQuery(route.query.login)
if (loginQuery === 'success') {
  showSignInAlert.value = true
}

const userInfo = computed(() => {
  const u = loggedInUser.value

  if (!u) {
    return {
      fullName: 'Guest User',
      role: 'Guest',
      avatar: 'GU',
    }
  }

  const middleInitial = u.middleName
    ? `${u.middleName.charAt(0).toUpperCase()}.`
    : ''

  const suffixPart = u.suffix ? ` ${u.suffix}` : ''

  const fullName =
    `${u.lastName}, ${u.firstName}${suffixPart}` +
    (middleInitial ? `, ${middleInitial}` : '')

  const initials =
    `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase()

  return {
    fullName,
    role: u.role,
    avatar: initials,
  }
})

const currentTabLabel = computed(() => {
  if (activeTab.value === 'settings') {
    return 'Settings'
  }

  const tab = navItems.find(item => item.id === activeTab.value)
  return tab?.label || 'Dashboard'
})

const formattedDate = computed(() => {
  return now.value.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})


const navItems = [
  { label: 'Dashboard', icon: HomeIcon, id: 'overview' },
  { label: 'Employees', icon: UsersIcon, id: 'employees' },
  { label: 'Departments', icon:ShieldCheckIcon, id:'departments'},
  { label: 'Attendance', icon: CalendarDaysIcon, id: 'attendance' },
  { label: 'Transactions', icon: ClockIcon, id: 'transactions' },
  
]

// Watch for route query changes
watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = Array.isArray(newTab) ? newTab[0] : newTab
  }
})

function setActiveTab(id: string) {
  activeTab.value = id

  void router.replace({
    path: route.path,
    query: {
      ...route.query,
      tab: id,
    },
    hash: route.hash,
  })
}

function toggleNotifications() {
}

function openLogoutConfirm() {
  isLogoutConfirmOpen.value = true
}

function cancelLogout() {
  isLogoutConfirmOpen.value = false
}

async function confirmLogout() {
  isLogoutConfirmOpen.value = false
  isLoggingOutOpen.value = true

  await new Promise((resolve) => setTimeout(resolve, 1400))

  authCookie.value = null
  userCookie.value = null
  isLoggingOutOpen.value = false
  await navigateTo('/landing')
}

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  // If login alert is being shown, remove the login query parameter and set up auto-dismiss
  if (showSignInAlert.value) {
    // Remove login query parameter so it doesn't show again on refresh
    const { login: _login, ...restQuery } = route.query
    void router.replace({
      path: route.path,
      query: restQuery,
      hash: route.hash,
    })

    // Auto-dismiss the alert after 3 seconds
    alertTimer = setTimeout(() => {
      showSignInAlert.value = false
    }, 3000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }

  if (alertTimer) {
    clearTimeout(alertTimer)
  }
})
</script>

<template>
  <div class="main-page">
    <div class="signin-alert-wrap">
      <Alert
        v-if="showSignInAlert"
        title="Signed in successfully"
        :message="`Signed in as ${userInfo.role}`"
        variant="success"
        dismissible
        @close="showSignInAlert = false"
      />
    </div>

    <aside class="main-sidebar">
      <div>
        <div class="brand-block">
          <div class="user-block">
            <div class="avatar">
              {{ userInfo.avatar }}
            </div>
            <div class="user-info">
              <h5>{{ userInfo.fullName }}</h5>
              <span class="role-badge">{{ userInfo.role }}</span>
            </div>
          </div>
        </div>
        
        <div class="sidebar-divider"></div>

      <nav class="main-nav" aria-label="Main navigation">
          <button
            v-for="item in navItems"
            :key="item.id"
            class="nav-item"
            :class="{ 'nav-item--active': activeTab === item.id }"
            type="button"
            @click="setActiveTab(item.id)"
          >
            <component :is="item.icon" class="nav-item__icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </button>
        </nav>
      </div>

      <div class="sidebar-footer">
        
        <button class="nav-item" type="button" @click="openLogoutConfirm">
          <ArrowLeftOnRectangleIcon class="nav-item__icon" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <Modal
      v-model:open="isLogoutConfirmOpen"
      title="Confirm Logout"
      description="Are you sure you want to log out?"
      :hide-trigger="true"
      :show-footer="false"
    >
      <template #default>
        <p class="logout-copy"></p>
      </template>
      <template #footer>
        <button type="button" class="logout-btn logout-btn--no" @click="cancelLogout">No</button>
        <button type="button" class="logout-btn logout-btn--yes" @click="confirmLogout">Yes</button>
      </template>
    </Modal>

    <Modal
      v-model:open="isLoggingOutOpen"
      title=""
      description=""
      :hide-trigger="true"
      :show-footer="false"
      :dismissible="false"
    >
      <template #default>
        <div class="logout-loading" role="status" aria-live="polite">
          <span class="logout-spinner" aria-hidden="true"></span>
          <p>Signing out</p>
        </div>
      </template>
    </Modal>

    <div class="main-shell">
      <header class="main-header">
        <h1>{{ currentTabLabel }}</h1>
        <div class="header-right">
          <div class="date-time" aria-live="polite">
            <span class="date-text">{{ formattedDate }}</span>
          </div>
          <button class="bell-btn" type="button" aria-label="Notifications" @click="toggleNotifications">
            <BellIcon class="bell-icon" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main class="main-content">
        <slot :active-tab="activeTab" name="content" />
      </main>
    </div>
  </div>
</template>

<style scoped>

.signin-alert-wrap {
  position: fixed;
  top: 14px;
  right: 20px;
  z-index: 1200;
  width: min(360px, calc(100vw - 20px));
}

.logout-copy {
  margin: 0;
  color: #475569;
}

.logout-btn {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn--no {
  border-color: #d1d5db;
  background: #ffffff;
  color: #374151;
  margin-right: 8px;
}

.logout-btn--yes {
  border-color: #ef4444;
  background: #ef4444;
  color: #ffffff;
}

.logout-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  color: #334155;
  width: 100%;
  min-height: 72px;
}

.logout-loading p {
  margin: 0;
}

.logout-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.main-page {
  height: 100dvh;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  color: #0f172a;
  overflow: hidden;
}

.main-sidebar {
  border-right: 1px solid #dbe4ff;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-block {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  margin-top: 20px;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.settings-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #1e293b;
  flex-shrink: 0;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.settings-btn:hover {
  background-color: #f1f5f9;
  border-radius: 8px;
}

.settings-icon {
  width: 18px;
  height: 18px;
}

.avatar {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.user-info h2 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 300;
  color: #059669;
  background: #d1fae5;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
}
.sidebar-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0 16px;
  margin-top: 10px;
}
.main-nav,
.sidebar-footer {
  display: grid;
  gap: 8px;
}

.main-nav {
  margin: 0;
  margin-top: 20px;
}

.sidebar-footer {
  padding: 0 0px 12px 0px;
}

.nav-item {
  border: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  font-size: 0.8rem;
  color: #868686;
  padding: 10px 12px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover,
.nav-item--active {
  background: #e9eef9;
}

.nav-item--active {
  border-left-color: #635bff;
  color: #635bff;
  font-weight: 400;
}

.nav-item--active .nav-item__icon {
  color: #635bff;
}

.settings-btn--active {
  background-color: #e8efff;
  color: #635bff;
  border-left-color: #635bff;
  font-weight: 400;
}

.settings-btn--active .nav-item__icon {
  color: #635bff;
}

.nav-item__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.main-shell {
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: white;
  min-height: 0;
}

.main-header {
  border-bottom: 1px solid #dbe4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.1;
}

.date-text {
  font-size: 0.72rem;
  color: #64748b;
}

.time-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.bell-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.bell-btn:hover {
  background-color: #f1f5f9;
}

.bell-icon {
  width: 20px;
  height: 20px;
  color: #1e293b;
}

.main-header h1 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #635bff;
  margin: 0;
}

.search-wrap {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid #c7d2fe;
  border-radius: 10px;
  padding: 0 10px;
  gap: 8px;
  background: #ffffff;
}

.search-wrap input {
  width: 100%;
  border: 0;
  outline: none;
  padding: 10px 0;
  background: transparent;
}

.search-icon,
.icon-btn__icon,
.profile-btn__icon {
  width: 18px;
  height: 18px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn,
.profile-btn {
  border: 1px solid #c7d2fe;
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: #1e293b;
}

.main-content {
  padding: 20px;
  display: grid;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
}

@media (max-width: 820px) {
  .signin-alert-wrap {
    top: 10px;
    right: 10px;
    width: min(320px, calc(100vw - 20px));
  }

  .main-page {
    grid-template-columns: 76px minmax(0, 1fr);
  }

  .main-sidebar {
    border-right: 1px solid #dbe4ff;
    border-bottom: 0;
    gap: 10px;
    justify-content: space-between;
  }

  .main-nav,
  .sidebar-footer {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 0 8px;
  }

  .brand-block {
    padding: 10px 8px;
    justify-content: center;
  }

  .user-block {
    justify-content: center;
    flex: 0 0 auto;
  }

  .user-info {
    display: none;
  }

  .avatar {
    width: 40px;
    height: 40px;
    font-size: 0.8rem;
  }

  .sidebar-divider {
    margin: 0 8px;
  }

  .nav-item {
    justify-content: center;
    padding: 10px 8px;
    border-left: 0;
    border-bottom: 3px solid transparent;
  }

  .nav-item span {
    display: none;
  }

  .nav-item--active {
    border-bottom-color: #635bff;
    border-left-color: transparent;
  }

  .date-time {
    align-items: flex-end;
  }

  .date-text {
    display: block;
    font-size: 0.66rem;
    white-space: nowrap;
  }
}
</style>
