<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Employee from './employee.vue'
import NewEmployee from './new-employee.vue'
import EmployeeInfo from './employee-info.vue'

type EmployeeTableRow = {
    id: number
    name: string
    cardStatus: 'Has Card' | 'No Card'
    department: string
    cardNumber: string
}

type EmployeeDirectoryRecord = {
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

const currentView = ref<'list' | 'new' | 'info'>('list')
const showSuccessAlert = ref(false)
const selectedEmployeeId = ref<number | null>(null)
const sharedEmployeeRows = useState<EmployeeTableRow[]>('employees-table-rows', () => [])
const employeeDirectory = ref<EmployeeDirectoryRecord[]>([
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
])

watch(sharedEmployeeRows, (rows) => {
    if (!rows || rows.length === 0) {
        return
    }

    employeeDirectory.value = employeeDirectory.value.map(employee => {
        const row = rows.find(item => item.id === employee.id)
        if (!row) {
            return employee
        }

        return {
            ...employee,
            cardStatus: row.cardStatus,
            cardNumber: row.cardNumber,
        }
    })
}, { immediate: true, deep: true })

const employeeRows = computed(() => {
    return employeeDirectory.value.map(employee => ({
        id: employee.id,
        name: `${employee.lastName}, ${employee.firstName}`,
        cardStatus: employee.cardStatus,
        department: employee.department,
        cardNumber: employee.cardNumber,
    }))
})

function openNewEmployee() {
    selectedEmployeeId.value = null
    currentView.value = 'new'
}

function backToList() {
    selectedEmployeeId.value = null
    currentView.value = 'list'
}

function openEmployeeInfo(employeeId: number) {
    selectedEmployeeId.value = employeeId
    currentView.value = 'info'
}

function onEmployeeCreated() {
    showSuccessAlert.value = true
    setTimeout(() => {
        showSuccessAlert.value = false
    }, 3000)
}

function onEmployeeCardStatusUpdated(payload: { employeeId: number; cardStatus: 'Has Card' | 'No Card'; cardNumber: string }) {
    employeeDirectory.value = employeeDirectory.value.map(employee => {
        if (employee.id !== payload.employeeId) {
            return employee
        }

        return {
            ...employee,
            cardStatus: payload.cardStatus,
            cardNumber: payload.cardNumber,
        }
    })
}

function onEmployeeDeleted(employeeId: number) {
    employeeDirectory.value = employeeDirectory.value.filter(employee => employee.id !== employeeId)
    sharedEmployeeRows.value = sharedEmployeeRows.value.filter(employee => employee.id !== employeeId)
}
</script>

<template>
    <Employee
        v-if="currentView === 'list' && selectedEmployeeId === null"
        :showSuccessAlert="showSuccessAlert"
        :employees="employeeRows"
        @add-employee="openNewEmployee"
        @view-employee="openEmployeeInfo"
        @delete-employee="onEmployeeDeleted"
    />
    <NewEmployee
        v-else-if="currentView === 'new'"
        @back="backToList"
        @employeeCreated="onEmployeeCreated"
    />
    <EmployeeInfo
        v-else-if="currentView === 'info' && selectedEmployeeId !== null"
        :employeeId="selectedEmployeeId"
        :employees="employeeDirectory"
        @back="backToList"
        @update-card-status="onEmployeeCardStatusUpdated"
    />
</template>