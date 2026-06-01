import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Alert",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    title: { default: "" },
    message: { default: "" },
    variant: { default: "info" },
    dismissible: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: true }
  }, {
    "visible": { type: Boolean, ...{
      default: true
    } },
    "visibleModifiers": {}
  }),
  emits: /* @__PURE__ */ vueExports.mergeModels(["close"], ["update:visible"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const visible = vueExports.useModel(__props, "visible");
    const variantClass = vueExports.computed(() => `app-alert--${props.variant}`);
    const iconSymbol = vueExports.computed(() => {
      if (props.variant === "success") return "check";
      if (props.variant === "warning") return "warning";
      if (props.variant === "error") return "error";
      return "info";
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (visible.value) {
        _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
          class: ["app-alert", variantClass.value],
          role: "alert",
          "aria-live": "polite"
        }, _attrs))} data-v-16fb1fc7>`);
        if (__props.showIcon) {
          _push(`<span class="app-alert__icon" aria-hidden="true" data-v-16fb1fc7>`);
          if (iconSymbol.value === "check") {
            _push(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16fb1fc7><path d="m20 6-11 11-5-5" data-v-16fb1fc7></path></svg>`);
          } else if (iconSymbol.value === "warning") {
            _push(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16fb1fc7><path d="M12 9v4" data-v-16fb1fc7></path><path d="M12 17h.01" data-v-16fb1fc7></path><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" data-v-16fb1fc7></path></svg>`);
          } else if (iconSymbol.value === "error") {
            _push(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16fb1fc7><circle cx="12" cy="12" r="10" data-v-16fb1fc7></circle><path d="m15 9-6 6" data-v-16fb1fc7></path><path d="m9 9 6 6" data-v-16fb1fc7></path></svg>`);
          } else {
            _push(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-16fb1fc7><circle cx="12" cy="12" r="10" data-v-16fb1fc7></circle><path d="M12 16v-4" data-v-16fb1fc7></path><path d="M12 8h.01" data-v-16fb1fc7></path></svg>`);
          }
          _push(`</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="app-alert__content" data-v-16fb1fc7>`);
        if (__props.title || _ctx.$slots.title) {
          _push(`<p class="app-alert__title" data-v-16fb1fc7>`);
          serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "title", {}, () => {
            _push(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}`);
          }, _push, _parent);
          _push(`</p>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.message || _ctx.$slots.default) {
          _push(`<p class="app-alert__message" data-v-16fb1fc7>`);
          serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
            _push(`${serverRenderer_cjs_prodExports.ssrInterpolate(__props.message)}`);
          }, _push, _parent);
          _push(`</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Alert.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Alert = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-16fb1fc7"]]), { __name: "Alert" });
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Modal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ vueExports.mergeModels({
    title: { default: "Modal Title" },
    description: { default: "" },
    triggerLabel: { default: "Open Modal" },
    triggerColor: { default: "neutral" },
    triggerVariant: { default: "subtle" },
    confirmLabel: { default: "Confirm" },
    cancelLabel: { default: "Cancel" },
    showFooter: { type: Boolean, default: false },
    dismissible: { type: Boolean, default: true },
    hideTrigger: { type: Boolean, default: false }
  }, {
    "open": { type: Boolean, ...{
      default: false
    } },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ vueExports.mergeModels(["confirm", "cancel"], ["update:open"]),
  setup(__props, { emit: __emit }) {
    const open = vueExports.useModel(__props, "open");
    const slots = vueExports.useSlots();
    const emit = __emit;
    function closeModal() {
      open.value = false;
    }
    function handleCancel() {
      emit("cancel");
      closeModal();
    }
    function handleConfirm() {
      emit("confirm");
      closeModal();
    }
    function openModal() {
      open.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (!__props.hideTrigger) {
        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "trigger", { open: openModal }, () => {
          _push(`<button type="button" class="app-modal__trigger" data-v-ebc24b84>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.triggerLabel)}</button>`);
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      serverRenderer_cjs_prodExports.ssrRenderTeleport(_push, (_push2) => {
        if (open.value) {
          _push2(`<div class="app-modal__overlay" data-v-ebc24b84><div class="app-modal" role="dialog" aria-modal="true" data-v-ebc24b84>`);
          if (__props.title || __props.description || vueExports.unref(slots).header) {
            _push2(`<header class="app-modal__header" data-v-ebc24b84>`);
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "header", {}, () => {
              if (__props.title) {
                _push2(`<h3 class="app-modal__title" data-v-ebc24b84>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}</h3>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.description) {
                _push2(`<p class="app-modal__description" data-v-ebc24b84>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent);
            _push2(`</header>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<section class="app-modal__body" data-v-ebc24b84>`);
          serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
            _push2(`<p data-v-ebc24b84>Add your modal content here.</p>`);
          }, _push2, _parent);
          _push2(`</section>`);
          if (__props.showFooter || vueExports.unref(slots).footer) {
            _push2(`<footer class="app-modal__footer" data-v-ebc24b84>`);
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "footer", {
              confirm: handleConfirm,
              cancel: handleCancel,
              close: closeModal
            }, () => {
              _push2(`<button type="button" class="app-modal__btn app-modal__btn--ghost" data-v-ebc24b84>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.cancelLabel)}</button><button type="button" class="app-modal__btn app-modal__btn--primary" data-v-ebc24b84>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.confirmLabel)}</button>`);
            }, _push2, _parent);
            _push2(`</footer>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Modal = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-ebc24b84"]]), { __name: "Modal" });

export { Alert as A, Modal as M };
//# sourceMappingURL=Modal-CvY6WRb2.mjs.map
