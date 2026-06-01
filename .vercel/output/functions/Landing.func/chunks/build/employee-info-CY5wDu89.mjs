import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { ArrowLeftIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { A as Alert, M as Modal } from './Modal-CvY6WRb2.mjs';
import { I as Input } from './Input-VFrQiZfx.mjs';
import { u as useState } from './state-CMS2XX0u.mjs';
import { u as useCookie } from './cookie-Cy4TWyBi.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';
import 'node:stream';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "employee-info",
  __ssrInlineRender: true,
  props: {
    employeeId: {},
    employees: {}
  },
  emits: ["back", "updateCardStatus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const sharedEmployeeRows = useState("employees-table-rows", () => []);
    const userCookie = useCookie("ems_user");
    const loadedEmployee = vueExports.ref(null);
    const departments = vueExports.ref([]);
    const currentUser = vueExports.computed(() => {
      if (!userCookie.value) {
        return null;
      }
      try {
        return JSON.parse(userCookie.value);
      } catch {
        return null;
      }
    });
    const transactedById = vueExports.computed(() => currentUser.value?.employeeId ?? null);
    const availableDepartmentPositions = vueExports.computed(() => {
      const selectedDepartmentId = Number(selectedDepartmentUpdate.value);
      if (!selectedDepartmentId) {
        return [];
      }
      return departments.value.find((department) => department.department_id === selectedDepartmentId)?.positions ?? [];
    });
    const availablePositions = vueExports.computed(() => {
      return departments.value.flatMap((department) => {
        return (department.positions ?? []).map((position) => ({
          ...position,
          department_name: department.department_name
        }));
      });
    });
    const employeeDepartmentPositions = vueExports.computed(() => {
      if (!employee.value.department) {
        return [];
      }
      const currentDepartment = departments.value.find(
        (dept) => dept.department_name === employee.value.department
      );
      if (!currentDepartment || !currentDepartment.positions) {
        return [];
      }
      return currentDepartment.positions.map((position) => ({
        ...position,
        department_name: currentDepartment.department_name
      }));
    });
    const mapBackendEmployee = (raw) => {
      const info = raw.user_informations ?? {};
      const position = raw.positions ?? {};
      const department = position.departments ?? {};
      const salary = position.salaries ?? {};
      const card = raw.cards ?? null;
      const morningWorkHour = raw.morning_work_hour ?? {};
      const afternoonWorkHour = raw.afternoon_work_hour ?? {};
      const birthdate = info.birthdate ? new Date(info.birthdate) : null;
      const age = birthdate ? Math.floor(((/* @__PURE__ */ new Date()).getTime() - birthdate.getTime()) / (365.25 * 24 * 60 * 60 * 1e3)) : 0;
      const formatTime12hr = (timeStr) => {
        if (!timeStr || typeof timeStr !== "string" || timeStr.trim() === "") return "";
        const parts = timeStr.split(":");
        const hoursStr = parts[0] || "";
        const minutesStr = parts[1] || "00";
        const hour = parseInt(hoursStr, 10);
        if (isNaN(hour)) return "";
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutesStr} ${period}`;
      };
      const formatDateOnly = (dateStr) => {
        if (!dateStr || typeof dateStr !== "string" || dateStr.trim() === "") return "";
        const datePart = dateStr.split("T")[0] || "";
        return datePart;
      };
      return {
        id: raw.employee_id,
        department: department.department_name ?? "",
        position: position.position_name ?? "",
        salary: salary.amount ? Number(salary.amount) : 0,
        morningShiftStart: formatTime12hr(morningWorkHour.time_in ?? ""),
        morningShiftEnd: formatTime12hr(morningWorkHour.time_out ?? ""),
        afternoonShiftStart: formatTime12hr(afternoonWorkHour.time_in ?? ""),
        afternoonShiftEnd: formatTime12hr(afternoonWorkHour.time_out ?? ""),
        shiftStart: formatTime12hr(morningWorkHour.time_in ?? ""),
        shiftEnd: formatTime12hr(morningWorkHour.time_out ?? ""),
        firstName: info.first_name ?? "",
        middleName: info.middle_name ?? "",
        lastName: info.last_name ?? "",
        suffix: info.suffix ?? "",
        gender: info.gender ?? "",
        birthdate: formatDateOnly(info.birthdate ?? ""),
        age,
        province: info.province ?? "",
        city: info.city ?? "",
        barangay: info.barangay ?? "",
        zipCode: info.zip_code ?? "",
        contactNumber: info.contact_number ?? "",
        username: raw.user_accounts?.username ?? "",
        cardStatus: card?.card_number ? "Has Card" : "No Card",
        cardNumber: card?.card_number ?? ""
      };
    };
    const employee = vueExports.computed(() => {
      if (loadedEmployee.value) {
        return loadedEmployee.value;
      }
      if (props.employees && props.employees.length > 0 && props.employeeId) {
        const found = props.employees.find((item) => item.id === props.employeeId);
        if (found) return found;
      }
      return {
        id: 0,
        department: "",
        position: "",
        salary: 0,
        morningShiftStart: "",
        morningShiftEnd: "",
        afternoonShiftStart: "",
        afternoonShiftEnd: "",
        shiftStart: "",
        shiftEnd: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        gender: "",
        birthdate: "",
        age: 0,
        province: "",
        city: "",
        barangay: "",
        zipCode: "",
        contactNumber: "",
        username: "",
        cardStatus: "No Card",
        cardNumber: ""
      };
    });
    const workHours = vueExports.ref([]);
    const availableShiftTimes = vueExports.computed(() => {
      return Array.from(new Set(workHours.value.map((workHour) => formatTwentyFourHourToMeridiem(workHour.time_in))));
    });
    const availableMorningShiftTimes = vueExports.computed(() => {
      return availableShiftTimes.value.filter((time) => {
        return time.trim().toUpperCase().endsWith("AM");
      });
    });
    const availableAfternoonShiftTimes = vueExports.computed(() => {
      return availableShiftTimes.value.filter((time) => {
        return time.trim().toUpperCase().endsWith("PM");
      });
    });
    const showUpdateModal = vueExports.ref(false);
    const showUpdateConfirmModal = vueExports.ref(false);
    const showPasswordConfirmModal = vueExports.ref(false);
    const showCardConfirmModal = vueExports.ref(false);
    const showScannerWaitingModal = vueExports.ref(false);
    const showScannerRegisterModal = vueExports.ref(false);
    const showScannedCardModal = vueExports.ref(false);
    const showLoadingModal = vueExports.ref(false);
    const showSuccessAlert = vueExports.ref(false);
    const successAlertMessage = vueExports.ref("Employee new department and position has been updated");
    const preserveUpdateSelection = vueExports.ref(false);
    const showValidationAlert = vueExports.ref(false);
    const validationAlertMessage = vueExports.ref("Please select new department and new position");
    const selectedUpdateOption = vueExports.ref("");
    const selectedDepartmentUpdate = vueExports.ref("");
    const selectedDepartmentPositionUpdate = vueExports.ref("");
    const selectedPositionUpdate = vueExports.ref("");
    const selectedShiftStartUpdate = vueExports.ref("");
    const selectedShiftEndUpdate = vueExports.ref("");
    const selectedMorningTimeInUpdate = vueExports.ref("");
    const selectedMorningTimeOutUpdate = vueExports.ref("");
    const selectedAfternoonTimeInUpdate = vueExports.ref("");
    const selectedAfternoonTimeOutUpdate = vueExports.ref("");
    const selectedPasswordUpdate = vueExports.ref("");
    const scannedRfidNumber = vueExports.ref("");
    const pendingCardUpdate = vueExports.ref(null);
    let validationAlertTimer = null;
    let loadingModalTimer = null;
    let successAlertTimer = null;
    let scannerRegisterModeTimer = null;
    let scannerCardScannedTimer = null;
    vueExports.watch(showUpdateModal, (isOpen) => {
      if (isOpen) {
        preserveUpdateSelection.value = false;
        return;
      }
      if (preserveUpdateSelection.value) {
        return;
      }
      if (!isOpen) {
        selectedUpdateOption.value = "";
        selectedDepartmentUpdate.value = "";
        selectedDepartmentPositionUpdate.value = "";
        selectedPositionUpdate.value = "";
        selectedShiftStartUpdate.value = "";
        selectedShiftEndUpdate.value = "";
        selectedMorningTimeInUpdate.value = "";
        selectedMorningTimeOutUpdate.value = "";
        selectedAfternoonTimeInUpdate.value = "";
        selectedAfternoonTimeOutUpdate.value = "";
        selectedPasswordUpdate.value = "";
      }
    });
    vueExports.watch(showLoadingModal, (isOpen) => {
      if (isOpen) {
        if (loadingModalTimer) {
          clearTimeout(loadingModalTimer);
        }
        loadingModalTimer = setTimeout(() => {
          applyPendingCardUpdateIfNeeded();
          showLoadingModal.value = false;
          showSuccessAlert.value = true;
          if (successAlertTimer) {
            clearTimeout(successAlertTimer);
          }
          successAlertTimer = setTimeout(() => {
            showSuccessAlert.value = false;
            closeConfirmModal();
          }, 3e3);
        }, 3e3);
      }
    });
    vueExports.watch(showScannerWaitingModal, (isOpen) => {
      if (isOpen) {
        if (scannerRegisterModeTimer) {
          clearTimeout(scannerRegisterModeTimer);
        }
        scannerRegisterModeTimer = setTimeout(() => {
          showScannerWaitingModal.value = false;
          showScannerRegisterModal.value = true;
        }, 2500);
        return;
      }
      if (scannerRegisterModeTimer) {
        clearTimeout(scannerRegisterModeTimer);
        scannerRegisterModeTimer = null;
      }
    });
    vueExports.watch(showScannerRegisterModal, (isOpen) => {
      if (isOpen) {
        if (scannerCardScannedTimer) {
          clearTimeout(scannerCardScannedTimer);
        }
        scannerCardScannedTimer = setTimeout(() => {
          scannedRfidNumber.value = `RFID-${Math.floor(1e5 + Math.random() * 9e5)}`;
          showScannerRegisterModal.value = false;
          showScannedCardModal.value = true;
        }, 2500);
        return;
      }
      if (scannerCardScannedTimer) {
        clearTimeout(scannerCardScannedTimer);
        scannerCardScannedTimer = null;
      }
    });
    vueExports.watch(selectedDepartmentUpdate, () => {
      selectedDepartmentPositionUpdate.value = "";
    });
    vueExports.watch(() => selectedMorningTimeInUpdate.value, () => {
      selectedMorningTimeOutUpdate.value = getTimeOutForTimeIn(selectedMorningTimeInUpdate.value);
    });
    vueExports.watch(() => selectedAfternoonTimeInUpdate.value, () => {
      selectedAfternoonTimeOutUpdate.value = getTimeOutForTimeIn(selectedAfternoonTimeInUpdate.value);
    });
    const emit = __emit;
    async function loadDepartments() {
      try {
        const resp = await $fetch("/api/departments");
        const payload = resp?.data ?? resp;
        if (Array.isArray(payload)) {
          departments.value = payload;
        }
      } catch (err) {
        console.error("Failed to load departments for update modal:", err);
      }
    }
    vueExports.watch(() => props.employeeId, async (id) => {
      if (!id) {
        loadedEmployee.value = null;
        return;
      }
      try {
        const resp = await $fetch(`/api/employees/${id}`);
        const payload = resp?.data ?? resp;
        if (payload) {
          const rawEmployee = payload.raw ?? payload;
          loadedEmployee.value = mapBackendEmployee(rawEmployee);
        }
      } catch (err) {
      }
    }, { immediate: true });
    function isAdminUser() {
      return currentUser.value?.role?.trim().toLowerCase() === "admin";
    }
    function ensureAdminPermission() {
      if (!isAdminUser()) {
        showErrorAlert("You dont have a permission to update");
        return false;
      }
      return true;
    }
    function formatTwentyFourHourToMeridiem(value) {
      const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
      if (!match) {
        return value;
      }
      const hours = Number.parseInt(match[1] ?? "0", 10);
      const minutes = match[2] ?? "00";
      const meridiem = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${String(displayHours).padStart(2, "0")}:${minutes} ${meridiem}`;
    }
    function getTimeOutForTimeIn(timeIn) {
      if (!timeIn) {
        return "";
      }
      const workHour = workHours.value.find((wh) => {
        const whTimeIn = formatTwentyFourHourToMeridiem(wh.time_in);
        return whTimeIn === timeIn;
      });
      if (!workHour) {
        return "";
      }
      return formatTwentyFourHourToMeridiem(workHour.time_out);
    }
    function normalizeShiftTimeToTwentyFourHour(value) {
      const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
      if (!match) {
        return "";
      }
      let hours = Number.parseInt(match[1] ?? "0", 10);
      const minutes = match[2] ?? "00";
      const meridiem = (match[3] ?? "AM").toUpperCase();
      if (hours === 12) {
        hours = 0;
      }
      if (meridiem === "PM") {
        hours += 12;
      }
      return `${String(hours).padStart(2, "0")}:${minutes}`;
    }
    function getWorkHourForShift(timeIn, timeOut) {
      const normalizedTimeIn = normalizeShiftTimeToTwentyFourHour(timeIn);
      const normalizedTimeOut = normalizeShiftTimeToTwentyFourHour(timeOut);
      if (!normalizedTimeIn || !normalizedTimeOut) {
        return null;
      }
      return workHours.value.find((workHour) => {
        const existingTimeIn = normalizeShiftTimeToTwentyFourHour(formatTwentyFourHourToMeridiem(workHour.time_in));
        const existingTimeOut = normalizeShiftTimeToTwentyFourHour(formatTwentyFourHourToMeridiem(workHour.time_out));
        return existingTimeIn === normalizedTimeIn && existingTimeOut === normalizedTimeOut;
      });
    }
    function showErrorAlert(message) {
      validationAlertMessage.value = message;
      showValidationAlert.value = true;
      if (validationAlertTimer) {
        clearTimeout(validationAlertTimer);
      }
      validationAlertTimer = setTimeout(() => {
        showValidationAlert.value = false;
      }, 3e3);
    }
    function getSelectedDepartmentOption() {
      const selectedDepartmentId = Number(selectedDepartmentUpdate.value);
      if (!selectedDepartmentId) {
        return null;
      }
      return departments.value.find((department) => department.department_id === selectedDepartmentId) ?? null;
    }
    function getSelectedDepartmentPositionOption() {
      const selectedPositionId = Number(selectedDepartmentPositionUpdate.value);
      if (!selectedPositionId) {
        return null;
      }
      return availableDepartmentPositions.value.find((position) => position.position_id === selectedPositionId) ?? null;
    }
    function getSelectedPositionOption() {
      const selectedPositionId = Number(selectedPositionUpdate.value);
      if (!selectedPositionId) {
        return null;
      }
      return availablePositions.value.find((position) => position.position_id === selectedPositionId) ?? null;
    }
    function getDepartmentNameById(departmentId) {
      const normalizedDepartmentId = Number(departmentId);
      if (!normalizedDepartmentId) {
        return "";
      }
      return departments.value.find((department) => department.department_id === normalizedDepartmentId)?.department_name ?? "";
    }
    function getPositionNameById(positionId) {
      const normalizedPositionId = Number(positionId);
      if (!normalizedPositionId) {
        return "";
      }
      return availablePositions.value.find((position) => position.position_id === normalizedPositionId)?.position_name ?? "";
    }
    function getBackendErrorMessage(err, fallback) {
      return err?.data?.message || err?.response?._data?.message || err?.message || fallback;
    }
    function applyPendingCardUpdateIfNeeded() {
      if (!pendingCardUpdate.value) {
        return;
      }
      if (loadedEmployee.value && loadedEmployee.value.id === pendingCardUpdate.value.employeeId) {
        loadedEmployee.value.cardStatus = pendingCardUpdate.value.cardStatus;
        loadedEmployee.value.cardNumber = pendingCardUpdate.value.cardNumber;
      }
      const foundEmployee = props.employees?.find((item) => item.id === pendingCardUpdate.value.employeeId);
      if (foundEmployee) {
        foundEmployee.cardStatus = pendingCardUpdate.value.cardStatus;
        foundEmployee.cardNumber = pendingCardUpdate.value.cardNumber;
      }
      sharedEmployeeRows.value = sharedEmployeeRows.value.map((employee2) => {
        if (employee2.id !== pendingCardUpdate.value.employeeId) {
          return employee2;
        }
        return {
          ...employee2,
          cardStatus: pendingCardUpdate.value.cardStatus,
          cardNumber: pendingCardUpdate.value.cardNumber
        };
      });
      emit("updateCardStatus", pendingCardUpdate.value);
      pendingCardUpdate.value = null;
    }
    function handleProceedUpdate() {
      if (selectedUpdateOption.value === "Password" && !selectedPasswordUpdate.value.trim()) {
        showErrorAlert("Please enter a new password");
        return;
      }
      if (selectedUpdateOption.value === "Department" && employee.value.id === currentUser.value?.employeeId) {
        showErrorAlert("You cannot update your own department and position");
        return;
      }
      if (selectedUpdateOption.value === "Position" && employee.value.id === currentUser.value?.employeeId) {
        showErrorAlert("You cannot update your own position");
        return;
      }
      if (selectedUpdateOption.value === "Department" && (!selectedDepartmentUpdate.value || !selectedDepartmentPositionUpdate.value)) {
        showErrorAlert("Please select new department and new position");
        return;
      }
      if (selectedUpdateOption.value === "Department" && getSelectedDepartmentOption()?.department_name === employee.value.department && getSelectedDepartmentPositionOption()?.position_name === employee.value.position) {
        showErrorAlert("New department and role cannot be the same as current department and role");
        return;
      }
      if (selectedUpdateOption.value === "Position" && !selectedPositionUpdate.value) {
        showErrorAlert("Please select a new position");
        return;
      }
      if (selectedUpdateOption.value === "Position" && getSelectedPositionOption()?.position_name === employee.value.position) {
        showErrorAlert("New position cannot be the same as current position");
        return;
      }
      if (selectedUpdateOption.value === "Shift" && (!selectedShiftStartUpdate.value || !selectedShiftEndUpdate.value)) {
        showErrorAlert("Please select morning and afternoon shift time in and out");
        return;
      }
      if (selectedUpdateOption.value === "Shift" && selectedShiftStartUpdate.value === (employee.value.shiftStart ?? "") && selectedShiftEndUpdate.value === (employee.value.shiftEnd ?? "")) {
        showErrorAlert("New shift schedule cannot be the same as current shift schedule");
        return;
      }
      if (selectedUpdateOption.value === "Shift-Time" && (!selectedMorningTimeInUpdate.value || !selectedMorningTimeOutUpdate.value || !selectedAfternoonTimeInUpdate.value || !selectedAfternoonTimeOutUpdate.value)) {
        showErrorAlert("Please select morning and afternoon shift time in and out");
        return;
      }
      if (selectedUpdateOption.value === "Shift-Time" && selectedMorningTimeInUpdate.value === (employee.value.morningShiftStart ?? "") && selectedMorningTimeOutUpdate.value === (employee.value.morningShiftEnd ?? "") && selectedAfternoonTimeInUpdate.value === (employee.value.afternoonShiftStart ?? "") && selectedAfternoonTimeOutUpdate.value === (employee.value.afternoonShiftEnd ?? "")) {
        showErrorAlert("New shift schedule cannot be the same as current shift schedule");
        return;
      }
      preserveUpdateSelection.value = true;
      showUpdateModal.value = false;
      if (selectedUpdateOption.value === "Password") {
        showPasswordConfirmModal.value = true;
        return;
      }
      if (selectedUpdateOption.value === "Card" && employee.value.cardStatus === "Has Card") {
        showCardConfirmModal.value = true;
        return;
      }
      if (selectedUpdateOption.value === "Card" && employee.value.cardStatus === "No Card") {
        showScannerWaitingModal.value = true;
        return;
      }
      showUpdateConfirmModal.value = true;
    }
    function getSelectedNewDepartment() {
      if (selectedUpdateOption.value === "Department") {
        return getSelectedDepartmentOption()?.department_name ?? "";
      }
      if (selectedUpdateOption.value === "Position") {
        return getSelectedPositionOption()?.department_name ?? employee.value.department;
      }
      return employee.value.department;
    }
    function getSelectedNewPosition() {
      if (selectedUpdateOption.value === "Department") {
        return getSelectedDepartmentPositionOption()?.position_name ?? "";
      }
      if (selectedUpdateOption.value === "Position") {
        return getSelectedPositionOption()?.position_name ?? "";
      }
      return employee.value.position;
    }
    function closeConfirmModal() {
      applyPendingCardUpdateIfNeeded();
      showUpdateConfirmModal.value = false;
      showPasswordConfirmModal.value = false;
      showCardConfirmModal.value = false;
      showScannerWaitingModal.value = false;
      showScannerRegisterModal.value = false;
      showScannedCardModal.value = false;
      showLoadingModal.value = false;
      selectedUpdateOption.value = "";
      selectedDepartmentUpdate.value = "";
      selectedDepartmentPositionUpdate.value = "";
      selectedPositionUpdate.value = "";
      selectedShiftStartUpdate.value = "";
      selectedShiftEndUpdate.value = "";
      selectedPasswordUpdate.value = "";
      scannedRfidNumber.value = "";
    }
    function goBackFromConfirmModal() {
      preserveUpdateSelection.value = true;
      showUpdateConfirmModal.value = false;
      showUpdateModal.value = true;
    }
    function goBackFromPasswordConfirmModal() {
      preserveUpdateSelection.value = true;
      showPasswordConfirmModal.value = false;
      showUpdateModal.value = true;
    }
    function goBackFromCardConfirmModal() {
      preserveUpdateSelection.value = true;
      showCardConfirmModal.value = false;
      showUpdateModal.value = true;
    }
    async function confirmUpdateSelection() {
      if (!ensureAdminPermission()) {
        return;
      }
      console.log("Confirm update option:", selectedUpdateOption.value);
      const foundEmployee = props.employees?.find((item) => item.id === props.employeeId) || loadedEmployee.value;
      if (props.employeeId && (selectedUpdateOption.value === "Department" || selectedUpdateOption.value === "Position")) {
        if (!transactedById.value) {
          showErrorAlert("You must be signed in to update employee information");
          return;
        }
        if (departments.value.length === 0) {
          await loadDepartments();
        }
        const selectedPositionOption = selectedUpdateOption.value === "Department" ? getSelectedDepartmentPositionOption() : getSelectedPositionOption();
        const selectedDepartmentOption = selectedUpdateOption.value === "Department" ? getSelectedDepartmentOption() : departments.value.find((department) => department.department_id === selectedPositionOption?.department_id) ?? null;
        if (!selectedDepartmentOption || !selectedPositionOption) {
          showErrorAlert("Please select a valid department and position");
          return;
        }
        try {
          await $fetch(`/api/employees/${props.employeeId}`, {
            method: "PUT",
            body: {
              update_type: "Position",
              transacted_by: transactedById.value,
              department_id: Number(selectedDepartmentOption.department_id),
              position_id: Number(selectedPositionOption.position_id)
            }
          });
        } catch (err) {
          console.error("Update failed:", err);
          showErrorAlert(getBackendErrorMessage(err, "Failed to update employee department and position"));
          return;
        }
        if (foundEmployee) {
          foundEmployee.department = selectedDepartmentOption.department_name;
          foundEmployee.position = selectedPositionOption.position_name;
        }
      }
      if (props.employeeId && selectedUpdateOption.value === "Shift-Time") {
        if (!transactedById.value) {
          showErrorAlert("You must be signed in to update employee information");
          return;
        }
        try {
          const morningWorkHour = getWorkHourForShift(selectedMorningTimeInUpdate.value, selectedMorningTimeOutUpdate.value);
          const afternoonWorkHour = getWorkHourForShift(selectedAfternoonTimeInUpdate.value, selectedAfternoonTimeOutUpdate.value);
          if (!morningWorkHour || !afternoonWorkHour) {
            showErrorAlert("Invalid shift time selection");
            return;
          }
          await $fetch(`/api/employees/${props.employeeId}`, {
            method: "PUT",
            body: {
              update_type: "Shift",
              transacted_by: transactedById.value,
              morning_work_hour_id: morningWorkHour.work_hour_id,
              afternoon_work_hour_id: afternoonWorkHour.work_hour_id
            }
          });
          if (foundEmployee) {
            foundEmployee.morningShiftStart = selectedMorningTimeInUpdate.value;
            foundEmployee.morningShiftEnd = selectedMorningTimeOutUpdate.value;
            foundEmployee.afternoonShiftStart = selectedAfternoonTimeInUpdate.value;
            foundEmployee.afternoonShiftEnd = selectedAfternoonTimeOutUpdate.value;
          }
        } catch (err) {
          console.error("Shift-Time update failed:", err);
          showErrorAlert(getBackendErrorMessage(err, "Failed to update employee shift time"));
          return;
        }
      }
      successAlertMessage.value = selectedUpdateOption.value === "Shift" ? "Employee shift schedule has been updated" : selectedUpdateOption.value === "Shift-Time" ? "Employee shift time has been updated" : "Employee new department and position has been updated";
      showUpdateConfirmModal.value = false;
      showLoadingModal.value = true;
    }
    function confirmPasswordUpdate() {
      console.log("Confirm update option:", selectedUpdateOption.value);
      if (props.employeeId && selectedPasswordUpdate.value && transactedById.value) {
        $fetch(`/api/employees/${props.employeeId}`, {
          method: "PUT",
          body: {
            transacted_by: transactedById.value,
            update_type: "Password",
            password: selectedPasswordUpdate.value
          }
        }).catch((err) => {
          console.error("Password update failed:", err);
        });
      }
      successAlertMessage.value = "Password updated successfully";
      showPasswordConfirmModal.value = false;
      showLoadingModal.value = true;
    }
    function proceedCardRegistrationFromConfirm() {
      showCardConfirmModal.value = false;
      showScannerWaitingModal.value = true;
    }
    function confirmCardUpdate() {
      console.log("Confirm update option:", selectedUpdateOption.value);
      console.log("Scanned RFID number:", scannedRfidNumber.value);
      if (props.employeeId !== null && transactedById.value) {
        $fetch(`/api/employees/${props.employeeId}`, {
          method: "PUT",
          body: {
            transacted_by: transactedById.value,
            update_type: "Card",
            card_number: scannedRfidNumber.value || "RFID-000000"
          }
        }).catch((err) => {
          console.error("Card update failed:", err);
        });
        pendingCardUpdate.value = {
          employeeId: props.employeeId,
          cardStatus: "Has Card",
          cardNumber: scannedRfidNumber.value || "RFID-000000"
        };
      }
      successAlertMessage.value = "New card registered successfully";
      showCardConfirmModal.value = false;
      showScannedCardModal.value = false;
      showLoadingModal.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "employee-info-page" }, _attrs))} data-v-2a64f609>`);
      if (showValidationAlert.value) {
        _push(`<div class="validation-alert-wrap" data-v-2a64f609>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
          visible: showValidationAlert.value,
          "onUpdate:visible": ($event) => showValidationAlert.value = $event,
          title: "Validation",
          message: validationAlertMessage.value,
          variant: "error",
          dismissible: false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="employee-info-header" data-v-2a64f609><button type="button" class="back-button" aria-label="Back" data-v-2a64f609>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "back-icon" }, null, _parent));
      _push(`</button><div class="header-content" data-v-2a64f609><h1 class="title" data-v-2a64f609>Employee Information</h1></div></div><div class="form-card" data-v-2a64f609><div class="form-section" data-v-2a64f609><div class="section-heading-row" data-v-2a64f609><h2 class="section-title" data-v-2a64f609>Job Information</h2><button type="button" class="update-button" data-v-2a64f609>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(PencilSquareIcon), { class: "update-icon" }, null, _parent));
      _push(`<span data-v-2a64f609>Update</span></button></div><div class="info-grid" data-v-2a64f609><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Department</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.department)}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Position</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.position)}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Salary</span><span class="value" data-v-2a64f609>₱${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.salary.toLocaleString())}</span></div></div><h3 class="subsection-title" data-v-2a64f609>Shift Time</h3><div class="shift-container" data-v-2a64f609><div class="shift-section" data-v-2a64f609><h4 class="shift-title" data-v-2a64f609>Morning Shift</h4><div class="shift-grid" data-v-2a64f609><div class="select-field-wrap" data-v-2a64f609><label class="select-field-label" data-v-2a64f609>Time In</label>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
        modelValue: employee.value.morningShiftStart || "N/A",
        readonly: ""
      }, null, _parent));
      _push(`</div><div class="select-field-wrap" data-v-2a64f609><label class="select-field-label" data-v-2a64f609>Time Out</label>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
        modelValue: employee.value.morningShiftEnd || "N/A",
        readonly: ""
      }, null, _parent));
      _push(`</div></div></div><div class="shift-section" data-v-2a64f609><h4 class="shift-title" data-v-2a64f609>Afternoon Shift</h4><div class="shift-grid" data-v-2a64f609><div class="select-field-wrap" data-v-2a64f609><label class="select-field-label" data-v-2a64f609>Time In</label>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
        modelValue: employee.value.afternoonShiftStart || "N/A",
        readonly: ""
      }, null, _parent));
      _push(`</div><div class="select-field-wrap" data-v-2a64f609><label class="select-field-label" data-v-2a64f609>Time Out</label>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
        modelValue: employee.value.afternoonShiftEnd || "N/A",
        readonly: ""
      }, null, _parent));
      _push(`</div></div></div></div></div><div class="form-divider" data-v-2a64f609></div><div class="form-section" data-v-2a64f609><h2 class="section-title" data-v-2a64f609>Personal Information</h2><div class="info-grid" data-v-2a64f609><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Last Name</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.lastName || "N/A")}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>First Name</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.firstName || "N/A")}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Middle Name</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.middleName || "N/A")}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Suffix</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.suffix || "N/A")}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Gender</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.gender)}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Birthdate</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.birthdate)}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Age</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.age)}</span></div></div></div><div class="form-divider" data-v-2a64f609></div><div class="form-section" data-v-2a64f609><h2 class="section-title" data-v-2a64f609>Address Information</h2><div class="info-grid" data-v-2a64f609><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Province</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.province || "N/A")}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>City</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.city || "N/A")}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Barangay</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.barangay || "N/A")}</span></div><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Zip Code</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.zipCode || "N/A")}</span></div></div></div><div class="form-divider" data-v-2a64f609></div><div class="form-section" data-v-2a64f609><h2 class="section-title" data-v-2a64f609>Contact Details</h2><div class="info-grid info-grid--one" data-v-2a64f609><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Contact Number</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.contactNumber)}</span></div></div></div><div class="form-divider" data-v-2a64f609></div><div class="form-section" data-v-2a64f609><h2 class="section-title" data-v-2a64f609>Account Information</h2><div class="info-grid info-grid--one" data-v-2a64f609><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Username</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.username)}</span></div></div></div><div class="form-divider" data-v-2a64f609></div><div class="form-section" data-v-2a64f609><h2 class="section-title" data-v-2a64f609>ID Card Information</h2><div class="info-grid info-grid--two" data-v-2a64f609><div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Card Status</span><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([employee.value.cardStatus === "Has Card" ? "value--success" : "value--danger", "value"])}" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.cardStatus)}</span></div>`);
      if (employee.value.cardStatus === "Has Card") {
        _push(`<div class="info-item" data-v-2a64f609><span class="label" data-v-2a64f609>Card Number</span><span class="value" data-v-2a64f609>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.cardNumber)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showUpdateModal.value,
        "onUpdate:open": ($event) => showUpdateModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="update-modal-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close update options" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><h3 class="update-modal-title" data-v-2a64f609${_scopeId}>Select Update Option</h3><div class="update-option-select-wrap" data-v-2a64f609${_scopeId}><select class="update-option-select" aria-label="Select update option" data-v-2a64f609${_scopeId}><option value="" disabled data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateOption.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateOption.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateOption.value, "")) ? " selected" : ""}${_scopeId}>Select Update Option</option><option value="Department" data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateOption.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateOption.value, "Department") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateOption.value, "Department")) ? " selected" : ""}${_scopeId}>Department</option><option value="Position" data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateOption.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateOption.value, "Position") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateOption.value, "Position")) ? " selected" : ""}${_scopeId}>Position</option><option value="Password" data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateOption.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateOption.value, "Password") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateOption.value, "Password")) ? " selected" : ""}${_scopeId}>Password</option><option value="Shift-Time" data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateOption.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateOption.value, "Shift-Time") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateOption.value, "Shift-Time")) ? " selected" : ""}${_scopeId}>Shift Time</option><option value="Card" data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateOption.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateOption.value, "Card") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateOption.value, "Card")) ? " selected" : ""}${_scopeId}>Card</option></select></div>`);
            if (selectedUpdateOption.value === "Department") {
              _push2(`<div class="department-update-panel" data-v-2a64f609${_scopeId}><label class="department-update-label" for="newDepartmentSelect" data-v-2a64f609${_scopeId}>Select department</label><select id="newDepartmentSelect" class="department-update-select" aria-label="New Department" data-v-2a64f609${_scopeId}><option value="" disabled data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedDepartmentUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedDepartmentUpdate.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedDepartmentUpdate.value, "")) ? " selected" : ""}${_scopeId}>Select new department</option><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(departments.value, (department) => {
                _push2(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", String(department.department_id))} data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedDepartmentUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedDepartmentUpdate.value, String(department.department_id)) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedDepartmentUpdate.value, String(department.department_id))) ? " selected" : ""}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(department.department_name)}</option>`);
              });
              _push2(`<!--]--></select><label class="department-update-label" for="newDepartmentPositionSelect" data-v-2a64f609${_scopeId}>Select position</label><select id="newDepartmentPositionSelect" class="department-update-select" aria-label="New Department Position" data-v-2a64f609${_scopeId}><option value="" disabled data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedDepartmentPositionUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedDepartmentPositionUpdate.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedDepartmentPositionUpdate.value, "")) ? " selected" : ""}${_scopeId}>Select new position</option><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(availableDepartmentPositions.value, (position) => {
                _push2(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", String(position.position_id))} data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedDepartmentPositionUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedDepartmentPositionUpdate.value, String(position.position_id)) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedDepartmentPositionUpdate.value, String(position.position_id))) ? " selected" : ""}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(position.position_name)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedUpdateOption.value === "Shift-Time") {
              _push2(`<div class="department-update-panel" data-v-2a64f609${_scopeId}><h4 class="shift-title" data-v-2a64f609${_scopeId}>Morning Shift</h4><div class="shift-grid" data-v-2a64f609${_scopeId}><div class="select-field-wrap" data-v-2a64f609${_scopeId}><label class="department-update-label" for="morningTimeInUpdate" data-v-2a64f609${_scopeId}>Time In</label><select id="morningTimeInUpdate" class="department-update-select" aria-label="Morning Time In" data-v-2a64f609${_scopeId}><option value="" data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedMorningTimeInUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedMorningTimeInUpdate.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedMorningTimeInUpdate.value, "")) ? " selected" : ""}${_scopeId}>Select time in</option><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(availableMorningShiftTimes.value, (time) => {
                _push2(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", time)} data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedMorningTimeInUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedMorningTimeInUpdate.value, time) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedMorningTimeInUpdate.value, time)) ? " selected" : ""}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(time)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="select-field-wrap" data-v-2a64f609${_scopeId}><label class="department-update-label" for="morningTimeOutUpdate" data-v-2a64f609${_scopeId}>Time Out</label><input id="morningTimeOutUpdate"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", selectedMorningTimeOutUpdate.value)} type="text" class="department-update-select" aria-label="Morning Time Out" readonly data-v-2a64f609${_scopeId}></div></div><h4 class="shift-title" data-v-2a64f609${_scopeId}>Afternoon Shift</h4><div class="shift-grid" data-v-2a64f609${_scopeId}><div class="select-field-wrap" data-v-2a64f609${_scopeId}><label class="department-update-label" for="afternoonTimeInUpdate" data-v-2a64f609${_scopeId}>Time In</label><select id="afternoonTimeInUpdate" class="department-update-select" aria-label="Afternoon Time In" data-v-2a64f609${_scopeId}><option value="" data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedAfternoonTimeInUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedAfternoonTimeInUpdate.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedAfternoonTimeInUpdate.value, "")) ? " selected" : ""}${_scopeId}>Select time in</option><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(availableAfternoonShiftTimes.value, (time) => {
                _push2(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", time)} data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedAfternoonTimeInUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedAfternoonTimeInUpdate.value, time) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedAfternoonTimeInUpdate.value, time)) ? " selected" : ""}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(time)}</option>`);
              });
              _push2(`<!--]--></select></div><div class="select-field-wrap" data-v-2a64f609${_scopeId}><label class="department-update-label" for="afternoonTimeOutUpdate" data-v-2a64f609${_scopeId}>Time Out</label><input id="afternoonTimeOutUpdate"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", selectedAfternoonTimeOutUpdate.value)} type="text" class="department-update-select" aria-label="Afternoon Time Out" readonly data-v-2a64f609${_scopeId}></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedUpdateOption.value === "Position") {
              _push2(`<div class="department-update-panel" data-v-2a64f609${_scopeId}><label class="department-update-label" for="newPositionSelect" data-v-2a64f609${_scopeId}>Select position</label><select id="newPositionSelect" class="department-update-select" aria-label="New Position" data-v-2a64f609${_scopeId}><option value="" disabled data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedPositionUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedPositionUpdate.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedPositionUpdate.value, "")) ? " selected" : ""}${_scopeId}>Select new position</option><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(employeeDepartmentPositions.value, (position) => {
                _push2(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", String(position.position_id))} data-v-2a64f609${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedPositionUpdate.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedPositionUpdate.value, String(position.position_id)) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedPositionUpdate.value, String(position.position_id))) ? " selected" : ""}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(position.position_name)}</option>`);
              });
              _push2(`<!--]--></select></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedUpdateOption.value === "Password") {
              _push2(`<div class="department-update-panel" data-v-2a64f609${_scopeId}><label class="department-update-label" for="newPasswordInput" data-v-2a64f609${_scopeId}>New password</label><input id="newPasswordInput"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", selectedPasswordUpdate.value)} class="department-update-select" type="password" aria-label="New Password" placeholder="Enter new password" autocomplete="new-password" data-v-2a64f609${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedUpdateOption.value) {
              _push2(`<div class="update-proceed-wrap" data-v-2a64f609${_scopeId}><button type="button" class="update-proceed-button" data-v-2a64f609${_scopeId}> Proceed </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "update-modal-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close update options",
                  onClick: ($event) => showUpdateModal.value = false
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ], 8, ["onClick"]),
                vueExports.createVNode("h3", { class: "update-modal-title" }, "Select Update Option"),
                vueExports.createVNode("div", { class: "update-option-select-wrap" }, [
                  vueExports.withDirectives(vueExports.createVNode("select", {
                    "onUpdate:modelValue": ($event) => selectedUpdateOption.value = $event,
                    class: "update-option-select",
                    "aria-label": "Select update option"
                  }, [
                    vueExports.createVNode("option", {
                      value: "",
                      disabled: ""
                    }, "Select Update Option"),
                    vueExports.createVNode("option", { value: "Department" }, "Department"),
                    vueExports.createVNode("option", { value: "Position" }, "Position"),
                    vueExports.createVNode("option", { value: "Password" }, "Password"),
                    vueExports.createVNode("option", { value: "Shift-Time" }, "Shift Time"),
                    vueExports.createVNode("option", { value: "Card" }, "Card")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vueExports.vModelSelect, selectedUpdateOption.value]
                  ])
                ]),
                selectedUpdateOption.value === "Department" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 0,
                  class: "department-update-panel"
                }, [
                  vueExports.createVNode("label", {
                    class: "department-update-label",
                    for: "newDepartmentSelect"
                  }, "Select department"),
                  vueExports.withDirectives(vueExports.createVNode("select", {
                    id: "newDepartmentSelect",
                    "onUpdate:modelValue": ($event) => selectedDepartmentUpdate.value = $event,
                    class: "department-update-select",
                    "aria-label": "New Department"
                  }, [
                    vueExports.createVNode("option", {
                      value: "",
                      disabled: ""
                    }, "Select new department"),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(departments.value, (department) => {
                      return vueExports.openBlock(), vueExports.createBlock("option", {
                        key: department.department_id,
                        value: String(department.department_id)
                      }, vueExports.toDisplayString(department.department_name), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vueExports.vModelSelect, selectedDepartmentUpdate.value]
                  ]),
                  vueExports.createVNode("label", {
                    class: "department-update-label",
                    for: "newDepartmentPositionSelect"
                  }, "Select position"),
                  vueExports.withDirectives(vueExports.createVNode("select", {
                    id: "newDepartmentPositionSelect",
                    "onUpdate:modelValue": ($event) => selectedDepartmentPositionUpdate.value = $event,
                    class: "department-update-select",
                    "aria-label": "New Department Position"
                  }, [
                    vueExports.createVNode("option", {
                      value: "",
                      disabled: ""
                    }, "Select new position"),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(availableDepartmentPositions.value, (position) => {
                      return vueExports.openBlock(), vueExports.createBlock("option", {
                        key: position.position_id,
                        value: String(position.position_id)
                      }, vueExports.toDisplayString(position.position_name), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vueExports.vModelSelect, selectedDepartmentPositionUpdate.value]
                  ])
                ])) : vueExports.createCommentVNode("", true),
                selectedUpdateOption.value === "Shift-Time" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "department-update-panel"
                }, [
                  vueExports.createVNode("h4", { class: "shift-title" }, "Morning Shift"),
                  vueExports.createVNode("div", { class: "shift-grid" }, [
                    vueExports.createVNode("div", { class: "select-field-wrap" }, [
                      vueExports.createVNode("label", {
                        class: "department-update-label",
                        for: "morningTimeInUpdate"
                      }, "Time In"),
                      vueExports.withDirectives(vueExports.createVNode("select", {
                        id: "morningTimeInUpdate",
                        "onUpdate:modelValue": ($event) => selectedMorningTimeInUpdate.value = $event,
                        class: "department-update-select",
                        "aria-label": "Morning Time In"
                      }, [
                        vueExports.createVNode("option", { value: "" }, "Select time in"),
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(availableMorningShiftTimes.value, (time) => {
                          return vueExports.openBlock(), vueExports.createBlock("option", {
                            key: time,
                            value: time
                          }, vueExports.toDisplayString(time), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vueExports.vModelSelect, selectedMorningTimeInUpdate.value]
                      ])
                    ]),
                    vueExports.createVNode("div", { class: "select-field-wrap" }, [
                      vueExports.createVNode("label", {
                        class: "department-update-label",
                        for: "morningTimeOutUpdate"
                      }, "Time Out"),
                      vueExports.withDirectives(vueExports.createVNode("input", {
                        id: "morningTimeOutUpdate",
                        "onUpdate:modelValue": ($event) => selectedMorningTimeOutUpdate.value = $event,
                        type: "text",
                        class: "department-update-select",
                        "aria-label": "Morning Time Out",
                        readonly: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vueExports.vModelText, selectedMorningTimeOutUpdate.value]
                      ])
                    ])
                  ]),
                  vueExports.createVNode("h4", { class: "shift-title" }, "Afternoon Shift"),
                  vueExports.createVNode("div", { class: "shift-grid" }, [
                    vueExports.createVNode("div", { class: "select-field-wrap" }, [
                      vueExports.createVNode("label", {
                        class: "department-update-label",
                        for: "afternoonTimeInUpdate"
                      }, "Time In"),
                      vueExports.withDirectives(vueExports.createVNode("select", {
                        id: "afternoonTimeInUpdate",
                        "onUpdate:modelValue": ($event) => selectedAfternoonTimeInUpdate.value = $event,
                        class: "department-update-select",
                        "aria-label": "Afternoon Time In"
                      }, [
                        vueExports.createVNode("option", { value: "" }, "Select time in"),
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(availableAfternoonShiftTimes.value, (time) => {
                          return vueExports.openBlock(), vueExports.createBlock("option", {
                            key: time,
                            value: time
                          }, vueExports.toDisplayString(time), 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vueExports.vModelSelect, selectedAfternoonTimeInUpdate.value]
                      ])
                    ]),
                    vueExports.createVNode("div", { class: "select-field-wrap" }, [
                      vueExports.createVNode("label", {
                        class: "department-update-label",
                        for: "afternoonTimeOutUpdate"
                      }, "Time Out"),
                      vueExports.withDirectives(vueExports.createVNode("input", {
                        id: "afternoonTimeOutUpdate",
                        "onUpdate:modelValue": ($event) => selectedAfternoonTimeOutUpdate.value = $event,
                        type: "text",
                        class: "department-update-select",
                        "aria-label": "Afternoon Time Out",
                        readonly: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vueExports.vModelText, selectedAfternoonTimeOutUpdate.value]
                      ])
                    ])
                  ])
                ])) : vueExports.createCommentVNode("", true),
                selectedUpdateOption.value === "Position" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "department-update-panel"
                }, [
                  vueExports.createVNode("label", {
                    class: "department-update-label",
                    for: "newPositionSelect"
                  }, "Select position"),
                  vueExports.withDirectives(vueExports.createVNode("select", {
                    id: "newPositionSelect",
                    "onUpdate:modelValue": ($event) => selectedPositionUpdate.value = $event,
                    class: "department-update-select",
                    "aria-label": "New Position"
                  }, [
                    vueExports.createVNode("option", {
                      value: "",
                      disabled: ""
                    }, "Select new position"),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(employeeDepartmentPositions.value, (position) => {
                      return vueExports.openBlock(), vueExports.createBlock("option", {
                        key: position.position_id,
                        value: String(position.position_id)
                      }, vueExports.toDisplayString(position.position_name), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vueExports.vModelSelect, selectedPositionUpdate.value]
                  ])
                ])) : vueExports.createCommentVNode("", true),
                selectedUpdateOption.value === "Password" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 3,
                  class: "department-update-panel"
                }, [
                  vueExports.createVNode("label", {
                    class: "department-update-label",
                    for: "newPasswordInput"
                  }, "New password"),
                  vueExports.withDirectives(vueExports.createVNode("input", {
                    id: "newPasswordInput",
                    "onUpdate:modelValue": ($event) => selectedPasswordUpdate.value = $event,
                    class: "department-update-select",
                    type: "password",
                    "aria-label": "New Password",
                    placeholder: "Enter new password",
                    autocomplete: "new-password"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vueExports.vModelText, selectedPasswordUpdate.value]
                  ])
                ])) : vueExports.createCommentVNode("", true),
                selectedUpdateOption.value ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 4,
                  class: "update-proceed-wrap"
                }, [
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button",
                    onClick: handleProceedUpdate
                  }, " Proceed ")
                ])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showUpdateConfirmModal.value,
        "onUpdate:open": ($event) => showUpdateConfirmModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="confirm-modal-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close confirm update" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><button type="button" class="update-modal-back-button" aria-label="Back to update options" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "update-modal-back-icon" }, null, _parent2, _scopeId));
            _push2(`</button><h3 class="update-modal-title" data-v-2a64f609${_scopeId}>Confirm Update</h3><div class="confirm-grid" data-v-2a64f609${_scopeId}>`);
            if (selectedUpdateOption.value === "Shift-Time") {
              _push2(`<div class="confirm-card" data-v-2a64f609${_scopeId}><h4 class="confirm-card-title" data-v-2a64f609${_scopeId}>Current Shift Time</h4><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Morning Time In:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.morningShiftStart || "N/A")}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Morning Time Out:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.morningShiftEnd || "N/A")}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Afternoon Time In:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.afternoonShiftStart || "N/A")}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Afternoon Time Out:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.afternoonShiftEnd || "N/A")}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedUpdateOption.value === "Shift-Time") {
              _push2(`<div class="confirm-card" data-v-2a64f609${_scopeId}><h4 class="confirm-card-title" data-v-2a64f609${_scopeId}>New Shift Time</h4><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Morning Time In:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedMorningTimeInUpdate.value || "N/A")}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Morning Time Out:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedMorningTimeOutUpdate.value || "N/A")}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Afternoon Time In:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedAfternoonTimeInUpdate.value || "N/A")}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Afternoon Time Out:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedAfternoonTimeOutUpdate.value || "N/A")}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedUpdateOption.value !== "Shift-Time") {
              _push2(`<div class="confirm-card" data-v-2a64f609${_scopeId}><h4 class="confirm-card-title" data-v-2a64f609${_scopeId}>Old Department and Position</h4><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Department:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.department)}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Position:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.position)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedUpdateOption.value !== "Shift-Time") {
              _push2(`<div class="confirm-card" data-v-2a64f609${_scopeId}><h4 class="confirm-card-title" data-v-2a64f609${_scopeId}>New Department and Position</h4><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Department:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedUpdateOption.value === "Department" ? getDepartmentNameById(selectedDepartmentUpdate.value) || "N/A" : getSelectedNewDepartment() || "N/A")}</p><p data-v-2a64f609${_scopeId}><strong data-v-2a64f609${_scopeId}>Position:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedUpdateOption.value === "Department" ? getPositionNameById(selectedDepartmentPositionUpdate.value) || "N/A" : getPositionNameById(selectedPositionUpdate.value) || getSelectedNewPosition() || "N/A")}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="update-proceed-wrap" data-v-2a64f609${_scopeId}><button type="button" class="update-proceed-button" data-v-2a64f609${_scopeId}> Confirm </button></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "confirm-modal-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close confirm update",
                  onClick: closeConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ]),
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-back-button",
                  "aria-label": "Back to update options",
                  onClick: goBackFromConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(ArrowLeftIcon), { class: "update-modal-back-icon" })
                ]),
                vueExports.createVNode("h3", { class: "update-modal-title" }, "Confirm Update"),
                vueExports.createVNode("div", { class: "confirm-grid" }, [
                  selectedUpdateOption.value === "Shift-Time" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 0,
                    class: "confirm-card"
                  }, [
                    vueExports.createVNode("h4", { class: "confirm-card-title" }, "Current Shift Time"),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Morning Time In:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(employee.value.morningShiftStart || "N/A"), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Morning Time Out:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(employee.value.morningShiftEnd || "N/A"), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Afternoon Time In:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(employee.value.afternoonShiftStart || "N/A"), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Afternoon Time Out:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(employee.value.afternoonShiftEnd || "N/A"), 1)
                    ])
                  ])) : vueExports.createCommentVNode("", true),
                  selectedUpdateOption.value === "Shift-Time" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 1,
                    class: "confirm-card"
                  }, [
                    vueExports.createVNode("h4", { class: "confirm-card-title" }, "New Shift Time"),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Morning Time In:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedMorningTimeInUpdate.value || "N/A"), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Morning Time Out:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedMorningTimeOutUpdate.value || "N/A"), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Afternoon Time In:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedAfternoonTimeInUpdate.value || "N/A"), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Afternoon Time Out:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedAfternoonTimeOutUpdate.value || "N/A"), 1)
                    ])
                  ])) : vueExports.createCommentVNode("", true),
                  selectedUpdateOption.value !== "Shift-Time" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 2,
                    class: "confirm-card"
                  }, [
                    vueExports.createVNode("h4", { class: "confirm-card-title" }, "Old Department and Position"),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Department:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(employee.value.department), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Position:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(employee.value.position), 1)
                    ])
                  ])) : vueExports.createCommentVNode("", true),
                  selectedUpdateOption.value !== "Shift-Time" ? (vueExports.openBlock(), vueExports.createBlock("div", {
                    key: 3,
                    class: "confirm-card"
                  }, [
                    vueExports.createVNode("h4", { class: "confirm-card-title" }, "New Department and Position"),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Department:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedUpdateOption.value === "Department" ? getDepartmentNameById(selectedDepartmentUpdate.value) || "N/A" : getSelectedNewDepartment() || "N/A"), 1)
                    ]),
                    vueExports.createVNode("p", null, [
                      vueExports.createVNode("strong", null, "Position:"),
                      vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedUpdateOption.value === "Department" ? getPositionNameById(selectedDepartmentPositionUpdate.value) || "N/A" : getPositionNameById(selectedPositionUpdate.value) || getSelectedNewPosition() || "N/A"), 1)
                    ])
                  ])) : vueExports.createCommentVNode("", true)
                ]),
                vueExports.createVNode("div", { class: "update-proceed-wrap" }, [
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button",
                    onClick: confirmUpdateSelection
                  }, " Confirm ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showPasswordConfirmModal.value,
        "onUpdate:open": ($event) => showPasswordConfirmModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="confirm-modal-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close password confirmation" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><button type="button" class="update-modal-back-button" aria-label="Back to update options" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "update-modal-back-icon" }, null, _parent2, _scopeId));
            _push2(`</button><h3 class="update-modal-title" data-v-2a64f609${_scopeId}>Confirm Password Update</h3><p class="password-confirm-message" data-v-2a64f609${_scopeId}>Are you sure you want to change the password?</p><div class="password-confirm-actions" data-v-2a64f609${_scopeId}><button type="button" class="update-proceed-button update-proceed-button--secondary" data-v-2a64f609${_scopeId}> Cancel </button><button type="button" class="update-proceed-button" data-v-2a64f609${_scopeId}> Confirm </button></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "confirm-modal-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close password confirmation",
                  onClick: closeConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ]),
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-back-button",
                  "aria-label": "Back to update options",
                  onClick: goBackFromPasswordConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(ArrowLeftIcon), { class: "update-modal-back-icon" })
                ]),
                vueExports.createVNode("h3", { class: "update-modal-title" }, "Confirm Password Update"),
                vueExports.createVNode("p", { class: "password-confirm-message" }, "Are you sure you want to change the password?"),
                vueExports.createVNode("div", { class: "password-confirm-actions" }, [
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button update-proceed-button--secondary",
                    onClick: goBackFromPasswordConfirmModal
                  }, " Cancel "),
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button",
                    onClick: confirmPasswordUpdate
                  }, " Confirm ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showCardConfirmModal.value,
        "onUpdate:open": ($event) => showCardConfirmModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="confirm-modal-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close card confirmation" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><button type="button" class="update-modal-back-button" aria-label="Back to update options" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "update-modal-back-icon" }, null, _parent2, _scopeId));
            _push2(`</button><h3 class="update-modal-title" data-v-2a64f609${_scopeId}>Confirm Card Registration</h3><p class="password-confirm-message" data-v-2a64f609${_scopeId}>This employee has a card already.</p><p class="password-confirm-message" data-v-2a64f609${_scopeId}>Current Card Number: ${serverRenderer_cjs_prodExports.ssrInterpolate(employee.value.cardNumber || "N/A")}</p><p class="password-confirm-message" data-v-2a64f609${_scopeId}>Are you sure you want to register new card?</p><div class="password-confirm-actions" data-v-2a64f609${_scopeId}><button type="button" class="update-proceed-button update-proceed-button--secondary" data-v-2a64f609${_scopeId}> Cancel </button><button type="button" class="update-proceed-button" data-v-2a64f609${_scopeId}> Confirm </button></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "confirm-modal-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close card confirmation",
                  onClick: closeConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ]),
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-back-button",
                  "aria-label": "Back to update options",
                  onClick: goBackFromCardConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(ArrowLeftIcon), { class: "update-modal-back-icon" })
                ]),
                vueExports.createVNode("h3", { class: "update-modal-title" }, "Confirm Card Registration"),
                vueExports.createVNode("p", { class: "password-confirm-message" }, "This employee has a card already."),
                vueExports.createVNode("p", { class: "password-confirm-message" }, "Current Card Number: " + vueExports.toDisplayString(employee.value.cardNumber || "N/A"), 1),
                vueExports.createVNode("p", { class: "password-confirm-message" }, "Are you sure you want to register new card?"),
                vueExports.createVNode("div", { class: "password-confirm-actions" }, [
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button update-proceed-button--secondary",
                    onClick: goBackFromCardConfirmModal
                  }, " Cancel "),
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button",
                    onClick: proceedCardRegistrationFromConfirm
                  }, " Confirm ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showScannerWaitingModal.value,
        "onUpdate:open": ($event) => showScannerWaitingModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false,
        dismissible: false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close scanner waiting" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><div class="spinner" data-v-2a64f609${_scopeId}></div><p class="loading-text" data-v-2a64f609${_scopeId}>Please switch the scanner into register mode.</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "loading-modal-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close scanner waiting",
                  onClick: closeConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ]),
                vueExports.createVNode("div", { class: "spinner" }),
                vueExports.createVNode("p", { class: "loading-text" }, "Please switch the scanner into register mode.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showScannerRegisterModal.value,
        "onUpdate:open": ($event) => showScannerRegisterModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false,
        dismissible: false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="scanner-register-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close scanner register mode" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><div class="scanner-card-icon-wrap" aria-hidden="true" data-v-2a64f609${_scopeId}><div class="scanner-scan-line" data-v-2a64f609${_scopeId}></div><svg class="scanner-card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-2a64f609${_scopeId}><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.7" data-v-2a64f609${_scopeId}></rect><path d="M3 10.5H21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-2a64f609${_scopeId}></path><path d="M7.5 14.5H10.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-2a64f609${_scopeId}></path></svg></div><p class="loading-text" data-v-2a64f609${_scopeId}>Please scan your RFID card.</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "scanner-register-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close scanner register mode",
                  onClick: closeConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ]),
                vueExports.createVNode("div", {
                  class: "scanner-card-icon-wrap",
                  "aria-hidden": "true"
                }, [
                  vueExports.createVNode("div", { class: "scanner-scan-line" }),
                  (vueExports.openBlock(), vueExports.createBlock("svg", {
                    class: "scanner-card-icon",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                  }, [
                    vueExports.createVNode("rect", {
                      x: "3",
                      y: "6",
                      width: "18",
                      height: "12",
                      rx: "2",
                      stroke: "currentColor",
                      "stroke-width": "1.7"
                    }),
                    vueExports.createVNode("path", {
                      d: "M3 10.5H21",
                      stroke: "currentColor",
                      "stroke-width": "1.7",
                      "stroke-linecap": "round"
                    }),
                    vueExports.createVNode("path", {
                      d: "M7.5 14.5H10.5",
                      stroke: "currentColor",
                      "stroke-width": "1.7",
                      "stroke-linecap": "round"
                    })
                  ]))
                ]),
                vueExports.createVNode("p", { class: "loading-text" }, "Please scan your RFID card.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showScannedCardModal.value,
        "onUpdate:open": ($event) => showScannedCardModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="confirm-modal-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close scanned card modal" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><h3 class="update-modal-title" data-v-2a64f609${_scopeId}>Card Scanned</h3><p class="password-confirm-message" data-v-2a64f609${_scopeId}>RFID Number</p><p class="rfid-code" data-v-2a64f609${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(scannedRfidNumber.value || "RFID-000000")}</p><div class="password-confirm-actions" data-v-2a64f609${_scopeId}><button type="button" class="update-proceed-button update-proceed-button--secondary" data-v-2a64f609${_scopeId}> Close </button><button type="button" class="update-proceed-button" data-v-2a64f609${_scopeId}> Confirm </button></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "confirm-modal-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close scanned card modal",
                  onClick: closeConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ]),
                vueExports.createVNode("h3", { class: "update-modal-title" }, "Card Scanned"),
                vueExports.createVNode("p", { class: "password-confirm-message" }, "RFID Number"),
                vueExports.createVNode("p", { class: "rfid-code" }, vueExports.toDisplayString(scannedRfidNumber.value || "RFID-000000"), 1),
                vueExports.createVNode("div", { class: "password-confirm-actions" }, [
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button update-proceed-button--secondary",
                    onClick: closeConfirmModal
                  }, " Close "),
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "update-proceed-button",
                    onClick: confirmCardUpdate
                  }, " Confirm ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showLoadingModal.value,
        "onUpdate:open": ($event) => showLoadingModal.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false,
        dismissible: false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" data-v-2a64f609${_scopeId}><button type="button" class="update-modal-close-button" aria-label="Close loading" data-v-2a64f609${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" }, null, _parent2, _scopeId));
            _push2(`</button><div class="spinner" data-v-2a64f609${_scopeId}></div><p class="loading-text" data-v-2a64f609${_scopeId}>Updating Please wait</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "loading-modal-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "update-modal-close-button",
                  "aria-label": "Close loading",
                  onClick: closeConfirmModal
                }, [
                  vueExports.createVNode(vueExports.unref(XMarkIcon), { class: "update-modal-close-icon" })
                ]),
                vueExports.createVNode("div", { class: "spinner" }),
                vueExports.createVNode("p", { class: "loading-text" }, "Updating Please wait")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="success-alert-wrap" data-v-2a64f609>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: showSuccessAlert.value,
        "onUpdate:visible": ($event) => showSuccessAlert.value = $event,
        title: "Success",
        message: successAlertMessage.value,
        variant: "success",
        dismissible: false
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Employees/employee-info.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EmployeeInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2a64f609"]]);

export { EmployeeInfo as default };
//# sourceMappingURL=employee-info-CY5wDu89.mjs.map
