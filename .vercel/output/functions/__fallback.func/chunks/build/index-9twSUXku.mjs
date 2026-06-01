import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import Main from './main-lUPxxbrZ.mjs';
import Dashboard from './dashboard-Bx9L-xFS.mjs';
import Employee from './employee-U3PwnO3k.mjs';
import NewEmployee from './new-employee-C2PY0d8c.mjs';
import EmployeeInfo from './employee-info-_T6I7PCW.mjs';
import Department from './department-DoxyMTX8.mjs';
import DepartmentInfo from './department-info-BOM0gW9o.mjs';
import _sfc_main$1 from './index-CGBWZEFV.mjs';
import Transactions from './transactions-CBbnC9tQ.mjs';
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
import './Modal-gsHbAz6A.mjs';
import '@heroicons/vue/24/outline';
import './cookie-Cy4TWyBi.mjs';
import './OverviewCard-B3my34HI.mjs';
import './state-CMS2XX0u.mjs';
import './IconInput-DYVe1Baj.mjs';
import './Button-Du_vXkIz.mjs';
import './CheckBox-DdsHZ8M1.mjs';
import './Input-VFrQiZfx.mjs';
import './Table-DpzCIhLT.mjs';
import './attendance-DAbT-TT-.mjs';
import './shift-hours-DseEWtFP.mjs';
import './view-department-attendance-CQoWDMvY.mjs';
import './employee-attendance-summary-BUhctATy.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedDepartmentId = vueExports.ref(null);
    const selectedEmployeeId = vueExports.ref(null);
    const isCreatingEmployee = vueExports.ref(false);
    const showSuccessAlert = vueExports.ref(false);
    function openDepartmentInfo(departmentId) {
      selectedDepartmentId.value = departmentId.id;
    }
    function closeDepartmentInfo() {
      selectedDepartmentId.value = null;
    }
    function openNewEmployee() {
      selectedEmployeeId.value = null;
      isCreatingEmployee.value = true;
    }
    function closeNewEmployee() {
      isCreatingEmployee.value = false;
    }
    function openEmployeeInfo(employeeId) {
      isCreatingEmployee.value = false;
      selectedEmployeeId.value = employeeId;
    }
    function closeEmployeeInfo() {
      selectedEmployeeId.value = null;
    }
    function onEmployeeCreated() {
      showSuccessAlert.value = true;
      setTimeout(() => {
        showSuccessAlert.value = false;
      }, 3e3);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Main, _attrs, {
        content: vueExports.withCtx(({ activeTab }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (activeTab === "overview") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Dashboard, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (activeTab === "employees" && !isCreatingEmployee.value && selectedEmployeeId.value === null) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Employee, {
                "show-success-alert": showSuccessAlert.value,
                onAddEmployee: openNewEmployee,
                onViewEmployee: openEmployeeInfo
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (activeTab === "employees" && isCreatingEmployee.value) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(NewEmployee, {
                onBack: closeNewEmployee,
                onEmployeeCreated
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (activeTab === "employees" && selectedEmployeeId.value !== null) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(EmployeeInfo, {
                "employee-id": selectedEmployeeId.value,
                onBack: closeEmployeeInfo
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (activeTab === "departments" && !selectedDepartmentId.value) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Department, { onViewDepartment: openDepartmentInfo }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (activeTab === "departments" && selectedDepartmentId.value) {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(DepartmentInfo, { onBack: closeDepartmentInfo }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (activeTab === "attendance") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (activeTab === "transactions") {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(Transactions, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              activeTab === "overview" ? (vueExports.openBlock(), vueExports.createBlock(Dashboard, { key: 0 })) : vueExports.createCommentVNode("", true),
              activeTab === "employees" && !isCreatingEmployee.value && selectedEmployeeId.value === null ? (vueExports.openBlock(), vueExports.createBlock(Employee, {
                key: 1,
                "show-success-alert": showSuccessAlert.value,
                onAddEmployee: openNewEmployee,
                onViewEmployee: openEmployeeInfo
              }, null, 8, ["show-success-alert"])) : vueExports.createCommentVNode("", true),
              activeTab === "employees" && isCreatingEmployee.value ? (vueExports.openBlock(), vueExports.createBlock(NewEmployee, {
                key: 2,
                onBack: closeNewEmployee,
                onEmployeeCreated
              })) : vueExports.createCommentVNode("", true),
              activeTab === "employees" && selectedEmployeeId.value !== null ? (vueExports.openBlock(), vueExports.createBlock(EmployeeInfo, {
                key: 3,
                "employee-id": selectedEmployeeId.value,
                onBack: closeEmployeeInfo
              }, null, 8, ["employee-id"])) : vueExports.createCommentVNode("", true),
              activeTab === "departments" && !selectedDepartmentId.value ? (vueExports.openBlock(), vueExports.createBlock(Department, {
                key: 4,
                onViewDepartment: openDepartmentInfo
              })) : vueExports.createCommentVNode("", true),
              activeTab === "departments" && selectedDepartmentId.value ? (vueExports.openBlock(), vueExports.createBlock(DepartmentInfo, {
                key: 5,
                onBack: closeDepartmentInfo
              })) : vueExports.createCommentVNode("", true),
              activeTab === "attendance" ? (vueExports.openBlock(), vueExports.createBlock(_sfc_main$1, { key: 6 })) : vueExports.createCommentVNode("", true),
              activeTab === "transactions" ? (vueExports.openBlock(), vueExports.createBlock(Transactions, { key: 7 })) : vueExports.createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Main/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-9twSUXku.mjs.map
