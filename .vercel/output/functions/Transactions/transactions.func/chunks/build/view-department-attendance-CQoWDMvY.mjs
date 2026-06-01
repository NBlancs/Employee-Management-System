import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { ArrowLeftIcon, FunnelIcon } from '@heroicons/vue/24/outline';
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
  __name: "view-department-attendance",
  __ssrInlineRender: true,
  props: {
    attendance: {}
  },
  emits: ["back", "viewSummary"],
  setup(__props, { emit: __emit }) {
    const monthsFilter = vueExports.ref("");
    const yearsFilter = vueExports.ref("");
    const positionAttendanceRows = vueExports.ref([
      { id: 1, fullName: "Callo, Je-ann", salary: 52e3, totalPresent: 20, totalAbsent: 5, totalLate: 3, grossPay: 1e5, dates: "2026-01-15 - 2026-01-30" },
      { id: 2, fullName: "Valle, Jayneth", salary: 42e3, totalPresent: 18, totalAbsent: 7, totalLate: 4, grossPay: 8e4, dates: "2026-02-15 - 2026-02-30" },
      { id: 3, fullName: "Lascuna, Joel Kent", salary: 28e3, totalPresent: 15, totalAbsent: 10, totalLate: 6, grossPay: 6e4, dates: "2026-03-15 - 2026-03-30" },
      { id: 4, fullName: "Maturan, Walter", salary: 24e3, totalPresent: 12, totalAbsent: 13, totalLate: 8, grossPay: 5e4, dates: "2026-04-15 - 2026-04-30" }
    ]);
    const monthOptions = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const yearOptions = vueExports.computed(() => {
      const years = positionAttendanceRows.value.map(
        (row) => new Date(row.dates).getFullYear()
      );
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const result = [];
      for (let y = minYear; y <= maxYear; y++) {
        result.push(y);
      }
      return result;
    });
    const filteredPositionAttendanceRows = vueExports.computed(() => {
      const selectedMonth = monthsFilter.value;
      const selectedYear = yearsFilter.value;
      return positionAttendanceRows.value.filter((row) => {
        const rowDate = new Date(row.dates.split(" - ")[0]);
        const rowMonth = rowDate.toLocaleString("default", { month: "long" });
        const rowYear = rowDate.getFullYear().toString();
        const matchesMonth = !selectedMonth || rowMonth === selectedMonth;
        const matchesYear = !selectedYear || rowYear === selectedYear;
        return matchesMonth && matchesYear;
      });
    });
    function exportPdf() {
    }
    function exportExcel() {
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.attendance) {
        _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "view-department-attendance-page" }, _attrs))} data-v-47aaa7ec><div class="page-header" data-v-47aaa7ec><button type="button" class="back-button" aria-label="Go back to attendance list" data-v-47aaa7ec>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftIcon), { class: "back-icon" }, null, _parent));
        _push(`</button><h1 class="page-title" data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.attendance.department)} Attendance</h1></div><div class="attendance-search" data-v-47aaa7ec><div class="filter-control" data-v-47aaa7ec><div class="filter-row" data-v-47aaa7ec><div class="filter-dropdown" data-v-47aaa7ec><select class="filter-select" data-v-47aaa7ec><option value="" data-v-47aaa7ec${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(monthsFilter.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(monthsFilter.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(monthsFilter.value, "")) ? " selected" : ""}>Select Month</option><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(monthOptions, (month) => {
          _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", month)} data-v-47aaa7ec${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(monthsFilter.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(monthsFilter.value, month) : serverRenderer_cjs_prodExports.ssrLooseEqual(monthsFilter.value, month)) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(month)}</option>`);
        });
        _push(`<!--]--></select></div><div class="filter-dropdown filter-dropdown--icon" data-v-47aaa7ec>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(FunnelIcon), { class: "filter-icon" }, null, _parent));
        _push(`<select class="filter-select filter-select--with-icon" data-v-47aaa7ec><option value="" data-v-47aaa7ec${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(yearsFilter.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(yearsFilter.value, "") : serverRenderer_cjs_prodExports.ssrLooseEqual(yearsFilter.value, "")) ? " selected" : ""}>Select Year</option><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(yearOptions.value, (year) => {
          _push(`<option${serverRenderer_cjs_prodExports.ssrRenderAttr("value", year.toString())} data-v-47aaa7ec${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(Array.isArray(yearsFilter.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(yearsFilter.value, year.toString()) : serverRenderer_cjs_prodExports.ssrLooseEqual(yearsFilter.value, year.toString())) ? " selected" : ""}>${serverRenderer_cjs_prodExports.ssrInterpolate(year)}</option>`);
        });
        _push(`<!--]--></select></div></div><div class="filter-actions" data-v-47aaa7ec>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
          type: "button",
          class: "export-button export-button--pdf",
          onClick: exportPdf
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Export PDF `);
            } else {
              return [
                vueExports.createTextVNode(" Export PDF ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
          type: "button",
          class: "export-button export-button--excel",
          onClick: exportExcel
        }, {
          default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Export Excel `);
            } else {
              return [
                vueExports.createTextVNode(" Export Excel ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (monthsFilter.value || yearsFilter.value) {
          _push(`<button type="button" class="clear-filter-button" data-v-47aaa7ec> Clear </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="form-divider" aria-hidden="true" data-v-47aaa7ec></div><div class="table-wrap" data-v-47aaa7ec><table class="attendance-table" data-v-47aaa7ec><thead data-v-47aaa7ec><tr data-v-47aaa7ec><th data-v-47aaa7ec>Name</th><th data-v-47aaa7ec>Total Present</th><th data-v-47aaa7ec>Total Absent</th><th data-v-47aaa7ec>Total Late</th><th data-v-47aaa7ec>Salary</th><th data-v-47aaa7ec>Gross pay</th><th data-v-47aaa7ec>Date</th></tr></thead><tbody data-v-47aaa7ec><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(filteredPositionAttendanceRows.value, (row) => {
          _push(`<tr data-v-47aaa7ec><td data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(row.fullName)}</td><td data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(row.totalPresent)}</td><td data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(row.totalAbsent)}</td><td data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(row.totalLate)}</td><td data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(row.salary)}</td><td data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(row.grossPay)}</td><td data-v-47aaa7ec>${serverRenderer_cjs_prodExports.ssrInterpolate(row.dates)}</td></tr>`);
        });
        _push(`<!--]-->`);
        if (!filteredPositionAttendanceRows.value.length) {
          _push(`<tr data-v-47aaa7ec><td colspan="7" class="empty-state" data-v-47aaa7ec>No position attendance found.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Attendance/view-department-attendance.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ViewDepartmentAttendance = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-47aaa7ec"]]);

export { ViewDepartmentAttendance as default };
//# sourceMappingURL=view-department-attendance-CQoWDMvY.mjs.map
