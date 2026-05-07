<script setup lang="ts">
import { ref } from 'vue'
import Attendance from './attendance.vue'
import ShiftHours from './shift-hours.vue'
import ViewDepartmentAttendance from './view-department-attendance.vue'
import EmployeeAttendanceSummary from './employee-attendance-summary.vue'

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

interface EmployeeAttendanceSummaryData extends AttendanceData {
    fullName: string
    position: string
    salary: number
}

const selectedAttendanceForShiftHours = ref<AttendanceData | null>(null)
const selectedAttendanceForDepartment = ref<AttendanceData | null>(null)
const selectedAttendanceForSummary = ref<EmployeeAttendanceSummaryData | null>(null)

function handleViewShiftHours(attendance: AttendanceData) {
    selectedAttendanceForShiftHours.value = attendance
    selectedAttendanceForDepartment.value = null
    selectedAttendanceForSummary.value = null
}

function handleViewDepartment(attendance: AttendanceData) {
    selectedAttendanceForDepartment.value = attendance
    selectedAttendanceForShiftHours.value = null
    selectedAttendanceForSummary.value = null
}

function handleViewSummaryFromDepartment(attendance: EmployeeAttendanceSummaryData) {
    selectedAttendanceForSummary.value = attendance
    selectedAttendanceForShiftHours.value = null
}

function handleBackToAttendance() {
    selectedAttendanceForShiftHours.value = null
    selectedAttendanceForDepartment.value = null
    selectedAttendanceForSummary.value = null
}

function handleBackFromSummary() {
    selectedAttendanceForSummary.value = null

    if (selectedAttendanceForDepartment.value) {
        return
    }

    handleBackToAttendance()
}
</script>

<template>
    <Attendance
        v-if="!selectedAttendanceForShiftHours && !selectedAttendanceForDepartment && !selectedAttendanceForSummary"
        @view-department="handleViewDepartment"
        @view-shift-hours="handleViewShiftHours"
    />

    <EmployeeAttendanceSummary
        v-else-if="selectedAttendanceForSummary"
        :attendance="selectedAttendanceForSummary"
        @back="handleBackFromSummary"
    />

    <ViewDepartmentAttendance
        v-else-if="selectedAttendanceForDepartment"
        :attendance="selectedAttendanceForDepartment"
        @back="handleBackToAttendance"
        @view-summary="handleViewSummaryFromDepartment"
    />

    <ShiftHours
        v-else
        :attendance="selectedAttendanceForShiftHours"
        @back="handleBackToAttendance"
    />
</template>