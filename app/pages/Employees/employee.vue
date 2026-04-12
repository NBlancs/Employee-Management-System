<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'

const searchQuery = ref('')
const filterQuery = ref('')
const departmentQuery = ref('')

function onSearch() {
    console.log('Searching employees:', searchQuery.value, 'Filter:', filterQuery.value, 'Department:', departmentQuery.value)
}

function handleViewEmployee(employeeId: number) {
    console.log('View employee:', employeeId)
}

function handleDeleteEmployee(employeeId: number) {
    console.log('Delete employee:', employeeId)
}

function handleAddEmployee() {
    console.log('Add employee')
}


const employees = [
    { id: 1, name: 'Lascuña, Joel Kent', position: 'Software Engineer', department: 'IT' },
    { id: 2, name: 'Valle, Jayneth', position: 'HR Specialist', department: 'HR' },
    { id: 3, name: 'Maturan, Walter', position: 'Financial Analyst', department: 'Finance' },
    { id: 4, name: 'Callo, Je-ann', position: 'Project Manager', department: 'IT'},
]


</script>


<template>
    <div class="employee-page">
        <h1 class="employee-title">Employee Management</h1>

        <form class="employee-search" @submit.prevent="onSearch">
            <IconInput
                v-model="searchQuery"
                size="sm"
                placeholder="Search employee"
                aria-label="Search employee"
            >
                <template #icon>
                    <MagnifyingGlassIcon class="search-icon" />
                </template>
            </IconInput>

            <Button
                label="Search"
                variant="solid"
                type="submit"
                class="search-button"
            />

            <div class="filter-dropdown">
                <FunnelIcon class="filter-icon" />
                <select v-model="filterQuery" class="filter-select" aria-label="Filter employee">
                    <option value="">Position</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                </select>
                <span class="filter-caret" aria-hidden="true"></span>
            </div>

            <div class="department-dropdown">
                <FunnelIcon class="filter-icon" />
                <select v-model="departmentQuery" class="filter-select" aria-label="Filter by department">
                    <option value="">Department</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                </select>
                <span class="filter-caret" aria-hidden="true"></span>
            </div>
            

        </form>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="employees-table-wrap">
            <table class="employees-table">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th class="actions-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee in employees" :key="employee.id">
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.position }}</td>
                        <td>{{ employee.department }}</td>
                        <td>
                            <div class="action-buttons">
                                <button type="button" class="action-button action-button--view" :aria-label="`View ${employee.name}`" @click="handleViewEmployee(employee.id)">
                                    <EyeIcon class="action-icon" />
                                </button>

                                <button type="button" class="action-button action-button--delete" :aria-label="`Delete ${employee.name}`" @click="handleDeleteEmployee(employee.id)">
                                    <TrashIcon class="action-icon" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button
            type="button"
            class="floating-add-button"
            aria-label="Add employee"
            @click="handleAddEmployee"
        >
            <PlusIcon class="floating-add-icon" />
        </button>

        
    </div>

    
</template>

<style scoped>
.employee-page {
    width: 100%;
}

.employee-title {
    font-size: 1rem;
    margin-bottom: 0.9rem;
}

.form-divider {
    width: 100%;
    height: 1px;
    margin-top: 1rem;
    background-color: #e5e7eb;
}

.employees-table-wrap {
    margin-top: 1rem;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
}

.employees-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 720px;
}

.employees-table th,
.employees-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.875rem;
    color: #1f2937;
    text-align: left;
}

.employees-table th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
}

.employees-table tbody tr:last-child td {
    border-bottom: 0;
}

.actions-column {
    width: 180px;
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

.action-button--update {
    color: #d97706;
    background: #fffbeb;
    border-color: #fef3c7;
}

.action-button--update:hover {
    background: #fef3c7;
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

.employee-search {
    display: grid;
    grid-template-columns: 0.3fr auto 0.2fr 0.2fr;
    align-items: end;
    justify-content: start;
    gap: 0.75rem;
}

.search-button {
    margin-inline: 0;
    min-height: 36px;
    padding: 8px 14px;
    font-size: 0.8rem;
}



@media (max-width: 1024px) {
    .employee-search {
        grid-template-columns: 1fr auto 1fr 1fr;
    }
}

@media (max-width: 768px) {
    .employee-search {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
    }

    .filter-dropdown {
        width: 100%;
    }

    .search-button {
        min-height: 36px;
        padding: 8px 12px;
        font-size: 0.8rem;
    }
}

@media (max-width: 640px) {
    .employee-search {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .search-button {
        width: 100%;
        padding: 8px 12px;
        font-size: 0.8rem;
    }

    .filter-dropdown {
        width: 100%;
    }

    .employee-title {
        font-size: 0.9rem;
    }

    .employees-table {
        min-width: 640px;
    }
}

.search-icon {
    width: 16px;
    height: 16px;
}

.filter-dropdown {
    position: relative;
    width: 100%;
}

.filter-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #6b7280;
    pointer-events: none;
}

.filter-select {
    width: 100%;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    padding: 8px 36px 8px 36px;
    appearance: none;
    outline: none;
}

.filter-caret {
    position: absolute;
    right: 14px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-right: 2px solid #6b7280;
    border-bottom: 2px solid #6b7280;
    transform: translateY(-65%) rotate(45deg);
    pointer-events: none;
}

.filter-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.department-dropdown {
    position: relative;
    width: 100%;
}

.floating-add-button {
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: 52px;
    height: 52px;
    border: 0;
    border-radius: 999px;
    background: #635bff;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 28px rgba(22, 163, 74, 0.28);
    cursor: pointer;
    z-index: 20;
}

.floating-add-button:hover {
    background: #716afb;
}

.floating-add-icon {
    width: 22px;
    height: 22px;
}

@media (max-width: 640px) {
    .floating-add-button {
        right: 16px;
        bottom: 16px;
        width: 46px;
        height: 46px;
    }

    .floating-add-icon {
        width: 18px;
        height: 18px;
    }
}

</style>