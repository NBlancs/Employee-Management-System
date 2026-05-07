<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { ArrowLeftIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Alert from '~/components/Alert.vue'
import Modal from '~/components/Modal.vue'

const props = defineProps<{
    employeeId: number | null
  employees?: EmployeeInfoRecord[]
}>()

type EmployeeInfoRecord = {
  id: number
  department: string
  position: string
  salary: number
  shiftStart?: string
  shiftEnd?: string
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

type EmployeeTableRow = {
  id: number
  name: string
  cardStatus: 'Has Card' | 'No Card'
  department: string
  cardNumber: string
}

const defaultEmployeeDirectory: [EmployeeInfoRecord, ...EmployeeInfoRecord[]] = [
  {
    id: 1,
    department: 'IT',
    position: 'Senior',
    salary: 48000,
    shiftStart: '08:00 AM',
    shiftEnd: '05:00 PM',
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
    shiftStart: '09:00 AM',
    shiftEnd: '06:00 PM',
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
    shiftStart: '08:30 AM',
    shiftEnd: '05:30 PM',
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
    shiftStart: '08:00 AM',
    shiftEnd: '05:00 PM',
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

const sharedEmployeeRows = useState<EmployeeTableRow[]>('employees-table-rows', () => {
  return defaultEmployeeDirectory.map(employee => ({
    id: employee.id,
    name: `${employee.lastName}, ${employee.firstName}`,
    cardStatus: employee.cardStatus,
    department: employee.department,
    cardNumber: employee.cardNumber,
  }))
})

const employee = computed(() => {
  const directory = (
    props.employees && props.employees.length > 0
      ? props.employees
      : defaultEmployeeDirectory
  ) as [EmployeeInfoRecord, ...EmployeeInfoRecord[]]
  const foundEmployee = directory.find(item => item.id === props.employeeId)
  return foundEmployee ?? directory[0]
})

const showUpdateModal = ref(false)
const showUpdateConfirmModal = ref(false)
const showPasswordConfirmModal = ref(false)
const showCardConfirmModal = ref(false)
const showScannerWaitingModal = ref(false)
const showScannerRegisterModal = ref(false)
const showScannedCardModal = ref(false)
const showLoadingModal = ref(false)
const showSuccessAlert = ref(false)
const successAlertMessage = ref('Employee new department and position has been updated')
const preserveUpdateSelection = ref(false)
const showValidationAlert = ref(false)
const validationAlertMessage = ref('Please select new department and new position')
const selectedUpdateOption = ref('')
const selectedDepartmentUpdate = ref('')
const selectedDepartmentPositionUpdate = ref('')
const selectedPositionUpdate = ref('')
const selectedShiftStartUpdate = ref('')
const selectedShiftEndUpdate = ref('')
const selectedPasswordUpdate = ref('')
const scannedRfidNumber = ref('')
const pendingCardUpdate = ref<{ employeeId: number; cardStatus: 'Has Card' | 'No Card'; cardNumber: string } | null>(null)
let validationAlertTimer: ReturnType<typeof setTimeout> | null = null
let loadingModalTimer: ReturnType<typeof setTimeout> | null = null
let successAlertTimer: ReturnType<typeof setTimeout> | null = null
let scannerRegisterModeTimer: ReturnType<typeof setTimeout> | null = null
let scannerCardScannedTimer: ReturnType<typeof setTimeout> | null = null

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
    selectedShiftStartUpdate.value = ''
    selectedShiftEndUpdate.value = ''
    selectedPasswordUpdate.value = ''
  }
})

watch(showLoadingModal, (isOpen) => {
  if (isOpen) {
    if (loadingModalTimer) {
      clearTimeout(loadingModalTimer)
    }
    loadingModalTimer = setTimeout(() => {
      applyPendingCardUpdateIfNeeded()

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

watch(showScannerWaitingModal, (isOpen) => {
  if (isOpen) {
    if (scannerRegisterModeTimer) {
      clearTimeout(scannerRegisterModeTimer)
    }

    scannerRegisterModeTimer = setTimeout(() => {
      showScannerWaitingModal.value = false
      showScannerRegisterModal.value = true
    }, 2500)
    return
  }

  if (scannerRegisterModeTimer) {
    clearTimeout(scannerRegisterModeTimer)
    scannerRegisterModeTimer = null
  }
})

watch(showScannerRegisterModal, (isOpen) => {
  if (isOpen) {
    if (scannerCardScannedTimer) {
      clearTimeout(scannerCardScannedTimer)
    }

    scannerCardScannedTimer = setTimeout(() => {
      scannedRfidNumber.value = `RFID-${Math.floor(100000 + Math.random() * 900000)}`
      showScannerRegisterModal.value = false
      showScannedCardModal.value = true
    }, 2500)
    return
  }

  if (scannerCardScannedTimer) {
    clearTimeout(scannerCardScannedTimer)
    scannerCardScannedTimer = null
  }
})

const emit = defineEmits<{
    back: []
  updateCardStatus: [payload: { employeeId: number; cardStatus: 'Has Card' | 'No Card'; cardNumber: string }]
}>()

function goBack() {
    emit('back')
}

function handleUpdateEmployee() {
  showUpdateModal.value = true
}

function showErrorAlert(message: string) {
  validationAlertMessage.value = message
  showValidationAlert.value = true

  if (validationAlertTimer) {
    clearTimeout(validationAlertTimer)
  }

  validationAlertTimer = setTimeout(() => {
    showValidationAlert.value = false
  }, 3000)
}

function applyPendingCardUpdateIfNeeded() {
  if (!pendingCardUpdate.value) {
    return
  }

  const directory = props.employees?.length ? props.employees : defaultEmployeeDirectory
  const foundEmployee = directory.find(item => item.id === pendingCardUpdate.value!.employeeId)
  if (foundEmployee) {
    foundEmployee.cardStatus = pendingCardUpdate.value.cardStatus
    foundEmployee.cardNumber = pendingCardUpdate.value.cardNumber
  }

  sharedEmployeeRows.value = sharedEmployeeRows.value.map(employee => {
    if (employee.id !== pendingCardUpdate.value!.employeeId) {
      return employee
    }

    return {
      ...employee,
      cardStatus: pendingCardUpdate.value!.cardStatus,
      cardNumber: pendingCardUpdate.value!.cardNumber,
    }
  })

  emit('updateCardStatus', pendingCardUpdate.value)
  pendingCardUpdate.value = null
}

function handleProceedUpdate() {
  if (selectedUpdateOption.value === 'Password' && !selectedPasswordUpdate.value.trim()) {
    showErrorAlert('Please enter a new password')
    return
  }

  if (
    selectedUpdateOption.value === 'Department' &&
    (!selectedDepartmentUpdate.value || !selectedDepartmentPositionUpdate.value)
  ) {
    showErrorAlert('Please select new department and new position')
    return
  }

  if (
    selectedUpdateOption.value === 'Department' &&
    selectedDepartmentUpdate.value === employee.value.department &&
    selectedDepartmentPositionUpdate.value === employee.value.position
  ) {
    showErrorAlert('New department and role cannot be the same as current department and role')

    return
  }

  if (
    selectedUpdateOption.value === 'Shift' &&
    (!selectedShiftStartUpdate.value || !selectedShiftEndUpdate.value)
  ) {
    showErrorAlert('Please select shift start and shift end')
    return
  }

  if (
    selectedUpdateOption.value === 'Shift' &&
    selectedShiftStartUpdate.value === (employee.value.shiftStart ?? '') &&
    selectedShiftEndUpdate.value === (employee.value.shiftEnd ?? '')
  ) {
    showErrorAlert('New shift schedule cannot be the same as current shift schedule')
    return
  }

  preserveUpdateSelection.value = true
  showUpdateModal.value = false

  if (selectedUpdateOption.value === 'Password') {
    showPasswordConfirmModal.value = true
    return
  }

  if (selectedUpdateOption.value === 'Card' && employee.value.cardStatus === 'Has Card') {
    showCardConfirmModal.value = true
    return
  }

  if (selectedUpdateOption.value === 'Card' && employee.value.cardStatus === 'No Card') {
    showScannerWaitingModal.value = true
    return
  }

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

function getSelectedNewShiftStart() {
  if (selectedUpdateOption.value === 'Shift') {
    return selectedShiftStartUpdate.value
  }

  return employee.value.shiftStart ?? ''
}

function getSelectedNewShiftEnd() {
  if (selectedUpdateOption.value === 'Shift') {
    return selectedShiftEndUpdate.value
  }

  return employee.value.shiftEnd ?? ''
}

function closeConfirmModal() {
  applyPendingCardUpdateIfNeeded()

  showUpdateConfirmModal.value = false
  showPasswordConfirmModal.value = false
  showCardConfirmModal.value = false
  showScannerWaitingModal.value = false
  showScannerRegisterModal.value = false
  showScannedCardModal.value = false
  showLoadingModal.value = false
  selectedUpdateOption.value = ''
  selectedDepartmentUpdate.value = ''
  selectedDepartmentPositionUpdate.value = ''
  selectedPositionUpdate.value = ''
  selectedShiftStartUpdate.value = ''
  selectedShiftEndUpdate.value = ''
  selectedPasswordUpdate.value = ''
  scannedRfidNumber.value = ''
}

function goBackFromConfirmModal() {
  preserveUpdateSelection.value = true
  showUpdateConfirmModal.value = false
  showUpdateModal.value = true
}

function goBackFromPasswordConfirmModal() {
  preserveUpdateSelection.value = true
  showPasswordConfirmModal.value = false
  showUpdateModal.value = true
}

function goBackFromCardConfirmModal() {
  preserveUpdateSelection.value = true
  showCardConfirmModal.value = false
  showUpdateModal.value = true
}

function confirmUpdateSelection() {
  console.log('Confirm update option:', selectedUpdateOption.value)
  console.log('Old department:', employee.value.department)
  console.log('Old position:', employee.value.position)
  console.log('New department:', getSelectedNewDepartment())
  console.log('New position:', getSelectedNewPosition())
  console.log('Old shift start:', employee.value.shiftStart)
  console.log('Old shift end:', employee.value.shiftEnd)
  console.log('New shift start:', getSelectedNewShiftStart())
  console.log('New shift end:', getSelectedNewShiftEnd())
  
  // Update the employee data
  const directory = props.employees?.length ? props.employees : defaultEmployeeDirectory
  const foundEmployee = directory.find(item => item.id === props.employeeId)
  if (foundEmployee) {
    if (selectedUpdateOption.value === 'Department') {
      foundEmployee.department = selectedDepartmentUpdate.value
      foundEmployee.position = selectedDepartmentPositionUpdate.value
    } else if (selectedUpdateOption.value === 'Position') {
      foundEmployee.position = selectedPositionUpdate.value
    } else if (selectedUpdateOption.value === 'Shift') {
      foundEmployee.shiftStart = selectedShiftStartUpdate.value
      foundEmployee.shiftEnd = selectedShiftEndUpdate.value
    }
  }

  successAlertMessage.value = selectedUpdateOption.value === 'Shift'
    ? 'Employee shift schedule has been updated'
    : 'Employee new department and position has been updated'
  
  showUpdateConfirmModal.value = false
  showLoadingModal.value = true
}

function confirmPasswordUpdate() {
  console.log('Confirm update option:', selectedUpdateOption.value)
  console.log('New password:', selectedPasswordUpdate.value)

  successAlertMessage.value = 'Password update successfully'

  showPasswordConfirmModal.value = false
  showLoadingModal.value = true
}

function proceedCardRegistrationFromConfirm() {
  showCardConfirmModal.value = false
  showScannerWaitingModal.value = true
}

function confirmCardUpdate() {
  console.log('Confirm update option:', selectedUpdateOption.value)
  console.log('Scanned RFID number:', scannedRfidNumber.value)

  if (props.employeeId !== null) {
    pendingCardUpdate.value = {
      employeeId: props.employeeId,
      cardStatus: 'Has Card',
      cardNumber: scannedRfidNumber.value || 'RFID-000000',
    }
  }

  successAlertMessage.value = 'New card registered successfully'

  showCardConfirmModal.value = false
  showScannedCardModal.value = false
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
  if (scannerRegisterModeTimer) {
    clearTimeout(scannerRegisterModeTimer)
  }
  if (scannerCardScannedTimer) {
    clearTimeout(scannerCardScannedTimer)
  }
})
</script>

<template>
  <div class="employee-info-page">
    <div v-if="showValidationAlert" class="validation-alert-wrap">
      <Alert
        v-model:visible="showValidationAlert"
        title="Validation"
        :message="validationAlertMessage"
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
          <div class="info-item">
            <span class="label">Shift Start</span>
            <span class="value">{{ employee.shiftStart || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Shift End</span>
            <span class="value">{{ employee.shiftEnd || 'N/A' }}</span>
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
            <option value="Shift-Time">Shift Time</option>
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

        <div v-if="selectedUpdateOption === 'Password'" class="department-update-panel">
          <label class="department-update-label" for="newPasswordInput">New password</label>
          <input
            id="newPasswordInput"
            v-model="selectedPasswordUpdate"
            class="department-update-select"
            type="password"
            aria-label="New Password"
            placeholder="Enter new password"
            autocomplete="new-password"
          />
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
          class="update-modal-close-button"
          aria-label="Close confirm update"
          @click="closeConfirmModal"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>

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
      v-model:open="showPasswordConfirmModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
    >
      <div class="confirm-modal-content">
        <button
          type="button"
          class="update-modal-close-button"
          aria-label="Close password confirmation"
          @click="closeConfirmModal"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>

        <button
          type="button"
          class="update-modal-back-button"
          aria-label="Back to update options"
          @click="goBackFromPasswordConfirmModal"
        >
          <ArrowLeftIcon class="update-modal-back-icon" />
        </button>

        <h3 class="update-modal-title">Confirm Password Update</h3>
        <p class="password-confirm-message">Are you sure you want to change the password?</p>

        <div class="password-confirm-actions">
          <button
            type="button"
            class="update-proceed-button update-proceed-button--secondary"
            @click="goBackFromPasswordConfirmModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="update-proceed-button"
            @click="confirmPasswordUpdate"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>

    <Modal
      v-model:open="showCardConfirmModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
    >
      <div class="confirm-modal-content">
        <button
          type="button"
          class="update-modal-close-button"
          aria-label="Close card confirmation"
          @click="closeConfirmModal"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>

        <button
          type="button"
          class="update-modal-back-button"
          aria-label="Back to update options"
          @click="goBackFromCardConfirmModal"
        >
          <ArrowLeftIcon class="update-modal-back-icon" />
        </button>

        <h3 class="update-modal-title">Confirm Card Registration</h3>
        <p class="password-confirm-message">This employee has a card already.</p>
        <p class="password-confirm-message">Current Card Number: {{ employee.cardNumber || 'N/A' }}</p>
        <p class="password-confirm-message">Are you sure you want to register new card?</p>

        <div class="password-confirm-actions">
          <button
            type="button"
            class="update-proceed-button update-proceed-button--secondary"
            @click="goBackFromCardConfirmModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="update-proceed-button"
            @click="proceedCardRegistrationFromConfirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>

    <Modal
      v-model:open="showScannerWaitingModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
      :dismissible="false"
    >
      <div class="loading-modal-content">
        <button
          type="button"
          class="update-modal-close-button"
          aria-label="Close scanner waiting"
          @click="closeConfirmModal"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>
        <div class="spinner"></div>
        <p class="loading-text">Please switch the scanner into register mode.</p>
      </div>
    </Modal>

    <Modal
      v-model:open="showScannerRegisterModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
      :dismissible="false"
    >
      <div class="scanner-register-content">
        <button
          type="button"
          class="update-modal-close-button"
          aria-label="Close scanner register mode"
          @click="closeConfirmModal"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>
        <div class="scanner-card-icon-wrap" aria-hidden="true">
          <div class="scanner-scan-line"></div>
          <svg class="scanner-card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.7" />
            <path d="M3 10.5H21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            <path d="M7.5 14.5H10.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
        </div>
        <p class="loading-text">Please scan your RFID card.</p>
      </div>
    </Modal>

    <Modal
      v-model:open="showScannedCardModal"
      :title="''"
      :description="''"
      :hide-trigger="true"
      :show-footer="false"
    >
      <div class="confirm-modal-content">
        <button
          type="button"
          class="update-modal-close-button"
          aria-label="Close scanned card modal"
          @click="closeConfirmModal"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>

        <h3 class="update-modal-title">Card Scanned</h3>
        <p class="password-confirm-message">RFID Number</p>
        <p class="rfid-code">{{ scannedRfidNumber || 'RFID-000000' }}</p>

        <div class="password-confirm-actions">
          <button
            type="button"
            class="update-proceed-button update-proceed-button--secondary"
            @click="closeConfirmModal"
          >
            Close
          </button>
          <button
            type="button"
            class="update-proceed-button"
            @click="confirmCardUpdate"
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
        <button
          type="button"
          class="update-modal-close-button"
          aria-label="Close loading"
          @click="closeConfirmModal"
        >
          <XMarkIcon class="update-modal-close-icon" />
        </button>
        <div class="spinner"></div>
        <p class="loading-text">Updating Please wait</p>
      </div>
    </Modal>

    <div class="success-alert-wrap">
      <Alert
        v-model:visible="showSuccessAlert"
        title="Success"
        :message="successAlertMessage"
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

.password-confirm-message {
  margin: 0;
  font-size: 0.9rem;
  color: #374151;
  text-align: center;
}

.rfid-code {
  margin: 0;
  padding: 0.55rem 0.75rem;
  border: 1px dashed #93c5fd;
  border-radius: 10px;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
}

.password-confirm-actions {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.update-proceed-button--secondary {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.update-proceed-button--secondary:hover {
  background: #fee2e2;
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
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.scanner-register-content {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
  text-align: center;
}

.scanner-card-icon-wrap {
  position: relative;
  width: 80px;
  height: 60px;
  display: grid;
  place-items: center;
  color: #1d4ed8;
  border-radius: 14px;
  background: #eff6ff;
  overflow: hidden;
}

.scanner-card-icon {
  width: 44px;
  height: 44px;
  animation: card-pulse 1.2s ease-in-out infinite;
}

.scanner-scan-line {
  position: absolute;
  left: 8px;
  right: 8px;
  height: 2px;
  background: rgba(29, 78, 216, 0.55);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
  animation: scan-line-move 1.8s linear infinite;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #635bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  margin: 0;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 200;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes card-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes scan-line-move {
  0% {
    top: 10px;
  }
  50% {
    top: 48px;
  }
  100% {
    top: 10px;
  }
}
</style>