import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import Department from './department-DoxyMTX8.mjs';
import DepartmentInfo from './department-info-BOM0gW9o.mjs';
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
import './IconInput-DYVe1Baj.mjs';
import './Button-Du_vXkIz.mjs';
import './Modal-gsHbAz6A.mjs';
import './Input-VFrQiZfx.mjs';
import './state-CMS2XX0u.mjs';
import './cookie-Cy4TWyBi.mjs';
import './OverviewCard-B3my34HI.mjs';
import './Table-DpzCIhLT.mjs';
import './CheckBox-DdsHZ8M1.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedDepartment = vueExports.ref(null);
    function handleViewDepartment(department) {
      selectedDepartment.value = department;
    }
    function handleBackToDepartmentList() {
      selectedDepartment.value = null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (!selectedDepartment.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Department, vueExports.mergeProps({ onViewDepartment: handleViewDepartment }, _attrs), null, _parent));
      } else {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(DepartmentInfo, vueExports.mergeProps({
          department: selectedDepartment.value,
          onBack: handleBackToDepartmentList
        }, _attrs), null, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Departments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ds8ol1sy.mjs.map
