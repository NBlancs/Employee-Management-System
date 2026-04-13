<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { ArrowLeftIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Alert from '~/components/Alert.vue'
import Modal from '~/components/Modal.vue'

const props = defineProps<{
    employeeId: number | null
}>()

type EmployeeInfoRecord = {
  id: number
  department: string
  position: string
  salary: number
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  gender: string
  birthdate: string
  age: number
  province: string
  city: string
  barangay: string
  zipCode: string
  contactNumber: string
  username: string
  cardStatus: 'Has Card' | 'No Card'
  cardNumber: string
}

const employeeDirectory: [EmployeeInfoRecord, ...EmployeeInfoRecord[]] = [
  {
    id: 1,
    department: 'IT',
    position: 'Senior',
    salary: 48000,
    firstName: 'Joel Kent',
    middleName: '',
    lastName: 'Lascuna',
    suffix: '',
    gender: 'Male',
    birthdate: '1995-06-18',
    age: 30,
    province: 'Cebu',
    city: 'Cebu City',
    barangay: 'Lahug',
    zipCode: '6000',
    contactNumber: '09171234567',
    username: 'joel.kent',
    cardStatus: 'Has Card',
    cardNumber: 'IDC-IT-1001',
  },
  {
    id: 2,
    department: 'HR',
    position: 'Manager',
    salary: 52000,
    firstName: 'Jayneth',
    middleName: '',
    lastName: 'Valle',
    suffix: '',
    gender: 'Female',
    birthdate: '1993-03-09',
    age: 33,
    province: 'Bohol',
    city: 'Tagbilaran',
    barangay: 'Cogon',
    zipCode: '6300',
    contactNumber: '09172345678',
    username: 'jayneth.valle',
    cardStatus: 'Has Card',
    cardNumber: 'IDC-HR-1002',
  },
  {
    id: 3,
    department: 'Finance',
    position: 'Junior',
    salary: 28000,
    firstName: 'Walter',
    middleName: '',
    lastName: 'Maturan',
    suffix: '',
    gender: 'Male',
    birthdate: '1998-11-23',
    age: 27,
    province: 'Leyte',
    city: 'Tacloban',
    barangay: 'Sagkahan',
    zipCode: '6500',
    contactNumber: '09173456789',
    username: 'walter.maturan',
    cardStatus: 'No Card',
    cardNumber: '',
  },
  {
    id: 4,
    department: 'IT',
    position: 'Intern',
    salary: 18000,
    firstName: 'Je-ann',
    middleName: '',
    lastName: 'Callo',
    suffix: '',
    gender: 'Female',
    birthdate: '2002-01-12',
    age: 24,
    province: 'Cebu',
    city: 'Mandaue',
    barangay: 'Banilad',
    zipCode: '6014',
    contactNumber: '09174567890',
    username: 'jeann.callo',
    cardStatus: 'Has Card',
    cardNumber: 'IDC-IT-1004',
  },
]

const employee = computed(() => {
  const foundEmployee = employeeDirectory.find(item => item.id === props.employeeId)
  return foundEmployee ?? employeeDirectory[0]
})

const showUpdateModal = ref(false)
const showUpdateConfirmModal = ref(false)
const showLoadingModal = ref(false)
const showSuccessAlert = ref(false)
const preserveUpdateSelection = ref(false)
const showValidationAlert = ref(false)
const selectedUpdateOption = ref('')
const selectedDepartmentUpdate = ref('')
const selectedDepartmentPositionUpdate = ref('')
const selectedPositionUpdate = ref('')
let validationAlertTimer: ReturnType<typeof setTimeout> | null = null
let loadingModalTimer: ReturnType<typeof setTimeout> | null = null
let successAlertTimer: ReturnType<typeof setTimeout> | null = null

watch(showUpdateModal, (isOpen) => {
  if (isOpen) {
    preserveUpdateSelection.value = false
    return
  }

  if (preserveUpdateSelection.value) {
    return
  }

  if (!isOpen) {
    selectedUpdateOption.value = ''
    selectedDepartmentUpdate.value = ''
    selectedDepartmentPositionUpdate.value = ''
    selectedPositionUpdate.value = ''
  }
})

watch(showLoadingModal, (isOpen) => {
  if (isOpen) {
    if (loadingModalTimer) {
      clearTimeout(loadingModalTimer)
    }
    loadingModalTimer = setTimeout(() => {
      showLoadingModal.value = false
      showSuccessAlert.value = true
      
      if (successAlertTimer) {
        clearTimeout(successAlertTimer)
      }
      successAlertTimer = setTimeout(() => {
        showSuccessAlert.value = false
        closeConfirmModal()
      }, 3000)
    }, 3000)
  }
})

const emit = defineEmits<{
    back: []
}>()

function goBack() {
    emit('back')
}

function handleUpdateEmployee() {
  showUpdateModal.value = true
}

function handleProceedUpdate() {
  if (
    selectedUpdateOption.value === 'Department' &&
    (!selectedDepartmentUpdate.value || !selectedDepartmentPositionUpdate.value)
  ) {
    showValidationAlert.value = true

    if (validationAlertTimer) {
      clearTimeout(validationAlertTimer)
    }

    validationAlertTimer = setTimeout(() => {
      showValidationAlert.value = false
    }, 3000)

    return
  }

  preserveUpdateSelection.value = true
  showUpdateModal.value = false
  showUpdateConfirmModal.value = true
}

function getSelectedNewDepartment() {
  if (selectedUpdateOption.value === 'Department') {
    return selectedDepartmentUpdate.value
  }

  return employee.value.department
}

function getSelectedNewPosition() {
  if (selectedUpdateOption.value === 'Department') {
    return selectedDepartmentPositionUpdate.value
  }

  if (selectedUpdateOption.value === 'Position') {
    return selectedPositionUpdate.value
  }

  return employee.value.position
}

function closeConfirmModal() {
  showUpdateConfirmModal.value = false
  selectedUpdateOption.value = ''
  selectedDepartmentUpdate.value = ''
  selectedDepartmentPositionUpdate.value = ''
  selectedPositionUpdate.value = ''
}

function goBackFromConfirmModal() {
  preserveUpdateSelection.value = true
  showUpdateConfirmModal.value = false
  showUpdateModal.value = true
}

function confirmUpdateSelection() {
  console.log('Confirm update option:', selectedUpdateOption.value)
  console.log('Old department:', employee.value.department)
  console.log('Old position:', employee.value.position)
  console.log('New department:', getSelectedNewDepartment())
  console.log('New position:', getSelectedNewPosition())
  
  // Update the employee data
  const foundEmployee = employeeDirectory.find(item => item.id === props.employeeId)
  if (foundEmployee) {
    if (selectedUpdateOption.value === 'Department') {
      foundEmployee.department = selectedDepartmentUpdate.value
      foundEmployee.position = selectedDepartmentPositionUpdate.value
    } else if (selectedUpdateOption.value === 'Position') {
      foundEmployee.position = selectedPositionUpdate.value
    }
  }
  
  showUpdateConfirmModal.value = false
  showLoadingModal.value = true
}

onUnmounted(() => {
  if (validationAlertTimer) {
    clearTimeout(validationAlertTimer)
  }
  if (loadingModalTimer) {
    clearTimeout(loadingModalTimer)
  }
  if (successAlertTimer) {
    clearTimeout(successAlertTimer)
  }
})
</script>

<template>
  <div class="employee-info-page">
    <div v-if="showValidationAlert" class="validation-alert-wrap">
      <Alert
        v-model:visible="showValidationAlert"
        title="Validation"
        message="Please select new department and new position"
        variant="error"
        :dismissible="false"
      />
    </div>

    <div class="employee-info-header">
      <button
        type="button"
        class="back-button"
        aria-label="Back"
        @click="goBack"
      >
        <ArrowLeftIcon class="back-icon" />
      </button>

      <div class="header-content">
        <h1 class="title">Employee Information</h1>
      </div>
    </div>

    <div class="form-card">
      <div class="form-section">
        <div class="section-heading-row">
            <h2 class="section-title">Job Information</h2>
            <button
              type="button"
              class="update-button"
              @click="handleUpdateEmployee"
            >
            <PencilSquareIcon class="update-icon" />
            <span>Update</span>
          </button>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Department</span>
            <span class="value">{{ employee.department }}</span>
          </div>
          <div class="info-item">
            <span class="label">Position</span>
            <span class="value">{{ employee.position }}</span>
          </div>
          <div class="info-item">
            <span class="label">Salary</span>
            <span class="value">₱{{ employee.salary.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <div class="form-section">
        <h2 class="section-title">Personal Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Last Name</span>
            <span class="value">{{ employee.lastName || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">First Name</span>
            <span class="value">{{ employee.firstName || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Middle Name</span>
            <span class="value">{{ employee.middleName || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Suffix</span>
            <span class="value">{{ employee.suffix || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Gender</span>
            <span class="value">{{ employee.gender }}</span>
          </div>
          <div class="info-item">
            <span class="label">Birthdate</span>
            <span class="value">{{ employee.birthdate }}</span>
          </div>
          <div class="info-item">
            <span class="label">Age</span>
            <span class="value">{{ employee.age }}</span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <div class="form-section">
        <h2 class="section-title">Address Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Province</span>
            <span class="value">{{ employee.province || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">City</span>
            <span class="value">{{ employee.city || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Barangay</span>
            <span class="value">{{ employee.barangay || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Zip Code</span>
            <span class="value">{{ employee.zipCode || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <div class="form-section">
        <h2 class="section-title">Contact Details</h2>
        <div class="info-grid info-grid--one">
          <div class="info-item">
            <span class="label">Contact Number</span>
            <span class="value">{{ employee.contactNumber }}</span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <div class="form-section">
        <h2 class="section-title">Account Information</h2>
        <div class="info-grid info-grid--one">
          <div class="info-item">
            <span class="label">Username</span>
            <span class="value">{{ employee.username }}</span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <div class="form-section">
        <h2 class="section-title">ID Card Information</h2>
        <div class="info-grid info-grid--two">
          <div class="info-item">
            <span class="label">Card Status</span>
            <span class="value" :class="employee.cardStatus === 'Has Card' ? 'value--success' : 'value--danger'">
              {{ employee.cardStatus }}
            </span>
          </div>
          <div class="info-item" v-if="employee.cardStatus === 'Has Card'">
            <span class="label">Card Number</span>
            <span class="value">{{ employee.cardNumber }}</span>
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-model:open="showUpdateModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
    >
      <div class="update-modal-content">
        <button
          type="button"
          class="update-modal-close-button"
          aria-label="Close update options"
          @click="showUpdateModal = false"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>

        <h3 class="update-modal-title">Select Update Option</h3>

        <div class="update-option-select-wrap">
          <select v-model="selectedUpdateOption" class="update-option-select" aria-label="Select update option">
            <option value="" disabled>Select Update Option</option>
            <option value="Department">Department</option>
            <option value="Password">Password</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div v-if="selectedUpdateOption === 'Department'" class="department-update-panel">
          <label class="department-update-label" for="newDepartmentSelect">Select department</label>

          <select id="newDepartmentSelect" v-model="selectedDepartmentUpdate" class="department-update-select" aria-label="New Department">
            <option value="" disabled>Select new department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <label class="department-update-label" for="newDepartmentPositionSelect">Select position</label>

          <select id="newDepartmentPositionSelect" v-model="selectedDepartmentPositionUpdate" class="department-update-select" aria-label="New Department Position">
            <option value="" disabled>Select new position</option>
            <option value="Manager">Manager</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div v-if="selectedUpdateOption === 'Position'" class="department-update-panel">
          <label class="department-update-label" for="newPositionSelect">Select position</label>

          <select id="newPositionSelect" v-model="selectedPositionUpdate" class="department-update-select" aria-label="New Position">
            <option value="" disabled>Select new position</option>
            <option value="Manager">Manager</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div v-if="selectedUpdateOption" class="update-proceed-wrap">
          <button
            type="button"
            class="update-proceed-button"
            @click="handleProceedUpdate"
          >
            Proceed
          </button>
        </div>
      </div>
    </Modal>

    <Modal
      v-model:open="showUpdateConfirmModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
    >
      <div class="confirm-modal-content">
        <button
          type="button"
          class="update-modal-back-button"
          aria-label="Back to update options"
          @click="goBackFromConfirmModal"
        >
          <ArrowLeftIcon class="update-modal-back-icon" />
        </button>

        <h3 class="update-modal-title">Confirm Update</h3>

        <div class="confirm-grid">
          <div class="confirm-card">
            <h4 class="confirm-card-title">Old Department and Position</h4>
            <p><strong>Department:</strong> {{ employee.department }}</p>
            <p><strong>Position:</strong> {{ employee.position }}</p>
          </div>

          <div class="confirm-card">
            <h4 class="confirm-card-title">New Department and Position</h4>
            <p><strong>Department:</strong> {{ getSelectedNewDepartment() || 'N/A' }}</p>
            <p><strong>Position:</strong> {{ getSelectedNewPosition() || 'N/A' }}</p>
          </div>
        </div>

        <div class="update-proceed-wrap">
          <button
            type="button"
            class="update-proceed-button"
            @click="confirmUpdateSelection"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>

    <Modal
      v-model:open="showLoadingModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
      :dismissible="false"
    >
      <div class="loading-modal-content">
        <div class="spinner"></div>
        <p class="loading-text">Updating Please wait</p>
      </div>
    </Modal>

    <div class="success-alert-wrap">
      <Alert
        v-model:visible="showSuccessAlert"
        title="Success"
        message="Employee new department and position has been updated"
        variant="success"
        :dismissible="false"
      />
    </div>
  </div>
</template>

<style scoped>
.employee-info-page {
    width: 100%;
    display: grid;
    align-content: start;
    gap: 1.5rem;
    max-width: 1200px;
}

.validation-alert-wrap {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1100;
  width: min(100%, 420px);
}

.success-alert-wrap {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1100;
  width: min(100%, 420px);
}

.employee-info-header {
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
    color: #111827;
    cursor: pointer;
    transition: background-color 0.2s ease;
    background-color: #fff;
}

.back-button:hover {
    opacity: 0.85;
}

.back-icon {
    width: 14px;
    height: 14px;
}

.title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
}

.subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
}

.form-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
    display: grid;
    gap: 1rem;
}

.section-heading-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: 0.75rem;
}

.update-button {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid #86efac;
  border-radius: 8px;
  background: #ecfdf3;
  color: #166534;
  font-size: 0.8125rem;
  line-height: 1;
  padding: 0.48rem 0.72rem;
  cursor: pointer;
    margin-inline: 0;
    justify-self: end;
    align-self: center;
}

.update-button:hover {
  background: #dcfce7;
}

.update-icon {
    width: 14px;
    height: 14px;
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

.info-grid {
    display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.9rem;
}

.info-grid--two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.info-grid--one {
    grid-template-columns: 1fr;
}

.info-item {
    display: grid;
    gap: 0.3rem;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

.label {
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 500;
}

.value {
    font-size: 0.9rem;
    color: #0f172a;
    font-weight: 600;
    word-break: break-word;
}

.value--success {
    color: #15803d;
}

.value--danger {
    color: #b91c1c;
}

.update-modal-content {
  width: 100%;
  position: relative;
  display: grid;
  justify-items: start;
  gap: 1rem;
  padding: 0.25rem 0;
  text-align: left;
}

.update-modal-close-button {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
}

.update-modal-back-button {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
}

.update-modal-back-button:hover {
  background: #f9fafb;
}

.update-modal-back-icon {
  width: 14px;
  height: 14px;
}

.update-modal-close-button:hover {
  background: #f9fafb;
}

.update-modal-close-icon {
  width: 14px;
  height: 14px;
}

.update-modal-title {
  margin: 0;
  font-size: 0.8rem;
  color: #1f2937;
  font-weight: 300;
  text-align: center;
}

.update-option-select-wrap {
  position: relative;
  width: 100%;
}

.update-option-select-wrap::after {
  display: none;
}

.update-option-select {
  width: 100%;
  min-height: 40px;
  padding: 0.55rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background-color: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  appearance: none;
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5l3.5 3 3.5-3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

.department-update-panel {
  width: 100%;
  display: grid;
  gap: 0.45rem;
}

.department-update-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.department-update-select {
  width: 100%;
  min-height: 40px;
  padding: 0.55rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background-color: #f8fafc;
  color: #111827;
  font-size: 0.875rem;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5l3.5 3 3.5-3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

.update-proceed-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.update-proceed-button {
  margin-top: 0.25rem;
  padding: 0.55rem 1rem;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  background: #f0f9ff;
  color: #1e40af;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.update-proceed-button:hover {
  background: #e0f2fe;
}

.confirm-modal-content {
  width: 100%;
  position: relative;
  display: grid;
  gap: 1rem;
  padding: 0.25rem 0;
  text-align: left;
}

.confirm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.confirm-card {
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}

.confirm-card-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.confirm-card p {
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
}

@media (max-width: 640px) {
  .confirm-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
    .info-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .form-card {
        padding: 1rem;
    }

    .info-grid,
    .info-grid--two {
        grid-template-columns: 1fr;
    }
}

.loading-modal-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
  text-align: center;
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
  color: #4b5563;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>