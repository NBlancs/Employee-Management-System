<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import OverviewCard from '~/components/OverviewCard.vue'
import { UserGroupIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ChartBarSquareIcon } from '@heroicons/vue/24/outline'

// API Response Types
interface DashboardStats {
  totalEmployees: number
  totalPresent: number
  totalAbsent: number
  totalDepartments: number
}

interface RecentAttendance {
  fullName: string
  status: string
  timeIn: string
}

interface RecentTransaction {
  reference: string
  type: string
  firstName: string
  dateTime: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

const hasLoadedDashboardTable = useState<boolean>('has-loaded-dashboard-table', () => false)
const isTableLoading = ref(!hasLoadedDashboardTable.value)
let loadingTimer: ReturnType<typeof setTimeout> | null = null

// Dashboard stats
const dashboardStats = ref<DashboardStats>({
  totalEmployees: 0,
  totalPresent: 0,
  totalAbsent: 0,
  totalDepartments: 0,
})
const isStatsLoading = ref(true)

const recentAttendances = ref<RecentAttendance[]>([])

const recentTransactions = ref<RecentTransaction[]>([])


const currentDate = new Date().toLocaleDateString(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})


function getStatusClass(status: string) {
  if (status === 'Present') return 'status-badge--present'
  if (status === 'Late') return 'status-badge--late'
  return 'status-badge--neutral'
}

onMounted(async () => {
  // Fetch dashboard stats
  try {
    const response = await $fetch<ApiResponse<DashboardStats>>('/api/dashboard/stats')
    if (response?.data) {
      dashboardStats.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  } finally {
    isStatsLoading.value = false
  }

  // Fetch recent attendances
  try {
    const response = await $fetch<ApiResponse<RecentAttendance[]>>('/api/dashboard/recent-attendances')
    if (response?.data) {
      recentAttendances.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch recent attendances:', error)
  }

  // Fetch recent transactions
  try {
    const response = await $fetch<ApiResponse<RecentTransaction[]>>('/api/dashboard/recent-transactions')
    if (response?.data) {
      recentTransactions.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error)
  }

  if (hasLoadedDashboardTable.value) {
    isTableLoading.value = false
    return
  }

  loadingTimer = setTimeout(() => {
    isTableLoading.value = false
    hasLoadedDashboardTable.value = true
  }, 1200)
})

onUnmounted(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
})
</script>

<template>
  <div class="dashboard">
    <h1>Overview</h1>
    
    <div class="overview-grid">
      <OverviewCard 
        :icon="UserGroupIcon"
        label="Total Employees" 
        :value="dashboardStats.totalEmployees.toString()"
        bgColor="#e9f2ff"
        iconBgColor="#d0e5ff"
        iconColor="#3686ff"
      />
      <OverviewCard 
        :icon="CheckCircleIcon"
        label="Total Present" 
        :value="dashboardStats.totalPresent.toString()"
        bgColor="#e5f8f0"
        iconBgColor="#cef2e5"
        iconColor="#00c16a"
      />
      <OverviewCard 
          :icon="XCircleIcon"
          label="Total Absent" 
          :value="dashboardStats.totalAbsent.toString()"
          bgColor="#fee9ea"
          iconBgColor="#fdcfd3"
          iconColor="#fc4f57"
      />

      <OverviewCard 
        :icon="ShieldCheckIcon"
        label="Departments" 
        :value="dashboardStats.totalDepartments.toString()"
        bgColor="#fef8e6"
        iconBgColor="#fef0cd"
        iconColor="#f0b305"
      />
    </div>

    <div class="recent-attendance-header">
      <h1 id="recent-attendance">Recent Attendances</h1>
      <p id="date">{{ currentDate }}</p>
    </div>

    <div class="recent-attendance-table">
      <table class="attendance-table" :aria-busy="isTableLoading ? 'true' : 'false'">
        <thead>
          <tr>
            <th>Full Name</th>
            <th class="status-header">Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isTableLoading" class="loading-row" role="status" aria-live="polite">
            <td class="loading-cell" colspan="3">
              <div class="loading-content">
                <span class="table-spinner" aria-hidden="true"></span>
                <span>Loading attendances...</span>
              </div>
            </td>
          </tr>

          <tr v-for="attendance in isTableLoading ? [] : recentAttendances.slice(0, 5)" :key="`${attendance.fullName}-${attendance.timeIn}`">
            <td>{{ attendance.fullName }}</td>
            <td class="status-cell-center">
              <span class="status-badge" :class="getStatusClass(attendance.status)">
                {{ attendance.status }}
              </span>
            </td>
            <td>{{ attendance.timeIn }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="recent-transaction-header">
      <h1 id="recent-transaction">Recent Transactions</h1>
    </div>

    <div class="recent-attendance-table">
      <table class="attendance-table" :aria-busy="isTableLoading ? 'true' : 'false'">
        <thead>
          <tr>
            <th>Transaction No.</th>
            <th>Classification</th>
            <th>Processed By</th>
            <th>Date &amp; Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isTableLoading" class="loading-row" role="status" aria-live="polite">
            <td class="loading-cell" colspan="4">
              <div class="loading-content">
                <span class="table-spinner" aria-hidden="true"></span>
                <span>Loading transactions...</span>
              </div>
            </td>
          </tr>

          <tr v-for="transaction in isTableLoading ? [] : recentTransactions.slice(0, 5)" :key="transaction.reference">
            <td>{{ transaction.reference }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.firstName }}</td>
            <td>{{ transaction.dateTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    
  </div>
</template>

<style scoped>

.dashboard h1 {
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-size: 1.2rem;
}

#recent-attendance {
  margin-top: 1rem;
  margin: 0;
  font-size: 1rem;
}

#recent-transaction {
  margin-top: 1rem;
  font-size: 1rem;
}

#date {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #64748b;
}

.recent-attendance-header {
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.recent-transaction-header {
  margin-top: 1rem;
  margin-bottom: 0.75rem;
}

.recent-attendance-table {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  /* Allow horizontal scroll on very small screens */
  overflow-x: auto;
}

.loading-cell {
  height: 180px;
  border-bottom: 0 !important;
  padding: 0 !important;
}

.loading-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #64748b;
  font-size: 0.88rem;
  text-align: center;
}

.table-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #dbeafe;
  border-top-color: #3b82f6;
  border-radius: 999px;
  animation: table-spin 0.8s linear infinite;
}

@keyframes table-spin {
  to {
    transform: rotate(360deg);
  }
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
  padding: 20px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.88rem;
  color: #1f2937;
  white-space: nowrap;
}

.attendance-table th {
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  text-align: left;
}

.attendance-table tbody tr:last-child td {
  border-bottom: 0;
}

.status-cell-center {
  display: flex;
  justify-content: center;
}

.status-header {
  text-align: center !important;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 200;
  border: 1px solid transparent;
}

.status-badge--present {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

.status-badge--late {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde047;
}

.status-badge--absent {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}

.status-badge--neutral {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}

/* --- Overview grid --- */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* --- Responsive breakpoints (mirrors department-info.vue) --- */
@media (max-width: 760px) {
  .overview-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
  }

  .dashboard h1 {
    font-size: 1.05rem;
    width: 100%;
    max-width: 100%;
  }

  #recent-attendance,
  #recent-transaction {
    font-size: 0.95rem;
  }

  #date {
    font-size: 0.82rem;
  }

  .recent-attendance-header {
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }

  .recent-attendance-table :deep(table),
  .recent-transaction-table :deep(table) {
    width: 100%;
    border-collapse: collapse;
  }

  .recent-attendance-table :deep(th),
  .recent-attendance-table :deep(td),
  .recent-transaction-table :deep(th),
  .recent-transaction-table :deep(td) {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem;
    color: #1f2937;
  }

  .recent-attendance-table :deep(th),
  .recent-transaction-table :deep(th) {
    background: #f8fafc;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: none;
    letter-spacing: normal;
  }

  .recent-attendance-table :deep(tbody tr:last-child td),
  .recent-transaction-table :deep(tbody tr:last-child td){
    border-bottom: none;
  }

}
</style>
