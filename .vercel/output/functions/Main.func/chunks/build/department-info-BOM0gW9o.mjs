import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { ArrowLeftIcon, UserGroupIcon, BriefcaseIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { O as OverviewCard } from './OverviewCard-B3my34HI.mjs';
import { I as IconInput } from './IconInput-DYVe1Baj.mjs';
import { B as Button } from './Button-Du_vXkIz.mjs';
import { T as Table } from './Table-DpzCIhLT.mjs';
import { A as Alert, M as Modal } from './Modal-gsHbAz6A.mjs';
import { I as Input } from './Input-VFrQiZfx.mjs';
import { C as CheckBox } from './CheckBox-DdsHZ8M1.mjs';
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
  __name: "department-info",
  __ssrInlineRender: true,
  props: {
    department: {}
  },
  emits: ["back"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const selectedDepartment = useState("selected-department-info", () => null);
    const userCookie = useCookie("ems_user");
    const loadedDepartment = vueExports.ref(null);
    const activeDepartment = vueExports.computed(() => loadedDepartment.value ?? props.department ?? selectedDepartment.value);
    const isDepartmentLoading = vueExports.ref(false);
    const searchQuery = vueExports.ref("");
    const isUpdateSalaryModalOpen = vueExports.ref(false);
    const selectedUpdatePosition = vueExports.ref("");
    const selectedUpdatePositionId = vueExports.ref(null);
    const selectedCurrentSalaryId = vueExports.ref(null);
    const selectedCurrentSalary = vueExports.ref("");
    const isUpdateSalaryLoadingModalOpen = vueExports.ref(false);
    const isSalaryUpdatedAlertVisible = vueExports.ref(false);
    const isUpdateNewSalaryOptionChecked = vueExports.ref(false);
    const isUpdateCurrentSalaryOptionChecked = vueExports.ref(false);
    const updateNewSalaryAmount = vueExports.ref("");
    const selectedUpdateExistingSalary = vueExports.ref("");
    const backendSalaries = vueExports.ref([]);
    const hasUpdateSalaryOptionError = vueExports.ref(false);
    const hasUpdateNewSalaryAmountError = vueExports.ref(false);
    const hasUpdateNewSalaryAmountFormatError = vueExports.ref(false);
    const hasUpdateNewSalaryDuplicateError = vueExports.ref(false);
    const hasUpdateExistingSalaryError = vueExports.ref(false);
    const hasUpdateExistingSalaryDuplicateError = vueExports.ref(false);
    const isAddPositionModalOpen = vueExports.ref(false);
    const isConfirmAddPositionModalOpen = vueExports.ref(false);
    const isAddPositionLoadingModalOpen = vueExports.ref(false);
    const newPositionName = vueExports.ref("");
    const isNewSalaryOptionChecked = vueExports.ref(false);
    const isCurrentSalaryOptionChecked = vueExports.ref(false);
    const addNewSalaryAmount = vueExports.ref("");
    const selectedCurrentSalaryForAdd = vueExports.ref("");
    const hasPositionNameError = vueExports.ref(false);
    const isDuplicatePositionNameError = vueExports.ref(false);
    const hasSalaryOptionError = vueExports.ref(false);
    const hasAddNewSalaryAmountError = vueExports.ref(false);
    const hasAddNewSalaryAmountFormatError = vueExports.ref(false);
    const hasAddNewSalaryDuplicateError = vueExports.ref(false);
    const hasAddCurrentSalaryError = vueExports.ref(false);
    const isPositionAddedAlertVisible = vueExports.ref(false);
    const isPositionDeletedAlertVisible = vueExports.ref(false);
    const selectedDeletePosition = vueExports.ref("");
    const selectedDeletePositionId = vueExports.ref(null);
    const isDeletePositionModalOpen = vueExports.ref(false);
    const isDeletePositionLoadingModalOpen = vueExports.ref(false);
    const backendPositions = vueExports.ref([]);
    const isErrorAlertVisible = vueExports.ref(false);
    const errorAlertMessage = vueExports.ref("");
    const errorAlertTitle = vueExports.ref("Error");
    let errorAlertTimer = null;
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
    let successAlertTimer = null;
    const positionRows = vueExports.ref([]);
    const positionTableColumns = [
      { accessorKey: "position", header: "Position" },
      { accessorKey: "salary", header: "Salary" },
      { accessorKey: "totalEmployees", header: "Total Employees" },
      { id: "action", header: "Action" }
    ];
    const filteredPositionRows = vueExports.computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) {
        return positionRows.value;
      }
      return positionRows.value.filter((row) => row.position.toLowerCase().includes(query));
    });
    vueExports.computed(() => {
      return [...new Set(positionRows.value.map((row) => row.salary))];
    });
    const addSalaryOptions = vueExports.computed(() => {
      const departmentId = activeDepartment.value?.id;
      if (!departmentId) {
        return [];
      }
      const salaryMap = /* @__PURE__ */ new Map();
      backendPositions.value.filter((position) => {
        const positionDepartmentId = position.department_id ?? position.departments?.department_id;
        return positionDepartmentId === departmentId;
      }).forEach((position) => {
        const salaryId = position.salaries?.salary_id;
        const amount = position.salaries?.amount;
        if (!salaryId || amount === void 0 || amount === null || amount === "") {
          return;
        }
        salaryMap.set(salaryId, {
          salary_id: salaryId,
          amount: formatSalaryAmount(amount)
        });
      });
      return [...salaryMap.values()];
    });
    const totalEmployeesDisplay = vueExports.computed(() => {
      if (isDepartmentLoading.value) {
        return "...";
      }
      if (!activeDepartment.value) {
        return "-";
      }
      return String(positionRows.value.reduce((total, row) => total + row.totalEmployees, 0));
    });
    const totalPositionsDisplay = vueExports.computed(() => {
      if (isDepartmentLoading.value) {
        return "...";
      }
      if (!activeDepartment.value) {
        return "-";
      }
      return String(positionRows.value.length);
    });
    function formatSalaryAmount(amount) {
      if (amount === void 0 || amount === null || amount === "") {
        return "-";
      }
      const numericAmount = typeof amount === "number" ? amount : Number(amount);
      if (Number.isNaN(numericAmount)) {
        return String(amount);
      }
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(numericAmount);
    }
    function getBackendErrorMessage(error, fallbackMessage) {
      const anyErr = error;
      let msg = void 0;
      if (anyErr?.data?.message) msg = anyErr.data.message;
      else if (anyErr?.data) msg = anyErr.data;
      else if (anyErr?.response?.data?.message) msg = anyErr.response.data.message;
      else if (anyErr instanceof Error && anyErr.message) msg = anyErr.message;
      else if (typeof anyErr === "string") msg = anyErr;
      if (Array.isArray(msg)) return msg.join(", ");
      if (typeof msg === "object" && msg !== null) {
        try {
          return JSON.stringify(msg);
        } catch {
          return fallbackMessage;
        }
      }
      if (typeof msg === "string") {
        const lines = msg.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        const candidate = lines.find((l) => /already exists|not found|required|failed/i.test(l));
        if (candidate) return candidate;
        return msg;
      }
      return fallbackMessage;
    }
    function showErrorAlert(message, title = "Error") {
      errorAlertTitle.value = title;
      errorAlertMessage.value = message;
      isErrorAlertVisible.value = true;
      if (errorAlertTimer) {
        clearTimeout(errorAlertTimer);
      }
      errorAlertTimer = setTimeout(() => {
        isErrorAlertVisible.value = false;
      }, 3e3);
    }
    function mapBackendPosition(position) {
      return {
        positionId: position.position_id,
        position: position.position_name,
        salaryId: position.salaries?.salary_id ?? null,
        salary: formatSalaryAmount(position.salaries?.amount),
        totalEmployees: position.employees?.length ?? 0
      };
    }
    async function loadBackendSalaries() {
      try {
        const salariesResp = await $fetch("/api/salaries");
        const salariesPayload = salariesResp?.data ?? salariesResp;
        backendSalaries.value = Array.isArray(salariesPayload) ? salariesPayload.map((salary) => ({
          salary_id: salary.salary_id,
          amount: String(salary.amount)
        })) : [];
      } catch {
        backendSalaries.value = [];
      }
    }
    async function loadDepartmentDetails() {
      const departmentId = activeDepartment.value?.id;
      if (!departmentId) {
        loadedDepartment.value = null;
        positionRows.value = [];
        return;
      }
      isDepartmentLoading.value = true;
      try {
        const [departmentResp, positionsResp] = await Promise.all([
          $fetch(`/api/departments/${departmentId}`),
          $fetch("/api/positions")
        ]);
        const departmentPayload = departmentResp?.data ?? departmentResp;
        const positionsPayload = positionsResp?.data ?? positionsResp;
        if (departmentPayload?.department_name) {
          loadedDepartment.value = {
            id: departmentId,
            name: departmentPayload.department_name,
            head: activeDepartment.value?.head || "-"
          };
        }
        if (Array.isArray(positionsPayload)) {
          backendPositions.value = positionsPayload;
          positionRows.value = positionsPayload.filter((position) => {
            const positionDepartmentId = position.department_id ?? position.departments?.department_id;
            return positionDepartmentId === departmentId;
          }).map(mapBackendPosition);
        } else {
          backendPositions.value = [];
          positionRows.value = [];
        }
      } catch (err) {
        backendPositions.value = [];
        positionRows.value = [];
      } finally {
        isDepartmentLoading.value = false;
      }
    }
    function onUpdate(positionId) {
      const numericPositionId = Number(positionId);
      const positionToUpdate = positionRows.value.find((row) => row.positionId === numericPositionId);
      if (!positionToUpdate) {
        return;
      }
      selectedUpdatePositionId.value = numericPositionId;
      selectedUpdatePosition.value = positionToUpdate.position;
      selectedCurrentSalaryId.value = positionToUpdate.salaryId;
      selectedCurrentSalary.value = positionToUpdate.salary;
      isUpdateNewSalaryOptionChecked.value = false;
      isUpdateCurrentSalaryOptionChecked.value = false;
      updateNewSalaryAmount.value = "";
      selectedUpdateExistingSalary.value = "";
      hasUpdateSalaryOptionError.value = false;
      hasUpdateNewSalaryAmountError.value = false;
      hasUpdateNewSalaryAmountFormatError.value = false;
      hasUpdateNewSalaryDuplicateError.value = false;
      hasUpdateExistingSalaryError.value = false;
      hasUpdateExistingSalaryDuplicateError.value = false;
      isUpdateSalaryModalOpen.value = true;
      void loadBackendSalaries();
    }
    function onDelete(positionId, position) {
      const numericPositionId = Number(positionId);
      if (!Number.isFinite(numericPositionId) || numericPositionId <= 0) {
        showErrorAlert("Invalid position selected for deletion.");
        return;
      }
      selectedDeletePositionId.value = numericPositionId;
      selectedDeletePosition.value = position;
      isDeletePositionModalOpen.value = true;
    }
    function closeDeletePositionModal() {
      isDeletePositionModalOpen.value = false;
    }
    function deletePosition() {
      if (selectedDeletePositionId.value === null) {
        showErrorAlert("Invalid position ID for deletion.");
        return;
      }
      isDeletePositionModalOpen.value = false;
      isDeletePositionLoadingModalOpen.value = true;
      setTimeout(async () => {
        try {
          if (!transactedById.value) throw new Error("Not signed in");
          await $fetch(
            `/api/positions/${selectedDeletePositionId.value}?transacted_by=${transactedById.value}`,
            {
              method: "DELETE",
              body: {
                transacted_by: transactedById.value
              }
            }
          );
          await loadDepartmentDetails();
          isPositionDeletedAlertVisible.value = true;
          if (successAlertTimer) {
            clearTimeout(successAlertTimer);
          }
          successAlertTimer = setTimeout(() => {
            isPositionDeletedAlertVisible.value = false;
          }, 2600);
        } catch (err) {
          showErrorAlert(getBackendErrorMessage(err, "Failed to delete position"));
        } finally {
          isDeletePositionLoadingModalOpen.value = false;
          selectedDeletePositionId.value = null;
        }
      }, 1200);
    }
    function closeUpdateSalaryModal() {
      isUpdateSalaryModalOpen.value = false;
    }
    function onUpdateNewSalaryOptionChange(isChecked) {
      isUpdateNewSalaryOptionChecked.value = isChecked;
      if (isChecked) {
        isUpdateCurrentSalaryOptionChecked.value = false;
        selectedUpdateExistingSalary.value = "";
        hasUpdateSalaryOptionError.value = false;
        hasUpdateExistingSalaryError.value = false;
      } else {
        hasUpdateNewSalaryAmountFormatError.value = false;
      }
    }
    function onUpdateCurrentSalaryOptionChange(isChecked) {
      isUpdateCurrentSalaryOptionChecked.value = isChecked;
      if (isChecked) {
        isUpdateNewSalaryOptionChecked.value = false;
        updateNewSalaryAmount.value = "";
        hasUpdateSalaryOptionError.value = false;
        hasUpdateNewSalaryAmountError.value = false;
        hasUpdateNewSalaryAmountFormatError.value = false;
      }
    }
    function isSalaryAmountNumeric(value) {
      const normalizedValue = value.trim().replaceAll(",", "");
      return /^\d+(\.\d+)?$/.test(normalizedValue);
    }
    async function saveUpdatedSalary() {
      hasUpdateSalaryOptionError.value = !isUpdateNewSalaryOptionChecked.value && !isUpdateCurrentSalaryOptionChecked.value;
      hasUpdateNewSalaryAmountError.value = isUpdateNewSalaryOptionChecked.value && !updateNewSalaryAmount.value.trim();
      hasUpdateNewSalaryAmountFormatError.value = isUpdateNewSalaryOptionChecked.value && Boolean(updateNewSalaryAmount.value.trim()) && !isSalaryAmountNumeric(updateNewSalaryAmount.value);
      hasUpdateExistingSalaryError.value = isUpdateCurrentSalaryOptionChecked.value && !selectedUpdateExistingSalary.value;
      hasUpdateNewSalaryDuplicateError.value = isUpdateNewSalaryOptionChecked.value && Boolean(updateNewSalaryAmount.value.trim()) && updateNewSalaryAmount.value.trim().replaceAll(",", "") === selectedCurrentSalary.value.trim().replaceAll(",", "");
      hasUpdateExistingSalaryDuplicateError.value = isUpdateCurrentSalaryOptionChecked.value && Boolean(selectedUpdateExistingSalary.value) && Number(selectedUpdateExistingSalary.value) === selectedCurrentSalaryId.value;
      if (hasUpdateSalaryOptionError.value || hasUpdateNewSalaryAmountError.value || hasUpdateNewSalaryAmountFormatError.value || hasUpdateNewSalaryDuplicateError.value || hasUpdateExistingSalaryError.value || hasUpdateExistingSalaryDuplicateError.value) {
        return;
      }
      const positionId = selectedUpdatePositionId.value;
      if (!positionId) {
        showErrorAlert("Missing position ID.");
        return;
      }
      closeUpdateSalaryModal();
      isUpdateSalaryLoadingModalOpen.value = true;
      try {
        const transactedBy = transactedById.value;
        if (!transactedBy) throw new Error("Not authenticated");
        let salaryId;
        if (isUpdateNewSalaryOptionChecked.value) {
          const salaryAmount = updateNewSalaryAmount.value.trim().replaceAll(",", "");
          const res = await $fetch("/api/salaries", {
            method: "POST",
            body: {
              amount: salaryAmount,
              transacted_by: transactedBy
            }
          });
          salaryId = res?.data?.salary_id ?? res?.salary_id;
        } else {
          salaryId = Number(selectedUpdateExistingSalary.value);
        }
        await $fetch(`/api/positions/${positionId}`, {
          method: "PUT",
          body: {
            salary_id: salaryId,
            transacted_by: transactedBy
          }
        });
        await loadDepartmentDetails();
        isSalaryUpdatedAlertVisible.value = true;
        setTimeout(() => isSalaryUpdatedAlertVisible.value = false, 2600);
      } catch (err) {
        showErrorAlert(getBackendErrorMessage(err, "Failed to update salary."));
      } finally {
        isUpdateSalaryLoadingModalOpen.value = false;
      }
    }
    function closeAddPositionModal() {
      isAddPositionModalOpen.value = false;
    }
    function requestAddPositionConfirmation() {
      const normalizedAddSalaryAmount = addNewSalaryAmount.value.trim();
      const normalizedPositionName = newPositionName.value.trim();
      const departmentId = activeDepartment.value?.id;
      if (!normalizedPositionName) {
        hasPositionNameError.value = true;
        isDuplicatePositionNameError.value = false;
        return;
      }
      const positionAlreadyExists = backendPositions.value.some((position) => {
        const positionDepartmentId = position.department_id ?? position.departments?.department_id;
        return positionDepartmentId === departmentId && position.position_name.trim().toLowerCase() === normalizedPositionName.toLowerCase();
      });
      if (positionAlreadyExists) {
        hasPositionNameError.value = false;
        isDuplicatePositionNameError.value = true;
        return;
      }
      hasSalaryOptionError.value = !isNewSalaryOptionChecked.value && !isCurrentSalaryOptionChecked.value;
      hasAddNewSalaryAmountError.value = isNewSalaryOptionChecked.value && !normalizedAddSalaryAmount;
      hasAddNewSalaryAmountFormatError.value = isNewSalaryOptionChecked.value && Boolean(normalizedAddSalaryAmount) && !isSalaryAmountNumeric(normalizedAddSalaryAmount);
      hasAddNewSalaryDuplicateError.value = isNewSalaryOptionChecked.value && Boolean(normalizedAddSalaryAmount) && addSalaryOptions.value.some(
        (option) => option.amount === formatSalaryAmount(normalizedAddSalaryAmount)
      );
      hasAddCurrentSalaryError.value = isCurrentSalaryOptionChecked.value && !selectedCurrentSalaryForAdd.value;
      if (hasSalaryOptionError.value || hasAddNewSalaryAmountError.value || hasAddNewSalaryAmountFormatError.value || hasAddNewSalaryDuplicateError.value || hasAddCurrentSalaryError.value) {
        return;
      }
      hasPositionNameError.value = false;
      isDuplicatePositionNameError.value = false;
      isConfirmAddPositionModalOpen.value = true;
    }
    function onAddNewSalaryOptionChange(isChecked) {
      isNewSalaryOptionChecked.value = isChecked;
      if (isChecked) {
        isCurrentSalaryOptionChecked.value = false;
        selectedCurrentSalaryForAdd.value = "";
        hasSalaryOptionError.value = false;
        hasAddCurrentSalaryError.value = false;
      } else {
        hasAddNewSalaryAmountFormatError.value = false;
        hasAddNewSalaryDuplicateError.value = false;
      }
    }
    function onAddCurrentSalaryOptionChange(isChecked) {
      isCurrentSalaryOptionChecked.value = isChecked;
      if (isChecked) {
        isNewSalaryOptionChecked.value = false;
        addNewSalaryAmount.value = "";
        hasSalaryOptionError.value = false;
        hasAddNewSalaryAmountError.value = false;
        hasAddNewSalaryAmountFormatError.value = false;
      }
    }
    function closeAddPositionConfirmationModal() {
      isConfirmAddPositionModalOpen.value = false;
    }
    function addPosition() {
      const normalizedPositionName = newPositionName.value.trim();
      const departmentId = activeDepartment.value?.id;
      if (!normalizedPositionName || !departmentId) return;
      closeAddPositionConfirmationModal();
      isAddPositionLoadingModalOpen.value = true;
      setTimeout(async () => {
        try {
          if (!transactedById.value) throw new Error("Not signed in");
          const basePayload = {
            department_id: departmentId,
            position_name: normalizedPositionName,
            transacted_by: transactedById.value
          };
          if (isNewSalaryOptionChecked.value) {
            basePayload.salary_type = "new";
            basePayload.salary_amount = addNewSalaryAmount.value.trim().replaceAll(",", "");
          } else {
            basePayload.salary_type = "existing";
            basePayload.salary_id = Number(selectedCurrentSalaryForAdd.value);
          }
          await $fetch("/api/positions", {
            method: "POST",
            body: basePayload
          });
          await loadDepartmentDetails();
          isPositionAddedAlertVisible.value = true;
          setTimeout(() => isPositionAddedAlertVisible.value = false, 2600);
          closeAddPositionModal();
        } catch (err) {
          showErrorAlert(getBackendErrorMessage(err, "Failed to create position"));
        } finally {
          isAddPositionLoadingModalOpen.value = false;
        }
      }, 1200);
    }
    vueExports.watch(newPositionName, (value) => {
      if (value.trim()) {
        hasPositionNameError.value = false;
        isDuplicatePositionNameError.value = false;
      }
    });
    vueExports.watch(addNewSalaryAmount, (value) => {
      const normalizedValue = value.trim();
      hasAddNewSalaryAmountError.value = false;
      hasAddNewSalaryAmountFormatError.value = Boolean(normalizedValue) && !isSalaryAmountNumeric(normalizedValue);
      hasAddNewSalaryDuplicateError.value = false;
    });
    vueExports.watch(selectedCurrentSalaryForAdd, (value) => {
      if (value) {
        hasAddCurrentSalaryError.value = false;
      }
    });
    vueExports.watch(updateNewSalaryAmount, (value) => {
      const normalizedValue = value.trim();
      hasUpdateNewSalaryAmountError.value = false;
      hasUpdateNewSalaryAmountFormatError.value = Boolean(normalizedValue) && !isSalaryAmountNumeric(normalizedValue);
      hasUpdateNewSalaryDuplicateError.value = false;
    });
    vueExports.watch(selectedUpdateExistingSalary, (value) => {
      if (value) {
        hasUpdateExistingSalaryError.value = false;
        hasUpdateExistingSalaryDuplicateError.value = false;
      }
    });
    vueExports.watch(
      () => activeDepartment.value?.id,
      () => {
        void loadDepartmentDetails();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "department-info-page" }, _attrs))} data-v-2650cae5><div class="top-alert-wrap" data-v-2650cae5>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: isPositionAddedAlertVisible.value,
        "onUpdate:visible": ($event) => isPositionAddedAlertVisible.value = $event,
        variant: "success",
        title: "Successfully added",
        message: "New position has been added."
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: isPositionDeletedAlertVisible.value,
        "onUpdate:visible": ($event) => isPositionDeletedAlertVisible.value = $event,
        variant: "success",
        title: "Successfully deleted",
        message: "Position has been deleted."
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: isSalaryUpdatedAlertVisible.value,
        "onUpdate:visible": ($event) => isSalaryUpdatedAlertVisible.value = $event,
        variant: "success",
        title: "Successfully updated",
        message: "Salary has been updated."
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: isErrorAlertVisible.value,
        "onUpdate:visible": ($event) => isErrorAlertVisible.value = $event,
        variant: "error",
        title: errorAlertTitle.value,
        message: errorAlertMessage.value
      }, null, _parent));
      _push(`</div><div class="department-info-header" data-v-2650cae5><button type="button" class="back-button" aria-label="Back" data-v-2650cae5>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "back-icon" }, null, _parent));
      _push(`</button><h1 class="department-info-title" data-v-2650cae5>Department Details</h1></div><div class="department-cards-grid" data-v-2650cae5><section class="department-info-card" aria-label="Department information" data-v-2650cae5><div class="department-detail-row" data-v-2650cae5><div class="department-detail-item" data-v-2650cae5><p class="department-detail-label" data-v-2650cae5>Department Name</p><p class="department-detail-value" data-v-2650cae5>${serverRenderer_cjs_prodExports.ssrInterpolate(activeDepartment.value?.name || "-")}</p></div><div class="department-detail-item department-detail-item--with-button" data-v-2650cae5><p class="department-detail-label" data-v-2650cae5>Department Head</p><div class="department-head-value-wrap" data-v-2650cae5><p class="department-detail-value" data-v-2650cae5>${serverRenderer_cjs_prodExports.ssrInterpolate(activeDepartment.value?.head || "-")}</p></div></div></div></section>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(OverviewCard, {
        icon: vueExports.unref(UserGroupIcon),
        label: "Total Employees",
        value: totalEmployeesDisplay.value,
        bgColor: "#e9f2ff",
        iconBgColor: "#d0e5ff",
        iconColor: "#3686ff"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(OverviewCard, {
        icon: vueExports.unref(BriefcaseIcon),
        label: "Total Positions",
        value: totalPositionsDisplay.value,
        bgColor: "#fef8e6",
        iconBgColor: "#fef0cd",
        iconColor: "#f0b305"
      }, null, _parent));
      _push(`</div><div class="department-divider" aria-hidden="true" data-v-2650cae5></div><form class="department-search" data-v-2650cae5>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        size: "sm",
        placeholder: "Search department",
        "aria-label": "Search department",
        class: "search-input"
      }, {
        icon: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(MagnifyingGlassIcon), { class: "search-icon" }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(vueExports.unref(MagnifyingGlassIcon), { class: "search-icon" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
        label: "Search",
        variant: "solid",
        type: "submit",
        class: "search-button"
      }, null, _parent));
      _push(`</form><div class="positions-table-wrap" data-v-2650cae5>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Table, {
        data: filteredPositionRows.value,
        columns: positionTableColumns,
        class: "positions-table"
      }, {
        "action-cell": vueExports.withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="table-actions" data-v-2650cae5${_scopeId}><button type="button" class="table-action-button update" aria-label="Update position" title="Update" data-v-2650cae5${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(PencilSquareIcon), { class: "table-action-icon" }, null, _parent2, _scopeId));
            _push2(`</button><button type="button" class="table-action-button delete" aria-label="Delete position" title="Delete" data-v-2650cae5${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TrashIcon), { class: "table-action-icon" }, null, _parent2, _scopeId));
            _push2(`</button></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "table-actions" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "table-action-button update",
                  onClick: ($event) => onUpdate(String(row.original.positionId)),
                  "aria-label": "Update position",
                  title: "Update"
                }, [
                  vueExports.createVNode(vueExports.unref(PencilSquareIcon), { class: "table-action-icon" })
                ], 8, ["onClick"]),
                vueExports.createVNode("button", {
                  type: "button",
                  class: "table-action-button delete",
                  onClick: ($event) => onDelete(row.original.positionId ?? row.original.position_id, String(row.original.position)),
                  "aria-label": "Delete position",
                  title: "Delete"
                }, [
                  vueExports.createVNode(vueExports.unref(TrashIcon), { class: "table-action-icon" })
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button type="button" class="fab-add-position" aria-label="Add position" title="Add Position" data-v-2650cae5>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(PlusIcon), { class: "add-icon" }, null, _parent));
      _push(`</button>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isUpdateSalaryModalOpen.value,
        "onUpdate:open": ($event) => isUpdateSalaryModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        title: "Update Salary"
      }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="modal-title" data-v-2650cae5${_scopeId}>Update Salary</h3>`);
          } else {
            return [
              vueExports.createVNode("h3", { class: "modal-title" }, "Update Salary")
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--red",
              onClick: closeUpdateSalaryModal
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    vueExports.createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--blue",
              onClick: saveUpdatedSalary
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Save `);
                } else {
                  return [
                    vueExports.createTextVNode(" Save ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--red",
                onClick: closeUpdateSalaryModal
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" Cancel ")
                ]),
                _: 1
              }),
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--blue",
                onClick: saveUpdatedSalary
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" Save ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-form-field" data-v-2650cae5${_scopeId}><p class="update-position-text" data-v-2650cae5${_scopeId}>Position: ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedUpdatePosition.value)}</p><label class="modal-field-label" for="current-salary" data-v-2650cae5${_scopeId}>Current Salary</label><div class="current-salary-display" data-v-2650cae5${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(selectedCurrentSalary.value || "-")}</div><div class="salary-option-grid" role="group" aria-label="Update salary selection" data-v-2650cae5${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(CheckBox, {
              modelValue: isUpdateNewSalaryOptionChecked.value,
              "onUpdate:modelValue": ($event) => isUpdateNewSalaryOptionChecked.value = $event,
              id: "update-salary-new-option",
              label: "New Salary Amount",
              onChange: onUpdateNewSalaryOptionChange
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(CheckBox, {
              modelValue: isUpdateCurrentSalaryOptionChecked.value,
              "onUpdate:modelValue": ($event) => isUpdateCurrentSalaryOptionChecked.value = $event,
              id: "update-salary-existing-option",
              label: "Existing Salary Amount",
              onChange: onUpdateCurrentSalaryOptionChange
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (hasUpdateSalaryOptionError.value) {
              _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Please choose a salary update option</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (isUpdateNewSalaryOptionChecked.value) {
              _push2(`<div class="modal-form-field" data-v-2650cae5${_scopeId}><label class="modal-field-label" for="update-new-salary-amount" data-v-2650cae5${_scopeId}>New Salary Amount</label>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
                id: "update-new-salary-amount",
                modelValue: updateNewSalaryAmount.value,
                "onUpdate:modelValue": ($event) => updateNewSalaryAmount.value = $event,
                placeholder: "Enter new salary amount",
                "aria-invalid": hasUpdateNewSalaryAmountError.value || hasUpdateNewSalaryAmountFormatError.value || hasUpdateNewSalaryDuplicateError.value ? "true" : "false",
                style: hasUpdateNewSalaryAmountError.value || hasUpdateNewSalaryAmountFormatError.value || hasUpdateNewSalaryDuplicateError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
              }, null, _parent2, _scopeId));
              if (hasUpdateNewSalaryAmountError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Please enter new salary amount</p>`);
              } else if (hasUpdateNewSalaryAmountFormatError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Salary amount must be a valid number</p>`);
              } else if (hasUpdateNewSalaryDuplicateError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>This salary amount already exists. Use existing salary option instead.</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (isUpdateCurrentSalaryOptionChecked.value) {
              _push2(`<div class="modal-form-field" data-v-2650cae5${_scopeId}><label class="modal-field-label" for="update-existing-salary-amount" data-v-2650cae5${_scopeId}>Existing Salary Amount</label><select id="update-existing-salary-amount" class="modal-select"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-invalid", hasUpdateExistingSalaryError.value || hasUpdateExistingSalaryDuplicateError.value ? "true" : "false")} style="${serverRenderer_cjs_prodExports.ssrRenderStyle(hasUpdateExistingSalaryError.value || hasUpdateExistingSalaryDuplicateError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0)}" data-v-2650cae5${_scopeId}><option value="" data-v-2650cae5${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateExistingSalary.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateExistingSalary.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateExistingSalary.value, "")) ? " selected" : ""}${_scopeId}>Select existing salary amount</option><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(backendSalaries.value, (salaryOption) => {
                _push2(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", String(salaryOption.salary_id))} data-v-2650cae5${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedUpdateExistingSalary.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedUpdateExistingSalary.value, String(salaryOption.salary_id)) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedUpdateExistingSalary.value, String(salaryOption.salary_id))) ? " selected" : ""}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(salaryOption.amount)}</option>`);
              });
              _push2(`<!--]--></select>`);
              if (hasUpdateExistingSalaryError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Please select existing salary amount</p>`);
              } else if (hasUpdateExistingSalaryDuplicateError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Selected salary is the same as the current salary.</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "modal-form-field" }, [
                vueExports.createVNode("p", { class: "update-position-text" }, "Position: " + vueExports.toDisplayString(selectedUpdatePosition.value), 1),
                vueExports.createVNode("label", {
                  class: "modal-field-label",
                  for: "current-salary"
                }, "Current Salary"),
                vueExports.createVNode("div", { class: "current-salary-display" }, vueExports.toDisplayString(selectedCurrentSalary.value || "-"), 1),
                vueExports.createVNode("div", {
                  class: "salary-option-grid",
                  role: "group",
                  "aria-label": "Update salary selection"
                }, [
                  vueExports.createVNode(CheckBox, {
                    modelValue: isUpdateNewSalaryOptionChecked.value,
                    "onUpdate:modelValue": ($event) => isUpdateNewSalaryOptionChecked.value = $event,
                    id: "update-salary-new-option",
                    label: "New Salary Amount",
                    onChange: onUpdateNewSalaryOptionChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(CheckBox, {
                    modelValue: isUpdateCurrentSalaryOptionChecked.value,
                    "onUpdate:modelValue": ($event) => isUpdateCurrentSalaryOptionChecked.value = $event,
                    id: "update-salary-existing-option",
                    label: "Existing Salary Amount",
                    onChange: onUpdateCurrentSalaryOptionChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                hasUpdateSalaryOptionError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "modal-field-error"
                }, "Please choose a salary update option")) : vueExports.createCommentVNode("", true),
                isUpdateNewSalaryOptionChecked.value ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 1,
                  class: "modal-form-field"
                }, [
                  vueExports.createVNode("label", {
                    class: "modal-field-label",
                    for: "update-new-salary-amount"
                  }, "New Salary Amount"),
                  vueExports.createVNode(Input, {
                    id: "update-new-salary-amount",
                    modelValue: updateNewSalaryAmount.value,
                    "onUpdate:modelValue": ($event) => updateNewSalaryAmount.value = $event,
                    placeholder: "Enter new salary amount",
                    "aria-invalid": hasUpdateNewSalaryAmountError.value || hasUpdateNewSalaryAmountFormatError.value || hasUpdateNewSalaryDuplicateError.value ? "true" : "false",
                    style: hasUpdateNewSalaryAmountError.value || hasUpdateNewSalaryAmountFormatError.value || hasUpdateNewSalaryDuplicateError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-invalid", "style"]),
                  hasUpdateNewSalaryAmountError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "modal-field-error"
                  }, "Please enter new salary amount")) : hasUpdateNewSalaryAmountFormatError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 1,
                    class: "modal-field-error"
                  }, "Salary amount must be a valid number")) : hasUpdateNewSalaryDuplicateError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 2,
                    class: "modal-field-error"
                  }, "This salary amount already exists. Use existing salary option instead.")) : vueExports.createCommentVNode("", true)
                ])) : vueExports.createCommentVNode("", true),
                isUpdateCurrentSalaryOptionChecked.value ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 2,
                  class: "modal-form-field"
                }, [
                  vueExports.createVNode("label", {
                    class: "modal-field-label",
                    for: "update-existing-salary-amount"
                  }, "Existing Salary Amount"),
                  vueExports.withDirectives(vueExports.createVNode("select", {
                    id: "update-existing-salary-amount",
                    "onUpdate:modelValue": ($event) => selectedUpdateExistingSalary.value = $event,
                    class: "modal-select",
                    "aria-invalid": hasUpdateExistingSalaryError.value || hasUpdateExistingSalaryDuplicateError.value ? "true" : "false",
                    style: hasUpdateExistingSalaryError.value || hasUpdateExistingSalaryDuplicateError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
                  }, [
                    vueExports.createVNode("option", { value: "" }, "Select existing salary amount"),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(backendSalaries.value, (salaryOption) => {
                      return vueExports.openBlock(), vueExports.createBlock("option", {
                        key: salaryOption.salary_id,
                        value: String(salaryOption.salary_id)
                      }, vueExports.toDisplayString(salaryOption.amount), 9, ["value"]);
                    }), 128))
                  ], 12, ["onUpdate:modelValue", "aria-invalid"]), [
                    [vueExports.vModelSelect, selectedUpdateExistingSalary.value]
                  ]),
                  hasUpdateExistingSalaryError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "modal-field-error"
                  }, "Please select existing salary amount")) : hasUpdateExistingSalaryDuplicateError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 1,
                    class: "modal-field-error"
                  }, "Selected salary is the same as the current salary.")) : vueExports.createCommentVNode("", true)
                ])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isAddPositionModalOpen.value,
        "onUpdate:open": ($event) => isAddPositionModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        title: "Add Position"
      }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="modal-title" data-v-2650cae5${_scopeId}>New Position</h3>`);
          } else {
            return [
              vueExports.createVNode("h3", { class: "modal-title" }, "New Position")
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--red",
              onClick: closeAddPositionModal
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    vueExports.createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--blue",
              onClick: requestAddPositionConfirmation
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Proceed `);
                } else {
                  return [
                    vueExports.createTextVNode(" Proceed ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--red",
                onClick: closeAddPositionModal
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" Cancel ")
                ]),
                _: 1
              }),
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--blue",
                onClick: requestAddPositionConfirmation
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" Proceed ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-form-field" data-v-2650cae5${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
              id: "new-position-name",
              modelValue: newPositionName.value,
              "onUpdate:modelValue": ($event) => newPositionName.value = $event,
              placeholder: "Enter position name",
              "aria-invalid": hasPositionNameError.value || isDuplicatePositionNameError.value ? "true" : "false",
              style: hasPositionNameError.value || isDuplicatePositionNameError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
            }, null, _parent2, _scopeId));
            if (hasPositionNameError.value) {
              _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Please enter position name</p>`);
            } else if (isDuplicatePositionNameError.value) {
              _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Position name is already registered</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="salary-option-grid" role="group" aria-label="Salary option selection" data-v-2650cae5${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(CheckBox, {
              modelValue: isNewSalaryOptionChecked.value,
              "onUpdate:modelValue": ($event) => isNewSalaryOptionChecked.value = $event,
              id: "add-position-new-salary-option",
              label: "New Salary Amount",
              onChange: onAddNewSalaryOptionChange
            }, null, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(CheckBox, {
              modelValue: isCurrentSalaryOptionChecked.value,
              "onUpdate:modelValue": ($event) => isCurrentSalaryOptionChecked.value = $event,
              id: "add-position-current-salary-option",
              label: "Current Salary Amount",
              onChange: onAddCurrentSalaryOptionChange
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (hasSalaryOptionError.value) {
              _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Please select one salary option</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (isNewSalaryOptionChecked.value) {
              _push2(`<div class="modal-form-field" data-v-2650cae5${_scopeId}><label class="modal-field-label" for="add-position-new-salary-amount" data-v-2650cae5${_scopeId}>New Salary Amount</label>`);
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
                id: "add-position-new-salary-amount",
                modelValue: addNewSalaryAmount.value,
                "onUpdate:modelValue": ($event) => addNewSalaryAmount.value = $event,
                placeholder: "Enter new salary amount",
                "aria-invalid": hasAddNewSalaryAmountError.value || hasAddNewSalaryAmountFormatError.value || hasAddNewSalaryDuplicateError.value ? "true" : "false",
                style: hasAddNewSalaryAmountError.value || hasAddNewSalaryAmountFormatError.value || hasAddNewSalaryDuplicateError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
              }, null, _parent2, _scopeId));
              if (hasAddNewSalaryAmountError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Please enter new salary amount</p>`);
              } else if (hasAddNewSalaryAmountFormatError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Salary amount must be a valid number</p>`);
              } else if (hasAddNewSalaryDuplicateError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>This salary amount already exists. Use existing salary option instead.</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (isCurrentSalaryOptionChecked.value) {
              _push2(`<div class="modal-form-field" data-v-2650cae5${_scopeId}><label class="modal-field-label" for="add-position-current-salary" data-v-2650cae5${_scopeId}>Current Salary Amount</label><select id="add-position-current-salary" class="modal-select"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-invalid", hasAddCurrentSalaryError.value ? "true" : "false")} style="${serverRenderer_cjs_prodExports.ssrRenderStyle(hasAddCurrentSalaryError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0)}" data-v-2650cae5${_scopeId}><option value="" data-v-2650cae5${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedCurrentSalaryForAdd.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedCurrentSalaryForAdd.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedCurrentSalaryForAdd.value, "")) ? " selected" : ""}${_scopeId}>Select current salary amount</option><!--[-->`);
              serverRenderer_cjs_prodExports.ssrRenderList(addSalaryOptions.value, (salaryOption) => {
                _push2(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", String(salaryOption.salary_id))} data-v-2650cae5${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedCurrentSalaryForAdd.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedCurrentSalaryForAdd.value, String(salaryOption.salary_id)) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedCurrentSalaryForAdd.value, String(salaryOption.salary_id))) ? " selected" : ""}${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(salaryOption.amount)}</option>`);
              });
              _push2(`<!--]--></select>`);
              if (hasAddCurrentSalaryError.value) {
                _push2(`<p class="modal-field-error" data-v-2650cae5${_scopeId}>Please select current salary amount</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "modal-form-field" }, [
                vueExports.createVNode(Input, {
                  id: "new-position-name",
                  modelValue: newPositionName.value,
                  "onUpdate:modelValue": ($event) => newPositionName.value = $event,
                  placeholder: "Enter position name",
                  "aria-invalid": hasPositionNameError.value || isDuplicatePositionNameError.value ? "true" : "false",
                  style: hasPositionNameError.value || isDuplicatePositionNameError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-invalid", "style"]),
                hasPositionNameError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "modal-field-error"
                }, "Please enter position name")) : isDuplicatePositionNameError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 1,
                  class: "modal-field-error"
                }, "Position name is already registered")) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("div", {
                  class: "salary-option-grid",
                  role: "group",
                  "aria-label": "Salary option selection"
                }, [
                  vueExports.createVNode(CheckBox, {
                    modelValue: isNewSalaryOptionChecked.value,
                    "onUpdate:modelValue": ($event) => isNewSalaryOptionChecked.value = $event,
                    id: "add-position-new-salary-option",
                    label: "New Salary Amount",
                    onChange: onAddNewSalaryOptionChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  vueExports.createVNode(CheckBox, {
                    modelValue: isCurrentSalaryOptionChecked.value,
                    "onUpdate:modelValue": ($event) => isCurrentSalaryOptionChecked.value = $event,
                    id: "add-position-current-salary-option",
                    label: "Current Salary Amount",
                    onChange: onAddCurrentSalaryOptionChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                hasSalaryOptionError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 2,
                  class: "modal-field-error"
                }, "Please select one salary option")) : vueExports.createCommentVNode("", true),
                isNewSalaryOptionChecked.value ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 3,
                  class: "modal-form-field"
                }, [
                  vueExports.createVNode("label", {
                    class: "modal-field-label",
                    for: "add-position-new-salary-amount"
                  }, "New Salary Amount"),
                  vueExports.createVNode(Input, {
                    id: "add-position-new-salary-amount",
                    modelValue: addNewSalaryAmount.value,
                    "onUpdate:modelValue": ($event) => addNewSalaryAmount.value = $event,
                    placeholder: "Enter new salary amount",
                    "aria-invalid": hasAddNewSalaryAmountError.value || hasAddNewSalaryAmountFormatError.value || hasAddNewSalaryDuplicateError.value ? "true" : "false",
                    style: hasAddNewSalaryAmountError.value || hasAddNewSalaryAmountFormatError.value || hasAddNewSalaryDuplicateError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-invalid", "style"]),
                  hasAddNewSalaryAmountError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "modal-field-error"
                  }, "Please enter new salary amount")) : hasAddNewSalaryAmountFormatError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 1,
                    class: "modal-field-error"
                  }, "Salary amount must be a valid number")) : hasAddNewSalaryDuplicateError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 2,
                    class: "modal-field-error"
                  }, "This salary amount already exists. Use existing salary option instead.")) : vueExports.createCommentVNode("", true)
                ])) : vueExports.createCommentVNode("", true),
                isCurrentSalaryOptionChecked.value ? (vueExports.openBlock(), vueExports.createBlock("div", {
                  key: 4,
                  class: "modal-form-field"
                }, [
                  vueExports.createVNode("label", {
                    class: "modal-field-label",
                    for: "add-position-current-salary"
                  }, "Current Salary Amount"),
                  vueExports.withDirectives(vueExports.createVNode("select", {
                    id: "add-position-current-salary",
                    "onUpdate:modelValue": ($event) => selectedCurrentSalaryForAdd.value = $event,
                    class: "modal-select",
                    "aria-invalid": hasAddCurrentSalaryError.value ? "true" : "false",
                    style: hasAddCurrentSalaryError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
                  }, [
                    vueExports.createVNode("option", { value: "" }, "Select current salary amount"),
                    (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(addSalaryOptions.value, (salaryOption) => {
                      return vueExports.openBlock(), vueExports.createBlock("option", {
                        key: `add-${salaryOption.salary_id}`,
                        value: String(salaryOption.salary_id)
                      }, vueExports.toDisplayString(salaryOption.amount), 9, ["value"]);
                    }), 128))
                  ], 12, ["onUpdate:modelValue", "aria-invalid"]), [
                    [vueExports.vModelSelect, selectedCurrentSalaryForAdd.value]
                  ]),
                  hasAddCurrentSalaryError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                    key: 0,
                    class: "modal-field-error"
                  }, "Please select current salary amount")) : vueExports.createCommentVNode("", true)
                ])) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isConfirmAddPositionModalOpen.value,
        "onUpdate:open": ($event) => isConfirmAddPositionModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        title: "Confirm Position"
      }, {
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--red",
              onClick: closeAddPositionConfirmationModal
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` No `);
                } else {
                  return [
                    vueExports.createTextVNode(" No ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--blue",
              onClick: addPosition
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Yes, Add `);
                } else {
                  return [
                    vueExports.createTextVNode(" Yes, Add ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--red",
                onClick: closeAddPositionConfirmationModal
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" No ")
                ]),
                _: 1
              }),
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--blue",
                onClick: addPosition
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" Yes, Add ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="confirm-modal-text" data-v-2650cae5${_scopeId}> Are you sure you want to add <span class="confirm-modal-position-name" data-v-2650cae5${_scopeId}>&#39;${serverRenderer_cjs_prodExports.ssrInterpolate(newPositionName.value.trim())}&#39;</span>? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "confirm-modal-text" }, [
                vueExports.createTextVNode(" Are you sure you want to add "),
                vueExports.createVNode("span", { class: "confirm-modal-position-name" }, "'" + vueExports.toDisplayString(newPositionName.value.trim()) + "'", 1),
                vueExports.createTextVNode("? ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isAddPositionLoadingModalOpen.value,
        "onUpdate:open": ($event) => isAddPositionLoadingModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        "show-footer": false,
        title: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" role="status" aria-live="polite" data-v-2650cae5${_scopeId}><span class="table-spinner" aria-hidden="true" data-v-2650cae5${_scopeId}></span><p class="adding-position-text" data-v-2650cae5${_scopeId}>Adding new position</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", {
                class: "loading-modal-content",
                role: "status",
                "aria-live": "polite"
              }, [
                vueExports.createVNode("span", {
                  class: "table-spinner",
                  "aria-hidden": "true"
                }),
                vueExports.createVNode("p", { class: "adding-position-text" }, "Adding new position")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isUpdateSalaryLoadingModalOpen.value,
        "onUpdate:open": ($event) => isUpdateSalaryLoadingModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        "show-footer": false,
        title: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" role="status" aria-live="polite" data-v-2650cae5${_scopeId}><span class="table-spinner" aria-hidden="true" data-v-2650cae5${_scopeId}></span><p class="updating-salary-text" data-v-2650cae5${_scopeId}>Updating ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedUpdatePosition.value)} salary</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", {
                class: "loading-modal-content",
                role: "status",
                "aria-live": "polite"
              }, [
                vueExports.createVNode("span", {
                  class: "table-spinner",
                  "aria-hidden": "true"
                }),
                vueExports.createVNode("p", { class: "updating-salary-text" }, "Updating " + vueExports.toDisplayString(selectedUpdatePosition.value) + " salary", 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isDeletePositionModalOpen.value,
        "onUpdate:open": ($event) => isDeletePositionModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        title: "Delete Position"
      }, {
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--red",
              onClick: closeDeletePositionModal
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` No `);
                } else {
                  return [
                    vueExports.createTextVNode(" No ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
              type: "button",
              variant: "subtle",
              class: "modal-footer-button modal-footer-button--blue",
              onClick: deletePosition
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Yes, Delete `);
                } else {
                  return [
                    vueExports.createTextVNode(" Yes, Delete ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--red",
                onClick: closeDeletePositionModal
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" No ")
                ]),
                _: 1
              }),
              vueExports.createVNode(Button, {
                type: "button",
                variant: "subtle",
                class: "modal-footer-button modal-footer-button--blue",
                onClick: deletePosition
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createTextVNode(" Yes, Delete ")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="confirm-modal-text" data-v-2650cae5${_scopeId}> Are you sure you want to delete <span class="confirm-modal-position-name" data-v-2650cae5${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(selectedDeletePosition.value)}</span>? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "confirm-modal-text" }, [
                vueExports.createTextVNode(" Are you sure you want to delete "),
                vueExports.createVNode("span", { class: "confirm-modal-position-name" }, vueExports.toDisplayString(selectedDeletePosition.value), 1),
                vueExports.createTextVNode("? ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isDeletePositionLoadingModalOpen.value,
        "onUpdate:open": ($event) => isDeletePositionLoadingModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        "show-footer": false,
        title: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" role="status" aria-live="polite" data-v-2650cae5${_scopeId}><span class="table-spinner" aria-hidden="true" data-v-2650cae5${_scopeId}></span><p class="deleting-position-text" data-v-2650cae5${_scopeId}>Deleting ${serverRenderer_cjs_prodExports.ssrInterpolate(selectedDeletePosition.value)} position</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", {
                class: "loading-modal-content",
                role: "status",
                "aria-live": "polite"
              }, [
                vueExports.createVNode("span", {
                  class: "table-spinner",
                  "aria-hidden": "true"
                }),
                vueExports.createVNode("p", { class: "deleting-position-text" }, "Deleting " + vueExports.toDisplayString(selectedDeletePosition.value) + " position", 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Departments/department-info.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DepartmentInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2650cae5"]]);

export { DepartmentInfo as default };
//# sourceMappingURL=department-info-BOM0gW9o.mjs.map
