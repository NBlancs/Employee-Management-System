<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftIcon, EyeIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'

interface AttendanceData {
    id: number
    department: string
    totalEmployees: number
    present: number
    absent: number
    late: number
    leave: number
    date: string
}

interface PositionAttendanceRow {
    id: number
    fullName: string
    position: string
    salary: number
    totalPresent: number
    totalAbsent: number
    totalLate: number
    totalLeave: number
    netWorth: number
    dates: string
}

interface EmployeeAttendanceSummaryData extends AttendanceData {
    fullName: string
    position: string
    salary: number
}

const props = defineProps<{
    attendance: AttendanceData | null
}>()

const emit = defineEmits<{
    back: []
    viewSummary: [attendance: EmployeeAttendanceSummaryData]
}>()

const searchQuery = ref('')
const appliedSearchQuery = ref('')
const monthsFilter = ref('')
const yearsFilter = ref('')
const appliedMonthFilter = ref('')
const appliedYearFilter = ref('')

const positionAttendanceRows = ref<PositionAttendanceRow[]>([
  { id: 1, fullName: 'Callo, Je-ann', position: 'Manager', salary: 52000, totalPresent: 20, totalAbsent: 5, totalLate: 3, totalLeave: 2, netWorth: 100000, dates: '2026-01-15 - 2026-01-30' },
  { id: 2, fullName: 'Valle, Jayneth', position: 'Supervisor', salary: 42000, totalPresent: 18, totalAbsent: 7, totalLate: 4, totalLeave: 1, netWorth: 80000,dates: '2026-02-15 - 2026-02-30' },
  { id: 3, fullName: 'Lascuna, Joel Kent', position: 'Staff', salary: 28000, totalPresent: 15, totalAbsent: 10, totalLate: 6, totalLeave: 3, netWorth: 60000, dates: '2026-03-15 - 2026-03-30' },
  { id: 4, fullName: 'Maturan, Walter', position: 'Assistant', salary: 24000, totalPresent: 12, totalAbsent: 13, totalLate: 8, totalLeave: 4, netWorth: 50000, dates: '2026-04-15 - 2026-04-30' },
])

const monthOptions = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const yearOptions = computed(() => {
    const years = positionAttendanceRows.value.map(row =>
        new Date(row.dates).getFullYear()
    )

    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)

    const result: number[] = []
    for (let y = minYear; y <= maxYear; y++) {
        result.push(y)
    }

    return result
})


const filteredPositionAttendanceRows = computed(() => {
    const query = appliedSearchQuery.value.trim().toLowerCase()

    return positionAttendanceRows.value.filter((row) => {
        const rowMonth = new Date(row.dates).toLocaleString('default', { month: 'long' })

        const matchesMonth =
            !appliedMonthFilter.value || rowMonth === appliedMonthFilter.value

        const matchesSearch =
            !query ||
            row.position.toLowerCase().includes(query) ||
            row.fullName.toLowerCase().includes(query)

        return matchesMonth && matchesSearch
    })
})


function handleBack() {
    emit('back')
}

function handleSearch() {
    appliedSearchQuery.value = searchQuery.value
    appliedMonthFilter.value = monthsFilter.value
    appliedYearFilter.value = yearsFilter.value
}

function clearPositionFilter() {
    monthsFilter.value = ''
    appliedMonthFilter.value = ''
}
</script>

<template>
    <section v-if="attendance" class="view-department-attendance-page">
        <div class="page-header">
            <button type="button" class="back-button" @click="handleBack" aria-label="Go back to attendance list">
                <ArrowLeftIcon class="back-icon" />
            </button>
            <h1 class="page-title">{{ attendance.department }} Attendance</h1>
        </div>

        <form class="attendance-search" @submit.prevent="handleSearch">
            

            <div class="filter-control">
                <div class="filter-dropdown">
                    <FunnelIcon class="filter-icon" />
                    <select v-model="monthsFilter" class="filter-select">
                        <option value="">Select Month</option>
                        <option v-for="month in monthOptions" :key="month" :value="month">
                            {{ month }}
                        </option>
                    </select>

                    <select v-model="yearsFilter" class="filter-select">
                        <option value="">Select Year</option>
                        <option v-for="year in yearOptions" :key="year" :value="year.toString()">
                            {{ year }}
                        </option>
                    </select>
                </div>

                <button
                    v-if="monthsFilter"
                    type="button"
                    class="clear-filter-button"
                    @click="clearPositionFilter"
                >
                    Clear
                </button>
            </div>
        </form>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="table-wrap">
            <table class="attendance-table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Position</th>
                        <th>Total Present</th>
                        <th>Total Absent</th>
                        <th>Total Late</th>
                        <th>Total Leave</th>
                        <th>Salary</th>
                        <th>Net Worth</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in filteredPositionAttendanceRows" :key="row.id">
                        <td>{{ row.fullName }}</td>
                        <td>{{ row.position }}</td>
                        <td>{{ row.totalPresent }}</td>
                        <td>{{ row.totalAbsent }}</td>
                        <td>{{ row.totalLate }}</td>
                        <td>{{ row.totalLeave }}</td>
                        <td>{{ row.salary }}</td>
                        <td>{{ row.netWorth }}</td>
                        <td>{{ row.dates }}</td>


                        <!-- <td>
                            <button
                                type="button"
                                class="action-button action-button--subtle"
                                :aria-label="`View ${row.fullName}`"
                                @click="handleViewEmployee(row)"
                            >
                                <EyeIcon class="action-icon" />
                            </button>
                        </td> -->
                    </tr>
                    <tr v-if="!filteredPositionAttendanceRows.length">
                        <td colspan="3" class="empty-state">No position attendance found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>
.view-department-attendance-page {
    width: 100%;
}

.page-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.back-button {
    width: 28px;
    height: 28px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.back-icon {
    width: 14px;
    height: 14px;
}

.page-title {
    margin: 0;
    font-size: 1.1rem;
    color: #1f2937;
}

.attendance-search {
    display: grid;
    grid-template-columns: minmax(240px, 360px) 100px auto;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.filter-control {
    display: column;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
}

.form-divider {
    width: 100%;
    height: 1px;
    margin-bottom: 1rem;
    background-color: #e5e7eb;
}

.search-icon {
    width: 16px;
    height: 16px;
}

.search-button {
    margin-inline: 0;
    width: 96px;
    min-height: 36px;
    padding: 8px 10px;
    font-size: 0.8rem;
    border-radius: 10px;
}

.filter-dropdown {
    position: relative;
    width: 100%;
    min-width: 180px;
    max-width: 240px;
}

.filter-select {
    width: 100%;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    padding: 8px 12px;
    appearance: none;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5l3.5 3 3.5-3'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-left: 32px;
    padding-right: 2rem;
}

.filter-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #6b7280;
    pointer-events: none;
}

.filter-select:focus {
    border-color: #635bff;
    box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.2);
}

.clear-filter-button {
    min-height: 32px;
    width: auto;
    padding: 7px 10px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #ffffff;
    color: #334155;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
}

.clear-filter-button:hover {
    background: #f8fafc;
    border-color: #94a3b8;
}

.table-wrap {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
}

.attendance-table {
    width: 100%;
    min-width: 700px;
    border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.85rem;
    color: #1f2937;
    text-align: left;
}

.attendance-table th {
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
}

.attendance-table tbody tr:last-child td {
    border-bottom: 0;
}

.actions-column {
    width: 110px;
}

.action-button {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.action-button--subtle {
    color: #2563eb;
    background: #eff6ff;
    border-color: #dbeafe;
}

.action-button--subtle:hover {
    color: #1d4ed8;
    background: #dbeafe;
    border-color: #bfdbfe;
}

.action-icon {
    width: 14px;
    height: 14px;
}

.empty-state {
    text-align: center;
    color: #64748b;
}

@media (max-width: 900px) {
    .attendance-search {
        grid-template-columns: 1fr auto auto;
        align-items: end;
    }

    .filter-dropdown {
        max-width: none;
    }
}

@media (max-width: 640px) {
    .attendance-search {
        grid-template-columns: 1fr;
        gap: 0.55rem;
        align-items: stretch;
    }

    .search-button,
    .filter-control {
        width: 100%;
        max-width: none;
    }

    .filter-dropdown {
        flex: 1 1 auto;
        min-width: 0;
        width: auto;
    }

    .search-button {
        min-height: 38px;
        font-size: 0.82rem;
        justify-content: center;
    }
}
</style>
