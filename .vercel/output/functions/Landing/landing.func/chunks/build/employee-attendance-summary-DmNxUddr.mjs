import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
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
  __name: "employee-attendance-summary",
  __ssrInlineRender: true,
  props: {
    attendance: {}
  },
  emits: ["back"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const selectedDate = vueExports.ref(props.attendance?.date ?? "");
    const appliedDate = vueExports.ref("");
    const hasSearched = vueExports.ref(false);
    const isSearching = vueExports.ref(false);
    const dummyAttendanceRecords = [
      { date: "2026-04-20", present: 18, absent: 1, late: 2 },
      { date: "2026-04-21", present: 16, absent: 2, late: 3 },
      { date: "2026-04-22", present: 17, absent: 1, late: 1 }
    ];
    const dateMatchedAttendance = vueExports.computed(() => {
      if (!appliedDate.value) {
        return null;
      }
      const sourceRecords = [
        ...dummyAttendanceRecords,
        ...props.attendance ? [{ date: props.attendance.date, present: props.attendance.present, absent: props.attendance.absent, late: props.attendance.late }] : []
      ];
      return sourceRecords.find((record) => record.date === appliedDate.value) ?? null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "summary-page" }, _attrs))} data-v-c312452d><div class="summary-header" data-v-c312452d><button type="button" class="back-button" aria-label="Go back to attendance list" data-v-c312452d>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "back-icon" }, null, _parent));
      _push(`</button><h1 class="summary-title" data-v-c312452d>Employee Attendance Summary</h1></div><div class="summary-details" aria-label="Employee summary details" data-v-c312452d><div class="detail-row" data-v-c312452d><span class="detail-label" data-v-c312452d>Full name</span><span class="detail-value" data-v-c312452d>${serverRenderer_cjs_prodExports.ssrInterpolate(props.attendance?.fullName ?? "-")}</span></div><div class="detail-row" data-v-c312452d><span class="detail-label" data-v-c312452d>Department</span><span class="detail-value" data-v-c312452d>${serverRenderer_cjs_prodExports.ssrInterpolate(props.attendance?.department ?? "-")}</span></div><div class="detail-row" data-v-c312452d><span class="detail-label" data-v-c312452d>Position</span><span class="detail-value" data-v-c312452d>${serverRenderer_cjs_prodExports.ssrInterpolate(props.attendance?.position ?? "-")}</span></div><div class="detail-row" data-v-c312452d><span class="detail-label" data-v-c312452d>Salary</span><span class="detail-value" data-v-c312452d>${serverRenderer_cjs_prodExports.ssrInterpolate(typeof props.attendance?.salary === "number" ? `PHP ${props.attendance.salary.toLocaleString()}` : "-")}</span></div></div><form class="summary-filters" data-v-c312452d><div class="date-field" data-v-c312452d><label class="date-label" for="summary-date" data-v-c312452d>Date</label><input id="summary-date"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", selectedDate.value)} type="date" class="date-input" aria-label="Select summary date" data-v-c312452d></div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
        type: "submit",
        variant: "solid",
        class: "search-button"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-c312452d${_scopeId}>Search</span>`);
          } else {
            return [
              vueExports.createVNode("span", null, "Search")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (selectedDate.value) {
        _push(`<button type="button" class="clear-button" data-v-c312452d>Clear</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="form-divider" aria-hidden="true" data-v-c312452d></div><div class="summary-table-wrap" data-v-c312452d><table class="summary-table" data-v-c312452d><thead data-v-c312452d><tr data-v-c312452d><th data-v-c312452d>Present</th><th data-v-c312452d>Absent</th><th data-v-c312452d>Late</th></tr></thead><tbody data-v-c312452d>`);
      if (isSearching.value) {
        _push(`<tr class="loading-row" role="status" aria-live="polite" data-v-c312452d><td colspan="3" class="loading-cell" data-v-c312452d><div class="loading-content" data-v-c312452d><span class="table-spinner" aria-hidden="true" data-v-c312452d></span><span data-v-c312452d>Loading attendance</span></div></td></tr>`);
      } else if (!hasSearched.value) {
        _push(`<tr data-v-c312452d><td colspan="3" class="empty-state" data-v-c312452d>Select a date.</td></tr>`);
      } else if (dateMatchedAttendance.value) {
        _push(`<tr data-v-c312452d><td data-v-c312452d>${serverRenderer_cjs_prodExports.ssrInterpolate(dateMatchedAttendance.value.present)}</td><td data-v-c312452d>${serverRenderer_cjs_prodExports.ssrInterpolate(dateMatchedAttendance.value.absent)}</td><td data-v-c312452d>${serverRenderer_cjs_prodExports.ssrInterpolate(dateMatchedAttendance.value.late)}</td></tr>`);
      } else {
        _push(`<tr data-v-c312452d><td colspan="3" class="empty-state" data-v-c312452d>No attendance recorded in this date.</td></tr>`);
      }
      _push(`</tbody></table></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Attendance/employee-attendance-summary.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EmployeeAttendanceSummary = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c312452d"]]);

export { EmployeeAttendanceSummary as default };
//# sourceMappingURL=employee-attendance-summary-DmNxUddr.mjs.map
