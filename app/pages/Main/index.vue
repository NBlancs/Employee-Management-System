<script setup lang="ts">
import Main from './main.vue';
import Dashboard from '../Dashboard/dashboard.vue';
import Employee from '../Employees/employee.vue';
import Department from '../Departments/department.vue';
import Attendance from '../Attendance/attendance.vue';
import Transactions from '../Transactions/transactions.vue';
import Reports from '../Reports/reports.vue';
import Settings from '../Settings/settings.vue';

definePageMeta({
    middleware: 'middleware',
})

</script>

<template>
        <Main>
            <template #content="{ activeTab }">
                <Dashboard v-if="activeTab === 'overview'" />
                <Employee v-if="activeTab === 'employees'" />
                <Department v-if="activeTab === 'department'" />
                <Attendance v-if="activeTab === 'attendance'"/>
                <Transactions v-if="activeTab === 'transactions'"/>
                <Reports v-if="activeTab === 'reports'"/>
                <Settings v-if="activeTab === 'settings'"/>
            </template>
        </Main>
</template>