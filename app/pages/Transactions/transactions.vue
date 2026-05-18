<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'
import Table from '~/components/Table.vue'

interface TransactionRow {
    transactionNo: string
    processedBy: string
    classification: string
    referenceNo: string
    referenceType: string
    referenceId: number
    date: string
    dateValue: string
}

const searchQuery = ref('')
const selectedDate = ref('')
const transactionRows = ref<TransactionRow[]>([])
const isLoading = ref(false)

const transactionColumns = [
    { accessorKey: 'transactionNo', header: 'Transaction No.' },
    { accessorKey: 'processedBy', header: 'Processed By' },
    { accessorKey: 'classification', header: 'Classification' },
    { accessorKey: 'referenceNo', header: 'Reference No.' },
    { accessorKey: 'date', header: 'Date' },
]

const filteredTransactionRows = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const dateFilter = selectedDate.value

    return transactionRows.value.filter((row) => {
        const matchesQuery = !query || row.transactionNo.toLowerCase().includes(query)

        const matchesDate = !dateFilter || row.dateValue === dateFilter

        return matchesQuery && matchesDate
    })
})

async function loadTransactions() {
    try {
        isLoading.value = true
        const response = await $fetch<{ success: boolean; data: TransactionRow[] }>('/api/transactions')
        const data = response?.data || []

        if (Array.isArray(data)) {
            transactionRows.value = data
        }
    } catch (error) {
        console.error('Failed to load transactions:', error)
        // Fallback to empty array
        transactionRows.value = []
    } finally {
        isLoading.value = false
    }
}

function handleSearch() {
    return
}

function clearSelectedDate() {
    selectedDate.value = ''
}

onMounted(() => {
    loadTransactions()
})
</script>

<template>
    <section class="transaction-page">
        <h1 class="transaction-title">Transaction Management</h1>

        <form class="transaction-search" @submit.prevent="handleSearch">
            <div class="search-input-wrap">
                <IconInput
                    v-model="searchQuery"
                    size="sm"
                    placeholder="Search transaction"
                    aria-label="Search transaction"
                >
                    <template #icon>
                        <MagnifyingGlassIcon class="search-icon" />
                    </template>
                </IconInput>

                <button
                    v-if="searchQuery"
                    type="button"
                    class="clear-search-btn"
                    @click="searchQuery = ''"
                    aria-label="Clear search"
                >
                    <XMarkIcon class="clear-icon" />
                </button>
            </div>

            <Button
                label="Search"
                variant="solid"
                type="submit"
                class="search-button"
            />

            <div class="date-field">
                <input
                    id="transaction-date"
                    v-model="selectedDate"
                    type="date"
                    class="date-input"
                    aria-label="Filter by transaction date"
                />

                <button
                    v-if="selectedDate"
                    type="button"
                    class="clear-date-button"
                    @click="clearSelectedDate"
                >
                    Clear
                </button>
            </div>
        </form>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="transactions-table-wrap">
            <Table
                :data="filteredTransactionRows"
                :columns="transactionColumns"
                class="transactions-table"
            />
        </div>
    </section>
</template>

<style scoped>

.transaction-page {
    width: 100%;
}

.transaction-title {
    margin: 0 0 0.9rem;
    font-size: 1rem;
}

.transaction-search {
    display: grid;
    grid-template-columns: 0.3fr auto minmax(220px, 0.45fr);
    align-items: end;
    justify-content: start;
    gap: 0.75rem;
}

.search-button {
    margin-inline: 0;
    width: 96px;
    min-height: 36px;
    padding: 8px 10px;
    font-size: 0.8rem;
}

.date-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: max-content;
    max-width: 100%;
}

.date-label {
    font-size: 0.82rem;
    color: #475569;
    font-weight: 600;
}

.date-input {
    width: 220px;
    flex: 0 0 220px;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    padding: 8px 10px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.date-input:focus {
    border-color: #635bff;
    box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.2);
}

.clear-date-button {
    min-height: 34px;
    padding: 7px 10px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #ffffff;
    color: #334155;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.clear-date-button:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
}

.form-divider {
    width: 100%;
    height: 1px;
    margin-top: 1rem;
    background-color: #e5e7eb;
}

.transactions-table-wrap {
    margin-top: 1rem;
    overflow-x: auto;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
}


:deep(.transactions-table .app-table) {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
}

:deep(.transactions-table .app-table th),
:deep(.transactions-table .app-table td) {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    font-size: 0.875rem;
    color: #1f2937;
}

:deep(.transactions-table .app-table th) {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
}

:deep(.transactions-table .app-table tbody tr:last-child td) {
    border-bottom: 0;
}

.search-icon {
    width: 16px;
    height: 16px;
}

@media (max-width: 1024px) {
    .transaction-search {
        grid-template-columns: 1fr auto;
    }

    .date-field {
        grid-column: 1 / -1;
    }
}

@media (max-width: 768px) {
    .transaction-search {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
    }

    .search-button {
        min-height: 36px;
        padding: 8px 10px;
        font-size: 0.8rem;
    }
}

@media (max-width: 640px) {
    .transaction-search {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        width: 220px;
    }

    .search-button {
        width: 100%;
        min-height: 38px;
        padding: 8px 10px;
        font-size: 0.82rem;
    }

    .date-field {
        width: 100%;
        max-width: 100%;
        justify-content: flex-start;
    }

    .date-input {
        width: auto;
        flex: 1 1 auto;
        min-width: 0;
    }

    .transaction-title {
        font-size: 0.9rem;
    }

    :deep(.transactions-table .app-table) {
        min-width: 640px;
    }
}

/* tighter space inside input */
.search-input-wrap :deep(input) {
    padding-right: 24px !important;
}

/* very small subtle clear button */
.clear-search-btn {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: none;
    background: rgba(239, 68, 68, 0.10);
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease;
}

/* icon must be smaller than button */
.clear-search-btn .clear-icon {
    width: 10px;
    height: 10px;
}

/* subtle hover */
.clear-search-btn:hover {
    background: rgba(239, 68, 68, 0.18);
    transform: translateY(-50%) scale(1.08);
}
.clear-icon {
    width: 14px;
    height: 14px;
}


</style>