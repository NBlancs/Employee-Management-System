<script setup lang="ts">
import { ArrowLeftIcon, PlusIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onUnmounted } from 'vue'
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
    start: string
    end: string
}

defineProps<{
    attendance?: AttendanceData | null
}>()

const emit = defineEmits<{
    back: []
    viewShiftHour: [shift: ShiftRecord]
}>()

const shifts = ref<ShiftRecord[]>([])

const isModalOpen = ref(false)
const isConfirmationModalOpen = ref(false)
const isDeleteConfirmationModalOpen = ref(false)
const isLoadingModalOpen = ref(false)
const showSuccessAlert = ref(false)
const successAlertMessage = ref('')
const shiftStartTime = ref('')
const shiftStartError = ref('')
const loadingAction = ref<'add' | 'delete' | null>(null)
const pendingDeleteId = ref<number | null>(null)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let alertTimer: ReturnType<typeof setTimeout> | null = null

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

const shiftEndTime = computed(() => {
    if (!shiftStartTime.value) return ''

    const [hours = 0, minutes = 0] = shiftStartTime.value.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)

    let endDate = new Date(startDate.getTime() + 8 * 60 * 60 * 1000)

    if (endDate.getHours() === 12) {
        endDate = new Date(endDate.getTime() + 60 * 60 * 1000)
    }

    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
})

function goBack() {
    emit('back')
}

function addShiftHours() {
    isModalOpen.value = true
}

function isDuplicateStart(time: string) {
    return shifts.value.some(s => s.start === time)
}

function handleAddShift() {
    shiftStartError.value = ''

    if (!shiftStartTime.value) {
        shiftStartError.value = 'Shift start time is required'
        return
    }

    if (isDuplicateStart(shiftStartTime.value)) {
        shiftStartError.value = 'This shift start time already exists'
        return
    }

    isConfirmationModalOpen.value = true
}

function confirmAddShift() {
    isConfirmationModalOpen.value = false
    loadingAction.value = 'add'
    isLoadingModalOpen.value = true

    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }

    loadingTimer = setTimeout(() => {
        shifts.value.push({
            id: Date.now(),
            start: shiftStartTime.value,
            end: shiftEndTime.value
        })

        isLoadingModalOpen.value = false
        loadingAction.value = null
        isModalOpen.value = false
        shiftStartTime.value = ''
        shiftStartError.value = ''

        showSuccessAlert.value = true
        successAlertMessage.value = 'Shift hour added successfully.'

        if (alertTimer) {
            clearTimeout(alertTimer)
        }

        alertTimer = setTimeout(() => {
            showSuccessAlert.value = false
        }, 3000)
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

    loadingTimer = setTimeout(() => {
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
    shiftStartTime.value = ''
    shiftStartError.value = ''
}

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

        <div class="shift-hours-header">
            <button class="back-button" @click="goBack">
                <ArrowLeftIcon class="back-icon" />
            </button>
            <h1 class="shift-hours-title">Shift Hours Management</h1>
        </div>

        <div class="shift-hours-table-wrap">
            <table class="shift-hours-table">
                <thead>
                    <tr>
                        <th>Shift Start</th>
                        <th>Shift End</th>
                        <th class="actions-column">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="shifts.length === 0">
                        <td colspan="3" class="empty-state">
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
        description="Set the shift start time. The end time will automatically be 8 hours later."
        :hide-trigger="true"
    >
        <div class="modal-content">
            <div class="form-group">
                <label class="form-label">Shift Start Time</label>
                <input
                    v-model="shiftStartTime"
                    type="time"
                    class="time-input"
                    :class="{ 'time-input--error': shiftStartError }"
                    @input="shiftStartError = ''"
                />
                <p v-if="shiftStartError" class="error-message">{{ shiftStartError }}</p>
            </div>

            <div class="form-group">
                <label class="form-label">Shift End Time</label>
                <input
                    :value="shiftEndTime"
                    type="time"
                    class="time-input time-input--disabled"
                    disabled
                />
            </div>
        </div>

        <template #footer>
            <div class="modal-footer-content">
                <button class="modal-button modal-button--subtle-red" @click="closeAllModals">
                    Cancel
                </button>
                <button class="modal-button modal-button--subtle-blue" @click="handleAddShift">
                    Add Shift
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
            <p class="confirmation-text">Add this shift?</p>
            <div class="shift-details">
                <div class="detail-row">
                    <span>Shift Start:</span>
                    <span>{{ formatTimeTo12Hour(shiftStartTime) }}</span>
                </div>
                <div class="detail-row">
                    <span>Shift End:</span>
                    <span>{{ formatTimeTo12Hour(shiftEndTime) }}</span>
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
    width: 100%;
    margin-top: 1rem;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
}

.shift-hours-table {
    width: 100%;
    min-width: 500px;
    border-collapse: collapse;
}

.shift-hours-table th,
.shift-hours-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.85rem;
    color: #1f2937;
    text-align: left;
}

.shift-hours-table th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
}

.shift-hours-table tbody tr:last-child td {
    border-bottom: none;
}

.actions-column {
    width: 120px;
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
    gap: 1rem;
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
</style>