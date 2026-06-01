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
const departments = ref<string[]>([])
const noCardFilter = ref(false)
const isExactSearchMode = ref(false)
const hasLoadedEmployeeTable = useState<boolean>('has-loaded-employee-table', () => false)
const isTableLoading = ref(!hasLoadedEmployeeTable.value)
const deleteModal = ref(false)
const deleteLoadingModal = ref(false)
const employeeIdToDelete = ref<number | null>(null)
const showDeleteSuccessAlert = ref(false)
const showErrorAlert = ref(false)
const errorMessage = ref('')
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let deleteTimer: ReturnType<typeof setTimeout> | null = null
let deleteAlertTimer: ReturnType<typeof setTimeout> | null = null
let errorAlertTimer: ReturnType<typeof setTimeout> | null = null

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


function isAdminUser() {
    return currentUser.value?.role?.trim().toLowerCase() === 'admin'
}

function showDeleteError(message: string) {
    errorMessage.value = message
    showErrorAlert.value = true

    if (errorAlertTimer) {
        clearTimeout(errorAlertTimer)
    }

    errorAlertTimer = setTimeout(() => {
        showErrorAlert.value = false
    }, 3000)
}

function handleDeleteEmployee(employeeId: number) {
    if (!isAdminUser()) {
        showDeleteError('You dont have a permission to delete')
        return
    }

    if (employeeId === currentUser?.value?.employeeId) {
        showDeleteError('You cannot delete your own information.')
        return
    }

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

    deleteTimer = setTimeout(async () => {
        if (employeeIdToDelete.value === null) {
            deleteLoadingModal.value = false
            return
        }

        if (props.employees) {
            emit('deleteEmployee', employeeIdToDelete.value)
        } else {
            try {
                const actorId = currentUser.value?.employeeId
                if (!actorId) {
                    showDeleteError('You must be signed in to delete employees.')
                    deleteLoadingModal.value = false
                    return
                }

                await $fetch(`/api/employees/${employeeIdToDelete.value}?transacted_by=${actorId}`, { method: 'DELETE' })

                // Only remove from UI if backend delete succeeded
                sharedEmployeeRows.value = sharedEmployeeRows.value.filter(employee => employee.id !== employeeIdToDelete.value)
            } catch (err) {
                // show backend error and do not remove from UI
                const message = (err as any)?.data?.message || (err as any)?.message || 'Failed to delete employee.'
                showDeleteError(message)
            }
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


const sharedEmployeeRows = useState<EmployeeRow[]>('employees-table-rows', () => [])
// const sharedEmployeeRows = useState<EmployeeRow[]>('employees-table-rows', () => [
//   {
//     id: 1,
//     name: 'Maturan, Walter, B.',
//     department: 'Human Resources',
//     cardStatus: 'Has Card',
//     cardNumber: '1234567890',
//   },
  
// ])
const userCookie = useCookie<string | null>('ems_user')

type LoggedInUser = {
    employeeId: number
    accountId: number
    username: string
    firstName: string
    middleName: string
    lastName: string
    suffix: string
    displayName: string
    role: string
    department: string
}

const currentUser = computed<LoggedInUser | null>(() => {
    if (!userCookie.value) {
        return null
    }

    try {
        return JSON.parse(userCookie.value) as LoggedInUser
    } catch {
        return null
    }
})

watch(() => props.employees, (employees) => {
    if (!employees || employees.length === 0) {
        return
    }

    sharedEmployeeRows.value = employees.map(normalizeEmployeeRow)
}, { immediate: true })

const tableEmployees = computed(() => {
    if (props.employees && props.employees.length > 0) {
        return props.employees.map(normalizeEmployeeRow)
    }

    return sharedEmployeeRows.value
})

const departmentSelectWidth = computed(() => {
    if (!departmentQuery.value) {
        return '180px'
    }

    const length = departmentQuery.value.length
    const width = Math.min(Math.max(length * 10 + 50, 180), 360)

    return `${width}px`
})

function buildEmployeeDisplayName(employee: {
    firstName: string
    middleName?: string
    lastName: string
    suffix?: string
}) {
    const firstName = employee.firstName.trim().split(/\s+/)[0] || ''
    const lastName = employee.lastName.trim()
    const suffix = employee.suffix?.trim() ? ` ${employee.suffix.trim()}` : ''
    const middleInitial = employee.middleName?.trim()
        ? `${employee.middleName.trim().charAt(0).toUpperCase()}.`
        : ''

    return `${lastName}, ${firstName}${suffix}${middleInitial ? `, ${middleInitial}` : ''}`
}

function normalizeEmployeeRow(raw: any): EmployeeRow {
    const info = raw.user_informations ?? {}
    const position = raw.positions ?? {}
    const departmentData = position.departments ?? {}
    const card = raw.cards ?? null

    const firstName = raw.firstName ?? info.first_name ?? ''
    const middleName = raw.middleName ?? info.middle_name ?? ''
    const lastName = raw.lastName ?? info.last_name ?? ''
    const suffix = raw.suffix ?? info.suffix ?? ''

    const name = firstName || middleName || lastName
        ? buildEmployeeDisplayName({ firstName, middleName, lastName, suffix })
        : String(raw.name ?? '')

    return {
        id: Number(raw.id ?? raw.employee_id ?? 0),
        name,
        department: raw.department ?? departmentData.department_name ?? '',
        cardStatus: raw.cardStatus ?? (card?.card_number ? 'Has Card' : 'No Card'),
        cardNumber: raw.cardNumber ?? card?.card_number ?? '',
    }
}
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
    // Attempt to load employee list and departments from proxied backend; fall back to defaults
    ;(async () => {
        // load departments for dropdown
        try {
            const dresp: any = await $fetch('/api/departments')
            const dlist = dresp?.data ?? dresp

            if (Array.isArray(dlist)) {
                departments.value = dlist.map((d: any) => d.department_name ?? d.name ?? String(d))
            }
        } catch (err) {
            // ignore
        }

        try {
            const resp: any = await $fetch('/api/employees')
            const list = resp?.data ?? resp

            if (Array.isArray(list) && list.length > 0) {
                sharedEmployeeRows.value = list.map(normalizeEmployeeRow)
            }
        } catch (err) {
            // ignore fetch errors and continue with defaults
        }

        if (hasLoadedEmployeeTable.value) {
            isTableLoading.value = false
            return
        }

        loadingTimer = setTimeout(() => {
            isTableLoading.value = false
            hasLoadedEmployeeTable.value = true
        }, 1200)
    })()
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

    if (errorAlertTimer) {
        clearTimeout(errorAlertTimer)
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
                        <select
                            v-model="departmentQuery"
                            class="filter-select"
                            :style="{ width: departmentSelectWidth }"
                            aria-label="Filter by department"
                        >
                            <option value="">Department</option>
                            <option
                                v-for="department in departments"
                                :key="department"
                                :value="department"
                            >
                                {{ department }}
                            </option>
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

                                <button
                                    type="button"
                                    class="action-button action-button--delete"
                                    :aria-label="`Delete ${employee.name}`"
                                    @click="handleDeleteEmployee(employee.id)"
                                    :title="employee.id === currentUser?.employeeId ? 'You cannot delete your own account' : 'Delete employee'"
                                >
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

        <div v-if="showErrorAlert" class="success-alert-container">
            <Alert
                title="Action not allowed"
                :message="errorMessage"
                variant="error"
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
    min-width: var(--table-min-width);
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
        width: fit-content;
        max-width: 100%;
    }
}

@media (max-width: 768px) {
    .employee-search {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
    }

    .department-dropdown {
        width: var(--control-width-wide);
        max-width: 100%;
    }

    .search-button {
        min-height: 36px;
        padding: 8px 10px;
        font-size: 0.8rem;
    }
}

@media (max-width: 640px) {
    /* Stack filters; keep Search button at the bottom */
    .employee-search {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        width: fit-content;
        max-width: min(100%, var(--filter-stack-width));
    }

    .employee-search :deep(.icon-input) {
        order: 1;
        width: var(--filter-stack-width);
        max-width: 100%;
    }

    .department-and-card-filters {
        order: 2;
        width: var(--filter-stack-width);
        max-width: 100%;
    }

    .search-button {
        order: 3;
        width: var(--search-btn-width);
        min-height: 44px;
        padding: 8px 12px;
        font-size: 0.92rem;
        align-self: flex-start;
    }

    .department-filter-control {
        width: auto;
        max-width: 100%;
        flex-direction: column;
        align-items: flex-start;
    }

    .department-dropdown,
    .filter-select,
    .clear-filter-button {
        width: var(--control-width) !important;
        max-width: 100% !important;
    }

    .employee-title {
        font-size: 0.9rem;
    }

    .employees-table {
        min-width: var(--table-min-width);
    }
}

.search-icon {
    width: 16px;
    height: 16px;
}

.filter-select {
    width: auto;
    min-height: 36px;
    min-width: 180px;
    max-width: 100%;
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
    width: auto;
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
        width: auto;
        max-width: 100%;
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .department-filter-control {
        width: auto;
    }

    .card-filters {
        width: auto;
        max-width: 100%;
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