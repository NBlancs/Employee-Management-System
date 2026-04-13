<script setup lang="ts">
import { ref } from 'vue'
import Main from './main.vue';
import Dashboard from '../Dashboard/dashboard.vue';
import Employee from '../Employees/employee.vue';
import NewEmployee from '../Employees/new-employee.vue';
import EmployeeInfo from '../Employees/employee-info.vue';
import Department from '../Departments/department.vue';
import DepartmentInfo from '../Departments/department-info.vue';
import Attendance from '../Attendance/attendance.vue';
import Transactions from '../Transactions/transactions.vue';
import Reports from '../Reports/reports.vue';
import Settings from '../Settings/settings.vue';

const selectedDepartmentId = ref<number | null>(null)
const selectedEmployeeId = ref<number | null>(null)
const isCreatingEmployee = ref(false)
const showSuccessAlert = ref(false)

function openDepartmentInfo(departmentId: number) {
    selectedDepartmentId.value = departmentId
}

function closeDepartmentInfo() {
    selectedDepartmentId.value = null
}

function openNewEmployee() {
    selectedEmployeeId.value = null
    isCreatingEmployee.value = true
}

function closeNewEmployee() {
    isCreatingEmployee.value = false
}

function openEmployeeInfo(employeeId: number) {
    isCreatingEmployee.value = false
    selectedEmployeeId.value = employeeId
}

function closeEmployeeInfo() {
    selectedEmployeeId.value = null
}

function onEmployeeCreated() {
    showSuccessAlert.value = true
    setTimeout(() => {
        showSuccessAlert.value = false
    }, 3000)
}

definePageMeta({
    middleware: 'middleware',
})

</script>

<template>
        <Main>
            <template #content="{ activeTab }">
                <Dashboard v-if="activeTab === 'overview'" />
                <Employee
                    v-if="activeTab === 'employees' && !isCreatingEmployee && selectedEmployeeId === null"
                    :show-success-alert="showSuccessAlert"
                    @add-employee="openNewEmployee"
                    @view-employee="openEmployeeInfo"
                />
                <NewEmployee
                    v-if="activeTab === 'employees' && isCreatingEmployee"
                    @back="closeNewEmployee"
                    @employee-created="onEmployeeCreated"
                />
                <EmployeeInfo
                    v-if="activeTab === 'employees' && selectedEmployeeId !== null"
                    :employee-id="selectedEmployeeId"
                    @back="closeEmployeeInfo"
                />
                <Department
                    v-if="activeTab === 'department' && !selectedDepartmentId"
                    @view-department="openDepartmentInfo"
                />
                <DepartmentInfo
                    v-if="activeTab === 'department' && selectedDepartmentId"
                    @back="closeDepartmentInfo"
                />
                <Attendance v-if="activeTab === 'attendance'"/>
                <Transactions v-if="activeTab === 'transactions'"/>
                <Reports v-if="activeTab === 'reports'"/>
                <Settings v-if="activeTab === 'settings'"/>
            </template>
        </Main>
</template>