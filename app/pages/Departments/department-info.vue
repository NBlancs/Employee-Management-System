<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
    back: []
}>()

function goBack() {
    emit('back')
}
</script>

<template>
    <div class="department-info-page">
        <div class="department-info-header">
            <button
                type="button"
                class="back-button"
                aria-label="Back"
                @click="goBack"
            >
                <ArrowLeftIcon class="back-icon" />
            </button>

            <h1 class="department-info-title">Department Details</h1>
        </div>
    </div>
</template>

<style scoped>
.department-info-page {
    width: 100%;
    display: grid;
    align-content: start;
    justify-items: start;
    gap: 0.75rem;
}

.department-info-header {
    display: grid;
    grid-template-columns: 28px auto;
    align-items: center;
    gap: 1rem;
}

.back-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: start;
    margin-inline: 0;
    width: 28px;
    height: 28px;
    min-height: 0;
    padding: 4px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #000000;
    cursor: pointer;
    line-height: 0;
}

.back-button:hover {
    background: #f8fafc;
}

.back-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

.department-info-title {
    margin: 0;
    font-size: 1rem;
    color: #1f2937;
}
</style>