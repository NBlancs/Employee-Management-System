import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { A as Alert, M as Modal } from './Modal-CvY6WRb2.mjs';
import { I as IconInput } from './IconInput-DYVe1Baj.mjs';
import { B as Button } from './Button-Du_vXkIz.mjs';
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
  __name: "new-employee",
  __ssrInlineRender: true,
  emits: ["back", "employeeCreated"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const userCookie = useCookie("ems_user");
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
    const form = vueExports.ref({
      department: "",
      position: "",
      morningTimeIn: "",
      morningTimeOut: "",
      afternoonTimeIn: "",
      afternoonTimeOut: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      gender: "",
      birthdate: "",
      age: "",
      province: "",
      city: "",
      barangay: "",
      zipCode: "",
      contactNumber: "",
      username: "",
      password: "",
      confirmPassword: ""
    });
    const showConfirmModal = vueExports.ref(false);
    const showLoadingModal = vueExports.ref(false);
    const departments = vueExports.ref([]);
    const workHours = vueExports.ref([]);
    const existingUsernames = vueExports.ref([]);
    const showValidationAlert = vueExports.ref(false);
    const validationAlertMessage = vueExports.ref("");
    let validationAlertTimer = null;
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
    const availablePositions = vueExports.computed(() => {
      const selectedDepartmentId = Number(form.value.department);
      if (!selectedDepartmentId) {
        return [];
      }
      return departments.value.find((department) => department.department_id === selectedDepartmentId)?.positions ?? [];
    });
    const selectedDepartmentOption = vueExports.computed(() => {
      const selectedDepartmentId = Number(form.value.department);
      if (!selectedDepartmentId) {
        return null;
      }
      return departments.value.find((department) => department.department_id === selectedDepartmentId) ?? null;
    });
    const selectedPositionOption = vueExports.computed(() => {
      const selectedPositionId = Number(form.value.position);
      if (!selectedPositionId) {
        return null;
      }
      return availablePositions.value.find((position) => position.position_id === selectedPositionId) ?? null;
    });
    function getBackendErrorMessage(err, fallback) {
      return err?.data?.message || err?.response?._data?.message || err?.message || fallback;
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
    function normalizeUsername(value) {
      return value.trim().toLowerCase();
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
    function isDepartmentHeadPosition(position) {
      const normalizedName = position.position_name.trim().toLowerCase();
      return normalizedName === "department head" || normalizedName.includes("head");
    }
    function isDepartmentHeadPositionDisabled(position) {
      return Boolean(selectedDepartmentOption.value?.department_head) && isDepartmentHeadPosition(position);
    }
    async function resolveWorkHourIds() {
      const morningTimeIn = form.value.morningTimeIn;
      const morningTimeOut = form.value.morningTimeOut;
      const afternoonTimeIn = form.value.afternoonTimeIn;
      const afternoonTimeOut = form.value.afternoonTimeOut;
      if (!morningTimeIn || !morningTimeOut || !afternoonTimeIn || !afternoonTimeOut) {
        throw new Error("Please select all shift times (morning and afternoon)");
      }
      const morningWorkHour = getWorkHourForShift(morningTimeIn, morningTimeOut);
      let morningWorkHourId = morningWorkHour?.work_hour_id;
      if (!morningWorkHourId) {
        if (!transactedById.value) {
          throw new Error("You must be signed in to create a work hour");
        }
        const createdMorning = await $fetch("/api/work-hours", {
          method: "POST",
          body: {
            transacted_by: transactedById.value,
            time_in: morningTimeIn,
            time_out: morningTimeOut
          }
        });
        const morningPayload = createdMorning?.data ?? createdMorning;
        morningWorkHourId = morningPayload?.work_hour_id;
        if (!morningWorkHourId) {
          throw new Error("Unable to create morning work hour");
        }
        workHours.value = [...workHours.value, morningPayload];
      }
      const afternoonWorkHour = getWorkHourForShift(afternoonTimeIn, afternoonTimeOut);
      let afternoonWorkHourId = afternoonWorkHour?.work_hour_id;
      if (!afternoonWorkHourId) {
        if (!transactedById.value) {
          throw new Error("You must be signed in to create a work hour");
        }
        const createdAfternoon = await $fetch("/api/work-hours", {
          method: "POST",
          body: {
            transacted_by: transactedById.value,
            time_in: afternoonTimeIn,
            time_out: afternoonTimeOut
          }
        });
        const afternoonPayload = createdAfternoon?.data ?? createdAfternoon;
        afternoonWorkHourId = afternoonPayload?.work_hour_id;
        if (!afternoonWorkHourId) {
          throw new Error("Unable to create afternoon work hour");
        }
        workHours.value = [...workHours.value, afternoonPayload];
      }
      return { morningWorkHourId, afternoonWorkHourId };
    }
    function validateBasicFields() {
      const ageValue = String(form.value.age).trim();
      const contactNumberValue = form.value.contactNumber.trim();
      const zipCodeValue = form.value.zipCode.trim();
      if (!/^\d+$/.test(ageValue)) {
        showErrorAlert("Age must be a valid number");
        return false;
      }
      if (!/^\d{11}$/.test(contactNumberValue)) {
        showErrorAlert("Contact number must be exactly 11 digits");
        return false;
      }
      if (!/^\d{4}$/.test(zipCodeValue)) {
        showErrorAlert("Zip code must be exactly 4 digits");
        return false;
      }
      if (form.value.password !== form.value.confirmPassword) {
        showErrorAlert("Passwords do not match");
        return false;
      }
      if (selectedPositionOption.value && isDepartmentHeadPositionDisabled(selectedPositionOption.value)) {
        showErrorAlert("This department already has a department head assigned");
        return false;
      }
      return true;
    }
    async function confirmSubmit() {
      if (!validateBasicFields()) {
        showConfirmModal.value = false;
        return;
      }
      if (!selectedDepartmentOption.value || !selectedPositionOption.value) {
        showErrorAlert("Please select a valid department and position");
        showConfirmModal.value = false;
        return;
      }
      if (!transactedById.value) {
        showErrorAlert("You must be signed in to create an employee");
        showConfirmModal.value = false;
        return;
      }
      showConfirmModal.value = false;
      showLoadingModal.value = true;
      try {
        const { morningWorkHourId, afternoonWorkHourId } = await resolveWorkHourIds();
        const createdEmployeeResponse = await $fetch("/api/employees", {
          method: "POST",
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
            password: form.value.password
          }
        });
        const payload = createdEmployeeResponse?.data ?? createdEmployeeResponse;
        const createdId = payload?.employee_id ?? payload?.id ?? 0;
        const middleInitial = form.value.middleName ? ` ${form.value.middleName.charAt(0)}.` : "";
        const fullName = `${form.value.lastName}, ${form.value.firstName}${middleInitial}`;
        emit("employeeCreated", {
          id: createdId,
          name: fullName,
          department: selectedDepartmentOption.value.department_name,
          cardStatus: "No Card",
          cardNumber: payload?.cards?.card_number ?? ""
        });
        existingUsernames.value = [...existingUsernames.value, normalizeUsername(form.value.username)];
        showLoadingModal.value = false;
        emit("back");
      } catch (err) {
        showLoadingModal.value = false;
        showErrorAlert(getBackendErrorMessage(err, "Failed to create employee"));
      }
    }
    vueExports.watch(() => form.value.department, () => {
      form.value.position = "";
    });
    vueExports.watch(() => form.value.morningTimeIn, () => {
      form.value.morningTimeOut = getTimeOutForTimeIn(form.value.morningTimeIn);
    });
    vueExports.watch(() => form.value.afternoonTimeIn, () => {
      form.value.afternoonTimeOut = getTimeOutForTimeIn(form.value.afternoonTimeIn);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "new-employee-page" }, _attrs))} data-v-da33c21d>`);
      if (showValidationAlert.value) {
        _push(`<div class="validation-alert-wrap" data-v-da33c21d>`);
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
      _push(`<div class="new-employee-header" data-v-da33c21d><button type="button" class="back-button" aria-label="Back" data-v-da33c21d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "back-icon" }, null, _parent));
      _push(`</button><div class="header-content" data-v-da33c21d><h1 class="new-employee-title" data-v-da33c21d>Create New Employee</h1></div></div><form class="new-employee-form" novalidate data-v-da33c21d><div class="form-card" data-v-da33c21d><div class="form-section" data-v-da33c21d><h2 class="section-title" data-v-da33c21d>Job Information</h2><div class="new-employee-grid" data-v-da33c21d><div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="department" data-v-da33c21d>Department <span class="required-indicator" data-v-da33c21d>*</span></label><select id="department" class="select-field" aria-label="Department" required data-v-da33c21d><option value="" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.department) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.department, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.department, "")) ? " selected" : ""}>Select department</option><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(departments.value, (department) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", String(department.department_id))} data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.department) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.department, String(department.department_id)) : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.department, String(department.department_id))) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(department.department_name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="position" data-v-da33c21d>Position <span class="required-indicator" data-v-da33c21d>*</span></label><select id="position" class="select-field" aria-label="Position" required data-v-da33c21d><option value="" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.position) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.position, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.position, "")) ? " selected" : ""}>Select position</option><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(availablePositions.value, (position) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", String(position.position_id))}${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(isDepartmentHeadPositionDisabled(position)) ? " disabled" : ""} data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.position) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.position, String(position.position_id)) : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.position, String(position.position_id))) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(position.position_name)}${serverRenderer_cjs_prodExports.ssrInterpolate(isDepartmentHeadPositionDisabled(position) ? " (Assigned)" : "")}</option>`);
      });
      _push(`<!--]--></select></div></div><h3 class="subsection-title" data-v-da33c21d>Shift Time</h3><div class="shift-container" data-v-da33c21d><div class="shift-section" data-v-da33c21d><h4 class="shift-title" data-v-da33c21d>Morning Shift</h4><div class="shift-grid" data-v-da33c21d><div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="morningTimeIn" data-v-da33c21d>Time In <span class="required-indicator" data-v-da33c21d>*</span></label><select id="morningTimeIn" class="select-field" aria-label="Morning Time In" required data-v-da33c21d><option value="" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.morningTimeIn) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.morningTimeIn, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.morningTimeIn, "")) ? " selected" : ""}>Select time in</option><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(availableMorningShiftTimes.value, (time) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", time)} data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.morningTimeIn) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.morningTimeIn, time) : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.morningTimeIn, time)) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(time)}</option>`);
      });
      _push(`<!--]--></select></div><div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="morningTimeOut" data-v-da33c21d>Time Out <span class="required-indicator" data-v-da33c21d>*</span></label><input id="morningTimeOut"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", form.value.morningTimeOut)} type="text" class="input-field" aria-label="Morning Time Out" readonly data-v-da33c21d></div></div></div><div class="shift-section" data-v-da33c21d><h4 class="shift-title" data-v-da33c21d>Afternoon Shift</h4><div class="shift-grid" data-v-da33c21d><div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="afternoonTimeIn" data-v-da33c21d>Time In <span class="required-indicator" data-v-da33c21d>*</span></label><select id="afternoonTimeIn" class="select-field" aria-label="Afternoon Time In" required data-v-da33c21d><option value="" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.afternoonTimeIn) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.afternoonTimeIn, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.afternoonTimeIn, "")) ? " selected" : ""}>Select time in</option><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(availableAfternoonShiftTimes.value, (time) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", time)} data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.afternoonTimeIn) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.afternoonTimeIn, time) : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.afternoonTimeIn, time)) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(time)}</option>`);
      });
      _push(`<!--]--></select></div><div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="afternoonTimeOut" data-v-da33c21d>Time Out <span class="required-indicator" data-v-da33c21d>*</span></label><input id="afternoonTimeOut"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", form.value.afternoonTimeOut)} type="text" class="input-field" aria-label="Afternoon Time Out" readonly data-v-da33c21d></div></div></div></div></div><div class="form-divider" data-v-da33c21d></div><div class="form-section" data-v-da33c21d><h2 class="section-title" data-v-da33c21d>Personal Information</h2><div class="new-employee-grid" data-v-da33c21d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.firstName,
        "onUpdate:modelValue": ($event) => form.value.firstName = $event,
        label: "First Name",
        placeholder: "Enter first name",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.middleName,
        "onUpdate:modelValue": ($event) => form.value.middleName = $event,
        label: "Middle Name",
        placeholder: "Enter middle name",
        size: "sm"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.lastName,
        "onUpdate:modelValue": ($event) => form.value.lastName = $event,
        label: "Last Name",
        placeholder: "Enter last name",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(`<div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="suffix" data-v-da33c21d>Suffix</label><select id="suffix" class="select-field" aria-label="Suffix" data-v-da33c21d><option value="" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.suffix) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.suffix, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.suffix, "")) ? " selected" : ""}>Select suffix</option><option value="Jr." data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.suffix) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.suffix, "Jr.") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.suffix, "Jr.")) ? " selected" : ""}>Jr.</option><option value="Sr." data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.suffix) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.suffix, "Sr.") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.suffix, "Sr.")) ? " selected" : ""}>Sr.</option><option value="II" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.suffix) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.suffix, "II") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.suffix, "II")) ? " selected" : ""}>II</option><option value="III" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.suffix) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.suffix, "III") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.suffix, "III")) ? " selected" : ""}>III</option><option value="IV" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.suffix) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.suffix, "IV") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.suffix, "IV")) ? " selected" : ""}>IV</option></select></div></div></div><div class="form-divider" data-v-da33c21d></div><div class="form-section" data-v-da33c21d><div class="new-employee-grid" data-v-da33c21d><div class="select-field-wrap" data-v-da33c21d><label class="select-field-label" for="gender" data-v-da33c21d>Gender <span class="required-indicator" data-v-da33c21d>*</span></label><select id="gender" class="select-field" aria-label="Gender" required data-v-da33c21d><option value="" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.gender) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.gender, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.gender, "")) ? " selected" : ""}>Select gender</option><option value="Male" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.gender) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.gender, "Male") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.gender, "Male")) ? " selected" : ""}>Male</option><option value="Female" data-v-da33c21d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(form.value.gender) ? serverRenderer_cjs_prodExports.ssrLooseContain(form.value.gender, "Female") : serverRenderer_cjs_prodExports.ssrLooseEqual(form.value.gender, "Female")) ? " selected" : ""}>Female</option></select></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.birthdate,
        "onUpdate:modelValue": ($event) => form.value.birthdate = $event,
        label: "Birthdate",
        type: "date",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(`<div class="age-input-wrapper" data-v-da33c21d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.age,
        "onUpdate:modelValue": ($event) => form.value.age = $event,
        label: "Age",
        type: "number",
        placeholder: "Enter age",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(`</div></div></div><div class="form-divider" data-v-da33c21d></div><div class="form-section" data-v-da33c21d><h2 class="section-title" data-v-da33c21d>Address Information</h2><div class="new-employee-grid" data-v-da33c21d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.province,
        "onUpdate:modelValue": ($event) => form.value.province = $event,
        label: "Province",
        placeholder: "Enter province",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.city,
        "onUpdate:modelValue": ($event) => form.value.city = $event,
        label: "City",
        placeholder: "Enter city",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.barangay,
        "onUpdate:modelValue": ($event) => form.value.barangay = $event,
        label: "Barangay",
        placeholder: "Enter barangay",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.zipCode,
        "onUpdate:modelValue": ($event) => form.value.zipCode = $event,
        label: "Zip Code",
        placeholder: "Enter zip code",
        size: "sm",
        required: "",
        inputmode: "numeric",
        maxlength: "4",
        pattern: "[0-9]{4}"
      }, null, _parent));
      _push(`</div></div><div class="form-divider" data-v-da33c21d></div><div class="form-section" data-v-da33c21d><h2 class="section-title" data-v-da33c21d>Contact Details</h2><div class="new-employee-grid" data-v-da33c21d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.contactNumber,
        "onUpdate:modelValue": ($event) => form.value.contactNumber = $event,
        label: "Contact Number",
        type: "tel",
        placeholder: "Enter contact number",
        size: "sm",
        required: "",
        inputmode: "numeric",
        maxlength: "11",
        pattern: "[0-9]{11}"
      }, null, _parent));
      _push(`</div></div><div class="form-divider" data-v-da33c21d></div><div class="form-section" data-v-da33c21d><h2 class="section-title" data-v-da33c21d>Account Information</h2><div class="account-info-container" data-v-da33c21d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.username,
        "onUpdate:modelValue": ($event) => form.value.username = $event,
        label: "Username",
        placeholder: "Enter username",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.password,
        "onUpdate:modelValue": ($event) => form.value.password = $event,
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: form.value.confirmPassword,
        "onUpdate:modelValue": ($event) => form.value.confirmPassword = $event,
        label: "Re-enter Password",
        type: "password",
        placeholder: "Re-enter password",
        size: "sm",
        required: ""
      }, null, _parent));
      _push(`</div></div></div><div class="form-footer" data-v-da33c21d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
        label: "Proceed",
        variant: "solid",
        type: "submit",
        class: "submit-button"
      }, null, _parent));
      _push(`</div></form>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: showConfirmModal.value,
        "onUpdate:open": ($event) => showConfirmModal.value = $event,
        title: "Confirm Employee Creation",
        description: "Please review the information and confirm to create the new employee.",
        confirmLabel: "Create Employee",
        cancelLabel: "Cancel",
        showFooter: true,
        hideTrigger: true,
        onConfirm: confirmSubmit,
        onCancel: ($event) => showConfirmModal.value = false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="confirmation-content" data-v-da33c21d${_scopeId}><div class="confirmation-section" data-v-da33c21d${_scopeId}><h4 class="section-header" data-v-da33c21d${_scopeId}>Job Information</h4><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Department:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedDepartmentOption.value?.department_name || "Not selected")}</p><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Position:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedPositionOption.value?.position_name || "Not selected")}</p></div><div class="confirmation-section" data-v-da33c21d${_scopeId}><h4 class="section-header" data-v-da33c21d${_scopeId}>Morning Shift</h4><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Time In:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.morningTimeIn || "Not selected")}</p><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Time Out:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.morningTimeOut || "Not selected")}</p></div><div class="confirmation-section" data-v-da33c21d${_scopeId}><h4 class="section-header" data-v-da33c21d${_scopeId}>Afternoon Shift</h4><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Time In:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.afternoonTimeIn || "Not selected")}</p><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Time Out:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.afternoonTimeOut || "Not selected")}</p></div><div class="confirmation-section" data-v-da33c21d${_scopeId}><h4 class="section-header" data-v-da33c21d${_scopeId}>Personal Information</h4><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Name:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate([form.value.firstName, form.value.middleName, form.value.lastName, form.value.suffix].filter(Boolean).join(" ") || "Not provided")}</p><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Gender:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.gender || "Not selected")}</p><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Birthdate:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.birthdate || "Not provided")}</p></div><div class="confirmation-section" data-v-da33c21d${_scopeId}><h4 class="section-header" data-v-da33c21d${_scopeId}>Address Information</h4><p data-v-da33c21d${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate([form.value.barangay, form.value.city, form.value.province, form.value.zipCode].filter(Boolean).join(", ") || "Not provided")}</p></div><div class="confirmation-section" data-v-da33c21d${_scopeId}><h4 class="section-header" data-v-da33c21d${_scopeId}>Contact Information</h4><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Contact Number:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.contactNumber || "Not provided")}</p></div><div class="confirmation-section" data-v-da33c21d${_scopeId}><h4 class="section-header" data-v-da33c21d${_scopeId}>Account Information</h4><p data-v-da33c21d${_scopeId}><strong data-v-da33c21d${_scopeId}>Username:</strong> ${serverRenderer_cjs_prodExports.ssrInterpolate(form.value.username || "Not provided")}</p></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "confirmation-content" }, [
                vueExports.createVNode("div", { class: "confirmation-section" }, [
                  vueExports.createVNode("h4", { class: "section-header" }, "Job Information"),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Department:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedDepartmentOption.value?.department_name || "Not selected"), 1)
                  ]),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Position:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(selectedPositionOption.value?.position_name || "Not selected"), 1)
                  ])
                ]),
                vueExports.createVNode("div", { class: "confirmation-section" }, [
                  vueExports.createVNode("h4", { class: "section-header" }, "Morning Shift"),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Time In:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.morningTimeIn || "Not selected"), 1)
                  ]),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Time Out:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.morningTimeOut || "Not selected"), 1)
                  ])
                ]),
                vueExports.createVNode("div", { class: "confirmation-section" }, [
                  vueExports.createVNode("h4", { class: "section-header" }, "Afternoon Shift"),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Time In:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.afternoonTimeIn || "Not selected"), 1)
                  ]),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Time Out:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.afternoonTimeOut || "Not selected"), 1)
                  ])
                ]),
                vueExports.createVNode("div", { class: "confirmation-section" }, [
                  vueExports.createVNode("h4", { class: "section-header" }, "Personal Information"),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Name:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString([form.value.firstName, form.value.middleName, form.value.lastName, form.value.suffix].filter(Boolean).join(" ") || "Not provided"), 1)
                  ]),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Gender:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.gender || "Not selected"), 1)
                  ]),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Birthdate:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.birthdate || "Not provided"), 1)
                  ])
                ]),
                vueExports.createVNode("div", { class: "confirmation-section" }, [
                  vueExports.createVNode("h4", { class: "section-header" }, "Address Information"),
                  vueExports.createVNode("p", null, vueExports.toDisplayString([form.value.barangay, form.value.city, form.value.province, form.value.zipCode].filter(Boolean).join(", ") || "Not provided"), 1)
                ]),
                vueExports.createVNode("div", { class: "confirmation-section" }, [
                  vueExports.createVNode("h4", { class: "section-header" }, "Contact Information"),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Contact Number:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.contactNumber || "Not provided"), 1)
                  ])
                ]),
                vueExports.createVNode("div", { class: "confirmation-section" }, [
                  vueExports.createVNode("h4", { class: "section-header" }, "Account Information"),
                  vueExports.createVNode("p", null, [
                    vueExports.createVNode("strong", null, "Username:"),
                    vueExports.createTextVNode(" " + vueExports.toDisplayString(form.value.username || "Not provided"), 1)
                  ])
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
        dismissible: false,
        hideTrigger: true
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" data-v-da33c21d${_scopeId}><div class="spinner" data-v-da33c21d${_scopeId}></div><p class="loading-text" data-v-da33c21d${_scopeId}>Creating new employee</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "loading-modal-content" }, [
                vueExports.createVNode("div", { class: "spinner" }),
                vueExports.createVNode("p", { class: "loading-text" }, "Creating new employee")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Employees/new-employee.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const NewEmployee = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-da33c21d"]]);

export { NewEmployee as default };
//# sourceMappingURL=new-employee-BFtUAvfS.mjs.map
