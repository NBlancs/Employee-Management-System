import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { I as IconInput } from './IconInput-DYVe1Baj.mjs';
import { B as Button } from './Button-Du_vXkIz.mjs';
import { A as Alert, M as Modal } from './Modal-gsHbAz6A.mjs';
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
  __name: "department",
  __ssrInlineRender: true,
  emits: ["viewDepartment"],
  setup(__props, { emit: __emit }) {
    const selectedDepartment = useState(
      "selected-department-info",
      () => null
    );
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
    const searchQuery = vueExports.ref("");
    const departmentFilter = vueExports.ref("");
    const appliedSearchQuery = vueExports.ref("");
    const appliedDepartmentFilter = vueExports.ref("");
    const isAddDepartmentModalOpen = vueExports.ref(false);
    const isConfirmAddDepartmentModalOpen = vueExports.ref(false);
    const isAddDepartmentLoadingModalOpen = vueExports.ref(false);
    const isDeleteDepartmentModalOpen = vueExports.ref(false);
    const isDeleteDepartmentLoadingModalOpen = vueExports.ref(false);
    const newDepartmentName = vueExports.ref("");
    const hasDepartmentNameError = vueExports.ref(false);
    const isDuplicateDepartmentAlertVisible = vueExports.ref(false);
    const isDepartmentAddedAlertVisible = vueExports.ref(false);
    const isDepartmentDeletedAlertVisible = vueExports.ref(false);
    const departmentToDelete = vueExports.ref(null);
    const hasLoadedDepartmentTable = useState("has-loaded-department-table", () => false);
    const isTableLoading = vueExports.ref(!hasLoadedDepartmentTable.value);
    let successAlertTimer = null;
    const sharedDepartmentRows = vueExports.ref([
      {
        id: 1,
        name: "Human Resources",
        head: "Dela Cruz, Juan"
      }
    ]);
    function closeDeleteDepartmentModal() {
      isDeleteDepartmentModalOpen.value = false;
      departmentToDelete.value = null;
    }
    async function loadDepartments() {
      const deptResp = await $fetch("/api/departments");
      const deptList = deptResp?.data ?? deptResp;
      if (!Array.isArray(deptList)) {
        sharedDepartmentRows.value = [];
        return;
      }
      const departmentsWithHeads = await Promise.all(
        deptList.map(async (dept) => {
          const headName = await getEmployeeHead(dept.department_head);
          return {
            id: dept.department_id,
            name: dept.department_name,
            head: headName
          };
        })
      );
      sharedDepartmentRows.value = departmentsWithHeads;
    }
    async function deleteDepartment() {
      if (!departmentToDelete.value) return;
      if (!transactedById.value) {
        alert("Cannot delete: User not identified.");
        return;
      }
      const targetDepartmentId = departmentToDelete.value.id;
      isDeleteDepartmentModalOpen.value = false;
      isDeleteDepartmentLoadingModalOpen.value = true;
      try {
        await $fetch(`/api/departments/${targetDepartmentId}`, {
          method: "DELETE",
          body: {
            transacted_by: transactedById.value
          }
        });
        await loadDepartments();
        if (selectedDepartment.value?.id === targetDepartmentId) {
          selectedDepartment.value = null;
        }
        isDepartmentDeletedAlertVisible.value = true;
        setTimeout(() => {
          isDepartmentDeletedAlertVisible.value = false;
        }, 2600);
      } catch (err) {
        alert(err?.data?.message || "Cannot delete department.");
      } finally {
        isDeleteDepartmentLoadingModalOpen.value = false;
        departmentToDelete.value = null;
      }
    }
    function handleAddDepartment() {
      newDepartmentName.value = "";
      hasDepartmentNameError.value = false;
      isAddDepartmentModalOpen.value = true;
    }
    function closeAddDepartmentModal() {
      isAddDepartmentModalOpen.value = false;
    }
    function requestAddDepartmentConfirmation() {
      if (!newDepartmentName.value.trim()) {
        hasDepartmentNameError.value = true;
        return;
      }
      hasDepartmentNameError.value = false;
      isConfirmAddDepartmentModalOpen.value = true;
    }
    function closeAddDepartmentConfirmationModal() {
      isConfirmAddDepartmentModalOpen.value = false;
    }
    function addDepartment() {
      const normalizedName = newDepartmentName.value.trim();
      if (!normalizedName) {
        return;
      }
      if (!transactedById.value) {
        return;
      }
      const isDepartmentAlreadyRegistered = sharedDepartmentRows.value.some(
        (department) => department.name.toLowerCase() === normalizedName.toLowerCase()
      );
      if (isDepartmentAlreadyRegistered) {
        closeAddDepartmentConfirmationModal();
        isDuplicateDepartmentAlertVisible.value = true;
        return;
      }
      isDuplicateDepartmentAlertVisible.value = false;
      closeAddDepartmentConfirmationModal();
      isAddDepartmentLoadingModalOpen.value = true;
      setTimeout(async () => {
        try {
          const response = await $fetch("/api/departments", {
            method: "POST",
            body: {
              department_name: normalizedName,
              transacted_by: transactedById.value
            }
          });
          const newDepartmentData = response?.data ?? response;
          if (!newDepartmentData?.department_id) {
            throw new Error("Department was not created.");
          }
          await loadDepartments();
          isDepartmentAddedAlertVisible.value = true;
          if (successAlertTimer) {
            clearTimeout(successAlertTimer);
          }
          successAlertTimer = setTimeout(() => {
            isDepartmentAddedAlertVisible.value = false;
          }, 2600);
          closeAddDepartmentModal();
        } catch (err) {
          isDuplicateDepartmentAlertVisible.value = false;
        } finally {
          isAddDepartmentLoadingModalOpen.value = false;
          closeAddDepartmentConfirmationModal();
        }
      }, 1200);
    }
    const departmentOptions = vueExports.computed(() => {
      return [...new Set(sharedDepartmentRows.value.map((department) => department.name))];
    });
    const departmentFilterWidth = vueExports.computed(() => {
      if (!departmentFilter.value) {
        return "190px";
      }
      const length = departmentFilter.value.length;
      const width = Math.min(Math.max(length * 10 + 50, 190), 360);
      return `${width}px`;
    });
    const filteredDepartments = vueExports.computed(() => {
      const query = appliedSearchQuery.value.trim().toLowerCase();
      const selectedDepartment2 = appliedDepartmentFilter.value;
      return sharedDepartmentRows.value.filter((department) => {
        const matchesDepartment = !selectedDepartment2 || department.name === selectedDepartment2;
        const matchesSearch = !query || department.name.toLowerCase().includes(query) || department.head.toLowerCase().includes(query);
        return matchesDepartment && matchesSearch;
      });
    });
    vueExports.watch(newDepartmentName, (value) => {
      if (value.trim()) {
        hasDepartmentNameError.value = false;
      }
    });
    vueExports.watch(searchQuery, (value) => {
      appliedSearchQuery.value = value;
    });
    vueExports.watch(departmentFilter, (value) => {
      appliedDepartmentFilter.value = value;
    });
    async function getEmployeeHead(employeeId) {
      if (!employeeId) return "Unassigned";
      try {
        const empResp = await $fetch(`/api/employees/${employeeId}`);
        const emp = empResp?.data ?? empResp;
        if (emp?.name) {
          return emp.name;
        }
        if (emp?.raw?.user_informations) {
          const info = emp.raw.user_informations;
          return `${info.last_name}, ${info.first_name}`;
        }
      } catch (err) {
      }
      return "Unassigned";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "department-page" }, _attrs))} data-v-4996467d><div class="top-alert-wrap" data-v-4996467d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: isDuplicateDepartmentAlertVisible.value,
        "onUpdate:visible": ($event) => isDuplicateDepartmentAlertVisible.value = $event,
        variant: "error",
        title: "Department already registered",
        message: "Please enter a different department name."
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: isDepartmentAddedAlertVisible.value,
        "onUpdate:visible": ($event) => isDepartmentAddedAlertVisible.value = $event,
        variant: "success",
        title: "Successfully added",
        message: "New department has been added."
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
        visible: isDepartmentDeletedAlertVisible.value,
        "onUpdate:visible": ($event) => isDepartmentDeletedAlertVisible.value = $event,
        variant: "success",
        title: "Successfully deleted",
        message: "Department has been deleted."
      }, null, _parent));
      _push(`</div><h1 class="department-title" data-v-4996467d>Department Management</h1><form class="department-search" data-v-4996467d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        size: "sm",
        placeholder: "Search department",
        "aria-label": "Search department"
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
        variant: "solid",
        type: "submit",
        class: "search-button"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-4996467d${_scopeId}>Search</span>`);
          } else {
            return [
              vueExports.createVNode("span", null, "Search")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="department-filter-control" data-v-4996467d><div class="filter-dropdown" data-v-4996467d><select class="filter-select" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: departmentFilterWidth.value })}" aria-label="Filter department" data-v-4996467d><option value="" data-v-4996467d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(departmentFilter.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(departmentFilter.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(departmentFilter.value, "")) ? " selected" : ""}>All Departments</option><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(departmentOptions.value, (option) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", option)} data-v-4996467d${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(departmentFilter.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(departmentFilter.value, option) : serverRenderer_cjs_prodExports.ssrLooseEqual(departmentFilter.value, option)) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select></div>`);
      if (departmentFilter.value) {
        _push(`<button type="button" class="clear-filter-button" data-v-4996467d> Clear </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
        variant: "solid",
        type: "button",
        class: "add-button",
        "aria-label": "Add Department",
        onClick: handleAddDepartment
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(PlusIcon), { class: "add-icon" }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(vueExports.unref(PlusIcon), { class: "add-icon" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="form-divider" aria-hidden="true" data-v-4996467d></div><div class="departments-table-wrap" data-v-4996467d><table class="departments-table"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-busy", isTableLoading.value ? "true" : "false")} data-v-4996467d><thead data-v-4996467d><tr data-v-4996467d><th data-v-4996467d>Department</th><th data-v-4996467d>Department Head</th><th class="actions-column" data-v-4996467d>Actions</th></tr></thead><tbody data-v-4996467d>`);
      if (isTableLoading.value) {
        _push(`<tr class="loading-row" role="status" aria-live="polite" data-v-4996467d><td class="loading-cell" colspan="4" data-v-4996467d><div class="loading-content" data-v-4996467d><span class="table-spinner" aria-hidden="true" data-v-4996467d></span><span data-v-4996467d>Loading departments...</span></div></td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(isTableLoading.value ? [] : filteredDepartments.value, (department) => {
        _push(`<tr data-v-4996467d><td data-v-4996467d>${serverRenderer_cjs_prodExports.ssrInterpolate(department.name)}</td><td data-v-4996467d>${serverRenderer_cjs_prodExports.ssrInterpolate(department.head)}</td><td data-v-4996467d><div class="action-buttons" data-v-4996467d><button type="button" class="action-button action-button--view"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `View ${department.name}`)} data-v-4996467d>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(EyeIcon), { class: "action-icon" }, null, _parent));
        _push(`</button><button type="button" class="action-button action-button--delete"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `Delete ${department.name}`)} data-v-4996467d>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TrashIcon), { class: "action-icon" }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (!isTableLoading.value && !filteredDepartments.value.length) {
        _push(`<tr data-v-4996467d><td colspan="4" class="empty-state" data-v-4996467d>No departments found.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isAddDepartmentModalOpen.value,
        "onUpdate:open": ($event) => isAddDepartmentModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        title: "New Department"
      }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-header-wrap" data-v-4996467d${_scopeId}><h3 class="modal-title" data-v-4996467d${_scopeId}>New Department</h3></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "modal-header-wrap" }, [
                vueExports.createVNode("h3", { class: "modal-title" }, "New Department")
              ])
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="app-modal__btn app-modal__btn--ghost" data-v-4996467d${_scopeId}> Cancel </button><button type="button" class="app-modal__btn app-modal__btn--primary" data-v-4996467d${_scopeId}> Add Department </button>`);
          } else {
            return [
              vueExports.createVNode("button", {
                type: "button",
                class: "app-modal__btn app-modal__btn--ghost",
                onClick: closeAddDepartmentModal
              }, " Cancel "),
              vueExports.createVNode("button", {
                type: "button",
                class: "app-modal__btn app-modal__btn--primary",
                onClick: requestAddDepartmentConfirmation
              }, " Add Department ")
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-form-field" data-v-4996467d${_scopeId}><label class="modal-field-label" for="new-department-name" data-v-4996467d${_scopeId}>Enter Department name</label>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Input, {
              id: "new-department-name",
              modelValue: newDepartmentName.value,
              "onUpdate:modelValue": ($event) => newDepartmentName.value = $event,
              placeholder: "Department name",
              "aria-invalid": hasDepartmentNameError.value ? "true" : "false",
              style: hasDepartmentNameError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
            }, null, _parent2, _scopeId));
            if (hasDepartmentNameError.value) {
              _push2(`<p class="modal-field-error" data-v-4996467d${_scopeId}>Please enter department name</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "modal-form-field" }, [
                vueExports.createVNode("label", {
                  class: "modal-field-label",
                  for: "new-department-name"
                }, "Enter Department name"),
                vueExports.createVNode(Input, {
                  id: "new-department-name",
                  modelValue: newDepartmentName.value,
                  "onUpdate:modelValue": ($event) => newDepartmentName.value = $event,
                  placeholder: "Department name",
                  "aria-invalid": hasDepartmentNameError.value ? "true" : "false",
                  style: hasDepartmentNameError.value ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.14)" } : void 0
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-invalid", "style"]),
                hasDepartmentNameError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "modal-field-error"
                }, "Please enter department name")) : vueExports.createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isConfirmAddDepartmentModalOpen.value,
        "onUpdate:open": ($event) => isConfirmAddDepartmentModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        title: "Confirm Department"
      }, {
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="app-modal__btn app-modal__btn--ghost confirm-modal-cancel-btn" data-v-4996467d${_scopeId}> Cancel </button><button type="button" class="app-modal__btn app-modal__btn--primary confirm-modal-confirm-btn" data-v-4996467d${_scopeId}> Confirm </button>`);
          } else {
            return [
              vueExports.createVNode("button", {
                type: "button",
                class: "app-modal__btn app-modal__btn--ghost confirm-modal-cancel-btn",
                onClick: closeAddDepartmentConfirmationModal
              }, " Cancel "),
              vueExports.createVNode("button", {
                type: "button",
                class: "app-modal__btn app-modal__btn--primary confirm-modal-confirm-btn",
                onClick: addDepartment
              }, " Confirm ")
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="confirm-modal-text" data-v-4996467d${_scopeId}> Add <span class="confirm-modal-department-name" data-v-4996467d${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(newDepartmentName.value.trim())}</span> to the list? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "confirm-modal-text" }, [
                vueExports.createTextVNode(" Add "),
                vueExports.createVNode("span", { class: "confirm-modal-department-name" }, vueExports.toDisplayString(newDepartmentName.value.trim()), 1),
                vueExports.createTextVNode(" to the list? ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isAddDepartmentLoadingModalOpen.value,
        "onUpdate:open": ($event) => isAddDepartmentLoadingModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        "show-footer": false,
        title: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" role="status" aria-live="polite" data-v-4996467d${_scopeId}><span class="table-spinner" aria-hidden="true" data-v-4996467d${_scopeId}></span><p class="adding-department-text" data-v-4996467d${_scopeId}>Adding new department</p></div>`);
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
                vueExports.createVNode("p", { class: "adding-department-text" }, "Adding new department")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isDeleteDepartmentModalOpen.value,
        "onUpdate:open": ($event) => isDeleteDepartmentModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        title: "Delete Department"
      }, {
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="delete-modal-footer-content" data-v-4996467d${_scopeId}><button type="button" class="app-modal__btn delete-modal-no-btn" data-v-4996467d${_scopeId}> No </button><button type="button" class="app-modal__btn delete-modal-yes-btn" data-v-4996467d${_scopeId}> Yes, Delete </button></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "delete-modal-footer-content" }, [
                vueExports.createVNode("button", {
                  type: "button",
                  class: "app-modal__btn delete-modal-no-btn",
                  onClick: closeDeleteDepartmentModal
                }, " No "),
                vueExports.createVNode("button", {
                  type: "button",
                  class: "app-modal__btn delete-modal-yes-btn",
                  onClick: deleteDepartment
                }, " Yes, Delete ")
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="delete-modal-text" data-v-4996467d${_scopeId}> Are you sure you want to delete Department of <span class="confirm-modal-department-name" data-v-4996467d${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(departmentToDelete.value?.name || "this department")}</span>? </p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "delete-modal-text" }, [
                vueExports.createTextVNode(" Are you sure you want to delete Department of "),
                vueExports.createVNode("span", { class: "confirm-modal-department-name" }, vueExports.toDisplayString(departmentToDelete.value?.name || "this department"), 1),
                vueExports.createTextVNode("? ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isDeleteDepartmentLoadingModalOpen.value,
        "onUpdate:open": ($event) => isDeleteDepartmentLoadingModalOpen.value = $event,
        "hide-trigger": "",
        dismissible: false,
        "show-footer": false,
        title: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-modal-content" role="status" aria-live="polite" data-v-4996467d${_scopeId}><span class="table-spinner" aria-hidden="true" data-v-4996467d${_scopeId}></span><p class="deleting-department-text" data-v-4996467d${_scopeId}>Deleting Department</p></div>`);
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
                vueExports.createVNode("p", { class: "deleting-department-text" }, "Deleting Department")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Departments/department.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Department = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4996467d"]]);

export { Department as default };
//# sourceMappingURL=department-DoxyMTX8.mjs.map
