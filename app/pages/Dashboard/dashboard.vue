<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import OverviewCard from '~/components/OverviewCard.vue'
import { UserGroupIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ChartBarSquareIcon } from '@heroicons/vue/24/outline'

const hasLoadedDashboardTable = useState<boolean>('has-loaded-dashboard-table', () => false)
const isTableLoading = ref(!hasLoadedDashboardTable.value)
let loadingTimer: ReturnType<typeof setTimeout> | null = null

const recentAttendances = [
  {
    fullName: 'Dela Cruz, Juan',
    status: 'Present',
    time: '08:02 AM'
  },
  {
    fullName: 'Santos, Maria',
    status: 'Late',
    time: '08:21 AM'
  },
  {
    fullName: 'Reyes, Carlo',
    status: 'Present',
    time: '07:56 AM'
  },
  {
    fullName: 'Mendoza, Rafael',
    status: 'Present',
    time: '08:06 AM'
  },
  
]

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

onMounted(() => {
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
        value="125"
        bgColor="#e9f2ff"
        iconBgColor="#d0e5ff"
        iconColor="#3686ff"
      />
      <OverviewCard 
        :icon="CheckCircleIcon"
        label="Total Present" 
        value="95"
        bgColor="#e5f8f0"
        iconBgColor="#cef2e5"
        iconColor="#00c16a"
      />
      <OverviewCard 
          :icon="XCircleIcon"
          label="Total Absent" 
          value="30"
          bgColor="#fee9ea"
          iconBgColor="#fdcfd3"
          iconColor="#fc4f57"
      />

      <OverviewCard 
        :icon="ShieldCheckIcon"
        label="Departments" 
        value="5"
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

          <tr v-for="attendance in isTableLoading ? [] : recentAttendances.slice(0, 5)" :key="`${attendance.fullName}-${attendance.time}`">
            <td>{{ attendance.fullName }}</td>
            <td class="status-cell-center">
              <span class="status-badge" :class="getStatusClass(attendance.status)">
                {{ attendance.status }}
              </span>
            </td>
            <td>{{ attendance.time }}</td>
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

          <tr v-for="attendance in isTableLoading ? [] : recentAttendances.slice(0, 5)" :key="`${attendance.fullName}-${attendance.time}`">
            <td>{{ attendance.fullName }}</td>
            <td class="status-cell-center">
              <span class="status-badge" :class="getStatusClass(attendance.status)">
                {{ attendance.status }}
              </span>
            </td>
            <td>{{ attendance.time }}</td>
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


#recent-attendance{
  margin-top: 1rem;
  margin: 0;
  font-size: 1rem;
}

#recent-transaction{
  margin-top: 1rem;
  font-size: 1rem;
}

#date{
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

.recent-attendance-table {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
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
  font-weight: 400;
}

.status-badge--present {
  background: #dcfce7;
  color: #166534;
}

.status-badge--late {
  background: #fef3c7;
  color: #92400e;
}

.status-badge--absent {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge--neutral {
  background: #e2e8f0;
  color: #334155;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 820px) {
  .overview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

</style>