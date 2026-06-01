import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "CheckBox",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, default: false },
    label: { default: "" },
    id: { default: "" },
    name: { default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    color: { default: "primary" },
    size: { default: "md" }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const value = vueExports.computed({
      get: () => props.modelValue,
      set: (nextValue) => {
        emit("update:modelValue", nextValue);
        emit("change", nextValue);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<label${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["app-checkbox", `app-checkbox--${__props.size}`]
      }, _attrs))} data-v-0981c9f1><input${serverRenderer_cjs_prodExports.ssrRenderAttrs((_temp0 = vueExports.mergeProps({
        checked: Array.isArray(value.value) ? serverRenderer_cjs_prodExports.ssrLooseContain(value.value, null) : value.value,
        class: "app-checkbox__input",
        type: "checkbox",
        id: __props.id || void 0,
        name: __props.name || void 0,
        disabled: __props.disabled,
        required: __props.required
      }, _ctx.$attrs), vueExports.mergeProps(_temp0, serverRenderer_cjs_prodExports.ssrGetDynamicModelProps(_temp0, value.value))))} data-v-0981c9f1><span class="app-checkbox__label" data-v-0981c9f1>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "label", {}, () => {
        _push(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)}`);
      }, _push, _parent);
      _push(`</span></label>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CheckBox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CheckBox = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-0981c9f1"]]), { __name: "CheckBox" });

export { CheckBox as C };
//# sourceMappingURL=CheckBox-DdsHZ8M1.mjs.map
