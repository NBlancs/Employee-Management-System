import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { O as OverviewCard } from './OverviewCard-B3my34HI.mjs';
import { UserGroupIcon, CheckCircleIcon, XCircleIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';
import { u as useState } from './state-CMS2XX0u.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const hasLoadedDashboardTable = useState("has-loaded-dashboard-table", () => false);
    const isTableLoading = vueExports.ref(!hasLoadedDashboardTable.value);
    const dashboardStats = vueExports.ref({
      totalEmployees: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalDepartments: 0
    });
    vueExports.ref(true);
    const recentAttendances = vueExports.ref([]);
    const recentTransactions = vueExports.ref([]);
    const currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    function getStatusClass(status) {
      if (status === "Present") return "status-badge--present";
      if (status === "Late") return "status-badge--late";
      return "status-badge--neutral";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "dashboard" }, _attrs))} data-v-059d0128><h1 data-v-059d0128>Overview</h1><div class="overview-grid" data-v-059d0128>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(OverviewCard, {
        icon: vueExports.unref(UserGroupIcon),
        label: "Total Employees",
        value: dashboardStats.value.totalEmployees.toString(),
        bgColor: "#e9f2ff",
        iconBgColor: "#d0e5ff",
        iconColor: "#3686ff"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(OverviewCard, {
        icon: vueExports.unref(CheckCircleIcon),
        label: "Total Present",
        value: dashboardStats.value.totalPresent.toString(),
        bgColor: "#e5f8f0",
        iconBgColor: "#cef2e5",
        iconColor: "#00c16a"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(OverviewCard, {
        icon: vueExports.unref(XCircleIcon),
        label: "Total Absent",
        value: dashboardStats.value.totalAbsent.toString(),
        bgColor: "#fee9ea",
        iconBgColor: "#fdcfd3",
        iconColor: "#fc4f57"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(OverviewCard, {
        icon: vueExports.unref(ShieldCheckIcon),
        label: "Departments",
        value: dashboardStats.value.totalDepartments.toString(),
        bgColor: "#fef8e6",
        iconBgColor: "#fef0cd",
        iconColor: "#f0b305"
      }, null, _parent));
      _push(`</div><div class="recent-attendance-header" data-v-059d0128><h1 id="recent-attendance" data-v-059d0128>Recent Attendances</h1><p id="date" data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(currentDate))}</p></div><div class="recent-attendance-table" data-v-059d0128><table class="attendance-table"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-busy", isTableLoading.value ? "true" : "false")} data-v-059d0128><thead data-v-059d0128><tr data-v-059d0128><th data-v-059d0128>Full Name</th><th class="status-header" data-v-059d0128>Status</th><th data-v-059d0128>Time</th></tr></thead><tbody data-v-059d0128>`);
      if (isTableLoading.value) {
        _push(`<tr class="loading-row" role="status" aria-live="polite" data-v-059d0128><td class="loading-cell" colspan="3" data-v-059d0128><div class="loading-content" data-v-059d0128><span class="table-spinner" aria-hidden="true" data-v-059d0128></span><span data-v-059d0128>Loading attendances...</span></div></td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(isTableLoading.value ? [] : recentAttendances.value.slice(0, 5), (attendance) => {
        _push(`<tr data-v-059d0128><td data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(attendance.fullName)}</td><td class="status-cell-center" data-v-059d0128><span class="${serverRenderer_cjs_prodExports.ssrRenderClass([getStatusClass(attendance.status), "status-badge"])}" data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(attendance.status)}</span></td><td data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(attendance.timeIn)}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="recent-transaction-header" data-v-059d0128><h1 id="recent-transaction" data-v-059d0128>Recent Transactions</h1></div><div class="recent-attendance-table" data-v-059d0128><table class="attendance-table"${serverRenderer_cjs_prodExports.ssrRenderAttr("aria-busy", isTableLoading.value ? "true" : "false")} data-v-059d0128><thead data-v-059d0128><tr data-v-059d0128><th data-v-059d0128>Transaction No.</th><th data-v-059d0128>Classification</th><th data-v-059d0128>Processed By</th><th data-v-059d0128>Date &amp; Time</th></tr></thead><tbody data-v-059d0128>`);
      if (isTableLoading.value) {
        _push(`<tr class="loading-row" role="status" aria-live="polite" data-v-059d0128><td class="loading-cell" colspan="4" data-v-059d0128><div class="loading-content" data-v-059d0128><span class="table-spinner" aria-hidden="true" data-v-059d0128></span><span data-v-059d0128>Loading transactions...</span></div></td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(isTableLoading.value ? [] : recentTransactions.value.slice(0, 5), (transaction) => {
        _push(`<tr data-v-059d0128><td data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(transaction.reference)}</td><td data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(transaction.type)}</td><td data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(transaction.firstName)}</td><td data-v-059d0128>${serverRenderer_cjs_prodExports.ssrInterpolate(transaction.dateTime)}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Dashboard/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-059d0128"]]);

export { Dashboard as default };
//# sourceMappingURL=dashboard-Bx9L-xFS.mjs.map
