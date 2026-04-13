<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { MagnifyingGlassIcon, EyeIcon, TrashIcon, FunnelIcon, PlusIcon } from '@heroicons/vue/24/outline'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'

const emit = defineEmits<{
    viewDepartment: [departmentId: number]
}>()

const searchQuery = ref('')
const departmentFilter = ref('')
const appliedSearchQuery = ref('')
const appliedDepartmentFilter = ref('')
const hasLoadedDepartmentTable = useState<boolean>('has-loaded-department-table', () => false)
const isTableLoading = ref(!hasLoadedDepartmentTable.value)
let loadingTimer: ReturnType<typeof setTimeout> | null = null

const departments = [
    { id: 1, name: 'Human Resources', head: 'Jayneth Valle', totalEmployees: 12 },
    { id: 2, name: 'Information Technology', head: 'Joel Kent Lascuna', totalEmployees: 24 },
    { id: 3, name: 'Finance', head: 'Walter Maturan', totalEmployees: 9 },
    { id: 4, name: 'Operations', head: 'Je-ann Callo', totalEmployees: 15 },
]

function handleViewDepartment(departmentId: number) {
    emit('viewDepartment', departmentId)
}

function handleDeleteDepartment(departmentId: number) {
    console.log('Delete department:', departmentId)
}

function handleAddDepartment() {
    console.log('Add department')
}

function onSearch() {
    appliedSearchQuery.value = searchQuery.value
    appliedDepartmentFilter.value = departmentFilter.value
}

const departmentOptions = computed(() => {
    return [...new Set(departments.map((department) => department.name))]
})

const filteredDepartments = computed(() => {
    const query = appliedSearchQuery.value.trim().toLowerCase()
    const selectedDepartment = appliedDepartmentFilter.value

    return departments.filter((department) => {
        const matchesDepartment = !selectedDepartment || department.name === selectedDepartment
        const matchesSearch =
            !query ||
            department.name.toLowerCase().includes(query) ||
            department.head.toLowerCase().includes(query)

        return (
            matchesDepartment && matchesSearch
        )
    })
})

onMounted(() => {
    if (hasLoadedDepartmentTable.value) {
        isTableLoading.value = false
        return
    }

    loadingTimer = setTimeout(() => {
        isTableLoading.value = false
        hasLoadedDepartmentTable.value = true
    }, 1200)
})

onUnmounted(() => {
    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }
})
</script>

<template>
    <div class="department-page">
        <h1 class="department-title">Department Management</h1>

        <form class="department-search" @submit.prevent="onSearch">
            <IconInput
                v-model="searchQuery"
                size="sm"
                placeholder="Search department"
                aria-label="Search department"
            >
                <template #icon>
                    <MagnifyingGlassIcon class="search-icon" />
                </template>
            </IconInput>

            <Button
                variant="solid"
                type="submit"
                class="search-button"
            >
                <span>Search</span>
            </Button>

            <div class="filter-dropdown">
                <FunnelIcon class="filter-icon" />
                <select v-model="departmentFilter" class="filter-select" aria-label="Filter department">
                    <option value="">All Departments</option>
                    <option v-for="option in departmentOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
                <span class="filter-caret" aria-hidden="true"></span>
            </div>

            <Button
                variant="solid"
                type="button"
                class="add-button"
                @click="handleAddDepartment"
            >
                <PlusIcon class="add-icon" />
                <span>Add Department</span>
            </Button>
        </form>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="departments-table-wrap">
            <table class="departments-table" :aria-busy="isTableLoading ? 'true' : 'false'">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Department Head</th>
                        <th>Total Employees</th>
                        <th class="actions-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isTableLoading" class="loading-row" role="status" aria-live="polite">
                        <td class="loading-cell" colspan="4">
                            <div class="loading-content">
                                <span class="table-spinner" aria-hidden="true"></span>
                                <span>Loading departments...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="department in isTableLoading ? [] : filteredDepartments" :key="department.id">
                        <td>{{ department.name }}</td>
                        <td>{{ department.head }}</td>
                        <td>{{ department.totalEmployees }}</td>
                        <td>
                            <div class="action-buttons">
                                <button
                                    type="button"
                                    class="action-button action-button--view"
                                    :aria-label="`View ${department.name}`"
                                    @click="handleViewDepartment(department.id)"
                                >
                                    <EyeIcon class="action-icon" />
                                </button>

                                <button
                                    type="button"
                                    class="action-button action-button--delete"
                                    :aria-label="`Delete ${department.name}`"
                                    @click="handleDeleteDepartment(department.id)"
                                >
                                    <TrashIcon class="action-icon" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!isTableLoading && !filteredDepartments.length">
                        <td colspan="4" class="empty-state">No departments found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.department-page {
    width: 100%;
}

.department-title {
    font-size: 1rem;
    margin-bottom: 0.9rem;
}

.department-search {
    display: grid;
    grid-template-columns: minmax(240px, 360px) auto 190px 1fr auto;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.form-divider {
    width: 100%;
    height: 1px;
    margin-bottom: 1rem;
    background-color: #e5e7eb;
}

.search-button {
    margin-inline: 0;
    width: 96px;
    min-height: 36px;
    padding: 8px 10px;
    font-size: 0.8rem;
}

.search-button-icon {
    width: 14px;
    height: 14px;
}

.add-button {
    grid-column: 5;
    justify-self: end;
    margin-inline: 0;
    width: 144px;
    min-height: 36px;
    padding: 8px 10px;
    font-size: 0.8rem;
    white-space: nowrap;
}

.add-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: currentColor;
}

.filter-dropdown {
    position: relative;
    width: 100%;
    min-width: 180px;
    max-width: 240px;
}

.filter-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #6b7280;
    pointer-events: none;
}

.filter-select {
    width: 100%;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    padding: 8px 30px 8px 32px;
    appearance: none;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filter-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.filter-caret {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    border-right: 2px solid #6b7280;
    border-bottom: 2px solid #6b7280;
    pointer-events: none;
}

.departments-table-wrap {
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
}

.loading-cell {
    height: 180px;
    border-bottom: 0 !important;
    padding: 0 !important;
}

.loading-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #64748b;
    font-size: 0.88rem;
    text-align: center;
}

.table-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #dbeafe;
    border-top-color: #3b82f6;
    border-radius: 999px;
    animation: table-spin 0.8s linear infinite;
}

@keyframes table-spin {
    to {
        transform: rotate(360deg);
    }
}

.departments-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 760px;
}

.departments-table th,
.departments-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
    color: #1f2937;
    text-align: left;
}

.departments-table th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
}

.departments-table tbody tr:last-child td {
    border-bottom: 0;
}

.actions-column {
    width: 150px;
}

.action-buttons {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: #f8fafc;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.action-button:hover {
    background: #f1f5f9;
}

.action-button--view {
    color: #2563eb;
    background: #eff6ff;
    border-color: #dbeafe;
}

.action-button--view:hover {
    background: #dbeafe;
}

.action-button--delete {
    color: #dc2626;
    background: #fef2f2;
    border-color: #fecaca;
}

.action-button--delete:hover {
    background: #fecaca;
}

.action-icon {
    width: 13px;
    height: 13px;
}

.empty-state {
    text-align: center;
    color: #64748b;
}

.search-icon {
    width: 16px;
    height: 16px;
}

@media (max-width: 900px) {
    .department-search {
        grid-template-columns: 1fr auto 1fr;
        align-items: end;
    }

    .add-button {
        grid-column: 1 / -1;
        justify-self: start;
    }

    .filter-dropdown {
        max-width: none;
    }
}

@media (max-width: 640px) {
    .department-page {
        padding-inline: 0;
    }

    .department-title {
        font-size: 0.95rem;
    }

    .department-search {
        grid-template-columns: 1fr;
        gap: 0.55rem;
        align-items: stretch;
    }

    .search-button,
    .add-button,
    .filter-dropdown {
        width: 100%;
        max-width: none;
    }

    .search-button,
    .add-button {
        min-height: 38px;
        font-size: 0.82rem;
        justify-content: center;
    }

    .add-button {
        grid-column: auto;
        justify-self: stretch;
    }

    .departments-table {
        min-width: 640px;
    }

    .departments-table th,
    .departments-table td {
        padding: 12px 12px;
        font-size: 0.8125rem;
    }
}
</style>