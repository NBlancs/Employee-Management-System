<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Alert from '~/components/Alert.vue'
import IconInput from '~/components/IconInput.vue'
import Button from '~/components/Button.vue'
import Modal from '~/components/Modal.vue'

type CreatedEmployeePayload = {
    id: number
    name: string
    department: string
    cardStatus: 'Has Card' | 'No Card'
    cardNumber: string
}

type DepartmentOption = {
    department_id: number
    department_name: string
    department_head: number | null
    positions?: PositionOption[]
}

type PositionOption = {
    position_id: number
    department_id: number
    position_name: string
}

type WorkHourOption = {
    work_hour_id: number
    time_in: string
    time_out: string
    lunch_break_minutes?: number
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
    back: []
    employeeCreated: [employee: CreatedEmployeePayload]
}>()

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

const form = ref({
    department: '',
    position: '',
    morningTimeIn: '',
    morningTimeOut: '',
    afternoonTimeIn: '',
    afternoonTimeOut: '',
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
const departments = ref<DepartmentOption[]>([])
const workHours = ref<WorkHourOption[]>([])
const existingUsernames = ref<string[]>([])
const showValidationAlert = ref(false)
const validationAlertMessage = ref('')
let validationAlertTimer: ReturnType<typeof setTimeout> | null = null

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

const availablePositions = computed(() => {
    const selectedDepartmentId = Number(form.value.department)

    if (!selectedDepartmentId) {
        return []
    }

    return departments.value.find(department => department.department_id === selectedDepartmentId)?.positions ?? []
})

const selectedDepartmentOption = computed(() => {
    const selectedDepartmentId = Number(form.value.department)

    if (!selectedDepartmentId) {
        return null
    }

    return departments.value.find(department => department.department_id === selectedDepartmentId) ?? null
})

const selectedPositionOption = computed(() => {
    const selectedPositionId = Number(form.value.position)

    if (!selectedPositionId) {
        return null
    }

    return availablePositions.value.find(position => position.position_id === selectedPositionId) ?? null
})

function getBackendErrorMessage(err: any, fallback: string) {
    return err?.data?.message || err?.response?._data?.message || err?.message || fallback
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

function normalizeUsername(value: string) {
    return value.trim().toLowerCase()
}

function parseShiftTimeToMinutes(value: string) {
    const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
    if (!match) {
        return null
    }

    const hoursPart = match[1]
    const minutesPart = match[2]
    const meridiemPart = match[3]

    if (!hoursPart || !minutesPart || !meridiemPart) {
        return null
    }

    let hours = Number.parseInt(hoursPart, 10)
    const minutes = Number.parseInt(minutesPart, 10)
    const meridiem = meridiemPart.toUpperCase()

    if (hours === 12) {
        hours = 0
    }

    if (meridiem === 'PM') {
        hours += 12
    }

    return hours * 60 + minutes
}

function formatMinutesToMeridiem(totalMinutes: number) {
    const normalizedMinutes = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60)
    const hours24 = Math.floor(normalizedMinutes / 60)
    const minutes = normalizedMinutes % 60
    const meridiem = hours24 >= 12 ? 'PM' : 'AM'
    const hours12 = hours24 % 12 || 12
    const paddedMinutes = String(minutes).padStart(2, '0')

    return `${String(hours12).padStart(2, '0')}:${paddedMinutes} ${meridiem}`
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

function goBack() {
    emit('back')
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

function isDepartmentHeadPosition(position: PositionOption) {
    const normalizedName = position.position_name.trim().toLowerCase()
    return normalizedName === 'department head' || normalizedName.includes('head')
}

function isDepartmentHeadPositionDisabled(position: PositionOption) {
    return Boolean(selectedDepartmentOption.value?.department_head) && isDepartmentHeadPosition(position)
}

async function loadDepartments() {
    try {
        const resp: any = await $fetch('/api/departments')
        const payload = resp?.data ?? resp

        if (Array.isArray(payload)) {
            departments.value = payload
        }
    } catch (err) {
        console.error('Failed to load departments:', err)
    }
}

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

async function loadExistingUsernames() {
    try {
        const resp: any = await $fetch('/api/employees')
        const payload = resp?.data ?? resp

        if (Array.isArray(payload)) {
            existingUsernames.value = payload
                .map((employee: any) => employee?.raw?.user_accounts?.username ?? employee?.user_accounts?.username ?? '')
                .filter(Boolean)
                .map((value: string) => normalizeUsername(value))
        }
    } catch (err) {
        console.error('Failed to load existing usernames:', err)
    }
}

async function resolveWorkHourIds() {
    const morningTimeIn = form.value.morningTimeIn
    const morningTimeOut = form.value.morningTimeOut
    const afternoonTimeIn = form.value.afternoonTimeIn
    const afternoonTimeOut = form.value.afternoonTimeOut

    if (!morningTimeIn || !morningTimeOut || !afternoonTimeIn || !afternoonTimeOut) {
        throw new Error('Please select all shift times (morning and afternoon)')
    }

    // Resolve morning shift
    const morningWorkHour = getWorkHourForShift(morningTimeIn, morningTimeOut)
    let morningWorkHourId = morningWorkHour?.work_hour_id

    if (!morningWorkHourId) {
        if (!transactedById.value) {
            throw new Error('You must be signed in to create a work hour')
        }

        const createdMorning: any = await $fetch('/api/work-hours', {
            method: 'POST',
            body: {
                transacted_by: transactedById.value,
                time_in: morningTimeIn,
                time_out: morningTimeOut,
            },
        })

        const morningPayload = createdMorning?.data ?? createdMorning
        morningWorkHourId = morningPayload?.work_hour_id

        if (!morningWorkHourId) {
            throw new Error('Unable to create morning work hour')
        }

        workHours.value = [...workHours.value, morningPayload]
    }

    // Resolve afternoon shift
    const afternoonWorkHour = getWorkHourForShift(afternoonTimeIn, afternoonTimeOut)
    let afternoonWorkHourId = afternoonWorkHour?.work_hour_id

    if (!afternoonWorkHourId) {
        if (!transactedById.value) {
            throw new Error('You must be signed in to create a work hour')
        }

        const createdAfternoon: any = await $fetch('/api/work-hours', {
            method: 'POST',
            body: {
                transacted_by: transactedById.value,
                time_in: afternoonTimeIn,
                time_out: afternoonTimeOut,
            },
        })

        const afternoonPayload = createdAfternoon?.data ?? createdAfternoon
        afternoonWorkHourId = afternoonPayload?.work_hour_id

        if (!afternoonWorkHourId) {
            throw new Error('Unable to create afternoon work hour')
        }

        workHours.value = [...workHours.value, afternoonPayload]
    }

    return { morningWorkHourId, afternoonWorkHourId }
}

function validateBasicFields() {
    const ageValue = String(form.value.age).trim()
    const contactNumberValue = form.value.contactNumber.trim()
    const zipCodeValue = form.value.zipCode.trim()

    if (!/^\d+$/.test(ageValue)) {
        showErrorAlert('Age must be a valid number')
        return false
    }

    if (!/^\d{11}$/.test(contactNumberValue)) {
        showErrorAlert('Contact number must be exactly 11 digits')
        return false
    }

    if (!/^\d{4}$/.test(zipCodeValue)) {
        showErrorAlert('Zip code must be exactly 4 digits')
        return false
    }

    if (form.value.password !== form.value.confirmPassword) {
        showErrorAlert('Passwords do not match')
        return false
    }

    if (selectedPositionOption.value && isDepartmentHeadPositionDisabled(selectedPositionOption.value)) {
        showErrorAlert('This department already has a department head assigned')
        return false
    }

    return true
}

function handleSubmit() {
    if (!validateBasicFields()) {
        return
    }

    if (!selectedDepartmentOption.value || !selectedPositionOption.value) {
        showErrorAlert('Please select a valid department and position')
        return
    }

    if (selectedPositionOption.value.department_id !== selectedDepartmentOption.value.department_id) {
        showErrorAlert('Selected position does not belong to the selected department')
        return
    }

    if (!form.value.morningTimeIn || !form.value.morningTimeOut || !form.value.afternoonTimeIn || !form.value.afternoonTimeOut) {
        showErrorAlert('Please select all shift times (morning and afternoon)')
        return
    }

    const normalizedUsername = normalizeUsername(form.value.username)

    if (existingUsernames.value.includes(normalizedUsername)) {
        showErrorAlert('Username already exists')
        return
    }

    showConfirmModal.value = true
}

async function confirmSubmit() {
    if (!validateBasicFields()) {
        showConfirmModal.value = false
        return
    }

    if (!selectedDepartmentOption.value || !selectedPositionOption.value) {
        showErrorAlert('Please select a valid department and position')
        showConfirmModal.value = false
        return
    }

    if (!transactedById.value) {
        showErrorAlert('You must be signed in to create an employee')
        showConfirmModal.value = false
        return
    }

    showConfirmModal.value = false
    showLoadingModal.value = true

    try {
        const { morningWorkHourId, afternoonWorkHourId } = await resolveWorkHourIds()

        const createdEmployeeResponse: any = await $fetch('/api/employees', {
            method: 'POST',
            body: {
                transacted_by: transactedById.value,
                department_id: Number(selectedDepartmentOption.value.department_id),
                position_id: Number(selectedPositionOption.value.position_id),
                morning_work_hour_id: morningWorkHourId,
                afternoon_work_hour_id: afternoonWorkHourId,
                first_name: form.value.firstName.trim(),
                middle_name: form.value.middleName.trim(),
                last_name: form.value.lastName.trim(),
                suffix: form.value.suffix.trim(),
                gender: form.value.gender,
                birthdate: form.value.birthdate,
                province: form.value.province.trim(),
                city: form.value.city.trim(),
                barangay: form.value.barangay.trim(),
                zip_code: form.value.zipCode.trim(),
                contact_number: form.value.contactNumber.trim(),
                username: normalizeUsername(form.value.username),
                password: form.value.password,
            },
        })

        const payload = createdEmployeeResponse?.data ?? createdEmployeeResponse
        const createdId = payload?.employee_id ?? payload?.id ?? 0
        const middleInitial = form.value.middleName ? ` ${form.value.middleName.charAt(0)}.` : ''
        const fullName = `${form.value.lastName}, ${form.value.firstName}${middleInitial}`

        emit('employeeCreated', {
            id: createdId,
            name: fullName,
            department: selectedDepartmentOption.value.department_name,
            cardStatus: 'No Card',
            cardNumber: payload?.cards?.card_number ?? '',
        })

        existingUsernames.value = [...existingUsernames.value, normalizeUsername(form.value.username)]

        showLoadingModal.value = false
        emit('back')
    } catch (err) {
        showLoadingModal.value = false
        showErrorAlert(getBackendErrorMessage(err, 'Failed to create employee'))
    }
}

watch(() => form.value.department, () => {
    form.value.position = ''
})

watch(() => form.value.morningTimeIn, () => {
    form.value.morningTimeOut = getTimeOutForTimeIn(form.value.morningTimeIn)
})

watch(() => form.value.afternoonTimeIn, () => {
    form.value.afternoonTimeOut = getTimeOutForTimeIn(form.value.afternoonTimeIn)
})

onMounted(async () => {
    await Promise.all([
        loadDepartments(),
        loadWorkHours(),
        loadExistingUsernames(),
    ])
})

onUnmounted(() => {
    if (validationAlertTimer) {
        clearTimeout(validationAlertTimer)
    }
})
</script>

<template>
    <div class="new-employee-page">
        <div v-if="showValidationAlert" class="validation-alert-wrap">
            <Alert
                v-model:visible="showValidationAlert"
                title="Validation"
                :message="validationAlertMessage"
                variant="error"
                :dismissible="false"
            />
        </div>

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

        <form class="new-employee-form" novalidate @submit.prevent="handleSubmit">
            <div class="form-card">
                <div class="form-section">
                    <h2 class="section-title">Job Information</h2>
                    <div class="new-employee-grid">
                        <div class="select-field-wrap">
                            <label class="select-field-label" for="department">Department <span class="required-indicator">*</span></label>
                            <select id="department" v-model="form.department" class="select-field" aria-label="Department" required>
                                <option value="">Select department</option>
                                <option
                                    v-for="department in departments"
                                    :key="department.department_id"
                                    :value="String(department.department_id)"
                                >
                                    {{ department.department_name }}
                                </option>
                            </select>
                        </div>
                        <div class="select-field-wrap">
                            <label class="select-field-label" for="position">Position <span class="required-indicator">*</span></label>
                            <select id="position" v-model="form.position" class="select-field" aria-label="Position" required>
                                <option value="">Select position</option>
                                <option
                                    v-for="position in availablePositions"
                                    :key="position.position_id"
                                    :value="String(position.position_id)"
                                    :disabled="isDepartmentHeadPositionDisabled(position)"
                                >
                                    {{ position.position_name }}{{ isDepartmentHeadPositionDisabled(position) ? ' (Assigned)' : '' }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <h3 class="subsection-title">Shift Time</h3>
                    <div class="shift-container">
                        <div class="shift-section">
                            <h4 class="shift-title">Morning Shift</h4>
                            <div class="shift-grid">
                                <div class="select-field-wrap">
                                    <label class="select-field-label" for="morningTimeIn">Time In <span class="required-indicator">*</span></label>
                                    <select id="morningTimeIn" v-model="form.morningTimeIn" class="select-field" aria-label="Morning Time In" required>
                                        <option value="">Select time in</option>
                                        <option v-for="time in availableMorningShiftTimes" :key="time" :value="time">{{ time }}</option>
                                    </select>
                                </div>
                                <div class="select-field-wrap">
                                    <label class="select-field-label" for="morningTimeOut">Time Out <span class="required-indicator">*</span></label>
                                    <input id="morningTimeOut" v-model="form.morningTimeOut" type="text" class="input-field" aria-label="Morning Time Out" readonly />
                                </div>
                            </div>
                        </div>

                        <div class="shift-section">
                            <h4 class="shift-title">Afternoon Shift</h4>
                            <div class="shift-grid">
                                <div class="select-field-wrap">
                                    <label class="select-field-label" for="afternoonTimeIn">Time In <span class="required-indicator">*</span></label>
                                    <select id="afternoonTimeIn" v-model="form.afternoonTimeIn" class="select-field" aria-label="Afternoon Time In" required>
                                        <option value="">Select time in</option>
                                        <option v-for="time in availableAfternoonShiftTimes" :key="time" :value="time">{{ time }}</option>
                                    </select>
                                </div>
                                <div class="select-field-wrap">
                                    <label class="select-field-label" for="afternoonTimeOut">Time Out <span class="required-indicator">*</span></label>
                                    <input id="afternoonTimeOut" v-model="form.afternoonTimeOut" type="text" class="input-field" aria-label="Afternoon Time Out" readonly />
                                </div>
                            </div>
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
                            <IconInput v-model="form.age" label="Age" type="number" placeholder="Enter age" size="sm" required />
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
                        <IconInput
                            v-model="form.zipCode"
                            label="Zip Code"
                            placeholder="Enter zip code"
                            size="sm"
                            required
                            inputmode="numeric"
                            maxlength="4"
                            pattern="[0-9]{4}"
                        />
                    </div>
                </div>

                <div class="form-divider"></div>

                <div class="form-section">
                    <h2 class="section-title">Contact Details</h2>
                    <div class="new-employee-grid">
                        <IconInput
                            v-model="form.contactNumber"
                            label="Contact Number"
                            type="tel"
                            placeholder="Enter contact number"
                            size="sm"
                            required
                            inputmode="numeric"
                            maxlength="11"
                            pattern="[0-9]{11}"
                        />
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
                            required
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
                    <p><strong>Department:</strong> {{ selectedDepartmentOption?.department_name || 'Not selected' }}</p>
                    <p><strong>Position:</strong> {{ selectedPositionOption?.position_name || 'Not selected' }}</p>
                </div>
                <div class="confirmation-section">
                    <h4 class="section-header">Morning Shift</h4>
                    <p><strong>Time In:</strong> {{ form.morningTimeIn || 'Not selected' }}</p>
                    <p><strong>Time Out:</strong> {{ form.morningTimeOut || 'Not selected' }}</p>
                </div>
                <div class="confirmation-section">
                    <h4 class="section-header">Afternoon Shift</h4>
                    <p><strong>Time In:</strong> {{ form.afternoonTimeIn || 'Not selected' }}</p>
                    <p><strong>Time Out:</strong> {{ form.afternoonTimeOut || 'Not selected' }}</p>
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
            title=""
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

.validation-alert-wrap {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1100;
    width: min(100%, 420px);
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

.subsection-title {
    margin: 0.75rem 0 0;
    font-size: 0.95rem;
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

.shift-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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

.shift-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
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

.select-field:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #e5e7eb;
}

.input-field {
    width: 100%;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background-color: #f9fafb;
    color: #111827;
    font-size: 0.875rem;
    padding: 8px 12px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    cursor: not-allowed;
}

.input-field:readonly {
    background-color: #f3f4f6;
    color: #6b7280;
}

.form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.submit-button {
    width: 160px;
}

:deep(.app-modal) {
    width: min(100%, 760px);
    max-height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
}

:deep(.app-modal__body) {
    overflow-y: auto;
}

@media (max-width: 1100px) {
    .new-employee-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .shift-container {
        grid-template-columns: 1fr;
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

    .form-footer {
        flex-direction: column-reverse;
        align-items: stretch;
    }

    .submit-button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .shift-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 280px) {
    .shift-grid {
        grid-template-columns: 1fr;
    }
}

.confirmation-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    max-height: min(62vh, 560px);
    overflow-y: auto;
    padding-right: 0.25rem;
}

.confirmation-section {
    display: grid;
    gap: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 0.85rem;
    background: #f8fafc;
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

@media (max-width: 900px) {
    .confirmation-content {
        max-height: min(58vh, 520px);
    }
}

@media (max-width: 640px) {
    :deep(.app-modal) {
        width: min(100%, 96vw);
        padding: 12px;
    }

    .confirmation-content {
        max-height: min(56vh, 460px);
        gap: 0.75rem;
        padding-right: 0.15rem;
    }

    .confirmation-section {
        padding: 0.75rem;
    }

    .validation-alert-wrap{
        top: 12px;
        right: 12px;
        width: calc(100vw - 24px);
    }
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
    font-weight: 200;
    color: #1f2937;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
    display: none !important;
}

</style>