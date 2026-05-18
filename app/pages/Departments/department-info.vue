<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { PlusIcon, ArrowLeftIcon, BriefcaseIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import OverviewCard from '~/components/OverviewCard.vue'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'
import Table from '~/components/Table.vue'
import Modal from '~/components/Modal.vue'
import Alert from '~/components/Alert.vue'
import Input from '~/components/Input.vue'
import CheckBox from '~/components/CheckBox.vue'

interface DepartmentInfoData {
    id: number
    name: string
    head: string
}

interface PositionTableRow {
    positionId: number
    position: string
    salary: string
    totalEmployees: number
}

interface PositionTableColumn {
    accessorKey?: string
    id?: string
    header: string
}

interface BackendPosition {
    position_id: number
    department_id?: number
    position_name: string
    employees?: Array<unknown>
    salaries?: {
        salary_id?: number
        amount?: string | number
    } | null
    departments?: {
        department_id?: number
    } | null
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

type SalaryOption = {
    salary_id: number
    amount: string
}

const props = defineProps<{
    department?: DepartmentInfoData | null
}>()

const selectedDepartment = useState<DepartmentInfoData | null>('selected-department-info', () => null)
const userCookie = useCookie<string | null>('ems_user')

const loadedDepartment = ref<DepartmentInfoData | null>(null)
const activeDepartment = computed(() => loadedDepartment.value ?? props.department ?? selectedDepartment.value)
const isDepartmentLoading = ref(false)
const searchQuery = ref('')
const isUpdateSalaryModalOpen = ref(false)
const selectedUpdatePosition = ref('')
const selectedUpdatePositionId = ref<number | null>(null)
const selectedCurrentSalary = ref('')
const isUpdateSalaryLoadingModalOpen = ref(false)
const isSalaryUpdatedAlertVisible = ref(false)
const isUpdateNewSalaryOptionChecked = ref(false)
const isUpdateCurrentSalaryOptionChecked = ref(false)
const updateNewSalaryAmount = ref('')
const selectedUpdateExistingSalary = ref('')
const backendSalaries = ref<SalaryOption[]>([])
const hasUpdateSalaryOptionError = ref(false)
const hasUpdateNewSalaryAmountError = ref(false)
const hasUpdateNewSalaryAmountFormatError = ref(false)
const hasUpdateNewSalaryDuplicateError = ref(false)
const hasUpdateExistingSalaryError = ref(false)
const isAddPositionModalOpen = ref(false)
const isConfirmAddPositionModalOpen = ref(false)
const isAddPositionLoadingModalOpen = ref(false)
const newPositionName = ref('')
const isNewSalaryOptionChecked = ref(false)
const isCurrentSalaryOptionChecked = ref(false)
const addNewSalaryAmount = ref('')
const selectedCurrentSalaryForAdd = ref('')
const hasPositionNameError = ref(false)
const isDuplicatePositionNameError = ref(false)
const hasSalaryOptionError = ref(false)
const hasAddNewSalaryAmountError = ref(false)
const hasAddNewSalaryAmountFormatError = ref(false)
const hasAddCurrentSalaryError = ref(false)
const isPositionAddedAlertVisible = ref(false)
const isPositionDeletedAlertVisible = ref(false)
const selectedDeletePosition = ref('')
const isDeletePositionModalOpen = ref(false)
const isDeletePositionLoadingModalOpen = ref(false)
const backendPositions = ref<BackendPosition[]>([])

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
let addPositionTimer: ReturnType<typeof setTimeout> | null = null
let updateSalaryTimer: ReturnType<typeof setTimeout> | null = null
let deletePositionTimer: ReturnType<typeof setTimeout> | null = null
let successAlertTimer: ReturnType<typeof setTimeout> | null = null

const positionRows = ref<PositionTableRow[]>([])

const positionTableColumns: PositionTableColumn[] = [
    { accessorKey: 'position', header: 'Position' },
    { accessorKey: 'salary', header: 'Salary' },
    { accessorKey: 'totalEmployees', header: 'Total Employees' },
    { id: 'action', header: 'Action' },
]

const filteredPositionRows = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) {
        return positionRows.value
    }

    return positionRows.value.filter(row => row.position.toLowerCase().includes(query))
})

const currentSalaryOptions = computed(() => {
    return [...new Set(positionRows.value.map((row) => row.salary))]
})

const addSalaryOptions = computed<SalaryOption[]>(() => {
    const departmentId = activeDepartment.value?.id

    if (!departmentId) {
        return []
    }

    const salaryMap = new Map<number, SalaryOption>()

    backendPositions.value
        .filter((position) => {
            const positionDepartmentId = position.department_id ?? position.departments?.department_id
            return positionDepartmentId === departmentId
        })
        .forEach((position) => {
            const salaryId = position.salaries?.salary_id
            const amount = position.salaries?.amount

            if (!salaryId || amount === undefined || amount === null || amount === '') {
                return
            }

            salaryMap.set(salaryId, {
                salary_id: salaryId,
                amount: formatSalaryAmount(amount),
            })
        })

    return [...salaryMap.values()]
})

const totalEmployeesDisplay = computed(() => {
    if (isDepartmentLoading.value) {
        return '...'
    }

    if (!activeDepartment.value) {
        return '-'
    }

    return String(positionRows.value.reduce((total, row) => total + row.totalEmployees, 0))
})

const totalPositionsDisplay = computed(() => {
    if (isDepartmentLoading.value) {
        return '...'
    }

    if (!activeDepartment.value) {
        return '-'
    }

    return String(positionRows.value.length)
})

const emit = defineEmits<{
    back: []
}>()

function goBack() {
    emit('back')
}

function formatSalaryAmount(amount: string | number | undefined | null) {
    if (amount === undefined || amount === null || amount === '') {
        return '-'
    }

    const numericAmount = typeof amount === 'number' ? amount : Number(amount)

    if (Number.isNaN(numericAmount)) {
        return String(amount)
    }

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numericAmount)
}

function getBackendErrorMessage(error: unknown, fallbackMessage: string) {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return fallbackMessage
}

function showErrorAlert(message: string) {
    alert(message)
}

function mapBackendPosition(position: BackendPosition): PositionTableRow {
    return {
        positionId: position.position_id,
        position: position.position_name,
        salary: formatSalaryAmount(position.salaries?.amount),
        totalEmployees: position.employees?.length ?? 0,
    }
}

async function loadBackendSalaries() {
    try {
        const salariesResp: any = await $fetch('/api/salaries')
        const salariesPayload = salariesResp?.data ?? salariesResp

        backendSalaries.value = Array.isArray(salariesPayload)
            ? salariesPayload.map((salary: any) => ({
                  salary_id: salary.salary_id,
                  amount: formatSalaryAmount(salary.amount),
              }))
            : []
    } catch {
        backendSalaries.value = []
    }
}

async function loadDepartmentDetails() {
    const departmentId = activeDepartment.value?.id

    if (!departmentId) {
        loadedDepartment.value = null
        positionRows.value = []
        return
    }

    isDepartmentLoading.value = true

    try {
        const [departmentResp, positionsResp]: [any, any] = await Promise.all([
            $fetch(`/api/departments/${departmentId}`),
            $fetch('/api/positions'),
        ])

        const departmentPayload = departmentResp?.data ?? departmentResp
        const positionsPayload = positionsResp?.data ?? positionsResp

        if (departmentPayload?.department_name) {
            loadedDepartment.value = {
                id: departmentId,
                name: departmentPayload.department_name,
                head: activeDepartment.value?.head || '-',
            }
        }

        if (Array.isArray(positionsPayload)) {
            backendPositions.value = positionsPayload
            positionRows.value = positionsPayload
                .filter((position: BackendPosition) => {
                    const positionDepartmentId = position.department_id ?? position.departments?.department_id
                    return positionDepartmentId === departmentId
                })
                .map(mapBackendPosition)
        } else {
            backendPositions.value = []
            positionRows.value = []
        }
    } catch (err) {
        backendPositions.value = []
        positionRows.value = []
    } finally {
        isDepartmentLoading.value = false
    }
}

function onUpdate(positionId: string) {
    const numericPositionId = Number(positionId)
    const positionToUpdate = positionRows.value.find((row) => row.positionId === numericPositionId)

    if (!positionToUpdate) {
        return
    }

    selectedUpdatePositionId.value = numericPositionId
    selectedUpdatePosition.value = positionToUpdate.position
    selectedCurrentSalary.value = positionToUpdate.salary
    isUpdateNewSalaryOptionChecked.value = false
    isUpdateCurrentSalaryOptionChecked.value = false
    updateNewSalaryAmount.value = ''
    selectedUpdateExistingSalary.value = ''
    hasUpdateSalaryOptionError.value = false
    hasUpdateNewSalaryAmountError.value = false
    hasUpdateNewSalaryAmountFormatError.value = false
    hasUpdateExistingSalaryError.value = false
    isUpdateSalaryModalOpen.value = true
    void loadBackendSalaries()
}

function onDelete(position: string) {
    selectedDeletePosition.value = position
    isDeletePositionModalOpen.value = true
}

function closeDeletePositionModal() {
    isDeletePositionModalOpen.value = false
}

function deletePosition() {
    if (!selectedDeletePosition.value) {
        return
    }

    closeDeletePositionModal()
    isDeletePositionLoadingModalOpen.value = true

    deletePositionTimer = setTimeout(() => {
        positionRows.value = positionRows.value.filter(
            (row) => row.position !== selectedDeletePosition.value,
        )

        isDeletePositionLoadingModalOpen.value = false
        isPositionDeletedAlertVisible.value = true

        if (successAlertTimer) {
            clearTimeout(successAlertTimer)
        }

        successAlertTimer = setTimeout(() => {
            isPositionDeletedAlertVisible.value = false
        }, 2600)
    }, 1200)
}

function closeUpdateSalaryModal() {
    isUpdateSalaryModalOpen.value = false
}

function onUpdateNewSalaryOptionChange(isChecked: boolean) {
    isUpdateNewSalaryOptionChecked.value = isChecked

    if (isChecked) {
        isUpdateCurrentSalaryOptionChecked.value = false
        selectedUpdateExistingSalary.value = ''
        hasUpdateSalaryOptionError.value = false
        hasUpdateExistingSalaryError.value = false
    } else {
        hasUpdateNewSalaryAmountFormatError.value = false
    }
}

function onUpdateCurrentSalaryOptionChange(isChecked: boolean) {
    isUpdateCurrentSalaryOptionChecked.value = isChecked

    if (isChecked) {
        isUpdateNewSalaryOptionChecked.value = false
        updateNewSalaryAmount.value = ''
        hasUpdateSalaryOptionError.value = false
        hasUpdateNewSalaryAmountError.value = false
        hasUpdateNewSalaryAmountFormatError.value = false
    }
}

function isSalaryAmountNumeric(value: string) {
    const normalizedValue = value.trim().replaceAll(',', '')
    return /^\d+(\.\d+)?$/.test(normalizedValue)
}

async function saveUpdatedSalary() {
    hasUpdateSalaryOptionError.value = !isUpdateNewSalaryOptionChecked.value && !isUpdateCurrentSalaryOptionChecked.value
    hasUpdateNewSalaryAmountError.value = isUpdateNewSalaryOptionChecked.value && !updateNewSalaryAmount.value.trim()
    hasUpdateNewSalaryAmountFormatError.value = isUpdateNewSalaryOptionChecked.value && Boolean(updateNewSalaryAmount.value.trim()) && !isSalaryAmountNumeric(updateNewSalaryAmount.value)
    hasUpdateNewSalaryDuplicateError.value = false
    hasUpdateExistingSalaryError.value = isUpdateCurrentSalaryOptionChecked.value && !selectedUpdateExistingSalary.value

    const normalizedSalaryAmount = updateNewSalaryAmount.value.trim().replaceAll(',', '')
    const isDuplicateSalary = isUpdateNewSalaryOptionChecked.value && Boolean(normalizedSalaryAmount) && backendSalaries.value.some((salary) => String(salary.amount).trim().replaceAll(',', '') === normalizedSalaryAmount)

    if (isDuplicateSalary) {
        hasUpdateNewSalaryDuplicateError.value = true
    }

    if (
        hasUpdateSalaryOptionError.value ||
        hasUpdateNewSalaryAmountError.value ||
        hasUpdateNewSalaryAmountFormatError.value ||
        hasUpdateNewSalaryDuplicateError.value ||
        hasUpdateExistingSalaryError.value
    ) {
        return
    }

    const positionId = selectedUpdatePositionId.value

    if (!positionId) {
        showErrorAlert('Unable to update salary: missing position identifier.')
        return
    }

    closeUpdateSalaryModal()
    isUpdateSalaryLoadingModalOpen.value = true

    try {
        const transactedBy = transactedById.value

        if (!transactedBy) {
            throw new Error('You must be signed in to update salary.')
        }

        let salaryId: number | null = null

        if (isUpdateNewSalaryOptionChecked.value) {
            const salaryAmount = updateNewSalaryAmount.value.trim().replaceAll(',', '')
            const response: any = await $fetch('/api/salaries', {
                method: 'POST',
                body: {
                    amount: salaryAmount,
                    transacted_by: transactedBy,
                },
            })
            const payload = response?.data ?? response
            salaryId = payload?.salary_id ?? null

            if (!salaryId) {
                throw new Error('Failed to create new salary record.')
            }
        } else {
            salaryId = Number(selectedUpdateExistingSalary.value)
        }

        await $fetch(`/api/positions/${positionId}`, {
            method: 'PUT',
            body: {
                salary_id: salaryId,
                transacted_by: transactedBy,
            },
        })

        await loadDepartmentDetails()

        isSalaryUpdatedAlertVisible.value = true

        if (successAlertTimer) {
            clearTimeout(successAlertTimer)
        }

        successAlertTimer = setTimeout(() => {
            isSalaryUpdatedAlertVisible.value = false
        }, 2600)
    } catch (err) {
        showErrorAlert(getBackendErrorMessage(err, 'Failed to update salary.'))
    } finally {
        isUpdateSalaryLoadingModalOpen.value = false
    }
}

function handleAddPosition() {
    newPositionName.value = ''
    isNewSalaryOptionChecked.value = false
    isCurrentSalaryOptionChecked.value = false
    addNewSalaryAmount.value = ''
    selectedCurrentSalaryForAdd.value = ''
    hasPositionNameError.value = false
    isDuplicatePositionNameError.value = false
    hasSalaryOptionError.value = false
    hasAddNewSalaryAmountError.value = false
    hasAddNewSalaryAmountFormatError.value = false
    hasAddCurrentSalaryError.value = false
    isAddPositionModalOpen.value = true
}

function closeAddPositionModal() {
    isAddPositionModalOpen.value = false
}

function requestAddPositionConfirmation() {
    const normalizedAddSalaryAmount = addNewSalaryAmount.value.trim()

    if (!newPositionName.value.trim()) {
        hasPositionNameError.value = true
        isDuplicatePositionNameError.value = false
        return
    }

    hasSalaryOptionError.value = !isNewSalaryOptionChecked.value && !isCurrentSalaryOptionChecked.value
    hasAddNewSalaryAmountError.value = isNewSalaryOptionChecked.value && !normalizedAddSalaryAmount
    hasAddNewSalaryAmountFormatError.value = isNewSalaryOptionChecked.value && Boolean(normalizedAddSalaryAmount) && !isSalaryAmountNumeric(normalizedAddSalaryAmount)
    hasAddCurrentSalaryError.value = isCurrentSalaryOptionChecked.value && !selectedCurrentSalaryForAdd.value

    if (hasSalaryOptionError.value || hasAddNewSalaryAmountError.value || hasAddNewSalaryAmountFormatError.value || hasAddCurrentSalaryError.value) {
        return
    }

    hasPositionNameError.value = false
    isDuplicatePositionNameError.value = false
    isConfirmAddPositionModalOpen.value = true
}

function onAddNewSalaryOptionChange(isChecked: boolean) {
    isNewSalaryOptionChecked.value = isChecked

    if (isChecked) {
        isCurrentSalaryOptionChecked.value = false
        selectedCurrentSalaryForAdd.value = ''
        hasSalaryOptionError.value = false
        hasAddCurrentSalaryError.value = false
    } else {
        hasAddNewSalaryAmountFormatError.value = false
    }
}

function onAddCurrentSalaryOptionChange(isChecked: boolean) {
    isCurrentSalaryOptionChecked.value = isChecked

    if (isChecked) {
        isNewSalaryOptionChecked.value = false
        addNewSalaryAmount.value = ''
        hasSalaryOptionError.value = false
        hasAddNewSalaryAmountError.value = false
        hasAddNewSalaryAmountFormatError.value = false
    }
}

function closeAddPositionConfirmationModal() {
    isConfirmAddPositionModalOpen.value = false
}

function addPosition() {
    const normalizedPositionName = newPositionName.value.trim()
    const departmentId = activeDepartment.value?.id
    const normalizedSalaryAmount = addNewSalaryAmount.value.trim().replaceAll(',', '')
    const selectedSalaryOption = addSalaryOptions.value.find(
        (salaryOption) => String(salaryOption.salary_id) === selectedCurrentSalaryForAdd.value,
    )

    if (!normalizedPositionName || !departmentId) {
        return
    }

    const isPositionAlreadyRegistered = positionRows.value.some(
        (positionRow) => positionRow.position.toLowerCase() === normalizedPositionName.toLowerCase(),
    )

    if (isPositionAlreadyRegistered) {
        closeAddPositionConfirmationModal()
        hasPositionNameError.value = false
        isDuplicatePositionNameError.value = true
        return
    }

    isDuplicatePositionNameError.value = false
    closeAddPositionConfirmationModal()
    isAddPositionLoadingModalOpen.value = true

    addPositionTimer = setTimeout(async () => {
        if (!transactedById.value) {
            isAddPositionLoadingModalOpen.value = false
            showErrorAlert('You must be signed in to create a position')
            return
        }

        try {
            await $fetch('/api/positions', {
                method: 'POST',
                body: isNewSalaryOptionChecked.value
                    ? {
                        department_id: departmentId,
                        position_name: normalizedPositionName,
                        salary_type: 'new',
                        salary_amount: normalizedSalaryAmount,
                        transacted_by: transactedById.value,
                    }
                    : {
                        department_id: departmentId,
                        position_name: normalizedPositionName,
                        salary_type: 'existing',
                        salary_id: selectedSalaryOption?.salary_id,
                        transacted_by: transactedById.value,
                    },
            })

            await loadDepartmentDetails()

            isPositionAddedAlertVisible.value = true

            if (successAlertTimer) {
                clearTimeout(successAlertTimer)
            }

            successAlertTimer = setTimeout(() => {
                isPositionAddedAlertVisible.value = false
            }, 2600)

            closeAddPositionModal()
        } catch (err) {
            showErrorAlert(getBackendErrorMessage(err, 'Failed to create position'))
        } finally {
            isAddPositionLoadingModalOpen.value = false
        }
    }, 1200)
}

watch(newPositionName, (value) => {
    if (value.trim()) {
        hasPositionNameError.value = false
        isDuplicatePositionNameError.value = false
    }
})

watch(addNewSalaryAmount, (value) => {
    const normalizedValue = value.trim()

    hasAddNewSalaryAmountError.value = false
    hasAddNewSalaryAmountFormatError.value = Boolean(normalizedValue) && !isSalaryAmountNumeric(normalizedValue)
})

watch(selectedCurrentSalaryForAdd, (value) => {
    if (value) {
        hasAddCurrentSalaryError.value = false
    }
})

watch(updateNewSalaryAmount, (value) => {
    const normalizedValue = value.trim()

    hasUpdateNewSalaryAmountError.value = false
    hasUpdateNewSalaryAmountFormatError.value = Boolean(normalizedValue) && !isSalaryAmountNumeric(normalizedValue)
    hasUpdateNewSalaryDuplicateError.value = false
})

watch(selectedUpdateExistingSalary, (value) => {
    if (value) {
        hasUpdateExistingSalaryError.value = false
    }
})

watch(
    () => activeDepartment.value?.id,
    () => {
        void loadDepartmentDetails()
    },
    { immediate: true },
)

onUnmounted(() => {
    if (addPositionTimer) {
        clearTimeout(addPositionTimer)
    }

    if (updateSalaryTimer) {
        clearTimeout(updateSalaryTimer)
    }

    if (deletePositionTimer) {
        clearTimeout(deletePositionTimer)
    }

    if (successAlertTimer) {
        clearTimeout(successAlertTimer)
    }
})
</script>

<template>
    <div class="department-info-page">
        <div class="top-alert-wrap">
            <Alert
                v-model:visible="isPositionAddedAlertVisible"
                variant="success"
                title="Successfully added"
                message="New position has been added."
            />

            <Alert
                v-model:visible="isPositionDeletedAlertVisible"
                variant="success"
                title="Successfully deleted"
                message="Position has been deleted."
            />

            <Alert
                v-model:visible="isSalaryUpdatedAlertVisible"
                variant="success"
                title="Successfully updated"
                message="Salary has been updated."
            />
        </div>

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

        <div class="department-cards-grid">
            <section class="department-info-card" aria-label="Department information">
                <div class="department-detail-row">
                    <div class="department-detail-item">
                        <p class="department-detail-label">Department Name</p>
                        <p class="department-detail-value">{{ activeDepartment?.name || '-' }}</p>
                    </div>

                    <div class="department-detail-item department-detail-item--with-button">
                        <p class="department-detail-label">Department Head</p>
                        <div class="department-head-value-wrap">
                            <p class="department-detail-value">{{ activeDepartment?.head || '-' }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <OverviewCard
                :icon="UserGroupIcon"
                label="Total Employees"
                :value="totalEmployeesDisplay"
                bgColor="#e9f2ff"
                iconBgColor="#d0e5ff"
                iconColor="#3686ff"
            />

            <OverviewCard
                :icon="BriefcaseIcon"
                label="Total Positions"
                :value="totalPositionsDisplay"
                bgColor="#fef8e6"
                iconBgColor="#fef0cd"
                iconColor="#f0b305"
            />
        </div>

        <div class="department-divider" aria-hidden="true"></div>

        <form class="department-search" @submit.prevent>
            <IconInput
                v-model="searchQuery"
                size="sm"
                placeholder="Search department"
                aria-label="Search department"
                class="search-input"
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
        </form>

        <div class="positions-table-wrap">
            <Table
                :data="filteredPositionRows"
                :columns="positionTableColumns"
                class="positions-table"
            >
                <template #action-cell="{ row }">
                    <div class="table-actions">
                        <button
                            type="button"
                            class="table-action-button update"
                            @click="onUpdate(String(row.original.positionId))"
                            aria-label="Update position"
                            title="Update"
                        >
                            <PencilSquareIcon class="table-action-icon" />
                        </button>

                        <button
                            type="button"
                            class="table-action-button delete"
                            @click="onDelete(String(row.original.position))"
                            aria-label="Delete position"
                            title="Delete"
                        >
                            <TrashIcon class="table-action-icon" />
                        </button>
                    </div>
                </template>
            </Table>
        </div>

        <button
            type="button"
            class="fab-add-position"
            aria-label="Add position"
            title="Add Position"
            @click="handleAddPosition"
        >
            <PlusIcon class="add-icon" />
        </button>

        <Modal
            v-model:open="isUpdateSalaryModalOpen"
            hide-trigger
            :dismissible="false"
            title="Update Salary"
        >
            <template #header>
                <h3 class="modal-title">Update Salary</h3>
            </template>

            <div class="modal-form-field">
                <p class="update-position-text">Position: {{ selectedUpdatePosition }}</p>

                <label class="modal-field-label" for="current-salary">Current Salary</label>
                <div class="current-salary-display">{{ selectedCurrentSalary || '-' }}</div>

                <div class="salary-option-grid" role="group" aria-label="Update salary selection">
                    <CheckBox
                        v-model="isUpdateNewSalaryOptionChecked"
                        id="update-salary-new-option"
                        label="New Salary Amount"
                        @change="onUpdateNewSalaryOptionChange"
                    />
                    <CheckBox
                        v-model="isUpdateCurrentSalaryOptionChecked"
                        id="update-salary-existing-option"
                        label="Existing Salary Amount"
                        @change="onUpdateCurrentSalaryOptionChange"
                    />
                </div>
                <p v-if="hasUpdateSalaryOptionError" class="modal-field-error">Please choose a salary update option</p>

                <div v-if="isUpdateNewSalaryOptionChecked" class="modal-form-field">
                    <label class="modal-field-label" for="update-new-salary-amount">New Salary Amount</label>
                    <Input
                        id="update-new-salary-amount"
                        v-model="updateNewSalaryAmount"
                        placeholder="Enter new salary amount"
                        :aria-invalid="hasUpdateNewSalaryAmountError || hasUpdateNewSalaryAmountFormatError || hasUpdateNewSalaryDuplicateError ? 'true' : 'false'"
                        :style="hasUpdateNewSalaryAmountError || hasUpdateNewSalaryAmountFormatError || hasUpdateNewSalaryDuplicateError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.14)' } : undefined"
                    />
                    <p v-if="hasUpdateNewSalaryAmountError" class="modal-field-error">Please enter new salary amount</p>
                    <p v-else-if="hasUpdateNewSalaryAmountFormatError" class="modal-field-error">Salary amount must be a valid number</p>
                    <p v-else-if="hasUpdateNewSalaryDuplicateError" class="modal-field-error">This salary amount already exists. Use existing salary option instead.</p>
                </div>

                <div v-if="isUpdateCurrentSalaryOptionChecked" class="modal-form-field">
                    <label class="modal-field-label" for="update-existing-salary-amount">Existing Salary Amount</label>
                    <select
                        id="update-existing-salary-amount"
                        v-model="selectedUpdateExistingSalary"
                        class="modal-select"
                        :aria-invalid="hasUpdateExistingSalaryError ? 'true' : 'false'"
                        :style="hasUpdateExistingSalaryError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.14)' } : undefined"
                    >
                        <option value="">Select existing salary amount</option>
                        <option v-for="salaryOption in backendSalaries" :key="salaryOption.salary_id" :value="String(salaryOption.salary_id)">
                            {{ salaryOption.amount }}
                        </option>
                    </select>
                    <p v-if="hasUpdateExistingSalaryError" class="modal-field-error">Please select existing salary amount</p>
                </div>
            </div>

            <template #footer>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--red"
                    @click="closeUpdateSalaryModal"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--blue"
                    @click="saveUpdatedSalary"
                >
                    Save
                </Button>
            </template>
        </Modal>

        <Modal
            v-model:open="isAddPositionModalOpen"
            hide-trigger
            :dismissible="false"
            title="Add Position"
        >
            <template #header>
                <h3 class="modal-title">New Position</h3>
            </template>

            <div class="modal-form-field">
                <Input
                    id="new-position-name"
                    v-model="newPositionName"
                    placeholder="Enter position name"
                    :aria-invalid="hasPositionNameError || isDuplicatePositionNameError ? 'true' : 'false'"
                    :style="hasPositionNameError || isDuplicatePositionNameError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.14)' } : undefined"
                />
                <p v-if="hasPositionNameError" class="modal-field-error">Please enter position name</p>
                <p v-else-if="isDuplicatePositionNameError" class="modal-field-error">Position name is already registered</p>

                <div class="salary-option-grid" role="group" aria-label="Salary option selection">
                    <CheckBox
                        v-model="isNewSalaryOptionChecked"
                        id="add-position-new-salary-option"
                        label="New Salary Amount"
                        @change="onAddNewSalaryOptionChange"
                    />
                    <CheckBox
                        v-model="isCurrentSalaryOptionChecked"
                        id="add-position-current-salary-option"
                        label="Current Salary Amount"
                        @change="onAddCurrentSalaryOptionChange"
                    />
                </div>
                <p v-if="hasSalaryOptionError" class="modal-field-error">Please select one salary option</p>

                <div v-if="isNewSalaryOptionChecked" class="modal-form-field">
                    <label class="modal-field-label" for="add-position-new-salary-amount">New Salary Amount</label>
                    <Input
                        id="add-position-new-salary-amount"
                        v-model="addNewSalaryAmount"
                        placeholder="Enter new salary amount"
                        :aria-invalid="hasAddNewSalaryAmountError || hasAddNewSalaryAmountFormatError ? 'true' : 'false'"
                        :style="hasAddNewSalaryAmountError || hasAddNewSalaryAmountFormatError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.14)' } : undefined"
                    />
                    <p v-if="hasAddNewSalaryAmountError" class="modal-field-error">Please enter new salary amount</p>
                    <p v-else-if="hasAddNewSalaryAmountFormatError" class="modal-field-error">Salary amount must be a valid number</p>
                </div>

                <div v-if="isCurrentSalaryOptionChecked" class="modal-form-field">
                    <label class="modal-field-label" for="add-position-current-salary">Current Salary Amount</label>
                    <select
                        id="add-position-current-salary"
                        v-model="selectedCurrentSalaryForAdd"
                        class="modal-select"
                        :aria-invalid="hasAddCurrentSalaryError ? 'true' : 'false'"
                        :style="hasAddCurrentSalaryError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.14)' } : undefined"
                    >
                        <option value="">Select current salary amount</option>
                        <option v-for="salaryOption in addSalaryOptions" :key="`add-${salaryOption.salary_id}`" :value="String(salaryOption.salary_id)">
                            {{ salaryOption.amount }}
                        </option>
                    </select>
                    <p v-if="hasAddCurrentSalaryError" class="modal-field-error">Please select current salary amount</p>
                </div>
            </div>

            <template #footer>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--red"
                    @click="closeAddPositionModal"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--blue"
                    @click="requestAddPositionConfirmation"
                >
                    Proceed
                </Button>
            </template>
        </Modal>

        <Modal
            v-model:open="isConfirmAddPositionModalOpen"
            hide-trigger
            :dismissible="false"
            title="Confirm Position"
        >
            <p class="confirm-modal-text">
                Are you sure you want to add
                <span class="confirm-modal-position-name">'{{ newPositionName.trim() }}'</span>?
            </p>

            <template #footer>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--red"
                    @click="closeAddPositionConfirmationModal"
                >
                    No
                </Button>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--blue"
                    @click="addPosition"
                >
                    Yes, Add
                </Button>
            </template>
        </Modal>

        <Modal
            v-model:open="isAddPositionLoadingModalOpen"
            hide-trigger
            :dismissible="false"
            :show-footer="false"
            title=""
        >
            <div class="loading-modal-content" role="status" aria-live="polite">
                <span class="table-spinner" aria-hidden="true"></span>
                <p class="adding-position-text">Adding new position</p>
            </div>
        </Modal>

        <Modal
            v-model:open="isUpdateSalaryLoadingModalOpen"
            hide-trigger
            :dismissible="false"
            :show-footer="false"
            title=""
        >
            <div class="loading-modal-content" role="status" aria-live="polite">
                <span class="table-spinner" aria-hidden="true"></span>
                <p class="updating-salary-text">Updating {{ selectedUpdatePosition }} salary</p>
            </div>
        </Modal>

        <Modal
            v-model:open="isDeletePositionModalOpen"
            hide-trigger
            :dismissible="false"
            title="Delete Position"
        >
            <p class="confirm-modal-text">
                Are you sure you want to delete
                <span class="confirm-modal-position-name">{{ selectedDeletePosition }}</span>?
            </p>

            <template #footer>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--red"
                    @click="closeDeletePositionModal"
                >
                    No
                </Button>
                <Button
                    type="button"
                    variant="subtle"
                    class="modal-footer-button modal-footer-button--blue"
                    @click="deletePosition"
                >
                    Yes, Delete
                </Button>
            </template>
        </Modal>

        <Modal
            v-model:open="isDeletePositionLoadingModalOpen"
            hide-trigger
            :dismissible="false"
            :show-footer="false"
            title=""
        >
            <div class="loading-modal-content" role="status" aria-live="polite">
                <span class="table-spinner" aria-hidden="true"></span>
                <p class="deleting-position-text">Deleting {{ selectedDeletePosition }} position</p>
            </div>
        </Modal>

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

.top-alert-wrap {
    position: fixed;
    top: 18px;
    right: 18px;
    width: min(360px, calc(100vw - 32px));
    z-index: 1100;
    display: grid;
    gap: 10px;
}

.add-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: currentColor;
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

.department-cards-grid {
    width: min(100%, 100%);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    align-items: stretch;
}

.department-info-card {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #ffffff;
}

.department-divider {
    width: min(100%, 100%);
    height: 1px;
    background: #e5e7eb;
    margin-top: 0.25rem;
}

.department-search {
    width: min(620px, 100%);
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.department-search :deep(.icon-input) {
    flex: 1;
    max-width: 480px;
}

.search-button {
    flex-shrink: 0;
    margin-left: 0.5rem;
}

.fab-add-position {
    position: fixed;
    right: 1.25rem;
    bottom: 1.25rem;
    width: 3.25rem;
    height: 3.25rem;
    border: none;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #2563eb;
    color: #ffffff;
    font-size: 1.75rem;
    line-height: 1;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.28);
    cursor: pointer;
    z-index: 30;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.fab-add-position:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 16px 28px rgba(29, 78, 216, 0.32);
}

.fab-add-position:active {
    transform: translateY(0);
}

.search-icon {
    width: 1rem;
    height: 1rem;
    color: #6b7280;
}

.positions-table-wrap {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #ffffff;
    overflow-x: auto;
}

.loading-modal-content {
    min-height: 120px;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 12px;
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

.adding-position-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 200;
    color: #334155;
}

.updating-salary-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 200;
    color: #334155;
}

.deleting-position-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 200;
    color: #334155;
}

.positions-table :deep(table) {
    width: 100%;
    border-collapse: collapse;
}

.positions-table :deep(th),
.positions-table :deep(td) {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem;
    color: #1f2937;
}

.positions-table :deep(th) {
    background: #f8fafc;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: none;
    letter-spacing: normal;
}

.positions-table :deep(tbody tr:last-child td) {
    border-bottom: none;
}

.table-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.table-action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.9rem;
    height: 1.9rem;
    border: 1px solid transparent;
    border-radius: 8px;
    background: #f8fafc;
    color: #64748b;
    padding: 0;
    line-height: 0;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.table-action-button.update {
    background: #f5f9ff;
    border-color: #e4efff;
    color: #4f83d1;
}

.table-action-button.delete {
    background: #fff6f6;
    border-color: #ffe8e8;
    color: #d17b7b;
}

.table-action-icon {
    width: 0.95rem;
    height: 0.95rem;
}

.table-action-button.update:hover {
    background: #eff6ff;
    border-color: #dbeafe;
    color: #2563eb;
}

.table-action-button.delete:hover {
    background: #fef2f2;
    border-color: #fee2e2;
    color: #dc2626;
}

.department-detail-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    text-align: center;
}

.department-detail-item {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
    justify-items: center;
}

.department-detail-item--with-button {
    justify-items: center;
}

.department-head-value-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
}

.department-detail-label {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
}

.department-detail-value {
    margin: 0;
    font-size: 0.75rem;
    color: #1f2937;
    overflow-wrap: anywhere;
}

.modal-title {
    margin: 0;
    color: #111827;
    font-size: 1rem;
    line-height: 1.2;
}

.modal-form-field {
    display: grid;
    gap: 8px;
}

.update-position-text {
    margin: 0;
    font-size: 0.88rem;
    color: #334155;
}

.salary-option-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    margin-top: 2px;
}

.modal-field-label {
    font-size: 0.84rem;
    color: #334155;
    font-weight: 600;
}

.modal-select {
    width: 100%;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    padding: 8px 12px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5l3.5 3 3.5-3'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 2rem;
}

.current-salary-display {
    width: 100%;
    min-height: 36px;
    padding: 8px 12px;
    background-color: #f3f4f6;
    color: #1f2937;
    font-size: 0.875rem;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
}

.modal-select:focus {
    border-color: #635bff;
    box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.2);
}

.modal-field-error {
    margin: 0;
    color: #dc2626;
    font-size: 0.8rem;
    line-height: 1.25;
}

.confirm-modal-text {
    margin: 0;
    color: #475569;
    font-size: 0.92rem;
}

.confirm-modal-position-name {
    font-weight: 600;
    color: #334155;
}

.modal-footer-button {
    margin-inline: 0;
}

.modal-footer-button--blue {
    background: #eaf2ff;
    border-color: #c7dcff;
    color: #1d4ed8;
}

.modal-footer-button--blue:hover {
    background: #dbeafe;
    border-color: #bfd7ff;
    color: #1e40af;
}

.modal-footer-button--red {
    background: #fff1f2;
    border-color: #fecdd3;
    color: #be123c;
}

.modal-footer-button--red:hover {
    background: #ffe4e6;
    border-color: #fda4af;
    color: #9f1239;
}

@media (max-width: 760px) {
    .top-alert-wrap {
        top: 12px;
        right: 12px;
        width: calc(100vw - 24px);
    }

    .department-cards-grid {
        grid-template-columns: 1fr;
    }

    .department-info-card {
        padding: 0.9rem 0.95rem;
    }

    .department-detail-row {
        grid-template-columns: 1fr;
        gap: 0.9rem;
    }

    .fab-add-position {
        width: 3rem;
        height: 3rem;
        right: 1rem;
        bottom: 1rem;
    }

    .salary-option-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .department-search {
        flex-direction: column;
        width: 220px;
    }


}
</style>