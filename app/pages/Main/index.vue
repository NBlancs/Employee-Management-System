<script setup lang="ts">
import Main from './main.vue';
import Dashboard from '../Dashboard/dashboard.vue';
import Employee from '../Employees/employee.vue';

definePageMeta({
    middleware: 'middleware',
})

</script>

<template>
        <Main>
            <template #content="{ activeTab }">
                <Dashboard v-if="activeTab === 'overview'" />
                <Employee v-if="activeTab === 'employees'" />
            </template>
        </Main>
</template>