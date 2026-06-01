import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { ClockIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { B as Button } from './Button-Du_vXkIz.mjs';
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
  __name: "attendance",
  __ssrInlineRender: true,
  emits: ["viewDepartment", "viewShiftHours"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const selectedDate = vueExports.ref("");
    const selectedDepartment = vueExports.ref("");
    const appliedDate = vueExports.ref("");
    const appliedDepartment = vueExports.ref("");
    const departmentOptions = [
      "Human Resources",
      "Information Technology",
      "Finance",
      "Operations"
    ];
    const attendanceRows = vueExports.ref([
      { id: 1, department: "Human Resources", totalEmployees: 18, present: 14, absent: 1, late: 2, leave: 1, date: "2026-04-22" },
      { id: 2, department: "Information Technology", totalEmployees: 42, present: 35, absent: 3, late: 4, leave: 0, date: "2026-04-22" },
      { id: 3, department: "Finance", totalEmployees: 24, present: 19, absent: 2, late: 1, leave: 2, date: "2026-04-21" },
      { id: 4, department: "Operations", totalEmployees: 37, present: 31, absent: 2, late: 3, leave: 1, date: "2026-04-21" }
    ]);
    const filteredAttendanceRows = vueExports.computed(() => {
      return attendanceRows.value.filter((row) => {
        const matchesDate = !appliedDate.value || row.date === appliedDate.value;
        const matchesDepartment = !appliedDepartment.value || row.department === appliedDepartment.value;
        return matchesDate && matchesDepartment;
      });
    });
    function onViewShiftHours() {
      const firstFilteredRow = filteredAttendanceRows.value[0];
      if (!firstFilteredRow) {
        return;
      }
      emit("viewShiftHours", firstFilteredRow);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "attendance-page" }, _attrs))} data-v-a1f6eff6><h1 class="attendance-title" data-v-a1f6eff6>Attendance Management</h1><form class="attendance-search" data-v-a1f6eff6><div class="date-field" data-v-a1f6eff6><label class="date-label" for="attendance-date" data-v-a1f6eff6>Select Date</label><input id="attendance-date"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", selectedDate.value)} type="date" class="date-input" aria-label="Select attendance date" data-v-a1f6eff6></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
        type: "submit",
        variant: "solid",
        class: "search-button"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Search `);
          } else {
            return [
              vueExports.createTextVNode(" Search ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="department-field" data-v-a1f6eff6><label class="date-label" for="attendance-department" data-v-a1f6eff6>Department</label><div class="department-filter-control" data-v-a1f6eff6><select id="attendance-department" class="department-select" aria-label="Filter attendance by department" data-v-a1f6eff6><option value="" data-v-a1f6eff6${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedDepartment.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedDepartment.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedDepartment.value, "")) ? " selected" : ""}>All Departments</option><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(departmentOptions, (department) => {
        _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", department)} data-v-a1f6eff6${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(selectedDepartment.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(selectedDepartment.value, department) : serverRenderer_cjs_prodExports.ssrLooseEqual(selectedDepartment.value, department)) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(department)}</option>`);
      });
      _push(`<!--]--></select>`);
      if (selectedDepartment.value) {
        _push(`<button type="button" class="clear-filter-button" data-v-a1f6eff6> Clear </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
        type: "button",
        variant: "subtle",
        class: "view-shift-hours-button",
        onClick: onViewShiftHours
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ClockIcon), { class: "shift-hours-icon" }, null, _parent2, _scopeId));
            _push2(`<span data-v-a1f6eff6${_scopeId}>View Shift Hours</span>`);
          } else {
            return [
              vueExports.createVNode(vueExports.unref(ClockIcon), { class: "shift-hours-icon" }),
              vueExports.createVNode("span", null, "View Shift Hours")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="attendance-divider" aria-hidden="true" data-v-a1f6eff6></div><div class="attendance-table-wrap" data-v-a1f6eff6><table class="attendance-table" data-v-a1f6eff6><thead data-v-a1f6eff6><tr data-v-a1f6eff6><th data-v-a1f6eff6>Department</th><th data-v-a1f6eff6>Total Employees</th><th data-v-a1f6eff6>Present</th><th data-v-a1f6eff6>Absent</th><th data-v-a1f6eff6>Late</th><th data-v-a1f6eff6>Leave</th><th data-v-a1f6eff6>Date</th><th class="actions-column" data-v-a1f6eff6>Action</th></tr></thead><tbody data-v-a1f6eff6><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(filteredAttendanceRows.value, (row) => {
        _push(`<tr data-v-a1f6eff6><td data-v-a1f6eff6>${serverRenderer_cjs_prodExports.ssrInterpolate(row.department)}</td><td data-v-a1f6eff6>${serverRenderer_cjs_prodExports.ssrInterpolate(row.totalEmployees)}</td><td data-v-a1f6eff6>${serverRenderer_cjs_prodExports.ssrInterpolate(row.present)}</td><td data-v-a1f6eff6>${serverRenderer_cjs_prodExports.ssrInterpolate(row.absent)}</td><td data-v-a1f6eff6>${serverRenderer_cjs_prodExports.ssrInterpolate(row.late)}</td><td data-v-a1f6eff6>${serverRenderer_cjs_prodExports.ssrInterpolate(row.leave)}</td><td data-v-a1f6eff6>${serverRenderer_cjs_prodExports.ssrInterpolate(row.date)}</td><td data-v-a1f6eff6><button type="button" class="action-button action-button--view"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-label", `View ${row.department} attendance on ${row.date}`)} data-v-a1f6eff6>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(EyeIcon), { class: "action-icon" }, null, _parent));
        _push(`</button></td></tr>`);
      });
      _push(`<!--]-->`);
      if (!filteredAttendanceRows.value.length) {
        _push(`<tr data-v-a1f6eff6><td colspan="8" class="empty-state" data-v-a1f6eff6>No attendance records found.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Attendance/attendance.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Attendance = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a1f6eff6"]]);

export { Attendance as default };
//# sourceMappingURL=attendance-DAbT-TT-.mjs.map
