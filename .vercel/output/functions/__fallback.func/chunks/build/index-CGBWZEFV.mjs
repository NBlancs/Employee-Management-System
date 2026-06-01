import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import Attendance from './attendance-DAbT-TT-.mjs';
import ShiftHours from './shift-hours-DseEWtFP.mjs';
import ViewDepartmentAttendance from './view-department-attendance-CQoWDMvY.mjs';
import EmployeeAttendanceSummary from './employee-attendance-summary-BUhctATy.mjs';
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
import '@heroicons/vue/24/outline';
import './Button-Du_vXkIz.mjs';
import './Modal-gsHbAz6A.mjs';
import './cookie-Cy4TWyBi.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedAttendanceForShiftHours = vueExports.ref(null);
    const selectedAttendanceForDepartment = vueExports.ref(null);
    const selectedAttendanceForSummary = vueExports.ref(null);
    function handleViewShiftHours(attendance) {
      selectedAttendanceForShiftHours.value = attendance;
      selectedAttendanceForDepartment.value = null;
      selectedAttendanceForSummary.value = null;
    }
    function handleViewDepartment(attendance) {
      selectedAttendanceForDepartment.value = attendance;
      selectedAttendanceForShiftHours.value = null;
      selectedAttendanceForSummary.value = null;
    }
    function handleViewSummaryFromDepartment(attendance) {
      selectedAttendanceForSummary.value = attendance;
      selectedAttendanceForShiftHours.value = null;
    }
    function handleBackToAttendance() {
      selectedAttendanceForShiftHours.value = null;
      selectedAttendanceForDepartment.value = null;
      selectedAttendanceForSummary.value = null;
    }
    function handleBackFromSummary() {
      selectedAttendanceForSummary.value = null;
      if (selectedAttendanceForDepartment.value) {
        return;
      }
      handleBackToAttendance();
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (!selectedAttendanceForShiftHours.value && !selectedAttendanceForDepartment.value && !selectedAttendanceForSummary.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Attendance, vueExports.mergeProps({
          onViewDepartment: handleViewDepartment,
          onViewShiftHours: handleViewShiftHours
        }, _attrs), null, _parent));
      } else if (selectedAttendanceForSummary.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(EmployeeAttendanceSummary, vueExports.mergeProps({
          attendance: selectedAttendanceForSummary.value,
          onBack: handleBackFromSummary
        }, _attrs), null, _parent));
      } else if (selectedAttendanceForDepartment.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(ViewDepartmentAttendance, vueExports.mergeProps({
          attendance: selectedAttendanceForDepartment.value,
          onBack: handleBackToAttendance,
          onViewSummary: handleViewSummaryFromDepartment
        }, _attrs), null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(ShiftHours, vueExports.mergeProps({
          attendance: selectedAttendanceForShiftHours.value,
          onBack: handleBackToAttendance
        }, _attrs), null, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Attendance/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CGBWZEFV.mjs.map
