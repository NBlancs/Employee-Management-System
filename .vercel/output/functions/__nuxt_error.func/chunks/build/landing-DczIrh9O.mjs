import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports, n as navigateTo } from './server.mjs';
import { I as IconInput } from './IconInput-DYVe1Baj.mjs';
import { B as Button } from './Button-Du_vXkIz.mjs';
import { UsersIcon, ClockIcon, CalendarDaysIcon, CreditCardIcon } from '@heroicons/vue/24/outline';
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

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Card",
  __ssrInlineRender: true,
  props: {
    title: { default: "Card Title" },
    subtitle: { default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "card" }, _attrs))} data-v-b74898e8><header class="card-header" data-v-b74898e8>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "header-top", {}, null, _push, _parent);
      _push(`<h3 class="card-title" data-v-b74898e8>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.title)}</h3>`);
      if (__props.subtitle) {
        _push(`<p class="card-subtitle" data-v-b74898e8>${serverRenderer_cjs_prodExports.ssrInterpolate(__props.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><section class="card-body" data-v-b74898e8>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`<p data-v-b74898e8>Add your card content here.</p>`);
      }, _push, _parent);
      _push(`</section>`);
      if (_ctx.$slots.footer) {
        _push(`<footer class="card-footer" data-v-b74898e8>`);
        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</footer>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Card.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-b74898e8"]]), { __name: "Card" });
const employeeLogo = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='Layer_1'%20data-name='Layer%201'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%20406.96%20410.41'%3e%3cdefs%3e%3cstyle%3e%20.cls-1%20{%20fill:%20url(%23linear-gradient);%20}%20%3c/style%3e%3clinearGradient%20id='linear-gradient'%20x1='331.58'%20y1='170.4'%20x2='-12.99'%20y2='-46.14'%20gradientTransform='translate(0%20280.74)%20scale(1%20-1)'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0'%20stop-color='%230df'/%3e%3cstop%20offset='.06'%20stop-color='%2309d0ff'/%3e%3cstop%20offset='.3'%20stop-color='%232f9dff'/%3e%3cstop%20offset='.51'%20stop-color='%234b79ff'/%3e%3cstop%20offset='.68'%20stop-color='%235c63ff'/%3e%3cstop%20offset='.79'%20stop-color='%23635bff'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20class='cls-1'%20d='M186.69,135.8v.63l-24.8,14.32-33.79-19.51v106.9l-57.21-33.03v89.8c0,2.27,1.21,4.36,3.17,5.5l4.82,2.78h0c-8.59,0-17.14-1.21-25.38-3.59l-12.18-3.52V147.17c0-26.92,20.97-48.93,47.47-50.61-12.31-3.33-21.37-14.58-21.37-27.95,0-16.37,13.59-29.57,30.1-28.93,14.93,.58,27.12,12.7,27.78,27.62,.47,10.67-4.83,20.13-13.05,25.52-2.41,1.59-5.07,2.82-7.91,3.63h0c9.31,0,18.45,2.45,26.51,7.1l55.85,32.25h0Zm151.86-22.53c-8.61-9.57-20.8-15.85-34.47-16.71,12.31-3.33,21.37-14.58,21.37-27.95,0-16.37-13.59-29.57-30.11-28.93-14.93,.58-27.12,12.7-27.78,27.62-.47,10.67,4.83,20.13,13.05,25.52,2.41,1.59,5.07,2.82,7.91,3.63-4.65,0-9.27,.61-13.73,1.81-4.45,1.19-8.76,2.97-12.79,5.29l-55.85,32.25v.63l24.8,14.32,33.79-19.51v82.79c22.02-21.27,37.83-40.86,45.63-51.13l-36.55-24.37,64.71-25.26h0Zm-76.78-28.7c-.77-2.21-1.1-4.22-1.24-5.8-11.26-5.6-22.52-11.19-33.77-16.78-6.83-3.39-14.18-5.62-21.75-6.58,11.57-3.56,19.98-14.34,19.98-27.08,0-15.65-12.69-28.33-28.33-28.33s-28.33,12.68-28.33,28.33c0,12.74,8.41,23.52,19.98,27.08-7.56,.96-14.92,3.18-21.74,6.58-11.26,5.6-22.52,11.19-33.77,16.78-.14,1.58-.47,3.59-1.24,5.8-1.21,3.43-2.98,5.92-4.29,7.46,3.37,1.11,7.31,2.73,11.47,5.11,2.46,1.41,4.62,2.87,6.49,4.28l18.52-9.4v20.18l32.91,19.07,32.91-19.07v-20.18l18.52,9.4c1.87-1.41,4.04-2.87,6.49-4.28,4.16-2.39,8.1-4.01,11.47-5.11-1.31-1.55-3.08-4.03-4.29-7.46h0Zm-24.13,152.1s-9.47-9.67-33.6-10.97c14.08-3.33,24.55-15.98,24.55-31.07,0-17.63-14.29-31.92-31.92-31.92s-31.92,14.29-31.92,31.92c0,15.38,10.87,28.21,25.35,31.25-2.18,.16-4.45,.38-6.81,.68-39.61,4.95-64.07,39.59-66.33,70.54l34.09-9.95s4.05-12.35,10.13-15.11v11.05s45.06-19.6,76.46-46.43Zm56.01-95.99l29.85,19.9s-92.31,134.87-220.55,149.79c-128.24,14.93-70.75-91.75-70.75-91.75-12.67,10.5-22.26,30.72-27.36,43.42-4.29,10.66-5.87,22.27-4.16,33.63,9.21,61.2,98.41,51.74,98.41,51.74,21.85-1.96,42.57-6.05,62.09-11.66v17.01l-7.92-4.81c-2.94,2.92-46.98,8.87-46.98,8.87l93.42,53.62,160.85-94.52v-101.87l-31.51,33.19v52.23l-96.54,56.98v-49.82c85.01-45.39,133.58-111.21,133.58-111.21l27.09,20.45,13.82-119.4-113.31,44.22h0Zm-48.46,169.14v28.74l30.95-19.9-1.47-27.27-29.48,18.42h0Z'/%3e%3c/svg%3e";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "landing",
  __ssrInlineRender: true,
  setup(__props) {
    const username = vueExports.ref("");
    const password = vueExports.ref("");
    const usernameError = vueExports.ref("");
    const passwordError = vueExports.ref("");
    const loginStatusText = vueExports.ref("");
    const isSigningIn = vueExports.ref(false);
    const loginButtonText = vueExports.ref("Sign In");
    async function onSubmit() {
      usernameError.value = "";
      passwordError.value = "";
      if (!username.value.trim()) {
        usernameError.value = "Username is required.";
      }
      if (!password.value.trim()) {
        passwordError.value = "Password is required.";
      }
      if (usernameError.value || passwordError.value) {
        return;
      }
      loginStatusText.value = "";
      isSigningIn.value = true;
      loginButtonText.value = "Signing In";
      setTimeout(async () => {
        await navigateTo("/main?login=success&tab=overview");
      }, 1e3);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = __nuxt_component_0;
      const _component_IconInput = IconInput;
      const _component_Button = Button;
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(_attrs)} data-v-28469caf><div class="landing-header" data-v-28469caf><img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(employeeLogo))} alt="Employee logo" class="landing-logo" data-v-28469caf><h1 data-v-28469caf>Employee Management System</h1></div><div class="content" data-v-28469caf><div class="left-side" data-v-28469caf><div class="left-side-content" data-v-28469caf><h1 data-v-28469caf>&quot;Know who&#39;s in, when it matters.&quot;</h1><p data-v-28469caf> Our Employee Attendance Monitoring System gives you real-time insights, automates attendance tracking, and helps you run a smarter, more efficient workplace. </p></div><div class="icon-scatter" data-v-28469caf><div class="scattered-icon scattered-icon--sm scatter-pos-1" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(UsersIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--md scatter-pos-2" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ClockIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--sm scatter-pos-3" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(CalendarDaysIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--lg scatter-pos-4" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(CreditCardIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--sm scatter-pos-5" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(UsersIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--md scatter-pos-6" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ClockIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--sm scatter-pos-7" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(CalendarDaysIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--md scatter-pos-8" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(CreditCardIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--sm scatter-pos-9" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(UsersIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--lg scatter-pos-10" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ClockIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--sm scatter-pos-11" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(CalendarDaysIcon), { class: "icon" }, null, _parent));
      _push(`</div><div class="scattered-icon scattered-icon--md scatter-pos-12" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(CreditCardIcon), { class: "icon" }, null, _parent));
      _push(`</div></div></div><div class="right-side" data-v-28469caf>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Card, {
        title: "Welcome Back",
        subtitle: "Please enter your credentials to sign in."
      }, {
        "header-top": vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${serverRenderer_cjs_prodExports.ssrRenderAttr("src", vueExports.unref(employeeLogo))} alt="Employee logo" class="welcome-logo" data-v-28469caf${_scopeId}>`);
          } else {
            return [
              vueExports.createVNode("img", {
                src: vueExports.unref(employeeLogo),
                alt: "Employee logo",
                class: "welcome-logo"
              }, null, 8, ["src"])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="login-form" method="post" data-v-28469caf${_scopeId}>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_IconInput, {
              id: "username",
              modelValue: username.value,
              "onUpdate:modelValue": ($event) => username.value = $event,
              label: "Username",
              name: "username",
              placeholder: "Enter your username",
              autocomplete: "username",
              error: usernameError.value,
              required: ""
            }, {
              icon: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-28469caf${_scopeId2}><path d="M20 21a8 8 0 1 0-16 0" data-v-28469caf${_scopeId2}></path><circle cx="12" cy="7" r="4" data-v-28469caf${_scopeId2}></circle></svg>`);
                } else {
                  return [
                    (vueExports.openBlock(), vueExports.createBlock("svg", {
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.8",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "aria-hidden": "true"
                    }, [
                      vueExports.createVNode("path", { d: "M20 21a8 8 0 1 0-16 0" }),
                      vueExports.createVNode("circle", {
                        cx: "12",
                        cy: "7",
                        r: "4"
                      })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_IconInput, {
              id: "password",
              modelValue: password.value,
              "onUpdate:modelValue": ($event) => password.value = $event,
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "Enter your password",
              autocomplete: "current-password",
              error: passwordError.value,
              required: ""
            }, {
              icon: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-28469caf${_scopeId2}><rect x="4" y="10" width="16" height="10" rx="2" data-v-28469caf${_scopeId2}></rect><path d="M8 10V8a4 4 0 1 1 8 0v2" data-v-28469caf${_scopeId2}></path></svg>`);
                } else {
                  return [
                    (vueExports.openBlock(), vueExports.createBlock("svg", {
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.8",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "aria-hidden": "true"
                    }, [
                      vueExports.createVNode("rect", {
                        x: "4",
                        y: "10",
                        width: "16",
                        height: "10",
                        rx: "2"
                      }),
                      vueExports.createVNode("path", { d: "M8 10V8a4 4 0 1 1 8 0v2" })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_Button, {
              id: "login-button",
              type: "button",
              disabled: isSigningIn.value,
              onClick: onSubmit,
              variant: "solid",
              "custom-color": "#635bff",
              block: ""
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="button-content" data-v-28469caf${_scopeId2}>`);
                  if (isSigningIn.value) {
                    _push3(`<span class="button-spinner-centered" aria-hidden="true" data-v-28469caf${_scopeId2}><span class="spinner" data-v-28469caf${_scopeId2}></span><span class="spinner-text" data-v-28469caf${_scopeId2}>Signing in</span></span>`);
                  } else {
                    _push3(`<span class="button-label" data-v-28469caf${_scopeId2}>${serverRenderer_cjs_prodExports.ssrInterpolate(loginButtonText.value)}</span>`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "button-content" }, [
                      isSigningIn.value ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "button-spinner-centered",
                        "aria-hidden": "true"
                      }, [
                        vueExports.createVNode("span", { class: "spinner" }),
                        vueExports.createVNode("span", { class: "spinner-text" }, "Signing in")
                      ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "button-label"
                      }, vueExports.toDisplayString(loginButtonText.value), 1))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (loginStatusText.value) {
              _push2(`<p class="login-status-text" data-v-28469caf${_scopeId}>${serverRenderer_cjs_prodExports.ssrInterpolate(loginStatusText.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h1 class="forgot-password" data-v-28469caf${_scopeId}> Forgot password? </h1></form>`);
          } else {
            return [
              vueExports.createVNode("form", {
                class: "login-form",
                method: "post",
                onSubmit: vueExports.withModifiers(onSubmit, ["prevent"])
              }, [
                vueExports.createVNode(_component_IconInput, {
                  id: "username",
                  modelValue: username.value,
                  "onUpdate:modelValue": ($event) => username.value = $event,
                  label: "Username",
                  name: "username",
                  placeholder: "Enter your username",
                  autocomplete: "username",
                  error: usernameError.value,
                  required: ""
                }, {
                  icon: vueExports.withCtx(() => [
                    (vueExports.openBlock(), vueExports.createBlock("svg", {
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.8",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "aria-hidden": "true"
                    }, [
                      vueExports.createVNode("path", { d: "M20 21a8 8 0 1 0-16 0" }),
                      vueExports.createVNode("circle", {
                        cx: "12",
                        cy: "7",
                        r: "4"
                      })
                    ]))
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                vueExports.createVNode(_component_IconInput, {
                  id: "password",
                  modelValue: password.value,
                  "onUpdate:modelValue": ($event) => password.value = $event,
                  label: "Password",
                  name: "password",
                  type: "password",
                  placeholder: "Enter your password",
                  autocomplete: "current-password",
                  error: passwordError.value,
                  required: ""
                }, {
                  icon: vueExports.withCtx(() => [
                    (vueExports.openBlock(), vueExports.createBlock("svg", {
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.8",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "aria-hidden": "true"
                    }, [
                      vueExports.createVNode("rect", {
                        x: "4",
                        y: "10",
                        width: "16",
                        height: "10",
                        rx: "2"
                      }),
                      vueExports.createVNode("path", { d: "M8 10V8a4 4 0 1 1 8 0v2" })
                    ]))
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                vueExports.createVNode(_component_Button, {
                  id: "login-button",
                  type: "button",
                  disabled: isSigningIn.value,
                  onClick: onSubmit,
                  variant: "solid",
                  "custom-color": "#635bff",
                  block: ""
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode("div", { class: "button-content" }, [
                      isSigningIn.value ? (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 0,
                        class: "button-spinner-centered",
                        "aria-hidden": "true"
                      }, [
                        vueExports.createVNode("span", { class: "spinner" }),
                        vueExports.createVNode("span", { class: "spinner-text" }, "Signing in")
                      ])) : (vueExports.openBlock(), vueExports.createBlock("span", {
                        key: 1,
                        class: "button-label"
                      }, vueExports.toDisplayString(loginButtonText.value), 1))
                    ])
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                loginStatusText.value ? (vueExports.openBlock(), vueExports.createBlock("p", {
                  key: 0,
                  class: "login-status-text"
                }, vueExports.toDisplayString(loginStatusText.value), 1)) : vueExports.createCommentVNode("", true),
                vueExports.createVNode("h1", { class: "forgot-password" }, " Forgot password? ")
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Landing/landing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Landing = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-28469caf"]]);

export { Landing as default };
//# sourceMappingURL=landing-DczIrh9O.mjs.map
