import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { MagnifyingGlassIcon, EyeIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { I as IconInput } from './IconInput-DYVe1Baj.mjs';
import { B as Button } from './Button-Du_vXkIz.mjs';
import { C as CheckBox } from './CheckBox-DdsHZ8M1.mjs';
import { A as Alert, M as Modal } from './Modal-gsHbAz6A.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Badge",
  __ssrInlineRender: true,
  props: {
    label: { default: "Badge" },
    color: { default: "neutral" },
    variant: { default: "subtle" },
    size: { default: "sm" },
    ui: {}
  },
  setup(__props) {
    const props = __props;
    const badgeClasses = vueExports.computed(() => ({
      "app-badge--sm": props.size === "sm",
      "app-badge--md": props.size === "md",
      "app-badge--lg": props.size === "lg",
      "app-badge--outline": props.variant === "outline",
      "app-badge--soft": props.variant === "soft",
      "app-badge--subtle": props.variant === "subtle",
      "app-badge--solid": props.variant === "solid",
      "app-badge--green": props.color === "green",
      "app-badge--red": props.color === "red",
      "app-badge--neutral": !["green", "red"].includes(props.color)
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["app-badge", badgeClasses.value]
      }, _attrs))} data-v-68cbb93f>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}`);
      }, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Badge.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Badge = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-68cbb93f"]]), { __name: "Badge" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "employee",
  __ssrInlineRender: true,
  props: {
    showSuccessAlert: { type: Boolean },
    employees: {}
  },
  emits: ["addEmployee", "viewEmployee", "deleteEmployee"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const searchQuery = vueExports.ref("");
    const departmentQuery = vueExports.ref("");
    const departments = vueExports.ref([]);
    const noCardFilter = vueExports.ref(false);
    const isExactSearchMode = vueExports.ref(false);
    const hasLoadedEmployeeTable = useState("has-loaded-employee-table", () => false);
    const isTableLoading = vueExports.ref(!hasLoadedEmployeeTable.value);
    const deleteModal = vueExports.ref(false);
    const deleteLoadingModal = vueExports.ref(false);
    const employeeIdToDelete = vueExports.ref(null);
    const showDeleteSuccessAlert = vueExports.ref(false);
    const showErrorAlert = vueExports.ref(false);
    const errorMessage = vueExports.ref("");
    let deleteTimer = null;
    let deleteAlertTimer = null;
    let errorAlertTimer = null;
    const filteredEmployees = vueExports.computed(() => {
      const query = normalizeSearchValue(searchQuery.value);
      return tableEmployees.value.filter((employee) => {
        const searchCandidates = getEmployeeSearchCandidates(employee);
        const matchesSearch = query.length === 0 ? true : isExactSearchMode.value ? searchCandidates.some((candidate) => candidate === query) : searchCandidates.some((candidate) => candidate.includes(query));
        const matchesDepartment = departmentQuery.value.length === 0 || employee.department === departmentQuery.value;
        const matchesNoCard = !noCardFilter.value || employee.cardStatus === "No Card";
        return matchesSearch && matchesDepartment && matchesNoCard;
      });
    });
    function showDeleteError(message) {
      errorMessage.value = message;
      showErrorAlert.value = true;
      if (errorAlertTimer) {
        clearTimeout(errorAlertTimer);
      }
      errorAlertTimer = setTimeout(() => {
        showErrorAlert.value = false;
      }, 3e3);
    }
    function getCardBadgeColor(cardStatus) {
      return cardStatus === "Has Card" ? "green" : "red";
    }
    function cancelDelete() {
      employeeIdToDelete.value = null;
      deleteModal.value = false;
    }
    function confirmDelete() {
      if (employeeIdToDelete.value === null) {
        deleteModal.value = false;
        return;
      }
      deleteModal.value = false;
      deleteLoadingModal.value = true;
      if (deleteTimer) {
        clearTimeout(deleteTimer);
      }
      deleteTimer = setTimeout(async () => {
        if (employeeIdToDelete.value === null) {
          deleteLoadingModal.value = false;
          return;
        }
        if (props.employees) {
          emit("deleteEmployee", employeeIdToDelete.value);
        } else {
          try {
            const actorId = currentUser.value?.employeeId;
            if (!actorId) {
              showDeleteError("You must be signed in to delete employees.");
              deleteLoadingModal.value = false;
              return;
            }
            await $fetch(`/api/employees/${employeeIdToDelete.value}?transacted_by=${actorId}`, { method: "DELETE" });
            sharedEmployeeRows.value = sharedEmployeeRows.value.filter((employee) => employee.id !== employeeIdToDelete.value);
          } catch (err) {
            const message = err?.data?.message || err?.message || "Failed to delete employee.";
            showDeleteError(message);
          }
        }
        employeeIdToDelete.value = null;
        deleteLoadingModal.value = false;
        showDeleteSuccessAlert.value = true;
        if (deleteAlertTimer) {
          clearTimeout(deleteAlertTimer);
        }
        deleteAlertTimer = setTimeout(() => {
          showDeleteSuccessAlert.value = false;
        }, 3e3);
      }, 1200);
    }
    const sharedEmployeeRows = useState("employees-table-rows", () => [
      {
        id: 1,
        name: "Maturan, Walter, B.",
        department: "Human Resources",
        cardStatus: "Has Card",
        cardNumber: "1234567890"
      }
    ]);
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
    vueExports.watch(() => props.employees, (employees) => {
      if (!employees || employees.length === 0) {
        return;
      }
      sharedEmployeeRows.value = employees.map(normalizeEmployeeRow);
    }, { immediate: true });
    const tableEmployees = vueExports.computed(() => {
      if (props.employees && props.employees.length > 0) {
        return props.employees.map(normalizeEmployeeRow);
      }
      return sharedEmployeeRows.value;
    });
    const departmentSelectWidth = vueExports.computed(() => {
      if (!departmentQuery.value) {
        return "180px";
      }
      const length = departmentQuery.value.length;
      const width = Math.min(Math.max(length * 10 + 50, 180), 360);
      return `${width}px`;
    });
    function buildEmployeeDisplayName(employee) {
      const firstName = employee.firstName.trim().split(/\s+/)[0] || "";
      const lastName = employee.lastName.trim();
      const suffix = employee.suffix?.trim() ? ` ${employee.suffix.trim()}` : "";
      const middleInitial = employee.middleName?.trim() ? `${employee.middleName.trim().charAt(0).toUpperCase()}.` : "";
      return `${lastName}, ${firstName}${suffix}${middleInitial ? `, ${middleInitial}` : ""}`;
    }
    function normalizeEmployeeRow(raw) {
      const info = raw.user_informations ?? {};
      const position = raw.positions ?? {};
      const departmentData = position.departments ?? {};
      const card = raw.cards ?? null;
      const firstName = raw.firstName ?? info.first_name ?? "";
      const middleName = raw.middleName ?? info.middle_name ?? "";
      const lastName = raw.lastName ?? info.last_name ?? "";
      const suffix = raw.suffix ?? info.suffix ?? "";
      const name = firstName || middleName || lastName ? buildEmployeeDisplayName({ firstName, middleName, lastName, suffix }) : String(raw.name ?? "");
      return {
        id: Number(raw.id ?? raw.employee_id ?? 0),
        name,
        department: raw.department ?? departmentData.department_name ?? "",
        cardStatus: raw.cardStatus ?? (card?.card_number ? "Has Card" : "No Card"),
        cardNumber: raw.cardNumber ?? card?.card_number ?? ""
      };
    }
    function normalizeSearchValue(value) {
      return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
    }
    function getEmployeeSearchCandidates(employee) {
      const [lastNameRaw = "", firstNameRaw = ""] = employee.name.split(",");
      const normalizedLastName = normalizeSearchValue(lastNameRaw);
      const normalizedFirstNameFull = normalizeSearchValue(firstNameRaw);
      const normalizedFirstName = normalizedFirstNameFull.split(" ")[0] ?? "";
      return [
        normalizeSearchValue(employee.name),
        normalizedFirstName,
        normalizedFirstNameFull,
        normalizedLastName,
        normalizeSearchValue(employee.department),
        normalizeSearchValue(employee.cardNumber),
        normalizeSearchValue(employee.cardStatus)
      ].filter(Boolean);
    }
    vueExports.watch(searchQuery, () => {
      isExactSearchMode.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="employee-page" data-v-775d0c36><h1 class="employee-title" data-v-775d0c36>Employee Management</h1><form class="employee-search" data-v-775d0c36>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        size: "sm",
        placeholder: "Search employee",
        "aria-label": "Search employee"
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
      _push(`<div class="department-and-card-filters" data-v-775d0c36><div class="department-filter-control" data-v-775d0c36><div class="department-dropdown" data-v-775d0c36><select class="filter-select" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ width: departmentSelectWidth.value })}" aria-label="Filter by department" data-v-775d0c36><option value="" data-v-775d0c36${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(departmentQuery.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(departmentQuery.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(departmentQuery.value, "")) ? " selected" : ""}>Department</option><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(departments.value, (department) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", department)} data-v-775d0c36${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(departmentQuery.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(departmentQuery.value, department) : serverRenderer_cjs_prodExports.ssrLooseEqual(departmentQuery.value, department)) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(department)}</option>`);
      });
      _push(`<!--]--></select></div>`);
      if (departmentQuery.value) {
        _push(`<button type="button" class="clear-filter-button" data-v-775d0c36> Clear </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="card-filters" aria-label="Filter by card status" data-v-775d0c36>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(CheckBox, {
        modelValue: noCardFilter.value,
        "onUpdate:modelValue": ($event) => noCardFilter.value = $event,
        label: "No card"
      }, null, _parent));
      _push(`</div></div></form><div class="form-divider" aria-hidden="true" data-v-775d0c36></div><div class="employees-table-wrap" data-v-775d0c36><table class="employees-table"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-busy", isTableLoading.value ? "true" : "false")} data-v-775d0c36><thead data-v-775d0c36><tr data-v-775d0c36><th data-v-775d0c36>Employee Name</th><th data-v-775d0c36>Department</th><th data-v-775d0c36>ID Card</th><th class="actions-column" data-v-775d0c36>Actions</th></tr></thead><tbody data-v-775d0c36>`);
      if (isTableLoading.value) {
        _push(`<tr class="loading-row" role="status" aria-live="polite" data-v-775d0c36><td class="loading-cell" colspan="4" data-v-775d0c36><div class="loading-content" data-v-775d0c36><span class="table-spinner" aria-hidden="true" data-v-775d0c36></span><span data-v-775d0c36>Loading employees...</span></div></td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(isTableLoading.value ? [] : filteredEmployees.value, (employee) => {
        _push(`<tr data-v-775d0c36><td data-v-775d0c36>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.name)}</td><td data-v-775d0c36>${serverRenderer_cjs_prodExports.ssrInterpolate(employee.department)}</td><td data-v-775d0c36>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Badge, {
          label: employee.cardStatus,
          variant: "subtle",
          size: "sm",
          color: getCardBadgeColor(employee.cardStatus)
        }, null, _parent));
        _push(`</td><td data-v-775d0c36><div class="action-buttons" data-v-775d0c36><button type="button" class="action-button action-button--view"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `View ${employee.name}`)} data-v-775d0c36>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(EyeIcon), { class: "action-icon" }, null, _parent));
        _push(`</button><button type="button" class="action-button action-button--delete"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `Delete ${employee.name}`)}${serverRenderer_cjs_prodExports.ssrRenderAttr("title", employee.id === currentUser.value?.employeeId ? "You cannot delete your own account" : "Delete employee")} data-v-775d0c36>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TrashIcon), { class: "action-icon" }, null, _parent));
        _push(`</button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><button type="button" class="floating-add-button" aria-label="Add employee" data-v-775d0c36>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(PlusIcon), { class: "floating-add-icon" }, null, _parent));
      _push(`</button>`);
      if (props.showSuccessAlert) {
        _push(`<div class="success-alert-container" data-v-775d0c36>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
          title: "Success",
          message: "Employee created successfully!",
          variant: "success",
          dismissible: false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showDeleteSuccessAlert.value) {
        _push(`<div class="success-alert-container" data-v-775d0c36>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
          title: "Success",
          message: "Employee deleted successfully!",
          variant: "success",
          dismissible: false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showErrorAlert.value) {
        _push(`<div class="success-alert-container" data-v-775d0c36>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
          title: "Action not allowed",
          message: errorMessage.value,
          variant: "error",
          dismissible: false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: deleteModal.value,
        "onUpdate:open": ($event) => deleteModal.value = $event,
        "hide-trigger": true,
        "show-footer": false,
        title: "",
        description: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="delete-modal" data-v-775d0c36${_scopeId}><p class="delete-modal__text" data-v-775d0c36${_scopeId}>Are you sure you want to delete?</p><div class="delete-modal__actions" data-v-775d0c36${_scopeId}><button type="button" class="delete-modal__button delete-modal__button--subtle" data-v-775d0c36${_scopeId}> No </button><button type="button" class="delete-modal__button delete-modal__button--danger" data-v-775d0c36${_scopeId}> Yes, Delete </button></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "delete-modal" }, [
                vueExports.createVNode("p", { class: "delete-modal__text" }, "Are you sure you want to delete?"),
                vueExports.createVNode("div", { class: "delete-modal__actions" }, [
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "delete-modal__button delete-modal__button--subtle",
                    onClick: cancelDelete
                  }, " No "),
                  vueExports.createVNode("button", {
                    type: "button",
                    class: "delete-modal__button delete-modal__button--danger",
                    onClick: confirmDelete
                  }, " Yes, Delete ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: deleteLoadingModal.value,
        "onUpdate:open": ($event) => deleteLoadingModal.value = $event,
        "hide-trigger": true,
        "show-footer": false,
        dismissible: false,
        title: "",
        description: ""
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="delete-loading-modal" data-v-775d0c36${_scopeId}><span class="delete-loading-modal__spinner" aria-hidden="true" data-v-775d0c36${_scopeId}></span><p class="delete-loading-modal__text" data-v-775d0c36${_scopeId}>Deleting Employee</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "delete-loading-modal" }, [
                vueExports.createVNode("span", {
                  class: "delete-loading-modal__spinner",
                  "aria-hidden": "true"
                }),
                vueExports.createVNode("p", { class: "delete-loading-modal__text" }, "Deleting Employee")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Employees/employee.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Employee = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-775d0c36"]]);

export { Employee as default };
//# sourceMappingURL=employee-U3PwnO3k.mjs.map
