<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { MagnifyingGlassIcon, EyeIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'
import Modal from '~/components/Modal.vue'
import Alert from '~/components/Alert.vue'
import Input from '~/components/Input.vue'

interface Employee {
    employee_id: number
    user_informations: {
        first_name: string
        last_name: string
    }
}

interface DepartmentFromAPI {
    department_id: number
    department_name: string
    department_head: number | null
}

interface DepartmentRow {
    id: number
    name: string
    head: string
}

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

const emit = defineEmits<{
    viewDepartment: [department: { id: number; name: string; head: string }]
}>()

const selectedDepartment = useState<{ id: number; name: string; head: string } | null>(
    'selected-department-info',
    () => null,
)

const userCookie = useCookie<string | null>('ems_user')
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
const transactedById = computed(() => currentUser.value?.employeeId ?? null)

const searchQuery = ref('')
const departmentFilter = ref('')
const appliedSearchQuery = ref('')
const appliedDepartmentFilter = ref('')
const isAddDepartmentModalOpen = ref(false)
const isConfirmAddDepartmentModalOpen = ref(false)
const isAddDepartmentLoadingModalOpen = ref(false)
const isDeleteDepartmentModalOpen = ref(false)
const isDeleteDepartmentLoadingModalOpen = ref(false)
const newDepartmentName = ref('')
const hasDepartmentNameError = ref(false)
const isDuplicateDepartmentAlertVisible = ref(false)
const isDepartmentAddedAlertVisible = ref(false)
const isDepartmentDeletedAlertVisible = ref(false)
const departmentToDelete = ref<{ id: number; name: string } | null>(null)
const hasLoadedDepartmentTable = useState<boolean>('has-loaded-department-table', () => false)
const isTableLoading = ref(!hasLoadedDepartmentTable.value)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let addDepartmentTimer: ReturnType<typeof setTimeout> | null = null
let successAlertTimer: ReturnType<typeof setTimeout> | null = null
let deleteDepartmentTimer: ReturnType<typeof setTimeout> | null = null
let deleteSuccessAlertTimer: ReturnType<typeof setTimeout> | null = null

const sharedDepartmentRows = useState<DepartmentRow[]>('departments-table-rows', () => [])


function handleViewDepartment(department: { id: number; name: string; head: string }) {
    selectedDepartment.value = department
    emit('viewDepartment', department)
}

function handleDeleteDepartment(department: { id: number; name: string }) {
    departmentToDelete.value = {
        id: department.id,
        name: department.name,
    }
    isDeleteDepartmentModalOpen.value = true
}

function closeDeleteDepartmentModal() {
    isDeleteDepartmentModalOpen.value = false
    departmentToDelete.value = null
}

async function loadDepartments() {
    const deptResp: any = await $fetch('/api/departments')
    const deptList = deptResp?.data ?? deptResp

    if (!Array.isArray(deptList)) {
        sharedDepartmentRows.value = []
        return
    }

    const departmentsWithHeads = await Promise.all(
        deptList.map(async (dept: DepartmentFromAPI) => {
            const headName = await getEmployeeHead(dept.department_head)

            return {
                id: dept.department_id,
                name: dept.department_name,
                head: headName,
            }
        })
    )

    sharedDepartmentRows.value = departmentsWithHeads
}

async function deleteDepartment() {
    if (!departmentToDelete.value) return
    if (!transactedById.value) {
        alert("Cannot delete: User not identified.")
        return
    }

    const targetDepartmentId = departmentToDelete.value.id

    isDeleteDepartmentModalOpen.value = false
    isDeleteDepartmentLoadingModalOpen.value = true

    try {
        await $fetch(`/api/departments/${targetDepartmentId}`, {
            method: 'DELETE',
            body: {
                transacted_by: transactedById.value,
            },
        })

        await loadDepartments()

        if (selectedDepartment.value?.id === targetDepartmentId) {
            selectedDepartment.value = null
        }

        isDepartmentDeletedAlertVisible.value = true

        setTimeout(() => {
            isDepartmentDeletedAlertVisible.value = false
        }, 2600)

    } catch (err: any) {
        alert(err?.data?.message || "Cannot delete department.")
    } finally {
        isDeleteDepartmentLoadingModalOpen.value = false
        departmentToDelete.value = null
    }
}

function handleAddDepartment() {
    newDepartmentName.value = ''
    hasDepartmentNameError.value = false
    isAddDepartmentModalOpen.value = true
}

function closeAddDepartmentModal() {
    isAddDepartmentModalOpen.value = false
}

function requestAddDepartmentConfirmation() {
    if (!newDepartmentName.value.trim()) {
        hasDepartmentNameError.value = true
        return
    }

    hasDepartmentNameError.value = false
    isConfirmAddDepartmentModalOpen.value = true
}

function closeAddDepartmentConfirmationModal() {
    isConfirmAddDepartmentModalOpen.value = false
}

function addDepartment() {
    const normalizedName = newDepartmentName.value.trim()

    if (!normalizedName) {
        return
    }

    if (!transactedById.value) {
        return
    }

    const isDepartmentAlreadyRegistered = sharedDepartmentRows.value.some(
        (department) => department.name.toLowerCase() === normalizedName.toLowerCase(),
    )

    if (isDepartmentAlreadyRegistered) {
        closeAddDepartmentConfirmationModal()
        isDuplicateDepartmentAlertVisible.value = true
        return
    }

    isDuplicateDepartmentAlertVisible.value = false
    closeAddDepartmentConfirmationModal()
    isAddDepartmentLoadingModalOpen.value = true

    addDepartmentTimer = setTimeout(async () => {
        try {
            const response: any = await $fetch('/api/departments', {
                method: 'POST',
                body: {
                    department_name: normalizedName,
                    transacted_by: transactedById.value,
                }
            })

            const newDepartmentData = response?.data ?? response

            if (!newDepartmentData?.department_id) {
                throw new Error('Department was not created.')
            }

            await loadDepartments()

            isDepartmentAddedAlertVisible.value = true

            if (successAlertTimer) {
                clearTimeout(successAlertTimer)
            }

            successAlertTimer = setTimeout(() => {
                isDepartmentAddedAlertVisible.value = false
            }, 2600)

            closeAddDepartmentModal()
        } catch (err) {
            isDuplicateDepartmentAlertVisible.value = false
        } finally {
            isAddDepartmentLoadingModalOpen.value = false
            closeAddDepartmentConfirmationModal()
        }
    }, 1200)
}

function onSearch() {
    appliedSearchQuery.value = searchQuery.value
    appliedDepartmentFilter.value = departmentFilter.value
}

function clearDepartmentFilter() {
    departmentFilter.value = ''
    appliedDepartmentFilter.value = ''
}

const departmentOptions = computed(() => {
    return [...new Set(sharedDepartmentRows.value.map((department) => department.name))]
})

const departmentFilterWidth = computed(() => {
    if (!departmentFilter.value) {
        return '190px'
    }

    const length = departmentFilter.value.length
    const width = Math.min(Math.max(length * 10 + 50, 190), 360)
    return `${width}px`
})

const filteredDepartments = computed(() => {
    const query = appliedSearchQuery.value.trim().toLowerCase()
    const selectedDepartment = appliedDepartmentFilter.value

    return sharedDepartmentRows.value.filter((department) => {
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

watch(newDepartmentName, (value) => {
    if (value.trim()) {
        hasDepartmentNameError.value = false
    }
})

watch(searchQuery, (value) => {
    appliedSearchQuery.value = value
})

watch(departmentFilter, (value) => {
    appliedDepartmentFilter.value = value
})

async function getEmployeeHead(employeeId: number | null): Promise<string> {
    if (!employeeId) return 'Unassigned'
    
    try {
        const empResp: any = await $fetch(`/api/employees/${employeeId}`)
        const emp = empResp?.data ?? empResp

        if (emp?.name) {
            return emp.name
        }

        if (emp?.raw?.user_informations) {
            const info = emp.raw.user_informations
            return `${info.last_name}, ${info.first_name}`
        }
    } catch (err) {
        // ignore error
    }
    
    return 'Unassigned'
}

onMounted(() => {
    // Attempt to load departments from backend; fall back to empty list
    ;(async () => {
        try {
            await loadDepartments()
        } catch (err) {
            // ignore fetch errors and continue with defaults
        }

        if (hasLoadedDepartmentTable.value) {
            isTableLoading.value = false
            return
        }

        loadingTimer = setTimeout(() => {
            isTableLoading.value = false
            hasLoadedDepartmentTable.value = true
        }, 1200)
    })()
})

onUnmounted(() => {
    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }

    if (addDepartmentTimer) {
        clearTimeout(addDepartmentTimer)
    }

    if (deleteDepartmentTimer) {
        clearTimeout(deleteDepartmentTimer)
    }

    if (successAlertTimer) {
        clearTimeout(successAlertTimer)
    }

    if (deleteSuccessAlertTimer) {
        clearTimeout(deleteSuccessAlertTimer)
    }
})
</script>

<template>
    <div class="department-page">
        <div class="top-alert-wrap">
            <Alert
                v-model:visible="isDuplicateDepartmentAlertVisible"
                variant="error"
                title="Department already registered"
                message="Please enter a different department name."
            />

            <Alert
                v-model:visible="isDepartmentAddedAlertVisible"
                variant="success"
                title="Successfully added"
                message="New department has been added."
            />

            <Alert
                v-model:visible="isDepartmentDeletedAlertVisible"
                variant="success"
                title="Successfully deleted"
                message="Department has been deleted."
            />
        </div>

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

            <div class="department-filter-control">
                <div class="filter-dropdown">
                    <select
                        v-model="departmentFilter"
                        class="filter-select"
                        :style="{ width: departmentFilterWidth }"
                        aria-label="Filter department"
                    >
                        <option value="">All Departments</option>
                        <option v-for="option in departmentOptions" :key="option" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </div>

                <button
                    v-if="departmentFilter"
                    type="button"
                    class="clear-filter-button"
                    @click="clearDepartmentFilter"
                >
                    Clear
                </button>
            </div>

            <Button
                variant="solid"
                type="button"
                class="add-button"
                aria-label="Add Department"
                @click="handleAddDepartment"
            >
                <PlusIcon class="add-icon" />
            </Button>
        </form>

        <div class="form-divider" aria-hidden="true"></div>

        <div class="departments-table-wrap">
            <table class="departments-table" :aria-busy="isTableLoading ? 'true' : 'false'">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Department Head</th>
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
                        <td>
                            <div class="action-buttons">
                                <button
                                    type="button"
                                    class="action-button action-button--view"
                                    :aria-label="`View ${department.name}`"
                                    @click="handleViewDepartment(department)"
                                >
                                    <EyeIcon class="action-icon" />
                                </button>

                                <button
                                    type="button"
                                    class="action-button action-button--delete"
                                    :aria-label="`Delete ${department.name}`"
                                    @click="handleDeleteDepartment(department)"
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

        <Modal
            v-model:open="isAddDepartmentModalOpen"
            hide-trigger
            :dismissible="false"
            title="New Department"
        >
            <template #header>
                <div class="modal-header-wrap">
                    <h3 class="modal-title">New Department</h3>
                    <!-- <button
                        type="button"
                        class="modal-close-button"
                        aria-label="Close add department modal"
                        @click="closeAddDepartmentModal"
                    >
                        <XMarkIcon class="update-modal-close-icon" />
                    </button> -->
                </div>
            </template>

            <div class="modal-form-field">
                <label class="modal-field-label" for="new-department-name">Enter Department name</label>
                <Input
                    id="new-department-name"
                    v-model="newDepartmentName"
                    placeholder="Department name"
                    :aria-invalid="hasDepartmentNameError ? 'true' : 'false'"
                    :style="hasDepartmentNameError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.14)' } : undefined"
                />
                <p v-if="hasDepartmentNameError" class="modal-field-error">Please enter department name</p>
            </div>

            <template #footer>
                <button
                    type="button"
                    class="app-modal__btn app-modal__btn--ghost"
                    @click="closeAddDepartmentModal"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="app-modal__btn app-modal__btn--primary"
                    @click="requestAddDepartmentConfirmation"
                >
                    Add Department
                </button>
            </template>
        </Modal>

        <Modal
            v-model:open="isConfirmAddDepartmentModalOpen"
            hide-trigger
            :dismissible="false"
            title="Confirm Department"
        >
            <p class="confirm-modal-text">
                Add
                <span class="confirm-modal-department-name">{{ newDepartmentName.trim() }}</span>
                to the list?
            </p>

            <template #footer>
                <button
                    type="button"
                    class="app-modal__btn app-modal__btn--ghost confirm-modal-cancel-btn"
                    @click="closeAddDepartmentConfirmationModal"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="app-modal__btn app-modal__btn--primary confirm-modal-confirm-btn"
                    @click="addDepartment"
                >
                    Confirm
                </button>
            </template>
        </Modal>

        <Modal
            v-model:open="isAddDepartmentLoadingModalOpen"
            hide-trigger
            :dismissible="false"
            :show-footer="false"
            title=""
        >
            <div class="loading-modal-content" role="status" aria-live="polite">
                <span class="table-spinner" aria-hidden="true"></span>
                <p class="adding-department-text">Adding new department</p>
            </div>
        </Modal>

        <Modal
            v-model:open="isDeleteDepartmentModalOpen"
            hide-trigger
            :dismissible="false"
            title="Delete Department"
        >
            <p class="delete-modal-text">
                Are you sure you want to delete Department of
                <span class="confirm-modal-department-name">{{ departmentToDelete?.name || 'this department' }}</span
                >?
            </p>

            <template #footer>
                <div class="delete-modal-footer-content">
                    <button
                        type="button"
                        class="app-modal__btn delete-modal-no-btn"
                        @click="closeDeleteDepartmentModal"
                    >
                        No
                    </button>
                    <button
                        type="button"
                        class="app-modal__btn delete-modal-yes-btn"
                        @click="deleteDepartment"
                    >
                        Yes, Delete
                    </button>
                </div>
            </template>
        </Modal>

        <Modal
            v-model:open="isDeleteDepartmentLoadingModalOpen"
            hide-trigger
            :dismissible="false"
            :show-footer="false"
            title=""
        >
            <div class="loading-modal-content" role="status" aria-live="polite">
                <span class="table-spinner" aria-hidden="true"></span>
                <p class="deleting-department-text">Deleting Department</p>
            </div>
        </Modal>
    </div>
</template>

<style scoped>
.department-page {
    width: 100%;
    padding-bottom: 5.5rem;
}

.top-alert-wrap {
    position: fixed;
    top: 18px;
    right: 18px;
    width: min(360px, calc(100vw - 32px));
    z-index: 1100;
    display: grid;
    gap: 10px;
}

.department-title {
    font-size: 1rem;
    margin-bottom: 0.9rem;
}

.department-search {
    display: grid;
    grid-template-columns: minmax(240px, 360px) auto auto 1fr auto;
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
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 30;
    margin-inline: 0;
    width: 56px;
    min-height: 56px;
    height: 56px;
    padding: 0;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.2);
}

.add-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: currentColor;
}

.filter-dropdown {
    position: relative;
    width: auto;
    min-width: 180px;
    max-width: 100%;
}

.department-filter-control {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
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
    overflow: hidden;
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

.modal-header-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.modal-title {
    margin: 0;
    color: #111827;
    font-size: 1rem;
    line-height: 1.2;
}

.modal-close-button {
    width: 30px;
    height: 30px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.modal-close-button:hover {
    background: #f8fafc;
}

.modal-form-field {
    display: grid;
    gap: 8px;
}

.confirm-modal-text {
    margin: 0;
    color: #475569;
    font-size: 0.92rem;
}

.delete-modal-text {
    margin: 0;
    color: #475569;
    font-size: 0.92rem;
}

.confirm-modal-department-name {
    font-weight: 600;
    color: #334155;
}

.loading-modal-content {
    min-height: 120px;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 12px;
}

.adding-department-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 200;
    color: #334155;
}

.deleting-department-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 200;
    color: #334155;
}

.modal-field-label {
    font-size: 0.875rem;
    color: #334155;
    font-weight: 600;
}

.modal-field-error {
    margin: 0;
    color: #dc2626;
    font-size: 0.8rem;
    line-height: 1.25;
}

.app-modal__btn {
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 8px 12px;
    cursor: pointer;
}

.app-modal__btn--ghost {
    border-color: #fecaca;
    background: #fef2f2;
    color: #b91c1c;
}

.app-modal__btn--ghost:hover {
    background: #fee2e2;
}

.app-modal__btn--primary {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
}

.app-modal__btn--primary:hover {
    background: #dbeafe;
}

.app-modal__btn--ghost.confirm-modal-cancel-btn {
    border-color: #fecaca;
    background: #fef2f2;
    color: #b91c1c;
}

.app-modal__btn--ghost.confirm-modal-cancel-btn:hover {
    background: #fee2e2;
}

.app-modal__btn--primary.confirm-modal-confirm-btn {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
}

.app-modal__btn--primary.confirm-modal-confirm-btn:hover {
    background: #dbeafe;
}

.delete-modal-no-btn {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
}

.delete-modal-no-btn:hover {
    background: #dbeafe;
}

.delete-modal-yes-btn {
    border-color: #fecaca;
    background: #fef2f2;
    color: #b91c1c;
}

.delete-modal-yes-btn:hover {
    background: #fee2e2;
}

.delete-modal-footer-content {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    width: auto !important;
}

:deep(.app-modal__footer) {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    margin: 0 !important;
    padding: 0 !important;
}

:deep(.app-modal__footer > *) {
    margin: 0 !important;
}

.search-icon {
    width: 16px;
    height: 16px;
}

.update-modal-close-icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 820px) {
    .department-search {
        grid-template-columns: 1fr auto auto;
        align-items: end;
        width: 220px;
    }

    .filter-dropdown {
        max-width: none;
    }
}

@media (max-width: 540px) {
    .top-alert-wrap {
        top: 12px;
        right: 12px;
        width: calc(100vw - 24px);
    }

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
    .department-filter-control {
        width: 100%;
        max-width: none;
    }

    .filter-dropdown {
        flex: 1 1 auto;
        min-width: 0;
        width: auto;
    }

    .search-button,
    .add-button {
        min-height: 38px;
        font-size: 0.82rem;
        justify-content: center;
    }

    .add-button {
        width: 52px;
        height: 52px;
        min-height: 52px;
        right: 16px;
        bottom: 16px;
        border-radius: 999px;
        padding: 0;
    }

    .add-icon {
        width: 18px;
        height: 18px;
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