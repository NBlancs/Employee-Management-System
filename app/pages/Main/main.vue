<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const isLoginSkeletonVisible = ref(false)
const isLogoutConfirmOpen = ref(false)
const isLoggingOutOpen = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let alertTimer: ReturnType<typeof setTimeout> | null = null
let loginSkeletonTimer: ReturnType<typeof setTimeout> | null = null

const userInfo = {
  firstName: 'Filemon Jr.',
  lastName: 'Galanida',
  role: 'Admin',
  avatar: 'FG',
}

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
  { label: 'Department & Salaries', icon:ShieldCheckIcon, id:'department'},
  { label: 'Attendance', icon: CalendarDaysIcon, id: 'attendance' },
  { label: 'Transactions', icon: ClockIcon, id: 'transactions' },
  { label: 'Reports', icon: ChartBarSquareIcon, id: 'reports' },
  
]

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
  isLoggingOutOpen.value = false
  await navigateTo('/landing')
}

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  const loginQuery = getTabFromQuery(route.query.login)

  if (loginQuery === 'success') {
    isLoginSkeletonVisible.value = true

    const { login: _login, ...restQuery } = route.query
    void router.replace({
      path: route.path,
      query: restQuery,
      hash: route.hash,
    })

    loginSkeletonTimer = setTimeout(() => {
      isLoginSkeletonVisible.value = false
      showSignInAlert.value = true

      alertTimer = setTimeout(() => {
        showSignInAlert.value = false
      }, 3000)
    }, 2000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }

  if (alertTimer) {
    clearTimeout(alertTimer)
  }

  if (loginSkeletonTimer) {
    clearTimeout(loginSkeletonTimer)
  }
})
</script>

<template>
  <div v-if="isLoginSkeletonVisible" class="main-page main-page--skeleton" aria-busy="true" aria-live="polite">
    <aside class="main-sidebar main-sidebar--skeleton">
      <div>
        <div class="brand-block brand-block--skeleton">
          <div class="user-block user-block--skeleton">
            <div class="avatar avatar--skeleton"></div>
            <div class="user-info user-info--skeleton">
              <div class="skeleton-line skeleton-line--lg"></div>
              <div class="skeleton-line skeleton-line--sm"></div>
            </div>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <div class="skeleton-nav">
          <div v-for="item in 6" :key="item" class="skeleton-nav-item"></div>
        </div>
      </div>

      <div class="sidebar-footer sidebar-footer--skeleton">
        <div class="skeleton-nav-item skeleton-nav-item--short"></div>
        <div class="skeleton-nav-item skeleton-nav-item--short"></div>
      </div>
    </aside>

    <div class="main-shell main-shell--skeleton">
      <header class="main-header main-header--skeleton">
        <div class="skeleton-line skeleton-line--xl"></div>
        <div class="header-right header-right--skeleton">
          <div class="skeleton-line skeleton-line--md"></div>
          <div class="skeleton-circle"></div>
        </div>
      </header>

      <main class="main-content main-content--skeleton">
        <div class="skeleton-card skeleton-card--hero"></div>

        <div class="skeleton-grid">
          <div v-for="item in 4" :key="item" class="skeleton-card"></div>
        </div>

        <div class="skeleton-card skeleton-card--table"></div>
        <div class="skeleton-card skeleton-card--table"></div>
      </main>
    </div>
  </div>

  <div v-else class="main-page">
    <div class="signin-alert-wrap">
      <Alert
        v-if="showSignInAlert"
        title="Signed in successfully"
        message="Signed in as Admin"
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
              <h2>{{ userInfo.lastName }}, {{ userInfo.firstName }}</h2>
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
        <button
          class="nav-item"
          :class="{ 'settings-btn--active': activeTab === 'settings' }"
          id="settings-btn"
          type="button"
          @click="setActiveTab('settings')"
        >
          <Cog6ToothIcon class="nav-item__icon" aria-hidden="true" />
          <span>Settings</span>
        </button>
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

.main-sidebar--skeleton,
.main-shell--skeleton {
  min-height: 0;
}

.main-sidebar--skeleton {
  background: #ffffff;
  border-right: 1px solid #dbe4ff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-block--skeleton {
  min-height: 72px;
}

.user-block--skeleton {
  align-items: center;
}

.avatar--skeleton {
  background: #e2e8f0;
}

.user-info--skeleton {
  width: 100%;
  display: grid;
  gap: 8px;
}

.skeleton-line,
.skeleton-nav-item,
.skeleton-card,
.skeleton-circle {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 37%, #e2e8f0 63%);
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.3s ease-in-out infinite;
}

.skeleton-line {
  height: 12px;
  border-radius: 999px;
}

.skeleton-line--lg {
  width: 72%;
  height: 14px;
}

.skeleton-line--md {
  width: 110px;
}

.skeleton-line--xl {
  width: 180px;
  height: 18px;
}

.skeleton-line--sm {
  width: 40%;
}

.skeleton-nav {
  display: grid;
  gap: 10px;
  padding: 18px 16px 0;
}

.skeleton-nav-item {
  height: 38px;
  border-radius: 10px;
}

.skeleton-nav-item--short {
  width: 88%;
}

.sidebar-footer--skeleton {
  padding: 0 16px 12px;
  display: grid;
  gap: 10px;
}

.main-shell--skeleton {
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: white;
}

.main-header--skeleton {
  border-bottom: 1px solid #dbe4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
}

.header-right--skeleton {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skeleton-circle {
  width: 36px;
  height: 36px;
  border-radius: 999px;
}

.main-content--skeleton {
  padding: 20px;
  display: grid;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
}

.skeleton-card {
  height: 92px;
  border-radius: 14px;
}

.skeleton-card--hero {
  height: 120px;
}

.skeleton-card--table {
  height: 160px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
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
