<script setup lang="ts">
import { ref } from 'vue'
import Employee from './employee.vue'
import NewEmployee from './new-employee.vue'

const currentView = ref<'list' | 'new'>('list')
const showSuccessAlert = ref(false)

function openNewEmployee() {
    currentView.value = 'new'
}

function backToList() {
    currentView.value = 'list'
}

function onEmployeeCreated() {
    showSuccessAlert.value = true
    setTimeout(() => {
        showSuccessAlert.value = false
    }, 3000)
}
</script>

<template>
    <Employee v-if="currentView === 'list'" :showSuccessAlert="showSuccessAlert" @add-employee="openNewEmployee" />
    <NewEmployee v-else @back="backToList" @employeeCreated="onEmployeeCreated" />
</template>