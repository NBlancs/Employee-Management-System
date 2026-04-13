<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'
import Modal from '~/components/Modal.vue'

type CreatedEmployeePayload = {
    name: string
    department: string
    cardStatus: 'Has Card' | 'No Card'
}

const emit = defineEmits<{
    back: []
    employeeCreated: [employee: CreatedEmployeePayload]
}>()

const form = ref({
    department: '',
    position: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    gender: '',
    birthdate: '',
    age: '',
    province: '',
    city: '',
    barangay: '',
    zipCode: '',
    contactNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
})

const showConfirmModal = ref(false)
const showLoadingModal = ref(false)
const usernameError = ref('')
const existingUsernames = useState<string[]>('employee-usernames', () => [
    'joel.kent',
    'jayneth.valle',
    'walter.maturan',
    'jeann.callo',
])

function normalizeUsername(value: string) {
    return value.trim().toLowerCase()
}

function goBack() {
    emit('back')
}

function handleSubmit() {
    const normalizedUsername = normalizeUsername(form.value.username)

    if (existingUsernames.value.includes(normalizedUsername)) {
        usernameError.value = 'Username already exists'
        return
    }

    usernameError.value = ''
    showConfirmModal.value = true
}

function confirmSubmit() {
    showConfirmModal.value = false
    showLoadingModal.value = true
    
    setTimeout(() => {
        showLoadingModal.value = false
        console.log('Create employee:', form.value)
        const middleInitial = form.value.middleName ? ` ${form.value.middleName.charAt(0)}.` : ''
        const fullName = `${form.value.lastName}, ${form.value.firstName}${middleInitial}`

        emit('employeeCreated', {
            name: fullName,
            department: form.value.department,
            cardStatus: 'No Card',
        })

        const normalizedUsername = normalizeUsername(form.value.username)
        if (!existingUsernames.value.includes(normalizedUsername)) {
            existingUsernames.value = [...existingUsernames.value, normalizedUsername]
        }

        emit('back')
    }, 1500)
}
</script>

<template>
    <div class="new-employee-page">
        <div class="new-employee-header">
            <button
                type="button"
                class="back-button"
                aria-label="Back"
                @click="goBack"
            >
                <ArrowLeftIcon class="back-icon" />
            </button>

            <div class="header-content">
                <h1 class="new-employee-title">Create New Employee</h1>
            </div>
        </div>

        <form class="new-employee-form" @submit.prevent="handleSubmit">
            <div class="form-card">
                <div class="form-section">
                    <h2 class="section-title">Job Information</h2>
                    <div class="new-employee-grid">
                        <div class="select-field-wrap">
                            <label class="select-field-label" for="department">Department <span class="required-indicator">*</span></label>
                            <select id="department" v-model="form.department" class="select-field" aria-label="Department" required>
                                <option value="">Select department</option>
                                <option value="HR">Human Resources</option>
                                <option value="IT">Information Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                        <div class="select-field-wrap">
                            <label class="select-field-label" for="position">Position <span class="required-indicator">*</span></label>
                            <select id="position" v-model="form.position" class="select-field" aria-label="Position" required>
                                <option value="">Select position</option>
                                <option value="Manager">Manager</option>
                                <option value="Senior">Senior</option>
                                <option value="Junior">Junior</option>
                                <option value="Intern">Intern</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-divider"></div>

                <div class="form-section">
                    <h2 class="section-title">Personal Information</h2>
                    <div class="new-employee-grid">
                        <IconInput v-model="form.firstName" label="First Name" placeholder="Enter first name" size="sm" required />
                        <IconInput v-model="form.middleName" label="Middle Name" placeholder="Enter middle name" size="sm" />
                        <IconInput v-model="form.lastName" label="Last Name" placeholder="Enter last name" size="sm" required />
                        <div class="select-field-wrap">
                            <label class="select-field-label" for="suffix">Suffix</label>
                            <select id="suffix" v-model="form.suffix" class="select-field" aria-label="Suffix">
                                <option value="">Select suffix</option>
                                <option value="Jr.">Jr.</option>
                                <option value="Sr.">Sr.</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-divider"></div>

                <div class="form-section">
                    <div class="new-employee-grid">
                        <div class="select-field-wrap">
                            <label class="select-field-label" for="gender">Gender <span class="required-indicator">*</span></label>
                            <select id="gender" v-model="form.gender" class="select-field" aria-label="Gender" required>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <IconInput v-model="form.birthdate" label="Birthdate" type="date" size="sm" required />
                        <div class="age-input-wrapper">
                            <IconInput v-model="form.age" label="Age"placeholder="Enter age" size="sm" required />
                        </div>
                    </div>
                </div>

                <div class="form-divider"></div>

                <div class="form-section">
                    <h2 class="section-title">Address Information</h2>
                    <div class="new-employee-grid">
                        <IconInput v-model="form.province" label="Province" placeholder="Enter province" size="sm" required />
                        <IconInput v-model="form.city" label="City" placeholder="Enter city" size="sm" required />
                        <IconInput v-model="form.barangay" label="Barangay" placeholder="Enter barangay" size="sm" required />
                        <IconInput v-model="form.zipCode" label="Zip Code" placeholder="Enter zip code" size="sm" required />
                    </div>
                </div>

                <div class="form-divider"></div>

                <div class="form-section">
                    <h2 class="section-title">Contact Details</h2>
                    <div class="new-employee-grid">
                        <IconInput v-model="form.contactNumber" label="Contact Number" type="tel" placeholder="Enter contact number" size="sm" required />
                    </div>
                </div>

                <div class="form-divider"></div>

                <div class="form-section">
                    <h2 class="section-title">Account Information</h2>
                    <div class="account-info-container">
                        <IconInput
                            v-model="form.username"
                            label="Username"
                            placeholder="Enter username"
                            size="sm"
                            :error="usernameError"
                            required
                            @update:modelValue="usernameError = ''"
                        />
                        <IconInput v-model="form.password" label="Password" type="password" placeholder="Enter password" size="sm" required />
                        <IconInput v-model="form.confirmPassword" label="Re-enter Password" type="password" placeholder="Re-enter password" size="sm" required />
                    </div>
                </div>
            </div>

            <div class="form-footer">
                <Button
                    label="Proceed"
                    variant="solid"
                    type="submit"
                    class="submit-button"
                />
            </div>
        </form>

        <Modal
            v-model:open="showConfirmModal"
            title="Confirm Employee Creation"
            description="Please review the information and confirm to create the new employee."
            confirmLabel="Create Employee"
            cancelLabel="Cancel"
            :showFooter="true"
            :hideTrigger="true"
            @confirm="confirmSubmit"
            @cancel="showConfirmModal = false"
        >
            <div class="confirmation-content">
                <div class="confirmation-section">
                    <h4 class="section-header">Job Information</h4>
                    <p><strong>Department:</strong> {{ form.department || 'Not selected' }}</p>
                    <p><strong>Position:</strong> {{ form.position || 'Not selected' }}</p>
                </div>
                <div class="confirmation-section">
                    <h4 class="section-header">Personal Information</h4>
                    <p><strong>Name:</strong> {{ [form.firstName, form.middleName, form.lastName, form.suffix].filter(Boolean).join(' ') || 'Not provided' }}</p>
                    <p><strong>Gender:</strong> {{ form.gender || 'Not selected' }}</p>
                    <p><strong>Birthdate:</strong> {{ form.birthdate || 'Not provided' }}</p>
                </div>
                <div class="confirmation-section">
                    <h4 class="section-header">Address Information</h4>
                    <p>{{ [form.barangay, form.city, form.province, form.zipCode].filter(Boolean).join(', ') || 'Not provided' }}</p>
                </div>
                <div class="confirmation-section">
                    <h4 class="section-header">Contact Information</h4>
                    <p><strong>Contact Number:</strong> {{ form.contactNumber || 'Not provided' }}</p>
                </div>
                <div class="confirmation-section">
                    <h4 class="section-header">Account Information</h4>
                    <p><strong>Username:</strong> {{ form.username || 'Not provided' }}</p>
                </div>
            </div>
        </Modal>

        <Modal
            v-model:open="showLoadingModal"
            title="Processing"
            :dismissible="false"
            :hideTrigger="true"
        >
            <div class="loading-modal-content">
                <div class="spinner"></div>
                <p class="loading-text">Creating new employee</p>
            </div>
        </Modal>
    </div>
</template>

<style scoped>
.new-employee-page {
    width: 100%;
    display: grid;
    align-content: start;
    gap: 1.5rem;
    max-width: 1200px;
}

.new-employee-header {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
}

.header-content {
    display: grid;
    gap: 0.25rem;
}

.back-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #111827;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.back-button:hover {
    background: #f8fafc;
}

.back-icon {
    width: 14px;
    height: 14px;
}

.new-employee-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
}

.header-subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
}

.new-employee-form {
    width: 100%;
    display: grid;
    gap: 1.5rem;
}

.form-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
    display: grid;
    gap: 1rem;
}

.section-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
}

.form-divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 1.5rem 0;
}

.new-employee-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.9rem;
}

.age-input-wrapper {
    max-width: 120px;
}

.account-info-container {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.9rem;
}

.select-field-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.select-field-label {
    color: #1f2937;
    font-size: 0.875rem;
    font-weight: 500;
}

.required-indicator {
    color: #ef4444;
    margin-left: 2px;
}

.select-field {
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

.select-field:focus {
    border-color: #635bff;
    box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.2);
}

.form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.submit-button {
    width: 160px;
}

@media (max-width: 1100px) {
    .new-employee-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .new-employee-grid {
        grid-template-columns: 1fr;
    }

    .form-card {
        padding: 1.5rem;
    }

    .new-employee-title {
        font-size: 1.1rem;
    }
}

.confirmation-content {
    display: grid;
    gap: 1rem;
}

.confirmation-section {
    display: grid;
    gap: 0.5rem;
}

.section-header {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
}

.confirmation-section p {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #6b7280;
}

.confirmation-section p strong {
    color: #374151;
}

.loading-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem 0;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #635bff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.loading-text {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Hide number input spinner */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
    display: none !important;
}

input[type="number"] {
    -moz-appearance: textfield !important;
}
</style>