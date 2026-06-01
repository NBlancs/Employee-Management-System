<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { computed, onUnmounted, ref } from 'vue'
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
    fullName: string
    position: string
    salary: number
}

interface AttendanceStatsRecord {
    date: string
    present: number
    absent: number
    late: number
}

const props = defineProps<{
    attendance: AttendanceData | null
}>()

const emit = defineEmits<{
    back: []
}>()

const selectedDate = ref(props.attendance?.date ?? '')
const appliedDate = ref('')
const hasSearched = ref(false)
const isSearching = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | null = null

const dummyAttendanceRecords: AttendanceStatsRecord[] = [
    { date: '2026-04-20', present: 18, absent: 1, late: 2 },
    { date: '2026-04-21', present: 16, absent: 2, late: 3 },
    { date: '2026-04-22', present: 17, absent: 1, late: 1 },
]

const dateMatchedAttendance = computed(() => {
    if (!appliedDate.value) {
        return null
    }

    const sourceRecords: AttendanceStatsRecord[] = [
        ...dummyAttendanceRecords,
        ...(props.attendance
            ? [{ date: props.attendance.date, present: props.attendance.present, absent: props.attendance.absent, late: props.attendance.late }]
            : []),
    ]

    return sourceRecords.find((record) => record.date === appliedDate.value) ?? null
})

function handleBack() {
    emit('back')
}

function handleSearch() {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }

    hasSearched.value = true
    isSearching.value = true

    searchTimer = setTimeout(() => {
        appliedDate.value = selectedDate.value
        isSearching.value = false
    }, 900)
}

function handleClearDate() {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }

    selectedDate.value = ''
    appliedDate.value = ''
    hasSearched.value = false
    isSearching.value = false
}

onUnmounted(() => {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
})
</script>

<template>
    <section class="summary-page">
        <div class="summary-header">
            <button type="button" class="back-button" aria-label="Go back to attendance list" @click="handleBack">
                <ArrowLeftIcon class="back-icon" />
            </button>
            <h1 class="summary-title">Employee Attendance Summary</h1>
        </div>

        <div class="summary-details" aria-label="Employee summary details">
            <div class="detail-row">
                <span class="detail-label">Full name</span>
                <span class="detail-value">{{ props.attendance?.fullName ?? '-' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Department</span>
                <span class="detail-value">{{ props.attendance?.department ?? '-' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Position</span>
                <span class="detail-value">{{ props.attendance?.position ?? '-' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Salary</span>
                <span class="detail-value">{{ typeof props.attendance?.salary === 'number' ? `PHP ${props.attendance.salary.toLocaleString()}` : '-' }}</span>
            </div>
        </div>

        <form class="summary-filters" @submit.prevent="handleSearch">
            <div class="date-field">
                <label class="date-label" for="summary-date">Date</label>
                <input
                    id="summary-date"
                    v-model="selectedDate"
                    type="date"
                    class="date-input"
                    aria-label="Select summary date"
                />
            </div>

            <Button
                type="submit"
                variant="solid"
                class="search-button"
            >
                <span>Search</span>
            </Button>
            <button v-if="selectedDate" type="button" class="clear-button" @click="handleClearDate">Clear</button>
        </form>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="summary-table-wrap">
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Late</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isSearching" class="loading-row" role="status" aria-live="polite">
                        <td colspan="3" class="loading-cell">
                            <div class="loading-content">
                                <span class="table-spinner" aria-hidden="true"></span>
                                <span>Loading attendance</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="!hasSearched">
                        <td colspan="3" class="empty-state">Select a date.</td>
                    </tr>
                    <tr v-else-if="dateMatchedAttendance">
                        <td>{{ dateMatchedAttendance.present }}</td>
                        <td>{{ dateMatchedAttendance.absent }}</td>
                        <td>{{ dateMatchedAttendance.late }}</td>
                    </tr>
                    <tr v-else>
                        <td colspan="3" class="empty-state">No attendance recorded in this date.</td>
                    </tr>
                </tbody>
            </table>
        </div>


    </section>
</template>

<style scoped>
.summary-page {
    width: 100%;
}

.summary-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
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

.summary-title {
    margin: 0;
    font-size: 1.1rem;
    color: #1f2937;
}

.summary-filters {
    margin-top: 1rem;
    display: flex;
    align-items: end;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.date-field {
    display: grid;
    gap: 0.35rem;
}

.date-label {
    font-size: 0.82rem;
    color: #475569;
    font-weight: 600;
}

.date-input {
    min-height: 38px;
    min-width: 0;
    width: 100%;
    max-width: 280px;
    padding: 8px 10px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.date-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.clear-button {
    min-height: 38px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid transparent;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
}

.search-button {
    margin-inline: 0;
    width: 96px;
    min-height: 36px;
    padding: 8px 10px;
    font-size: 0.8rem;
}

.clear-button {
    background: #ffffff;
    color: #334155;
    border-color: #d1d5db;
}

.form-divider {
    width: 100%;
    height: 1px;
    margin-top: 0.9rem;
    background: #e5e7eb;
}

.summary-table-wrap {
    width: 100%;
    margin-top: 0.9rem;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
}

.summary-table {
    width: 100%;
    min-width: var(--table-min-width);
    border-collapse: collapse;
}

.summary-table th,
.summary-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.85rem;
    color: #1f2937;
    text-align: left;
}

.summary-table th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
}

.summary-table tbody tr:last-child td {
    border-bottom: 0;
}

.empty-state {
    text-align: center;
    color: #64748b;
}

.loading-cell {
    text-align: center;
    color: #475569;
}

.loading-content {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
}

.table-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #cbd5e1;
    border-top-color: #475569;
    border-radius: 999px;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.selected-date {
    margin: 0.7rem 0 0;
    color: #475569;
    font-size: 0.88rem;
}

.summary-details {
    margin-top: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    padding: 0.85rem 0.95rem;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
}

.detail-row {
    padding: 0.2rem 0.25rem;
    display: grid;
    gap: 0.3rem;
}

.detail-label {
    color: #475569;
    font-size: 0.9rem;
    font-weight: 600;
}

.detail-value {
    color: #1f2937;
    font-size: 0.9rem;
}

.summary-subtitle {
    margin: 0.8rem 0 0;
    color: #475569;
    font-size: 0.9rem;
}

@media (max-width: 1024px) {
    .summary-details {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .summary-details {
        grid-template-columns: 1fr;
    }

    .summary-table {
        min-width: var(--table-min-width);
    }

    .summary-filters {
        flex-direction: column;
        align-items: stretch;
    }

    .date-field,
    .date-input,
    .search-button,
    .clear-button {
        width: 100%;
    }

    .date-input {
        min-width: 0;
    }

    .search-button,
    .clear-button {
        min-height: 44px;
    }

    .summary-title {
        font-size: 1rem;
    }
}
</style>