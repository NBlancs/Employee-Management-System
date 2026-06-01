<script setup lang="ts">
import { ArrowLeftIcon, PlusIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Alert from '~/components/Alert.vue'
import Modal from '~/components/Modal.vue'

interface AttendanceData {
    id: number
    department: string
    totalEmployees: number
    present: number
    absent: number
    late: number
    leave: number
    date: string
}

interface ShiftRecord {
    id: number
    work_hour_id?: number
    start: string
    end: string
    time_in?: string
    time_out?: string
    classification?: string
}

interface LoggedInUser {
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

defineProps<{
    attendance?: AttendanceData | null
}>()

const emit = defineEmits<{
    back: []
    viewShiftHour: [shift: ShiftRecord]
}>()

const shifts = ref<ShiftRecord[]>([])
const isLoadingShifts = ref(false)
const loadingError = ref('')

const isModalOpen = ref(false)
const isConfirmationModalOpen = ref(false)
const isDeleteConfirmationModalOpen = ref(false)
const isLoadingModalOpen = ref(false)
const showSuccessAlert = ref(false)
const successAlertMessage = ref('')
const morningShiftTimeIn = ref('')
const afternoonShiftTimeIn = ref('')
const morningShiftError = ref('')
const afternoonShiftError = ref('')
const loadingAction = ref<'add' | 'delete' | null>(null)
const pendingDeleteId = ref<number | null>(null)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let alertTimer: ReturnType<typeof setTimeout> | null = null

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

const loadingText = computed(() => {
    if (loadingAction.value === 'delete') return 'Deleting shift hour'
    return 'Adding shift hour'
})

const pendingDeleteShift = computed(() => {
    if (pendingDeleteId.value === null) return null

    return shifts.value.find(shift => shift.id === pendingDeleteId.value) ?? null
})

const pendingDeleteShiftRange = computed(() => {
    if (!pendingDeleteShift.value) return ''

    return `${formatTimeTo12Hour(pendingDeleteShift.value.start)} - ${formatTimeTo12Hour(pendingDeleteShift.value.end)}`
})

const morningShiftTimeOut = computed(() => {
    if (!morningShiftTimeIn.value) return ''
    const [hours = 0, minutes = 0] = morningShiftTimeIn.value.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)
    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
})

const afternoonShiftTimeOut = computed(() => {
    if (!afternoonShiftTimeIn.value) return ''
    const [hours = 0, minutes = 0] = afternoonShiftTimeIn.value.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)
    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
})

function getBackendErrorMessage(err: any, fallback: string) {
    return err?.data?.message || err?.response?._data?.message || err?.message || fallback
}

async function loadShifts() {
    isLoadingShifts.value = true
    loadingError.value = ''

    try {
        const resp: any = await $fetch('/api/work-hours')
        const payload = resp?.data ?? resp

        if (Array.isArray(payload)) {
            shifts.value = payload.map((wh: any) => ({
                id: wh.work_hour_id,
                work_hour_id: wh.work_hour_id,
                start: wh.time_in,
                end: wh.time_out,
                time_in: wh.time_in,
                time_out: wh.time_out,
                classification: wh.classification,
            }))
        }
    } catch (err) {
        loadingError.value = getBackendErrorMessage(err, 'Failed to load shift hours')
    } finally {
        isLoadingShifts.value = false
    }
}

function goBack() {
    emit('back')
}

function addShiftHours() {
    isModalOpen.value = true
}

function isDuplicateStart(morningTime: string, afternoonTime: string) {
    const morningExists = shifts.value.some(s => s.start === morningTime)
    const afternoonExists = shifts.value.some(s => s.start === afternoonTime)
    return { morningExists, afternoonExists }
}

function isAMTime(time: string): boolean {
    const hours = Number((time.split(':')[0]) || 0)
    return hours < 12
}

function isPMTime(time: string): boolean {
    const hours = Number((time.split(':')[0]) || 0)
    return hours >= 12
}

function handleAddShift() {
    morningShiftError.value = ''
    afternoonShiftError.value = ''

    let hasError = false

    if (!morningShiftTimeIn.value) {
        morningShiftError.value = 'Morning shift start time is required'
        hasError = true
    } else if (!isAMTime(morningShiftTimeIn.value)) {
        morningShiftError.value = 'Morning shift must be AM (before 12:00)'
        hasError = true
    }

    if (!afternoonShiftTimeIn.value) {
        afternoonShiftError.value = 'Afternoon shift start time is required'
        hasError = true
    } else if (!isPMTime(afternoonShiftTimeIn.value)) {
        afternoonShiftError.value = 'Afternoon shift must be PM (12:00 or later)'
        hasError = true
    }

    if (hasError) return

    const { morningExists, afternoonExists } = isDuplicateStart(morningShiftTimeIn.value, afternoonShiftTimeIn.value)

    if (morningExists) {
        morningShiftError.value = 'This morning shift time already exists'
        hasError = true
    }

    if (afternoonExists) {
        afternoonShiftError.value = 'This afternoon shift time already exists'
        hasError = true
    }

    if (hasError) return

    isConfirmationModalOpen.value = true
}

function confirmAddShift() {
    isConfirmationModalOpen.value = false
    loadingAction.value = 'add'
    isLoadingModalOpen.value = true

    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }

    loadingTimer = setTimeout(async () => {
        try {
            // Add morning shift
            const morningShift: any = await $fetch('/api/work-hours', {
                method: 'POST',
                body: {
                    transacted_by: transactedById.value,
                    time_in: morningShiftTimeIn.value,
                    time_out: morningShiftTimeOut.value,
                },
            })

            const morningPayload = morningShift?.data ?? morningShift

            shifts.value.push({
                id: morningPayload.work_hour_id,
                work_hour_id: morningPayload.work_hour_id,
                start: morningPayload.time_in,
                end: morningPayload.time_out,
                time_in: morningPayload.time_in,
                time_out: morningPayload.time_out,
                classification: morningPayload.classification,
            })

            // Add afternoon shift
            const afternoonShift: any = await $fetch('/api/work-hours', {
                method: 'POST',
                body: {
                    transacted_by: transactedById.value,
                    time_in: afternoonShiftTimeIn.value,
                    time_out: afternoonShiftTimeOut.value,
                },
            })

            const afternoonPayload = afternoonShift?.data ?? afternoonShift

            shifts.value.push({
                id: afternoonPayload.work_hour_id,
                work_hour_id: afternoonPayload.work_hour_id,
                start: afternoonPayload.time_in,
                end: afternoonPayload.time_out,
                time_in: afternoonPayload.time_in,
                time_out: afternoonPayload.time_out,
                classification: afternoonPayload.classification,
            })

            isLoadingModalOpen.value = false
            loadingAction.value = null
            isModalOpen.value = false
            morningShiftTimeIn.value = ''
            afternoonShiftTimeIn.value = ''
            morningShiftError.value = ''
            afternoonShiftError.value = ''

            showSuccessAlert.value = true
            successAlertMessage.value = 'Both shift hours added successfully.'

            if (alertTimer) {
                clearTimeout(alertTimer)
            }

            alertTimer = setTimeout(() => {
                showSuccessAlert.value = false
            }, 3000)
        } catch (err) {
            isLoadingModalOpen.value = false
            loadingAction.value = null
            const errorMessage = getBackendErrorMessage(err, 'Failed to add shift hours')
            console.error('Add shift error:', err)
            showSuccessAlert.value = true
            successAlertMessage.value = errorMessage

            if (alertTimer) {
                clearTimeout(alertTimer)
            }

            alertTimer = setTimeout(() => {
                showSuccessAlert.value = false
            }, 3000)
        }
    }, 1500)
}

function removeShift(id: number) {
    shifts.value = shifts.value.filter(s => s.id !== id)
}

function handleDeleteShift(id: number) {
    pendingDeleteId.value = id
    isDeleteConfirmationModalOpen.value = true
}

function handleViewShiftHour(shift: ShiftRecord) {
    emit('viewShiftHour', shift)
}

function cancelConfirmation() {
    isConfirmationModalOpen.value = false
}

function cancelDeleteConfirmation() {
    isDeleteConfirmationModalOpen.value = false
    pendingDeleteId.value = null
}

function confirmDeleteShift() {
    if (pendingDeleteId.value === null) {
        return
    }

    isDeleteConfirmationModalOpen.value = false
    loadingAction.value = 'delete'
    isLoadingModalOpen.value = true

    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }

    const deleteId = pendingDeleteId.value

    loadingTimer = setTimeout(async () => {
        try {
            await $fetch(`/api/work-hours/${deleteId}?transacted_by=${transactedById.value}`, {
                method: 'DELETE',
            })

            shifts.value = shifts.value.filter(s => s.id !== deleteId)

            isLoadingModalOpen.value = false
            loadingAction.value = null
            pendingDeleteId.value = null

            showSuccessAlert.value = true
            successAlertMessage.value = 'Shift hour deleted successfully.'

            if (alertTimer) {
                clearTimeout(alertTimer)
            }

            alertTimer = setTimeout(() => {
                showSuccessAlert.value = false
            }, 3000)
        } catch (err) {
            isLoadingModalOpen.value = false
            loadingAction.value = null
            pendingDeleteId.value = null
            const errorMessage = getBackendErrorMessage(err, 'Failed to delete shift hour')
            showSuccessAlert.value = true
            successAlertMessage.value = errorMessage

            if (alertTimer) {
                clearTimeout(alertTimer)
            }

            alertTimer = setTimeout(() => {
                showSuccessAlert.value = false
            }, 3000)
        }
    }, 1500)
}

function closeAllModals() {
    if (loadingTimer) {
        clearTimeout(loadingTimer)
        loadingTimer = null
    }

    isModalOpen.value = false
    isConfirmationModalOpen.value = false
    isDeleteConfirmationModalOpen.value = false
    isLoadingModalOpen.value = false
    loadingAction.value = null
    pendingDeleteId.value = null
    morningShiftTimeIn.value = ''
    afternoonShiftTimeIn.value = ''
    morningShiftError.value = ''
    afternoonShiftError.value = ''
}

onMounted(async () => {
    await loadShifts()
})

onUnmounted(() => {
    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }

    if (alertTimer) {
        clearTimeout(alertTimer)
    }
})

function formatTimeTo12Hour(timeString: string): string {
    if (!timeString) return ''
    const [h, m] = timeString.split(':')
    let hour = parseInt(h ?? '0')
    const ampm = hour >= 12 ? 'PM' : 'AM'
    if (hour > 12) hour -= 12
    if (hour === 0) hour = 12
    return `${hour}:${m} ${ampm}`
}
</script>

<template>
    <section class="shift-hours-page">
        <div v-if="showSuccessAlert" class="shift-hours-alert-wrap">
            <Alert
                title="Success"
                :message="successAlertMessage"
                variant="success"
                :dismissible="true"
                @close="showSuccessAlert = false"
            />
        </div>

        <div v-if="loadingError" class="shift-hours-alert-wrap">
            <Alert
                title="Error"
                :message="loadingError"
                variant="error"
                :dismissible="true"
                @close="loadingError = ''"
            />
        </div>

        <div class="shift-hours-header">
            <button class="back-button" @click="goBack">
                <ArrowLeftIcon class="back-icon" />
            </button>
            <h1 class="shift-hours-title">Shift Hours Management</h1>
        </div>

        <div class="ems-table-wrap shift-hours-table-wrap">
            <div v-if="isLoadingShifts" class="loading-state">
                <div class="spinner"></div>
                <p class="loading-text">Loading shift hours...</p>
            </div>
            <table v-else>
                <thead>
                    <tr>
                        <th>Shift Start</th>
                        <th>Shift End</th>
                        <th class="actions-column">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="shifts.length === 0">
                        <td colspan="4" class="empty-state">
                            No shift hours records found.
                        </td>
                    </tr>

                    <tr v-for="shift in shifts" :key="shift.id">
                        <td>{{ formatTimeTo12Hour(shift.start) }}</td>
                        <td>{{ formatTimeTo12Hour(shift.end) }}</td>
                        <td>
                            <div class="action-buttons">
                               
                                <button
                                    class="delete-icon-button"
                                    @click="handleDeleteShift(shift.id)"
                                    aria-label="Delete shift"
                                >
                                    <TrashIcon class="delete-icon" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button class="floating-button" @click="addShiftHours">
            <PlusIcon class="floating-button-icon" />
        </button>
    </section>

    <!-- Add Shift Modal -->
    <Modal
        v-model:open="isModalOpen"
        title="Add Shift Hours"
        description="Set the shift times. The end time will automatically be 4 hours later."
        :hide-trigger="true"
    >
        <div class="modal-content">
            <!-- Morning Shift -->
            <div class="shift-section">
                <h3 class="shift-section-title">Morning Shift (AM only)</h3>
                <div class="form-group">
                    <label class="form-label">Time In</label>
                    <input
                        v-model="morningShiftTimeIn"
                        type="time"
                        class="time-input"
                        :class="{ 'time-input--error': morningShiftError }"
                        @input="() => {
                            morningShiftError = ''
                            if (morningShiftTimeIn && !isAMTime(morningShiftTimeIn)) {
                                morningShiftError = 'Morning shift must be AM (before 12:00)'
                            }
                        }"
                    />
                    <p v-if="morningShiftError" class="error-message">{{ morningShiftError }}</p>
                </div>

                <div class="form-group">
                    <label class="form-label">Time Out</label>
                    <input
                        :value="morningShiftTimeOut"
                        type="time"
                        class="time-input time-input--disabled"
                        disabled
                    />
                </div>
            </div>

            <!-- Afternoon Shift -->
            <div class="shift-section">
                <h3 class="shift-section-title">Afternoon Shift (PM only)</h3>
                <div class="form-group">
                    <label class="form-label">Time In</label>
                    <input
                        v-model="afternoonShiftTimeIn"
                        type="time"
                        class="time-input"
                        :class="{ 'time-input--error': afternoonShiftError }"
                        @input="() => {
                            afternoonShiftError = ''
                            if (afternoonShiftTimeIn && !isPMTime(afternoonShiftTimeIn)) {
                                afternoonShiftError = 'Afternoon shift must be PM (12:00 or later)'
                            }
                        }"
                    />
                    <p v-if="afternoonShiftError" class="error-message">{{ afternoonShiftError }}</p>
                </div>

                <div class="form-group">
                    <label class="form-label">Time Out</label>
                    <input
                        :value="afternoonShiftTimeOut"
                        type="time"
                        class="time-input time-input--disabled"
                        disabled
                    />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="modal-footer-content">
                <button class="modal-button modal-button--subtle-red" @click="closeAllModals">
                    Cancel
                </button>
                <button class="modal-button modal-button--subtle-blue" @click="handleAddShift">
                    Add Shifts
                </button>
            </div>
        </template>
    </Modal>

    <!-- Confirmation Modal -->
    <Modal
        v-model:open="isConfirmationModalOpen"
        title="Confirm Shift Hours"
        :hide-trigger="true"
        :dismissible="false"
    >
        <div class="confirmation-content">
            <p class="confirmation-text">Add these shifts?</p>
            <div class="shift-details">
                <div class="detail-section">
                    <h4 class="detail-section-title">Morning Shift</h4>
                    <div class="detail-row">
                        <span>Time In:</span>
                        <span>{{ formatTimeTo12Hour(morningShiftTimeIn) }}</span>
                    </div>
                    <div class="detail-row">
                        <span>Time Out:</span>
                        <span>{{ formatTimeTo12Hour(morningShiftTimeOut) }}</span>
                    </div>
                </div>
                <div class="detail-section">
                    <h4 class="detail-section-title">Afternoon Shift</h4>
                    <div class="detail-row">
                        <span>Time In:</span>
                        <span>{{ formatTimeTo12Hour(afternoonShiftTimeIn) }}</span>
                    </div>
                    <div class="detail-row">
                        <span>Time Out:</span>
                        <span>{{ formatTimeTo12Hour(afternoonShiftTimeOut) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="modal-footer-content">
                <button class="modal-button modal-button--subtle-red" @click="cancelConfirmation">
                    Cancel
                </button>
                <button class="modal-button modal-button--subtle-blue" @click="confirmAddShift">
                    Confirm
                </button>
            </div>
        </template>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal
        v-model:open="isDeleteConfirmationModalOpen"
        title=""
        description=""
        :hide-trigger="true"
        :dismissible="false"
    >
        <div class="delete-modal">
            <p class="delete-modal__text">Are you sure you want to delete this shift hour?</p>

            <p v-if="pendingDeleteShiftRange" class="delete-modal__range">{{ pendingDeleteShiftRange }}</p>

            <div class="delete-modal__actions">
                <button class="delete-modal__button delete-modal__button--subtle-red" @click="cancelDeleteConfirmation">
                    No
                </button>

                <button class="delete-modal__button delete-modal__button--subtle-blue" @click="confirmDeleteShift">
                    Yes, Delete
                </button>
            </div>
        </div>
    </Modal>

    <!-- Loading Modal -->
    <Modal
        v-model:open="isLoadingModalOpen"
        title=""
        description=""
        :hide-trigger="true"
        :dismissible="false"
        :show-footer="false"
    >
        <div class="loading-content">
            <div class="spinner" aria-hidden="true"></div>
            <p class="loading-text">{{ loadingText }}</p>
        </div>
    </Modal>
</template>

<style scoped>
.shift-hours-page {
    width: 100%;
    max-width: 100%;
    min-width: 0;
}

.shift-hours-alert-wrap {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1200;
    width: min(100%, 360px);
    pointer-events: none;
}

.shift-hours-alert-wrap :deep(.app-alert) {
    pointer-events: auto;
}

.shift-hours-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.9rem;
}

.back-button {
    width: 28px;
    height: 28px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.back-button:hover {
    background: #f8fafc;
}

.back-icon {
    width: 14px;
    height: 14px;
}

.shift-hours-title {
    margin: 0;
    font-size: 1rem;
    color: #1f2937;
}

.shift-hours-table-wrap {
    margin-top: 1rem;
}

.actions-column {
    width: 100px
}

.action-button {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #64748b;
    padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    margin-right: 6px;
}

.action-button:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
}

.empty-state {
    text-align: center;
    color: #94a3b8;
    padding: 24px 14px;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem 2rem;
    text-align: center;
}

.floating-button {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #635bff;
    border: none;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(99, 91, 255, 0.3);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.floating-button:hover {
    background: #5247e0;
    box-shadow: 0 6px 16px rgba(99, 91, 255, 0.4);
}

.floating-button-icon {
    width: 24px;
    height: 24px;
}

.modal-content {
    display: grid;
    gap: 1.5rem;
}

.shift-section {
    display: grid;
    gap: 0.75rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.shift-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.shift-section-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
}

.detail-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
    margin-top: 0.75rem;
}

.detail-section:first-child {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
}

.detail-section-title {
    margin: 0 0 0.5rem 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
}

.form-group {
    display: grid;
    gap: 0.35rem;
}

.form-label {
    font-size: 0.82rem;
    color: #475569;
    font-weight: 600;
}

.time-input {
    min-height: 38px;
    padding: 8px 10px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.time-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.time-input--error {
    border-color: #dc2626;
}

.time-input--error:focus {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.time-input--disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
}

.time-input--disabled:focus {
    border-color: #d1d5db;
    box-shadow: none;
}

.error-message {
    font-size: 0.8rem;
    color: #dc2626;
    margin: 4px 0 0;
}

.confirmation-content {
    display: grid;
    gap: 1rem;
}

.loading-content {
    display: grid;
    justify-items: center;
    gap: 0.9rem;
    padding: 0.5rem 0 0.25rem;
    text-align: center;
}

.spinner {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 4px solid #e5e7eb;
    border-top-color: #635bff;
    animation: spin 0.85s linear infinite;
}

.loading-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 200;
    color: #1f2937;
}

.delete-modal {
    display: grid;
    gap: 1rem;
}

.delete-modal__text {
    margin: 0;
    font-size: 0.95rem;
    color: #1f2937;
    font-weight: 200;
    text-align: center;
}

.delete-modal__range {
    margin: -0.4rem 0 0;
    text-align: center;
    font-size: 0.95rem;
    color: #1f2937;
    font-weight: 600;
}

.delete-modal__actions {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.delete-modal__button {
    min-width: 108px;
    border-radius: 10px;
    border: 1px solid #bfdbfe;
    padding: 8px 14px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.modal-button--subtle-blue,
.delete-modal__button--subtle-blue {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1d4ed8;
}

.modal-button--subtle-blue:hover,
.delete-modal__button--subtle-blue:hover {
    background: #dbeafe;
    border-color: #93c5fd;
}

.modal-button--subtle-red,
.delete-modal__button--subtle-red {
    background: #fef2f2;
    border-color: #fecaca;
    color: #b91c1c;
}

.modal-button--subtle-red:hover,
.delete-modal__button--subtle-red:hover {
    background: #fee2e2;
    border-color: #fca5a5;
}

.confirmation-text {
    margin: 0;
    font-size: 0.95rem;
    color: #1f2937;
    font-weight: 500;
}

.shift-details {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 1rem;
    display: grid;
    gap: 0.75rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
}

.detail-label {
    color: #6b7280;
    font-weight: 500;
}

.detail-value {
    color: #1f2937;
    font-weight: 600;
}

.modal-button {
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 8px 14px;
    cursor: pointer;
    font-weight: 500;
    margin: 0 !important;
}

.modal-button.modal-button--subtle-blue {
    border-color: #bfdbfe;
}

.modal-button.modal-button--subtle-red {
    border-color: #fecaca;
}

.modal-footer-content {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    width: auto !important;
}

.action-buttons {
    display: inline-flex;
    gap: 6px;
    align-items: center;
}

.action-button {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.action-button--view {
    border-color: #bfdbfe;
    background: #eff6ff;
}

.action-button--view:hover {
    background: #dbeafe;
    border-color: #93c5fd;
}

.action-icon {
    width: 16px;
    height: 16px;
    color: #1d4ed8;
}

.delete-icon-button {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #fecaca;
    background: #fef2f2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.delete-icon-button:hover {
    background: #fee2e2;
    border-color: #fca5a5;
}

.delete-icon {
    width: 16px;
    height: 16px;
    color: #dc2626;
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 820px) {
    .shift-hours-alert-wrap {
        top: 12px;
        right: 12px;
        width: min(100%, calc(100vw - 24px));
    }

    .shift-hours-title {
        font-size: 0.95rem;
    }
}

@media (max-width: 640px) {
    .shift-hours-header {
        flex-wrap: wrap;
    }

    .floating-button {
        right: 16px;
        bottom: 16px;
        width: 44px;
        height: 44px;
    }

    .floating-button-icon {
        width: 20px;
        height: 20px;
    }

    .delete-modal__actions {
        flex-wrap: wrap;
    }

    .delete-modal__button {
        flex: 1 1 auto;
        min-width: 96px;
    }
}

@media (max-width: 480px) {
    .action-button {
        padding: 5px 8px;
        font-size: 0.75rem;
        margin-right: 4px;
    }
}
</style>