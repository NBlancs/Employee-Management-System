<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'
import Badge from '~/components/Badge.vue'
import CheckBox from '~/components/CheckBox.vue'
import Alert from '~/components/Alert.vue'
import Modal from '~/components/Modal.vue'

type EmployeeRow = {
    id: number
    name: string
    cardStatus: 'Has Card' | 'No Card'
    department: string
    cardNumber: string
}

const props = defineProps<{
    showSuccessAlert?: boolean
    employees?: EmployeeRow[]
}>()

const emit = defineEmits<{
    addEmployee: []
    viewEmployee: [employeeId: number]
    deleteEmployee: [employeeId: number]
}>()

const searchQuery = ref('')
const departmentQuery = ref('')
const noCardFilter = ref(false)
const isExactSearchMode = ref(false)
const hasLoadedEmployeeTable = useState<boolean>('has-loaded-employee-table', () => false)
const isTableLoading = ref(!hasLoadedEmployeeTable.value)
const deleteModal = ref(false)
const deleteLoadingModal = ref(false)
const employeeIdToDelete = ref<number | null>(null)
const showDeleteSuccessAlert = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let deleteTimer: ReturnType<typeof setTimeout> | null = null
let deleteAlertTimer: ReturnType<typeof setTimeout> | null = null

const filteredEmployees = computed(() => {
    const query = normalizeSearchValue(searchQuery.value)

    return tableEmployees.value.filter((employee) => {
        const searchCandidates = getEmployeeSearchCandidates(employee)

                const matchesSearch =
                        query.length === 0
                                ? true
                                : isExactSearchMode.value
                    ? searchCandidates.some(candidate => candidate === query)
                    : searchCandidates.some(candidate => candidate.includes(query))

        const matchesDepartment =
            departmentQuery.value.length === 0 ||
            employee.department === departmentQuery.value

        const matchesNoCard = !noCardFilter.value || employee.cardStatus === 'No Card'

        return matchesSearch && matchesDepartment && matchesNoCard
    })
})

function handleViewEmployee(employeeId: number) {
    emit('viewEmployee', employeeId)
}


function handleDeleteEmployee(employeeId: number) {
    employeeIdToDelete.value = employeeId
    deleteModal.value = true
}

function handleAddEmployee() {
    emit('addEmployee')
}

function getCardBadgeColor(cardStatus: string) {
    return cardStatus === 'Has Card' ? 'green' : 'red'
}

function cancelDelete() {
    employeeIdToDelete.value = null
    deleteModal.value = false
}

function confirmDelete() {
    if (employeeIdToDelete.value === null) {
        deleteModal.value = false
        return
    }

    deleteModal.value = false
    deleteLoadingModal.value = true

    if (deleteTimer) {
        clearTimeout(deleteTimer)
    }

    deleteTimer = setTimeout(() => {
        if (employeeIdToDelete.value === null) {
            deleteLoadingModal.value = false
            return
        }

        if (props.employees) {
            emit('deleteEmployee', employeeIdToDelete.value)
        } else {
            sharedEmployeeRows.value = sharedEmployeeRows.value.filter(employee => employee.id !== employeeIdToDelete.value)
        }

        employeeIdToDelete.value = null
        deleteLoadingModal.value = false
        showDeleteSuccessAlert.value = true

        if (deleteAlertTimer) {
            clearTimeout(deleteAlertTimer)
        }

        deleteAlertTimer = setTimeout(() => {
            showDeleteSuccessAlert.value = false
        }, 3000)
    }, 1200)
}


const defaultEmployees: EmployeeRow[] = [
    { id: 1, name: 'Lascuña, Joel Kent', cardStatus: 'Has Card', department: 'IT', cardNumber: 'IDC-IT-1001' },
    { id: 2, name: 'Valle, Jayneth', cardStatus: 'Has Card', department: 'HR', cardNumber: 'IDC-HR-1002' },
    { id: 3, name: 'Maturan, Walter', cardStatus: 'No Card', department: 'Finance', cardNumber: '' },
    { id: 4, name: 'Callo, Je-ann', cardStatus: 'Has Card', department: 'IT', cardNumber: 'IDC-IT-1004' },
]

const sharedEmployeeRows = useState<EmployeeRow[]>('employees-table-rows', () => defaultEmployees)

watch(() => props.employees, (employees) => {
    if (!employees || employees.length === 0) {
        return
    }

    sharedEmployeeRows.value = employees
}, { immediate: true })

const tableEmployees = computed(() => props.employees ?? sharedEmployeeRows.value)

function normalizeSearchValue(value: string) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

function getEmployeeSearchCandidates(employee: EmployeeRow) {
    const [lastNameRaw = '', firstNameRaw = ''] = employee.name.split(',')
    const normalizedLastName = normalizeSearchValue(lastNameRaw)
    const normalizedFirstNameFull = normalizeSearchValue(firstNameRaw)
    const normalizedFirstName = normalizedFirstNameFull.split(' ')[0] ?? ''

    return [
        normalizeSearchValue(employee.name),
        normalizedFirstName,
        normalizedFirstNameFull,
        normalizedLastName,
        normalizeSearchValue(employee.department),
        normalizeSearchValue(employee.cardNumber),
        normalizeSearchValue(employee.cardStatus),
    ].filter(Boolean)
}

function onSearch() {
    isExactSearchMode.value = true
}

function clearDepartmentFilter() {
    departmentQuery.value = ''
}

watch(searchQuery, () => {
    isExactSearchMode.value = false
})

onMounted(() => {
    if (hasLoadedEmployeeTable.value) {
        isTableLoading.value = false
        return
    }

    loadingTimer = setTimeout(() => {
        isTableLoading.value = false
        hasLoadedEmployeeTable.value = true
    }, 1200)
})

onUnmounted(() => {
    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }

    if (deleteTimer) {
        clearTimeout(deleteTimer)
    }

    if (deleteAlertTimer) {
        clearTimeout(deleteAlertTimer)
    }
})


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

            <div class="department-and-card-filters">
                <div class="department-filter-control">
                    <div class="department-dropdown">
                        <select v-model="departmentQuery" class="filter-select" aria-label="Filter by department">
                            <option value="">Department</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>

                    <button
                        v-if="departmentQuery"
                        type="button"
                        class="clear-filter-button"
                        @click="clearDepartmentFilter"
                    >
                        Clear
                    </button>
                </div>

                <div class="card-filters" aria-label="Filter by card status">
                    <CheckBox v-model="noCardFilter" label="No card" />
                </div>
            </div>
            

        </form>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="employees-table-wrap">
            <table class="employees-table" :aria-busy="isTableLoading ? 'true' : 'false'">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Department</th>
                        <th>ID Card</th>
                        <th class="actions-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isTableLoading" class="loading-row" role="status" aria-live="polite">
                        <td class="loading-cell" colspan="4">
                            <div class="loading-content">
                                <span class="table-spinner" aria-hidden="true"></span>
                                <span>Loading employees...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="employee in isTableLoading ? [] : filteredEmployees" :key="employee.id">
                        <td>{{ employee.name }}</td>
                        <td>{{ employee.department }}</td>
                        <td>
                            <Badge
                                :label="employee.cardStatus"
                                variant="subtle"
                                size="sm"
                                :color="getCardBadgeColor(employee.cardStatus)"
                            />
                        </td>
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

        <div v-if="props.showSuccessAlert" class="success-alert-container">
            <Alert
                title="Success"
                message="Employee created successfully!"
                variant="success"
                :dismissible="false"
            />
        </div>

        <div v-if="showDeleteSuccessAlert" class="success-alert-container">
            <Alert
                title="Success"
                message="Employee deleted successfully!"
                variant="success"
                :dismissible="false"
            />
        </div>
    </div>

    <Modal
        v-model:open="deleteModal"
        :hide-trigger="true"
        :show-footer="false"
        title=""
        description=""
    >
        <div class="delete-modal">
            <p class="delete-modal__text">Are you sure you want to delete?</p>

            <div class="delete-modal__actions">
                <button type="button" class="delete-modal__button delete-modal__button--subtle" @click="cancelDelete">
                    No
                </button>

                <button type="button" class="delete-modal__button delete-modal__button--danger" @click="confirmDelete">
                    Yes, Delete
                </button>
            </div>
        </div>
    </Modal>

    <Modal
        v-model:open="deleteLoadingModal"
        :hide-trigger="true"
        :show-footer="false"
        :dismissible="false"
        title=""
        description=""
    >
        <div class="delete-loading-modal">
            <span class="delete-loading-modal__spinner" aria-hidden="true"></span>
            <p class="delete-loading-modal__text">Deleting Employee</p>
        </div>
    </Modal>

    
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



@media (max-width: 1024px) {
    .employee-search {
        grid-template-columns: 1fr auto;
    }
}

@media (max-width: 768px) {
    .employee-search {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
    }

    .department-dropdown {
        width: 100%;
    }

    .search-button {
        min-height: 36px;
        padding: 8px 10px;
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
        min-height: 38px;
        padding: 8px 10px;
        font-size: 0.82rem;
    }

    .department-dropdown {
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

.filter-select {
    width: 100%;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    padding: 8px 12px;
    appearance: none;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5l3.5 3 3.5-3'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 2rem;
}

.filter-select:focus {
    border-color: #635bff;
    box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.2);
}

.department-dropdown {
    position: relative;
    width: 180px;
    max-width: 100%;
    flex: 0 0 auto;
}

.department-and-card-filters {
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
    width: auto;
}

.department-filter-control {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
}

.clear-filter-button {
    min-height: 32px;
    width: auto;
    padding: 7px 10px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #ffffff;
    color: #334155;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
}

.clear-filter-button:hover {
    background: #f8fafc;
    border-color: #94a3b8;
}

.card-filters {
    display: inline-flex;
    align-items: center;
    gap: 1.25rem;
    min-height: 36px;
}

@media (max-width: 768px) {
    .department-and-card-filters {
        width: 100%;
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .department-filter-control {
        width: auto;
    }

    .card-filters {
        width: 100%;
        justify-content: flex-start;
        flex-wrap: wrap;
        row-gap: 0.6rem;
        column-gap: 1rem;
    }
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

.success-alert-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 50;
    max-width: 400px;
}

.delete-modal {
    display: grid;
    justify-items: center;
    gap: 1rem;
    text-align: center;
    padding: 0.35rem 0.2rem 0.1rem;
}

.delete-modal__text {
    margin: 0;
    font-size: 0.98rem;
    color: #374151;
    line-height: 1.5;
}

.delete-modal__actions {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
}

.delete-modal__button {
    min-width: 110px;
    border-radius: 10px;
    border: 1px solid transparent;
    padding: 9px 14px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.delete-modal__button--subtle {
    color: #2563eb;
    background: #eff6ff;
    border-color: #dbeafe;
}

.delete-modal__button--subtle:hover {
    background: #e5e7eb;
}

.delete-modal__button--danger {
    background: #fef2f2;
    border-color: #fecaca;
    color: #b91c1c;
}

.delete-modal__button--danger:hover {
    background: #fee2e2;
}

.delete-loading-modal {
    display: grid;
    justify-items: center;
    gap: 0.85rem;
    padding: 0.4rem 0.2rem;
    text-align: center;
}

.delete-loading-modal__spinner {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 3px solid #dbeafe;
    border-top-color: #3b82f6;
    animation: delete-spin 0.8s linear infinite;
}

.delete-loading-modal__text {
    margin: 0;
    font-size: 0.95rem;
    color: #000000;
    font-weight: 200;
}

@keyframes delete-spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 640px) {
    .success-alert-container {
        top: 16px;
        right: 16px;
        left: 16px;
        max-width: none;
    }
}

</style>