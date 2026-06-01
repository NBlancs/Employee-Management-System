<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftIcon, FunnelIcon } from '@heroicons/vue/24/outline'
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
    salary: number
    totalPresent: number
    totalAbsent: number
    totalLate: number
    grossPay: number
    dates: string
}

interface EmployeeAttendanceSummaryData extends AttendanceData {
    fullName: string
    salary: number
}

const props = defineProps<{
    attendance: AttendanceData | null
}>()

const emit = defineEmits<{
    back: []
    viewSummary: [attendance: EmployeeAttendanceSummaryData]
}>()

const monthsFilter = ref('')
const yearsFilter = ref('')

const positionAttendanceRows = ref<PositionAttendanceRow[]>([
  { id: 1, fullName: 'Callo, Je-ann', salary: 52000, totalPresent: 20, totalAbsent: 5, totalLate: 3, grossPay: 100000, dates: '2026-01-15 - 2026-01-30' },
  { id: 2, fullName: 'Valle, Jayneth', salary: 42000, totalPresent: 18, totalAbsent: 7, totalLate: 4, grossPay: 80000, dates: '2026-02-15 - 2026-02-30' },
  { id: 3, fullName: 'Lascuna, Joel Kent', salary: 28000, totalPresent: 15, totalAbsent: 10, totalLate: 6, grossPay: 60000, dates: '2026-03-15 - 2026-03-30' },
  { id: 4, fullName: 'Maturan, Walter', salary: 24000, totalPresent: 12, totalAbsent: 13, totalLate: 8, grossPay: 50000, dates: '2026-04-15 - 2026-04-30' },
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
    const selectedMonth = monthsFilter.value
    const selectedYear = yearsFilter.value

    return positionAttendanceRows.value.filter((row) => {
        const rowDate = new Date(row.dates.split(' - ')[0])
        const rowMonth = rowDate.toLocaleString('default', { month: 'long' })
        const rowYear = rowDate.getFullYear().toString()

        const matchesMonth = !selectedMonth || rowMonth === selectedMonth
        const matchesYear = !selectedYear || rowYear === selectedYear

        return matchesMonth && matchesYear
    })
})

function handleBack() {
    emit('back')
}

function clearFilters() {
    monthsFilter.value = ''
    yearsFilter.value = ''
}

function exportPdf() {
    // placeholder for PDF export action
}

function exportExcel() {
    // placeholder for Excel export action
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

        <div class="attendance-search">
            <div class="filter-control">
                <div class="filter-row">
                    <div class="filter-dropdown filter-dropdown--icon">
                        <FunnelIcon class="filter-icon" />
                        <select v-model="monthsFilter" class="filter-select filter-select--with-icon">
                            <option value="">Select Month</option>
                            <option v-for="month in monthOptions" :key="month" :value="month">
                                {{ month }}
                            </option>
                        </select>
                    </div>

                    <div class="filter-dropdown filter-dropdown--icon">
                        <FunnelIcon class="filter-icon" />
                        <select v-model="yearsFilter" class="filter-select filter-select--with-icon">
                            <option value="">Select Year</option>
                            <option v-for="year in yearOptions" :key="year" :value="year.toString()">
                                {{ year }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="filter-actions">
                    <Button type="button" class="export-button export-button--pdf" @click="exportPdf">
                        Export PDF
                    </Button>
                    <Button type="button" class="export-button export-button--excel" @click="exportExcel">
                        Export Excel
                    </Button>
                    <button
                        v-if="monthsFilter || yearsFilter"
                        type="button"
                        class="clear-filter-button"
                        @click="clearFilters"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="ems-table-wrap table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Total Present</th>
                        <th>Total Absent</th>
                        <th>Total Late</th>
                        <th>Salary</th>
                        <th>Gross pay</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in filteredPositionAttendanceRows" :key="row.id">
                        <td>{{ row.fullName }}</td>
                        <td>{{ row.totalPresent }}</td>
                        <td>{{ row.totalAbsent }}</td>
                        <td>{{ row.totalLate }}</td>
                        <td>{{ row.salary }}</td>
                        <td>{{ row.grossPay }}</td>
                        <td>{{ row.dates }}</td>
                    </tr>
                    <tr v-if="!filteredPositionAttendanceRows.length">
                        <td colspan="7" class="empty-state">No position attendance found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>
.view-department-attendance-page {
    width: 100%;
    max-width: 100%;
    min-width: 0;
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
    grid-template-columns: minmax(320px, 480px);
    align-items: start;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.filter-control {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
}

.filter-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
    gap: 0.75rem;
}

.filter-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
}

.export-button,
.clear-filter-button {
    width: 100%;
}

.export-button--pdf {
    background: #fef2f2;
    color: #991b1b;
    border-color: #fecaca;
}

.export-button--excel {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
}

.export-button:hover {
    filter: brightness(0.96);
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
}

.filter-dropdown,
.filter-dropdown--icon {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
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
    padding-right: 2rem;
}

@media (max-width: 820px) {
    .attendance-search {
        grid-template-columns: 1fr;
        align-items: end;
        width: 100%;
        max-width: min(100%, var(--filter-stack-width));
    }
}

@media (max-width: 540px) {
    .attendance-search {
        grid-template-columns: 1fr;
        gap: 0.55rem;
        align-items: stretch;
    }

    .filter-control {
        width: 100%;
    }

    .filter-row {
        grid-template-columns: 1fr;
    }

    .filter-dropdown,
    .filter-dropdown--icon {
        width: 100%;
    }

    .filter-select {
        width: 100%;
        min-height: 44px;
        font-size: 0.95rem;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-right: 12px;
    }

    .filter-actions {
        gap: 0.75rem;
    }

    .export-button,
    .clear-filter-button {
        width: 100%;
    }
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

</style>
