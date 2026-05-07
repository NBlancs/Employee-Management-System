<script setup lang="ts">
import { ref } from 'vue'
import DepartmentList from './department.vue'
import DepartmentInfo from './department-info.vue'

interface DepartmentData {
    id: number
    name: string
    head: string
}

const selectedDepartment = ref<DepartmentData | null>(null)

function handleViewDepartment(department: DepartmentData) {
    selectedDepartment.value = department
}

function handleBackToDepartmentList() {
    selectedDepartment.value = null
}
</script>

<template>
    <DepartmentList
        v-if="!selectedDepartment"
        @view-department="handleViewDepartment"
    />

    <DepartmentInfo
        v-else
        :department="selectedDepartment"
        @back="handleBackToDepartmentList"
    />
</template>