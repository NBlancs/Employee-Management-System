import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { ArrowLeftIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { A as Alert, M as Modal } from './Modal-CvY6WRb2.mjs';
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
  __name: "shift-hours",
  __ssrInlineRender: true,
  props: {
    attendance: {}
  },
  emits: ["back", "viewShiftHour"],
  setup(__props, { emit: __emit }) {
    const shifts = vueExports.ref([]);
    const isLoadingShifts = vueExports.ref(false);
    const loadingError = vueExports.ref("");
    const isModalOpen = vueExports.ref(false);
    const isConfirmationModalOpen = vueExports.ref(false);
    const isDeleteConfirmationModalOpen = vueExports.ref(false);
    const isLoadingModalOpen = vueExports.ref(false);
    const showSuccessAlert = vueExports.ref(false);
    const successAlertMessage = vueExports.ref("");
    const morningShiftTimeIn = vueExports.ref("");
    const afternoonShiftTimeIn = vueExports.ref("");
    const morningShiftError = vueExports.ref("");
    const afternoonShiftError = vueExports.ref("");
    const loadingAction = vueExports.ref(null);
    const pendingDeleteId = vueExports.ref(null);
    let loadingTimer = null;
    let alertTimer = null;
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
    const loadingText = vueExports.computed(() => {
      if (loadingAction.value === "delete") return "Deleting shift hour";
      return "Adding shift hour";
    });
    const pendingDeleteShift = vueExports.computed(() => {
      if (pendingDeleteId.value === null) return null;
      return shifts.value.find((shift) => shift.id === pendingDeleteId.value) ?? null;
    });
    const pendingDeleteShiftRange = vueExports.computed(() => {
      if (!pendingDeleteShift.value) return "";
      return `${formatTimeTo12Hour(pendingDeleteShift.value.start)} - ${formatTimeTo12Hour(pendingDeleteShift.value.end)}`;
    });
    const morningShiftTimeOut = vueExports.computed(() => {
      if (!morningShiftTimeIn.value) return "";
      const [hours = 0, minutes = 0] = morningShiftTimeIn.value.split(":").map(Number);
      const startDate = /* @__PURE__ */ new Date();
      startDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1e3);
      return `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    });
    const afternoonShiftTimeOut = vueExports.computed(() => {
      if (!afternoonShiftTimeIn.value) return "";
      const [hours = 0, minutes = 0] = afternoonShiftTimeIn.value.split(":").map(Number);
      const startDate = /* @__PURE__ */ new Date();
      startDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1e3);
      return `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    });
    function getBackendErrorMessage(err, fallback) {
      return err?.data?.message || err?.response?._data?.message || err?.message || fallback;
    }
    function isDuplicateStart(morningTime, afternoonTime) {
      const morningExists = shifts.value.some((s) => s.start === morningTime);
      const afternoonExists = shifts.value.some((s) => s.start === afternoonTime);
      return { morningExists, afternoonExists };
    }
    function isAMTime(time) {
      const hours = Number(time.split(":")[0] || 0);
      return hours < 12;
    }
    function isPMTime(time) {
      const hours = Number(time.split(":")[0] || 0);
      return hours >= 12;
    }
    function handleAddShift() {
      morningShiftError.value = "";
      afternoonShiftError.value = "";
      let hasError = false;
      if (!morningShiftTimeIn.value) {
        morningShiftError.value = "Morning shift start time is required";
        hasError = true;
      } else if (!isAMTime(morningShiftTimeIn.value)) {
        morningShiftError.value = "Morning shift must be AM (before 12:00)";
        hasError = true;
      }
      if (!afternoonShiftTimeIn.value) {
        afternoonShiftError.value = "Afternoon shift start time is required";
        hasError = true;
      } else if (!isPMTime(afternoonShiftTimeIn.value)) {
        afternoonShiftError.value = "Afternoon shift must be PM (12:00 or later)";
        hasError = true;
      }
      if (hasError) return;
      const { morningExists, afternoonExists } = isDuplicateStart(morningShiftTimeIn.value, afternoonShiftTimeIn.value);
      if (morningExists) {
        morningShiftError.value = "This morning shift time already exists";
        hasError = true;
      }
      if (afternoonExists) {
        afternoonShiftError.value = "This afternoon shift time already exists";
        hasError = true;
      }
      if (hasError) return;
      isConfirmationModalOpen.value = true;
    }
    function confirmAddShift() {
      isConfirmationModalOpen.value = false;
      loadingAction.value = "add";
      isLoadingModalOpen.value = true;
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
      loadingTimer = setTimeout(async () => {
        try {
          const morningShift = await $fetch("/api/work-hours", {
            method: "POST",
            body: {
              transacted_by: transactedById.value,
              time_in: morningShiftTimeIn.value,
              time_out: morningShiftTimeOut.value
            }
          });
          const morningPayload = morningShift?.data ?? morningShift;
          shifts.value.push({
            id: morningPayload.work_hour_id,
            work_hour_id: morningPayload.work_hour_id,
            start: morningPayload.time_in,
            end: morningPayload.time_out,
            time_in: morningPayload.time_in,
            time_out: morningPayload.time_out,
            classification: morningPayload.classification
          });
          const afternoonShift = await $fetch("/api/work-hours", {
            method: "POST",
            body: {
              transacted_by: transactedById.value,
              time_in: afternoonShiftTimeIn.value,
              time_out: afternoonShiftTimeOut.value
            }
          });
          const afternoonPayload = afternoonShift?.data ?? afternoonShift;
          shifts.value.push({
            id: afternoonPayload.work_hour_id,
            work_hour_id: afternoonPayload.work_hour_id,
            start: afternoonPayload.time_in,
            end: afternoonPayload.time_out,
            time_in: afternoonPayload.time_in,
            time_out: afternoonPayload.time_out,
            classification: afternoonPayload.classification
          });
          isLoadingModalOpen.value = false;
          loadingAction.value = null;
          isModalOpen.value = false;
          morningShiftTimeIn.value = "";
          afternoonShiftTimeIn.value = "";
          morningShiftError.value = "";
          afternoonShiftError.value = "";
          showSuccessAlert.value = true;
          successAlertMessage.value = "Both shift hours added successfully.";
          if (alertTimer) {
            clearTimeout(alertTimer);
          }
          alertTimer = setTimeout(() => {
            showSuccessAlert.value = false;
          }, 3e3);
        } catch (err) {
          isLoadingModalOpen.value = false;
          loadingAction.value = null;
          const errorMessage = getBackendErrorMessage(err, "Failed to add shift hours");
          console.error("Add shift error:", err);
          showSuccessAlert.value = true;
          successAlertMessage.value = errorMessage;
          if (alertTimer) {
            clearTimeout(alertTimer);
          }
          alertTimer = setTimeout(() => {
            showSuccessAlert.value = false;
          }, 3e3);
        }
      }, 1500);
    }
    function cancelConfirmation() {
      isConfirmationModalOpen.value = false;
    }
    function cancelDeleteConfirmation() {
      isDeleteConfirmationModalOpen.value = false;
      pendingDeleteId.value = null;
    }
    function confirmDeleteShift() {
      if (pendingDeleteId.value === null) {
        return;
      }
      isDeleteConfirmationModalOpen.value = false;
      loadingAction.value = "delete";
      isLoadingModalOpen.value = true;
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
      const deleteId = pendingDeleteId.value;
      loadingTimer = setTimeout(async () => {
        try {
          await $fetch(`/api/work-hours/${deleteId}?transacted_by=${transactedById.value}`, {
            method: "DELETE"
          });
          shifts.value = shifts.value.filter((s) => s.id !== deleteId);
          isLoadingModalOpen.value = false;
          loadingAction.value = null;
          pendingDeleteId.value = null;
          showSuccessAlert.value = true;
          successAlertMessage.value = "Shift hour deleted successfully.";
          if (alertTimer) {
            clearTimeout(alertTimer);
          }
          alertTimer = setTimeout(() => {
            showSuccessAlert.value = false;
          }, 3e3);
        } catch (err) {
          isLoadingModalOpen.value = false;
          loadingAction.value = null;
          pendingDeleteId.value = null;
          const errorMessage = getBackendErrorMessage(err, "Failed to delete shift hour");
          showSuccessAlert.value = true;
          successAlertMessage.value = errorMessage;
          if (alertTimer) {
            clearTimeout(alertTimer);
          }
          alertTimer = setTimeout(() => {
            showSuccessAlert.value = false;
          }, 3e3);
        }
      }, 1500);
    }
    function closeAllModals() {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
      isModalOpen.value = false;
      isConfirmationModalOpen.value = false;
      isDeleteConfirmationModalOpen.value = false;
      isLoadingModalOpen.value = false;
      loadingAction.value = null;
      pendingDeleteId.value = null;
      morningShiftTimeIn.value = "";
      afternoonShiftTimeIn.value = "";
      morningShiftError.value = "";
      afternoonShiftError.value = "";
    }
    function formatTimeTo12Hour(timeString) {
      if (!timeString) return "";
      const [h, m] = timeString.split(":");
      let hour = parseInt(h ?? "0");
      const ampm = hour >= 12 ? "PM" : "AM";
      if (hour > 12) hour -= 12;
      if (hour === 0) hour = 12;
      return `${hour}:${m} ${ampm}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section class="shift-hours-page" data-v-507b5e6b>`);
      if (showSuccessAlert.value) {
        _push(`<div class="shift-hours-alert-wrap" data-v-507b5e6b>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
          title: "Success",
          message: successAlertMessage.value,
          variant: "success",
          dismissible: true,
          onClose: ($event) => showSuccessAlert.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loadingError.value) {
        _push(`<div class="shift-hours-alert-wrap" data-v-507b5e6b>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
          title: "Error",
          message: loadingError.value,
          variant: "error",
          dismissible: true,
          onClose: ($event) => loadingError.value = ""
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="shift-hours-header" data-v-507b5e6b><button class="back-button" data-v-507b5e6b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "back-icon" }, null, _parent));
      _push(`</button><h1 class="shift-hours-title" data-v-507b5e6b>Shift Hours Management</h1></div><div class="shift-hours-table-wrap" data-v-507b5e6b>`);
      if (isLoadingShifts.value) {
        _push(`<div class="loading-state" data-v-507b5e6b><div class="spinner" data-v-507b5e6b></div><p class="loading-text" data-v-507b5e6b>Loading shift hours...</p></div>`);
      } else {
        _push(`<table class="shift-hours-table" data-v-507b5e6b><thead data-v-507b5e6b><tr data-v-507b5e6b><th data-v-507b5e6b>Shift Start</th><th data-v-507b5e6b>Shift End</th><th class="actions-column" data-v-507b5e6b>Action</th></tr></thead><tbody data-v-507b5e6b>`);
        if (shifts.value.length === 0) {
          _push(`<tr data-v-507b5e6b><td colspan="4" class="empty-state" data-v-507b5e6b> No shift hours records found. </td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(shifts.value, (shift) => {
          _push(`<tr data-v-507b5e6b><td data-v-507b5e6b>${serverRenderer_cjs_prodExports.ssrInterpolate(formatTimeTo12Hour(shift.start))}</td><td data-v-507b5e6b>${serverRenderer_cjs_prodExports.ssrInterpolate(formatTimeTo12Hour(shift.end))}</td><td data-v-507b5e6b><div class="action-buttons" data-v-507b5e6b><button class="delete-icon-button" aria-label="Delete shift" data-v-507b5e6b>`);
          _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(TrashIcon), { class: "delete-icon" }, null, _parent));
          _push(`</button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div><button class="floating-button" data-v-507b5e6b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(PlusIcon), { class: "floating-button-icon" }, null, _parent));
      _push(`</button></section>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isModalOpen.value,
        "onUpdate:open": ($event) => isModalOpen.value = $event,
        title: "Add Shift Hours",
        description: "Set the shift times. The end time will automatically be 4 hours later.",
        "hide-trigger": true
      }, {
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-footer-content" data-v-507b5e6b${_scopeId}><button class="modal-button modal-button--subtle-red" data-v-507b5e6b${_scopeId}> Cancel </button><button class="modal-button modal-button--subtle-blue" data-v-507b5e6b${_scopeId}> Add Shifts </button></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "modal-footer-content" }, [
                vueExports.createVNode("button", {
                  class: "modal-button modal-button--subtle-red",
                  onClick: closeAllModals
                }, " Cancel "),
                vueExports.createVNode("button", {
                  class: "modal-button modal-button--subtle-blue",
                  onClick: handleAddShift
                }, " Add Shifts ")
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-content" data-v-507b5e6b${_scopeId}><div class="shift-section" data-v-507b5e6b${_scopeId}><h3 class="shift-section-title" data-v-507b5e6b${_scopeId}>Morning Shift (AM only)</h3><div class="form-group" data-v-507b5e6b${_scopeId}><label class="form-label" data-v-507b5e6b${_scopeId}>Time In</label><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", morningShiftTimeIn.value)} type="time" class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "time-input--error": morningShiftError.value }, "time-input"])}" data-v-507b5e6b${_scopeId}>`);
            if (morningShiftError.value) {
              _push2(`<p class="error-message" data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(morningShiftError.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-group" data-v-507b5e6b${_scopeId}><label class="form-label" data-v-507b5e6b${_scopeId}>Time Out</label><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", morningShiftTimeOut.value)} type="time" class="time-input time-input--disabled" disabled data-v-507b5e6b${_scopeId}></div></div><div class="shift-section" data-v-507b5e6b${_scopeId}><h3 class="shift-section-title" data-v-507b5e6b${_scopeId}>Afternoon Shift (PM only)</h3><div class="form-group" data-v-507b5e6b${_scopeId}><label class="form-label" data-v-507b5e6b${_scopeId}>Time In</label><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", afternoonShiftTimeIn.value)} type="time" class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "time-input--error": afternoonShiftError.value }, "time-input"])}" data-v-507b5e6b${_scopeId}>`);
            if (afternoonShiftError.value) {
              _push2(`<p class="error-message" data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(afternoonShiftError.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-group" data-v-507b5e6b${_scopeId}><label class="form-label" data-v-507b5e6b${_scopeId}>Time Out</label><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", afternoonShiftTimeOut.value)} type="time" class="time-input time-input--disabled" disabled data-v-507b5e6b${_scopeId}></div></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "modal-content" }, [
                vueExports.createVNode("div", { class: "shift-section" }, [
                  vueExports.createVNode("h3", { class: "shift-section-title" }, "Morning Shift (AM only)"),
                  vueExports.createVNode("div", { class: "form-group" }, [
                    vueExports.createVNode("label", { class: "form-label" }, "Time In"),
                    vueExports.withDirectives(vueExports.createVNode("input", {
                      "onUpdate:modelValue": ($event) => morningShiftTimeIn.value = $event,
                      type: "time",
                      class: ["time-input", { "time-input--error": morningShiftError.value }],
                      onInput: () => {
                        morningShiftError.value = "";
                        if (morningShiftTimeIn.value && !isAMTime(morningShiftTimeIn.value)) {
                          morningShiftError.value = "Morning shift must be AM (before 12:00)";
                        }
                      }
                    }, null, 42, ["onUpdate:modelValue", "onInput"]), [
                      [vueExports.vModelText, morningShiftTimeIn.value]
                    ]),
                    morningShiftError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "error-message"
                    }, vueExports.toDisplayString(morningShiftError.value), 1)) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", { class: "form-group" }, [
                    vueExports.createVNode("label", { class: "form-label" }, "Time Out"),
                    vueExports.createVNode("input", {
                      value: morningShiftTimeOut.value,
                      type: "time",
                      class: "time-input time-input--disabled",
                      disabled: ""
                    }, null, 8, ["value"])
                  ])
                ]),
                vueExports.createVNode("div", { class: "shift-section" }, [
                  vueExports.createVNode("h3", { class: "shift-section-title" }, "Afternoon Shift (PM only)"),
                  vueExports.createVNode("div", { class: "form-group" }, [
                    vueExports.createVNode("label", { class: "form-label" }, "Time In"),
                    vueExports.withDirectives(vueExports.createVNode("input", {
                      "onUpdate:modelValue": ($event) => afternoonShiftTimeIn.value = $event,
                      type: "time",
                      class: ["time-input", { "time-input--error": afternoonShiftError.value }],
                      onInput: () => {
                        afternoonShiftError.value = "";
                        if (afternoonShiftTimeIn.value && !isPMTime(afternoonShiftTimeIn.value)) {
                          afternoonShiftError.value = "Afternoon shift must be PM (12:00 or later)";
                        }
                      }
                    }, null, 42, ["onUpdate:modelValue", "onInput"]), [
                      [vueExports.vModelText, afternoonShiftTimeIn.value]
                    ]),
                    afternoonShiftError.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                      key: 0,
                      class: "error-message"
                    }, vueExports.toDisplayString(afternoonShiftError.value), 1)) : vueExports.createCommentVNode("", true)
                  ]),
                  vueExports.createVNode("div", { class: "form-group" }, [
                    vueExports.createVNode("label", { class: "form-label" }, "Time Out"),
                    vueExports.createVNode("input", {
                      value: afternoonShiftTimeOut.value,
                      type: "time",
                      class: "time-input time-input--disabled",
                      disabled: ""
                    }, null, 8, ["value"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isConfirmationModalOpen.value,
        "onUpdate:open": ($event) => isConfirmationModalOpen.value = $event,
        title: "Confirm Shift Hours",
        "hide-trigger": true,
        dismissible: false
      }, {
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal-footer-content" data-v-507b5e6b${_scopeId}><button class="modal-button modal-button--subtle-red" data-v-507b5e6b${_scopeId}> Cancel </button><button class="modal-button modal-button--subtle-blue" data-v-507b5e6b${_scopeId}> Confirm </button></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "modal-footer-content" }, [
                vueExports.createVNode("button", {
                  class: "modal-button modal-button--subtle-red",
                  onClick: cancelConfirmation
                }, " Cancel "),
                vueExports.createVNode("button", {
                  class: "modal-button modal-button--subtle-blue",
                  onClick: confirmAddShift
                }, " Confirm ")
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="confirmation-content" data-v-507b5e6b${_scopeId}><p class="confirmation-text" data-v-507b5e6b${_scopeId}>Add these shifts?</p><div class="shift-details" data-v-507b5e6b${_scopeId}><div class="detail-section" data-v-507b5e6b${_scopeId}><h4 class="detail-section-title" data-v-507b5e6b${_scopeId}>Morning Shift</h4><div class="detail-row" data-v-507b5e6b${_scopeId}><span data-v-507b5e6b${_scopeId}>Time In:</span><span data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatTimeTo12Hour(morningShiftTimeIn.value))}</span></div><div class="detail-row" data-v-507b5e6b${_scopeId}><span data-v-507b5e6b${_scopeId}>Time Out:</span><span data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatTimeTo12Hour(morningShiftTimeOut.value))}</span></div></div><div class="detail-section" data-v-507b5e6b${_scopeId}><h4 class="detail-section-title" data-v-507b5e6b${_scopeId}>Afternoon Shift</h4><div class="detail-row" data-v-507b5e6b${_scopeId}><span data-v-507b5e6b${_scopeId}>Time In:</span><span data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatTimeTo12Hour(afternoonShiftTimeIn.value))}</span></div><div class="detail-row" data-v-507b5e6b${_scopeId}><span data-v-507b5e6b${_scopeId}>Time Out:</span><span data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(formatTimeTo12Hour(afternoonShiftTimeOut.value))}</span></div></div></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "confirmation-content" }, [
                vueExports.createVNode("p", { class: "confirmation-text" }, "Add these shifts?"),
                vueExports.createVNode("div", { class: "shift-details" }, [
                  vueExports.createVNode("div", { class: "detail-section" }, [
                    vueExports.createVNode("h4", { class: "detail-section-title" }, "Morning Shift"),
                    vueExports.createVNode("div", { class: "detail-row" }, [
                      vueExports.createVNode("span", null, "Time In:"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(formatTimeTo12Hour(morningShiftTimeIn.value)), 1)
                    ]),
                    vueExports.createVNode("div", { class: "detail-row" }, [
                      vueExports.createVNode("span", null, "Time Out:"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(formatTimeTo12Hour(morningShiftTimeOut.value)), 1)
                    ])
                  ]),
                  vueExports.createVNode("div", { class: "detail-section" }, [
                    vueExports.createVNode("h4", { class: "detail-section-title" }, "Afternoon Shift"),
                    vueExports.createVNode("div", { class: "detail-row" }, [
                      vueExports.createVNode("span", null, "Time In:"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(formatTimeTo12Hour(afternoonShiftTimeIn.value)), 1)
                    ]),
                    vueExports.createVNode("div", { class: "detail-row" }, [
                      vueExports.createVNode("span", null, "Time Out:"),
                      vueExports.createVNode("span", null, vueExports.toDisplayString(formatTimeTo12Hour(afternoonShiftTimeOut.value)), 1)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isDeleteConfirmationModalOpen.value,
        "onUpdate:open": ($event) => isDeleteConfirmationModalOpen.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        dismissible: false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="delete-modal" data-v-507b5e6b${_scopeId}><p class="delete-modal__text" data-v-507b5e6b${_scopeId}>Are you sure you want to delete this shift hour?</p>`);
            if (pendingDeleteShiftRange.value) {
              _push2(`<p class="delete-modal__range" data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(pendingDeleteShiftRange.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="delete-modal__actions" data-v-507b5e6b${_scopeId}><button class="delete-modal__button delete-modal__button--subtle-red" data-v-507b5e6b${_scopeId}> No </button><button class="delete-modal__button delete-modal__button--subtle-blue" data-v-507b5e6b${_scopeId}> Yes, Delete </button></div></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "delete-modal" }, [
                vueExports.createVNode("p", { class: "delete-modal__text" }, "Are you sure you want to delete this shift hour?"),
                pendingDeleteShiftRange.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "delete-modal__range"
                }, vueExports.toDisplayString(pendingDeleteShiftRange.value), 1)) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("div", { class: "delete-modal__actions" }, [
                  vueExports.createVNode("button", {
                    class: "delete-modal__button delete-modal__button--subtle-red",
                    onClick: cancelDeleteConfirmation
                  }, " No "),
                  vueExports.createVNode("button", {
                    class: "delete-modal__button delete-modal__button--subtle-blue",
                    onClick: confirmDeleteShift
                  }, " Yes, Delete ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isLoadingModalOpen.value,
        "onUpdate:open": ($event) => isLoadingModalOpen.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        dismissible: false,
        "show-footer": false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="loading-content" data-v-507b5e6b${_scopeId}><div class="spinner" aria-hidden="true" data-v-507b5e6b${_scopeId}></div><p class="loading-text" data-v-507b5e6b${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(loadingText.value)}</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "loading-content" }, [
                vueExports.createVNode("div", {
                  class: "spinner",
                  "aria-hidden": "true"
                }),
                vueExports.createVNode("p", { class: "loading-text" }, vueExports.toDisplayString(loadingText.value), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Attendance/shift-hours.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ShiftHours = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-507b5e6b"]]);

export { ShiftHours as default };
//# sourceMappingURL=shift-hours-CqKNvS3c.mjs.map
