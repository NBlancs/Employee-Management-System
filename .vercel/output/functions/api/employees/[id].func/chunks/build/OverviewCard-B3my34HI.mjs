import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "OverviewCard",
  __ssrInlineRender: true,
  props: {
    icon: {},
    label: {},
    value: {},
    bgColor: { default: "#e9f2ff" },
    iconBgColor: { default: "#d0e5ff" },
    iconStroke: {},
    iconColor: { default: "#3686ff" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: "overview-card",
        style: { backgroundColor: __props.bgColor }
      }, _attrs))} data-v-e8168fcd><div class="card-icon" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ backgroundColor: __props.iconBgColor, color: __props.iconColor })}" data-v-e8168fcd>`);
      serverRenderer_cjs_prodExports.ssrRenderVNode(_push, vueExports.createVNode(vueExports.resolveDynamicComponent(__props.icon), null, null), _parent);
      _push(`</div><div class="card-content" data-v-e8168fcd><p class="card-label" data-v-e8168fcd>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}</p><h3 class="card-value" data-v-e8168fcd>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.value)}</h3></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OverviewCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const OverviewCard = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-e8168fcd"]]), { __name: "OverviewCard" });

export { OverviewCard as O };
//# sourceMappingURL=OverviewCard-B3my34HI.mjs.map
