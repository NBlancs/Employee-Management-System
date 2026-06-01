import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: "" },
    type: { default: "text" },
    placeholder: { default: "" },
    name: { default: "" },
    id: { default: "" },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inputValue = vueExports.computed({
      get: () => String(props.modelValue ?? ""),
      set: (value) => emit("update:modelValue", value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<input${serverRenderer_cjs_prodExports.ssrRenderAttrs((_temp0 = vueExports.mergeProps({
        class: "app-input",
        type: __props.type,
        placeholder: __props.placeholder,
        name: __props.name || void 0,
        id: __props.id || void 0,
        disabled: __props.disabled,
        readonly: __props.readonly,
        required: __props.required
      }, _ctx.$attrs, _attrs), vueExports.mergeProps(_temp0, serverRenderer_cjs_prodExports.ssrGetDynamicModelProps(_temp0, inputValue.value))))} data-v-ebff4b99>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Input.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Input = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-ebff4b99"]]), { __name: "Input" });

export { Input as I };
//# sourceMappingURL=Input-VFrQiZfx.mjs.map
