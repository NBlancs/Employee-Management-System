import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "IconInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    id: { default: "" },
    name: { default: "" },
    type: { default: "text" },
    placeholder: { default: "" },
    icon: { default: "" },
    label: { default: "" },
    hint: { default: "" },
    error: { default: "" },
    size: { default: "md" },
    variant: { default: "outline" },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: true }
  }, {
    "modelValue": {
      default: ""
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const model = vueExports.useModel(__props, "modelValue");
    const slots = vueExports.useSlots();
    const hasLeadingIcon = vueExports.computed(() => Boolean(slots.icon) || Boolean(props.icon));
    const hasTrailingSlot = vueExports.computed(() => Boolean(slots.trailing));
    const wrapperClasses = vueExports.computed(() => ({
      "icon-input--full": props.fullWidth
    }));
    const inputClasses = vueExports.computed(() => ({
      "icon-input__field--sm": props.size === "sm",
      "icon-input__field--md": props.size === "md",
      "icon-input__field--lg": props.size === "lg",
      "icon-input__field--outline": props.variant === "outline",
      "icon-input__field--soft": props.variant === "soft",
      "icon-input__field--error": Boolean(props.error),
      "icon-input__field--with-leading": hasLeadingIcon.value,
      "icon-input__field--with-trailing": hasTrailingSlot.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["icon-input", wrapperClasses.value]
      }, _attrs))} data-v-4e0de77a>`);
      if (__props.label) {
        _push(`<label class="icon-input__label"${serverRenderer_cjs_prodExports.ssrRenderAttr("for", __props.id || void 0)} data-v-4e0de77a>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="icon-input__required" aria-label="required" data-v-4e0de77a>*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="icon-input__control" data-v-4e0de77a>`);
      if (hasLeadingIcon.value) {
        _push(`<span class="icon-input__leading" aria-hidden="true" data-v-4e0de77a>`);
        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
          _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.icon, "icon-input__icon"])}" data-v-4e0de77a></span>`);
        }, _push, _parent);
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${serverRenderer_cjs_prodExports.ssrRenderAttrs((_temp0 = vueExports.mergeProps({
        id: __props.id || void 0,
        class: ["icon-input__field", inputClasses.value],
        name: __props.name || void 0,
        type: __props.type,
        placeholder: __props.placeholder,
        disabled: __props.disabled,
        readonly: __props.readonly,
        required: __props.required,
        "aria-invalid": __props.error ? "true" : "false"
      }, _ctx.$attrs), vueExports.mergeProps(_temp0, serverRenderer_cjs_prodExports.ssrGetDynamicModelProps(_temp0, model.value))))} data-v-4e0de77a>`);
      if (hasTrailingSlot.value) {
        _push(`<span class="icon-input__trailing" data-v-4e0de77a>`);
        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "trailing", {}, null, _push, _parent);
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.error) {
        _push(`<p class="icon-input__error" data-v-4e0de77a>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.error)}</p>`);
      } else if (__props.hint) {
        _push(`<p class="icon-input__hint" data-v-4e0de77a>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/IconInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const IconInput = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-4e0de77a"]]), { __name: "IconInput" });

export { IconInput as I };
//# sourceMappingURL=IconInput-DYVe1Baj.mjs.map
