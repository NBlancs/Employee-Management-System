<script setup lang="ts">
import { computed, ref } from 'vue'
import { EyeIcon, ClockIcon, FunnelIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'
import Button from '~/components/Button.vue'

interface AttendanceRow {
    id: number
    department: string
    totalEmployees: number
    present: number
    absent: number
    late: number
    leave: number
    date: string
}

const emit = defineEmits<{
    viewDepartment: [attendance: AttendanceRow]
    viewShiftHours: [attendance: AttendanceRow]
}>()

const selectedDate = ref('')
const selectedDepartment = ref('')
const appliedDate = ref('')
const appliedDepartment = ref('')
const departmentOptions = [
    'Human Resources',
    'Information Technology',
    'Finance',
    'Operations',
]

const attendanceRows = ref<AttendanceRow[]>([
    { id: 1, department: 'Human Resources', totalEmployees: 18, present: 14, absent: 1, late: 2, leave: 1, date: '2026-04-22' },
    { id: 2, department: 'Information Technology', totalEmployees: 42, present: 35, absent: 3, late: 4, leave: 0, date: '2026-04-22' },
    { id: 3, department: 'Finance', totalEmployees: 24, present: 19, absent: 2, late: 1, leave: 2, date: '2026-04-21' },
    { id: 4, department: 'Operations', totalEmployees: 37, present: 31, absent: 2, late: 3, leave: 1, date: '2026-04-21' },
])

const filteredAttendanceRows = computed(() => {
    return attendanceRows.value.filter((row) => {
        const matchesDate = !appliedDate.value || row.date === appliedDate.value
        const matchesDepartment = !appliedDepartment.value || row.department === appliedDepartment.value

        return matchesDate && matchesDepartment
    })
})

function onSearchAttendance() {
    appliedDate.value = selectedDate.value
    appliedDepartment.value = selectedDepartment.value
}

function clearDepartmentFilter() {
    selectedDepartment.value = ''
    appliedDepartment.value = ''
}

function onViewAttendance(row: AttendanceRow) {
    emit('viewDepartment', row)
}

function onViewShiftHours() {
    const firstFilteredRow = filteredAttendanceRows.value[0]

    if (!firstFilteredRow) {
        return
    }

    emit('viewShiftHours', firstFilteredRow)
}
</script>

<template>
    <section class="attendance-page">

        <form class="attendance-search" @submit.prevent="onSearchAttendance">
            <div class="date-field">
                <label class="date-label" for="attendance-date">Select Date</label>
                <div class="filter-dropdown filter-dropdown--icon">
                    <CalendarDaysIcon class="calendar-icon" aria-hidden="true" />
                    <input
                        id="attendance-date"
                        v-model="selectedDate"
                        type="date"
                        class="date-input date-input--with-icon"
                        aria-label="Select attendance date"
                    />
                </div>
            </div>

            <Button
                type="submit"
                variant="solid"
                class="search-button"
            >
                Search
            </Button>

            <div class="department-field">
                <label class="date-label" for="attendance-department">Department</label>
                <div class="department-filter-control">
                    <div class="filter-dropdown filter-dropdown--icon">
                        <FunnelIcon class="filter-icon" />
                        <select
                            id="attendance-department"
                            v-model="selectedDepartment"
                            class="department-select filter-select--with-icon"
                            aria-label="Filter attendance by department"
                        >
                            <option value="">All Departments</option>
                            <option v-for="department in departmentOptions" :key="department" :value="department">
                                {{ department }}
                            </option>
                        </select>
                    </div>

                    <button
                        v-if="selectedDepartment"
                        type="button"
                        class="clear-filter-button"
                        @click="clearDepartmentFilter"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <Button
                type="button"
                variant="subtle"
                class="view-shift-hours-button"
                @click="onViewShiftHours"
            >
                <ClockIcon class="shift-hours-icon" />
                <span>View Shift Hours</span>
            </Button>
        </form>

        <div class="attendance-divider" aria-hidden="true"></div>

        <div class="ems-table-wrap attendance-table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Total Employees</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Late</th>
                        <th>Leave</th>
                        <th>Date</th>
                        <th class="actions-column">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in filteredAttendanceRows" :key="row.id">
                        <td>{{ row.department }}</td>
                        <td>{{ row.totalEmployees }}</td>
                        <td>{{ row.present }}</td>
                        <td>{{ row.absent }}</td>
                        <td>{{ row.late }}</td>
                        <td>{{ row.leave }}</td>
                        <td>{{ row.date }}</td>
                        <td>
                            <button
                                type="button"
                                class="action-button action-button--view"
                                :aria-label="`View ${row.department} attendance on ${row.date}`"
                                @click="onViewAttendance(row)"
                            >
                                <EyeIcon class="action-icon" />
                            </button>
                        </td>
                    </tr>
                    <tr v-if="!filteredAttendanceRows.length">
                        <td colspan="8" class="empty-state">No attendance records found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>
.attendance-page {
    width: 100%;
    max-width: 100%;
    min-width: 0;
}

td {
  font-size: 0.8rem;
}

th{
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
}

.attendance-title {
    margin: 0 0 0.9rem;
    font-size: 1rem;
}

.attendance-search {
    display: flex;
    align-items: end;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.attendance-divider {
    width: 100%;
    height: 1px;
    margin-top: 0.55rem;
    background: #e5e7eb;
}

.table-label {
    margin: 0.9rem 0 0.55rem;
    font-size: 0.88rem;
    font-weight: 600;
    color: #475569;
}

.date-field {
    display: grid;
    gap: 0.35rem;
}

.department-field {
    display: grid;
    gap: 0.35rem;
}

.department-filter-control {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
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

.department-select {
    min-height: 38px;
    min-width: 180px;
    width: auto;
    max-width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5l3.5 3 3.5-3'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 2rem;
}

.department-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
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
    cursor: pointer;
}

.clear-filter-button:hover {
    background: #f8fafc;
    border-color: #94a3b8;
}

.search-button {
    margin-inline: 0;
}

.attendance-table-wrap {
    margin-top: 1rem;
}

.view-shift-hours-button {
    margin: 0;
    margin-left: auto;
    margin-inline: 0;
    min-height: 34px;
    padding: 8px 12px;
    background: #eff6ff;
    border-color: #dbeafe;
    color: #1d4ed8;
}

.view-shift-hours-button:hover {
    background: #dbeafe;
    border-color: #bfdbfe;
}

.shift-hours-icon {
    width: 14px;
    height: 14px;
}

.action-button {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.action-button--view {
    color: #4f83d1;
    background: #f5f9ff;
    border-color: #e4efff;
}

.action-button--view:hover {
    color: #2563eb;
    background: #eff6ff;
    border-color: #dbeafe;
}

.action-icon {
    width: 13px;
    height: 13px;
}

.empty-state {
    text-align: center;
    color: #64748b;
}

@media (max-width: 640px) {
    .attendance-search {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: fit-content;
        max-width: min(100%, var(--filter-stack-width));
    }

    .date-field,
    .department-field,
    .view-shift-hours-button {
        margin-left: 0;
        width: var(--filter-stack-width);
        max-width: 100%;
    }

    .date-input {
        width: 100%;
        max-width: var(--control-width);
    }

    .department-filter-control {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
    }

    .department-select {
        width: 100%;
        max-width: var(--control-width);
        min-width: 0;
    }

    .clear-filter-button {
        width: 100%;
        max-width: var(--control-width);
    }

    /* Button order: Date -> Department -> View -> Search (bottom) */
    .date-field { order: 1; }
    .department-field { order: 2; }
    .view-shift-hours-button { order: 3; }
    .search-button { order: 4; }
}
</style>