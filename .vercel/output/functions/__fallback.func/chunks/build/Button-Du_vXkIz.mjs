import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    label: { default: "" },
    color: { default: "neutral" },
    variant: { default: "outline" },
    size: { default: "md" },
    type: { default: "button" },
    block: { type: Boolean, default: false },
    square: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    icon: { default: "" },
    trailingIcon: { default: "" },
    customColor: { default: "" },
    textColor: { default: "#ffffff" }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const variantClasses = vueExports.computed(() => ({
      "app-button--outline": props.variant === "outline",
      "app-button--solid": props.variant === "solid",
      "app-button--subtle": props.variant === "subtle"
    }));
    const buttonStyle = vueExports.computed(() => {
      if (props.customColor && props.variant === "outline") {
        return {
          color: props.customColor,
          borderColor: props.customColor
        };
      }
      if (props.customColor) {
        return {
          backgroundColor: props.customColor,
          borderColor: props.customColor,
          color: props.textColor
        };
      }
      return void 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: ["app-button", [{ "app-button--block": __props.block }, variantClasses.value]],
        type: __props.type,
        disabled: __props.disabled,
        "aria-disabled": __props.disabled || __props.loading ? "true" : "false",
        style: buttonStyle.value
      }, _ctx.$attrs, _attrs))} data-v-e46fb0d0>`);
      if (__props.icon) {
        _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.icon, "app-button__icon"])}" aria-hidden="true" data-v-e46fb0d0></span>`);
      } else {
        _push(`<!---->`);
      }
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.label || "Button")}`);
      }, _push, _parent);
      if (__props.trailingIcon) {
        _push(`<span class="${serverRenderer_cjs_prodExports.ssrRenderClass([__props.trailingIcon, "app-button__icon"])}" aria-hidden="true" data-v-e46fb0d0></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Button = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-e46fb0d0"]]), { __name: "Button" });

export { Button as B };
//# sourceMappingURL=Button-Du_vXkIz.mjs.map
