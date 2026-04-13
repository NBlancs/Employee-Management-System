<script setup lang="ts">
import { ref } from 'vue'
import Employee from './employee.vue'
import NewEmployee from './new-employee.vue'
import EmployeeInfo from './employee-info.vue'

const currentView = ref<'list' | 'new' | 'info'>('list')
const showSuccessAlert = ref(false)
const selectedEmployeeId = ref<number | null>(null)

function openNewEmployee() {
    selectedEmployeeId.value = null
    currentView.value = 'new'
}

function backToList() {
    selectedEmployeeId.value = null
    currentView.value = 'list'
}

function openEmployeeInfo(employeeId: number) {
    selectedEmployeeId.value = employeeId
    currentView.value = 'info'
}

function onEmployeeCreated() {
    showSuccessAlert.value = true
    setTimeout(() => {
        showSuccessAlert.value = false
    }, 3000)
}
</script>

<template>
    <Employee
        v-if="currentView === 'list' && selectedEmployeeId === null"
        :showSuccessAlert="showSuccessAlert"
        @add-employee="openNewEmployee"
        @view-employee="openEmployeeInfo"
    />
    <NewEmployee
        v-else-if="currentView === 'new'"
        @back="backToList"
        @employeeCreated="onEmployeeCreated"
    />
    <EmployeeInfo
        v-else-if="currentView === 'info' && selectedEmployeeId !== null"
        :employeeId="selectedEmployeeId"
        @back="backToList"
    />
</template>