<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowLeftIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Alert from '~/components/Alert.vue'
import Modal from '~/components/Modal.vue'
import Input from '~/components/Input.vue'

const props = defineProps<{
    employeeId: number | null
  employees?: EmployeeInfoRecord[]
}>()

type EmployeeInfoRecord = {
  id: number
  department: string
  position: string
  salary: number
  morningShiftStart?: string
  morningShiftEnd?: string
  afternoonShiftStart?: string
  afternoonShiftEnd?: string
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

type PositionUpdateOption = {
  position_id: number
  position_name: string
  department_id: number
  department_name?: string
}

type DepartmentUpdateOption = {
  department_id: number
  department_name: string
  positions?: PositionUpdateOption[]
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

const sharedEmployeeRows = useState<EmployeeTableRow[]>('employees-table-rows', () => [])
const userCookie = useCookie<string | null>('ems_user')

const loadedEmployee = ref<EmployeeInfoRecord | null>(null)
const departments = ref<DepartmentUpdateOption[]>([])
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

const availableDepartmentPositions = computed(() => {
  const selectedDepartmentId = Number(selectedDepartmentUpdate.value)

  if (!selectedDepartmentId) {
    return []
  }

  return departments.value.find(department => department.department_id === selectedDepartmentId)?.positions ?? []
})

const availablePositions = computed(() => {
  return departments.value.flatMap(department => {
    return (department.positions ?? []).map(position => ({
      ...position,
      department_name: department.department_name,
    }))
  })
})

const mapBackendEmployee = (raw: any): EmployeeInfoRecord => {
  const info = raw.user_informations ?? {}
  const position = raw.positions ?? {}
  const department = position.departments ?? {}
  const salary = position.salaries ?? {}
  const card = raw.cards ?? null
  const morningWorkHour = raw.morning_work_hour ?? {}
  const afternoonWorkHour = raw.afternoon_work_hour ?? {}
  
  const birthdate = info.birthdate ? new Date(info.birthdate) : null
  const age = birthdate ? Math.floor((new Date().getTime() - birthdate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0
  
  // Convert time to 12-hour format with AM/PM
  const formatTime12hr = (timeStr: string | undefined): string => {
    if (!timeStr || typeof timeStr !== 'string' || timeStr.trim() === '') return ''
    const parts = timeStr.split(':')
    const hoursStr = parts[0] || ''
    const minutesStr = parts[1] || '00'
    const hour = parseInt(hoursStr, 10)
    if (isNaN(hour)) return ''
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutesStr} ${period}`
  }
  
  // Format date to show only date (YYYY-MM-DD)
  const formatDateOnly = (dateStr: string | undefined): string => {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') return ''
    const datePart = dateStr.split('T')[0] || ''
    return datePart
  }
  
  return {
    id: raw.employee_id,
    department: department.department_name ?? '',
    position: position.position_name ?? '',
    salary: salary.amount ? Number(salary.amount) : 0,
    morningShiftStart: formatTime12hr(morningWorkHour.time_in ?? ''),
    morningShiftEnd: formatTime12hr(morningWorkHour.time_out ?? ''),
    afternoonShiftStart: formatTime12hr(afternoonWorkHour.time_in ?? ''),
    afternoonShiftEnd: formatTime12hr(afternoonWorkHour.time_out ?? ''),
    shiftStart: formatTime12hr(morningWorkHour.time_in ?? ''),
    shiftEnd: formatTime12hr(morningWorkHour.time_out ?? ''),
    firstName: info.first_name ?? '',
    middleName: info.middle_name ?? '',
    lastName: info.last_name ?? '',
    suffix: info.suffix ?? '',
    gender: info.gender ?? '',
    birthdate: formatDateOnly(info.birthdate ?? ''),
    age,
    province: info.province ?? '',
    city: info.city ?? '',
    barangay: info.barangay ?? '',
    zipCode: info.zip_code ?? '',
    contactNumber: info.contact_number ?? '',
    username: raw.user_accounts?.username ?? '',
    cardStatus: card?.card_number ? 'Has Card' : 'No Card',
    cardNumber: card?.card_number ?? '',
  }
}

const employee = computed(() => {
  if (loadedEmployee.value) {
    return loadedEmployee.value
  }
  
  if (props.employees && props.employees.length > 0 && props.employeeId) {
    const found = props.employees.find(item => item.id === props.employeeId)
    if (found) return found
  }
  
  // Return empty/default employee if not found
  return {
    id: 0,
    department: '',
    position: '',
    salary: 0,
    morningShiftStart: '',
    morningShiftEnd: '',
    afternoonShiftStart: '',
    afternoonShiftEnd: '',
    shiftStart: '',
    shiftEnd: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    gender: '',
    birthdate: '',
    age: 0,
    province: '',
    city: '',
    barangay: '',
    zipCode: '',
    contactNumber: '',
    username: '',
    cardStatus: 'No Card',
    cardNumber: '',
  } as EmployeeInfoRecord
})

const workHours = ref<WorkHourOption[]>([])

type WorkHourOption = {
    work_hour_id: number
    time_in: string
    time_out: string
    lunch_break_minutes?: number
}

const availableShiftTimes = computed(() => {
    return Array.from(new Set(workHours.value.map(workHour => formatTwentyFourHourToMeridiem(workHour.time_in))))
})

const availableMorningShiftTimes = computed(() => {
    return availableShiftTimes.value.filter(time => {
        return time.trim().toUpperCase().endsWith('AM')
    })
})

const availableAfternoonShiftTimes = computed(() => {
    return availableShiftTimes.value.filter(time => {
        return time.trim().toUpperCase().endsWith('PM')
    })
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
const selectedMorningTimeInUpdate = ref('')
const selectedMorningTimeOutUpdate = ref('')
const selectedAfternoonTimeInUpdate = ref('')
const selectedAfternoonTimeOutUpdate = ref('')
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
    selectedMorningTimeInUpdate.value = ''
    selectedMorningTimeOutUpdate.value = ''
    selectedAfternoonTimeInUpdate.value = ''
    selectedAfternoonTimeOutUpdate.value = ''
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

watch(selectedDepartmentUpdate, () => {
  selectedDepartmentPositionUpdate.value = ''
})

watch(() => selectedMorningTimeInUpdate.value, () => {
  selectedMorningTimeOutUpdate.value = getTimeOutForTimeIn(selectedMorningTimeInUpdate.value)
})

watch(() => selectedAfternoonTimeInUpdate.value, () => {
  selectedAfternoonTimeOutUpdate.value = getTimeOutForTimeIn(selectedAfternoonTimeInUpdate.value)
})

const emit = defineEmits<{
    back: []
  updateCardStatus: [payload: { employeeId: number; cardStatus: 'Has Card' | 'No Card'; cardNumber: string }]
}>()

function goBack() {
    emit('back')
}

async function loadDepartments() {
  try {
    const resp: any = await $fetch('/api/departments')
    const payload = resp?.data ?? resp

    if (Array.isArray(payload)) {
      departments.value = payload
    }
  } catch (err) {
    console.error('Failed to load departments for update modal:', err)
  }
}

onMounted(async () => {
  await loadDepartments()
})

watch(() => props.employeeId, async (id) => {
  if (!id) {
    loadedEmployee.value = null
    return
  }
  
  try {
    const resp: any = await $fetch(`/api/employees/${id}`)
    const payload = resp?.data ?? resp
    if (payload) {
      // Use payload.raw which contains the full nested backend structure
      const rawEmployee = payload.raw ?? payload
      loadedEmployee.value = mapBackendEmployee(rawEmployee)
    }
  } catch (err) {
    // ignore and use props fallback
  }
}, { immediate: true })

function isAdminUser() {
  return currentUser.value?.role?.trim().toLowerCase() === 'admin'
}

function ensureAdminPermission() {
  if (!isAdminUser()) {
    showErrorAlert('You dont have a permission to update')
    return false
  }

  return true
}

function formatTwentyFourHourToMeridiem(value: string) {
    const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/)

    if (!match) {
        return value
    }

    const hours = Number.parseInt(match[1] ?? '0', 10)
    const minutes = match[2] ?? '00'
    const meridiem = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12

    return `${String(displayHours).padStart(2, '0')}:${minutes} ${meridiem}`
}

function getTimeOutForTimeIn(timeIn: string) {
    if (!timeIn) {
        return ''
    }

    const workHour = workHours.value.find(wh => {
        const whTimeIn = formatTwentyFourHourToMeridiem(wh.time_in)
        return whTimeIn === timeIn
    })

    if (!workHour) {
        return ''
    }

    return formatTwentyFourHourToMeridiem(workHour.time_out)
}

function normalizeShiftTimeToTwentyFourHour(value: string) {
    const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)

    if (!match) {
        return ''
    }

    let hours = Number.parseInt(match[1] ?? '0', 10)
    const minutes = match[2] ?? '00'
    const meridiem = (match[3] ?? 'AM').toUpperCase()

    if (hours === 12) {
        hours = 0
    }

    if (meridiem === 'PM') {
        hours += 12
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`
}

function getWorkHourForShift(timeIn: string, timeOut: string) {
    const normalizedTimeIn = normalizeShiftTimeToTwentyFourHour(timeIn)
    const normalizedTimeOut = normalizeShiftTimeToTwentyFourHour(timeOut)

    if (!normalizedTimeIn || !normalizedTimeOut) {
        return null
    }

    return workHours.value.find(workHour => {
        const existingTimeIn = normalizeShiftTimeToTwentyFourHour(formatTwentyFourHourToMeridiem(workHour.time_in))
        const existingTimeOut = normalizeShiftTimeToTwentyFourHour(formatTwentyFourHourToMeridiem(workHour.time_out))

        return existingTimeIn === normalizedTimeIn && existingTimeOut === normalizedTimeOut
    })
}

function handleUpdateEmployee() {
  if (!ensureAdminPermission()) {
    return
  }

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

function getSelectedDepartmentOption() {
  const selectedDepartmentId = Number(selectedDepartmentUpdate.value)

  if (!selectedDepartmentId) {
    return null
  }

  return departments.value.find(department => department.department_id === selectedDepartmentId) ?? null
}

function getSelectedDepartmentPositionOption() {
  const selectedPositionId = Number(selectedDepartmentPositionUpdate.value)

  if (!selectedPositionId) {
    return null
  }

  return availableDepartmentPositions.value.find(position => position.position_id === selectedPositionId) ?? null
}

function getSelectedPositionOption() {
  const selectedPositionId = Number(selectedPositionUpdate.value)

  if (!selectedPositionId) {
    return null
  }

  return availablePositions.value.find(position => position.position_id === selectedPositionId) ?? null
}

function getDepartmentNameById(departmentId: number | string | null | undefined) {
  const normalizedDepartmentId = Number(departmentId)

  if (!normalizedDepartmentId) {
    return ''
  }

  return departments.value.find(department => department.department_id === normalizedDepartmentId)?.department_name ?? ''
}

function getPositionNameById(positionId: number | string | null | undefined) {
  const normalizedPositionId = Number(positionId)

  if (!normalizedPositionId) {
    return ''
  }

  return availablePositions.value.find(position => position.position_id === normalizedPositionId)?.position_name ?? ''
}

function getBackendErrorMessage(err: any, fallback: string) {
  return err?.data?.message || err?.response?._data?.message || err?.message || fallback
}

function applyPendingCardUpdateIfNeeded() {
  if (!pendingCardUpdate.value) {
    return
  }

  // Update loadedEmployee if it matches the pending update
  if (loadedEmployee.value && loadedEmployee.value.id === pendingCardUpdate.value.employeeId) {
    loadedEmployee.value.cardStatus = pendingCardUpdate.value.cardStatus
    loadedEmployee.value.cardNumber = pendingCardUpdate.value.cardNumber
  }

  // Update props.employees if provided
  const foundEmployee = props.employees?.find(item => item.id === pendingCardUpdate.value!.employeeId)
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

  if (selectedUpdateOption.value === 'Department') {
    showErrorAlert('You cannot update your department')
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
    getSelectedDepartmentOption()?.department_name === employee.value.department &&
    getSelectedDepartmentPositionOption()?.position_name === employee.value.position
  ) {
    showErrorAlert('New department and role cannot be the same as current department and role')

    return
  }

  if (selectedUpdateOption.value === 'Position' && !selectedPositionUpdate.value) {
    showErrorAlert('Please select a new position')
    return
  }

  if (
    selectedUpdateOption.value === 'Position' &&
    getSelectedPositionOption()?.position_name === employee.value.position
  ) {
    showErrorAlert('New position cannot be the same as current position')
    return
  }

  if (
    selectedUpdateOption.value === 'Shift' &&
    (!selectedShiftStartUpdate.value || !selectedShiftEndUpdate.value)
  ) {
    showErrorAlert('Please select morning and afternoon shift time in and out')
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

  if (
    selectedUpdateOption.value === 'Shift-Time' &&
    (!selectedMorningTimeInUpdate.value || !selectedMorningTimeOutUpdate.value ||
     !selectedAfternoonTimeInUpdate.value || !selectedAfternoonTimeOutUpdate.value)
  ) {
    showErrorAlert('Please select morning and afternoon shift time in and out')
    return
  }

  if (
    selectedUpdateOption.value === 'Shift-Time' &&
    selectedMorningTimeInUpdate.value === (employee.value.morningShiftStart ?? '') &&
    selectedMorningTimeOutUpdate.value === (employee.value.morningShiftEnd ?? '') &&
    selectedAfternoonTimeInUpdate.value === (employee.value.afternoonShiftStart ?? '') &&
    selectedAfternoonTimeOutUpdate.value === (employee.value.afternoonShiftEnd ?? '')
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
    return getSelectedDepartmentOption()?.department_name ?? ''
  }

  if (selectedUpdateOption.value === 'Position') {
    return getSelectedPositionOption()?.department_name ?? employee.value.department
  }

  return employee.value.department
}

function getSelectedNewPosition() {
  if (selectedUpdateOption.value === 'Department') {
    return getSelectedDepartmentPositionOption()?.position_name ?? ''
  }

  if (selectedUpdateOption.value === 'Position') {
    return getSelectedPositionOption()?.position_name ?? ''
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

async function confirmUpdateSelection() {
  if (!ensureAdminPermission()) {
    return
  }

  console.log('Confirm update option:', selectedUpdateOption.value)
  
  const foundEmployee = props.employees?.find(item => item.id === props.employeeId) || loadedEmployee.value
  if (props.employeeId && (selectedUpdateOption.value === 'Department' || selectedUpdateOption.value === 'Position')) {
    if (!transactedById.value) {
      showErrorAlert('You must be signed in to update employee information')
      return
    }

    if (departments.value.length === 0) {
      await loadDepartments()
    }

    const selectedPositionOption = selectedUpdateOption.value === 'Department'
      ? getSelectedDepartmentPositionOption()
      : getSelectedPositionOption()
    const selectedDepartmentOption = selectedUpdateOption.value === 'Department'
      ? getSelectedDepartmentOption()
      : departments.value.find(department => department.department_id === selectedPositionOption?.department_id) ?? null

    if (!selectedDepartmentOption || !selectedPositionOption) {
      showErrorAlert('Please select a valid department and position')
      return
    }

    try {
      await $fetch(`/api/employees/${props.employeeId}`, {
        method: 'PUT',
        body: {
          update_type: 'Position',
          transacted_by: transactedById.value,
          department_id: Number(selectedDepartmentOption.department_id),
          position_id: Number(selectedPositionOption.position_id),
        },
      })
    } catch (err) {
      console.error('Update failed:', err)
      showErrorAlert(getBackendErrorMessage(err, 'Failed to update employee department and position'))
      return
    }

    if (foundEmployee) {
      foundEmployee.department = selectedDepartmentOption.department_name
      foundEmployee.position = selectedPositionOption.position_name
    }
  }

  if (props.employeeId && selectedUpdateOption.value === 'Shift-Time') {
    if (!transactedById.value) {
      showErrorAlert('You must be signed in to update employee information')
      return
    }

    try {
      // Get work hour IDs for the selected times
      const morningWorkHour = getWorkHourForShift(selectedMorningTimeInUpdate.value, selectedMorningTimeOutUpdate.value)
      const afternoonWorkHour = getWorkHourForShift(selectedAfternoonTimeInUpdate.value, selectedAfternoonTimeOutUpdate.value)

      if (!morningWorkHour || !afternoonWorkHour) {
        showErrorAlert('Invalid shift time selection')
        return
      }

      await $fetch(`/api/employees/${props.employeeId}`, {
        method: 'PUT',
        body: {
          update_type: 'Shift',
          transacted_by: transactedById.value,
          morning_work_hour_id: morningWorkHour.work_hour_id,
          afternoon_work_hour_id: afternoonWorkHour.work_hour_id,
        },
      })

      if (foundEmployee) {
        foundEmployee.morningShiftStart = selectedMorningTimeInUpdate.value
        foundEmployee.morningShiftEnd = selectedMorningTimeOutUpdate.value
        foundEmployee.afternoonShiftStart = selectedAfternoonTimeInUpdate.value
        foundEmployee.afternoonShiftEnd = selectedAfternoonTimeOutUpdate.value
      }
    } catch (err) {
      console.error('Shift-Time update failed:', err)
      showErrorAlert(getBackendErrorMessage(err, 'Failed to update employee shift time'))
      return
    }
  }

  successAlertMessage.value = selectedUpdateOption.value === 'Shift'
    ? 'Employee shift schedule has been updated'
    : selectedUpdateOption.value === 'Shift-Time'
    ? 'Employee shift time has been updated'
    : 'Employee new department and position has been updated'
  
  showUpdateConfirmModal.value = false
  showLoadingModal.value = true
}

function confirmPasswordUpdate() {
  console.log('Confirm update option:', selectedUpdateOption.value)
  
  // Call backend API to update password
  if (props.employeeId && selectedPasswordUpdate.value && transactedById.value) {
    $fetch(`/api/employees/${props.employeeId}`, {
      method: 'PUT',
      body: {
        transacted_by: transactedById.value,
        update_type: 'Password',
        password: selectedPasswordUpdate.value,
      },
    }).catch(err => {
      console.error('Password update failed:', err)
    })
  }

  successAlertMessage.value = 'Password updated successfully'

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

  if (props.employeeId !== null && transactedById.value) {
    // Call backend API to update card
    $fetch(`/api/employees/${props.employeeId}`, {
      method: 'PUT',
      body: {
        transacted_by: transactedById.value,
        update_type: 'Card',
        card_number: scannedRfidNumber.value || 'RFID-000000',
      },
    }).catch(err => {
      console.error('Card update failed:', err)
    })
    
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



async function loadWorkHours() {
    try {
        const resp: any = await $fetch('/api/work-hours')
        const payload = resp?.data ?? resp

        if (Array.isArray(payload)) {
            workHours.value = payload
        }
    } catch (err) {
        console.error('Failed to load work hours:', err)
    }
}

onMounted(async () => {
    await Promise.all([
        loadWorkHours(),
    ])
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
        </div>
        <h3 class="subsection-title">Shift Time</h3>
        <div class="shift-container">
            <div class="shift-section">
              <h4 class="shift-title">Morning Shift</h4>
              <div class="shift-grid">
                <div class="select-field-wrap">
                  <label class="select-field-label">Time In</label>
                  <Input :modelValue="employee.morningShiftStart || 'N/A'" readonly />
                </div>
                <div class="select-field-wrap">
                  <label class="select-field-label">Time Out</label>
                  <Input :modelValue="employee.morningShiftEnd || 'N/A'" readonly />
                </div>
              </div>
            </div>

            <div class="shift-section">
              <h4 class="shift-title">Afternoon Shift</h4>
              <div class="shift-grid">
                <div class="select-field-wrap">
                  <label class="select-field-label">Time In</label>
                  <Input :modelValue="employee.afternoonShiftStart || 'N/A'" readonly />
                </div>
                <div class="select-field-wrap">
                  <label class="select-field-label">Time Out</label>
                  <Input :modelValue="employee.afternoonShiftEnd || 'N/A'" readonly />
                </div>
              </div>
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
            <option
              v-for="department in departments"
              :key="department.department_id"
              :value="String(department.department_id)"
            >
              {{ department.department_name }}
            </option>
          </select>

          <label class="department-update-label" for="newDepartmentPositionSelect">Select position</label>

          <select id="newDepartmentPositionSelect" v-model="selectedDepartmentPositionUpdate" class="department-update-select" aria-label="New Department Position">
            <option value="" disabled>Select new position</option>
            <option
              v-for="position in availableDepartmentPositions"
              :key="position.position_id"
              :value="String(position.position_id)"
            >
              {{ position.position_name }}
            </option>
          </select>
        </div>

        <div v-if="selectedUpdateOption === 'Shift-Time'" class="department-update-panel">
          <h4 class="shift-title">Morning Shift</h4>
          <div class="shift-grid">
            <div class="select-field-wrap">
              <label class="department-update-label" for="morningTimeInUpdate">Time In</label>
              <select id="morningTimeInUpdate" v-model="selectedMorningTimeInUpdate" class="department-update-select" aria-label="Morning Time In">
                <option value="">Select time in</option>
                <option v-for="time in availableMorningShiftTimes" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
            <div class="select-field-wrap">
              <label class="department-update-label" for="morningTimeOutUpdate">Time Out</label>
              <input id="morningTimeOutUpdate" v-model="selectedMorningTimeOutUpdate" type="text" class="department-update-select" aria-label="Morning Time Out" readonly />
            </div>
          </div>

          <h4 class="shift-title">Afternoon Shift</h4>
          <div class="shift-grid">
            <div class="select-field-wrap">
              <label class="department-update-label" for="afternoonTimeInUpdate">Time In</label>
              <select id="afternoonTimeInUpdate" v-model="selectedAfternoonTimeInUpdate" class="department-update-select" aria-label="Afternoon Time In">
                <option value="">Select time in</option>
                <option v-for="time in availableAfternoonShiftTimes" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
            <div class="select-field-wrap">
              <label class="department-update-label" for="afternoonTimeOutUpdate">Time Out</label>
              <input id="afternoonTimeOutUpdate" v-model="selectedAfternoonTimeOutUpdate" type="text" class="department-update-select" aria-label="Afternoon Time Out" readonly />
            </div>
          </div>
        </div>

        <div v-if="selectedUpdateOption === 'Position'" class="department-update-panel">
          <label class="department-update-label" for="newPositionSelect">Select position</label>

          <select id="newPositionSelect" v-model="selectedPositionUpdate" class="department-update-select" aria-label="New Position">
            <option value="" disabled>Select new position</option>
            <option
              v-for="position in availablePositions"
              :key="position.position_id"
              :value="String(position.position_id)"
            >
              {{ position.position_name }} - {{ position.department_name }}
            </option>
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
          <div v-if="selectedUpdateOption === 'Shift-Time'" class="confirm-card">
            <h4 class="confirm-card-title">Current Shift Time</h4>
            <p><strong>Morning Time In:</strong> {{ employee.morningShiftStart || 'N/A' }}</p>
            <p><strong>Morning Time Out:</strong> {{ employee.morningShiftEnd || 'N/A' }}</p>
            <p><strong>Afternoon Time In:</strong> {{ employee.afternoonShiftStart || 'N/A' }}</p>
            <p><strong>Afternoon Time Out:</strong> {{ employee.afternoonShiftEnd || 'N/A' }}</p>
          </div>

          <div v-if="selectedUpdateOption === 'Shift-Time'" class="confirm-card">
            <h4 class="confirm-card-title">New Shift Time</h4>
            <p><strong>Morning Time In:</strong> {{ selectedMorningTimeInUpdate || 'N/A' }}</p>
            <p><strong>Morning Time Out:</strong> {{ selectedMorningTimeOutUpdate || 'N/A' }}</p>
            <p><strong>Afternoon Time In:</strong> {{ selectedAfternoonTimeInUpdate || 'N/A' }}</p>
            <p><strong>Afternoon Time Out:</strong> {{ selectedAfternoonTimeOutUpdate || 'N/A' }}</p>
          </div>

          <div v-if="selectedUpdateOption !== 'Shift-Time'" class="confirm-card">
            <h4 class="confirm-card-title">Old Department and Position</h4>
            <p><strong>Department:</strong> {{ employee.department }}</p>
            <p><strong>Position:</strong> {{ employee.position }}</p>
          </div>

          <div v-if="selectedUpdateOption !== 'Shift-Time'" class="confirm-card">
            <h4 class="confirm-card-title">New Department and Position</h4>
            <p><strong>Department:</strong>
              {{ selectedUpdateOption === 'Department'
                ? getDepartmentNameById(selectedDepartmentUpdate) || 'N/A'
                : getSelectedNewDepartment() || 'N/A' }}
            </p>
            <p><strong>Position:</strong>
              {{ selectedUpdateOption === 'Department'
                ? getPositionNameById(selectedDepartmentPositionUpdate) || 'N/A'
                : getPositionNameById(selectedPositionUpdate) || getSelectedNewPosition() || 'N/A' }}
            </p>
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

.shift-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
}

.shift-section {
    display: grid;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.shift-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
}

.subsection-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
}

.shift-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
  background-color: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  outline: none;
  appearance: none;
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
  display: flex;
  flex-direction: column;
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