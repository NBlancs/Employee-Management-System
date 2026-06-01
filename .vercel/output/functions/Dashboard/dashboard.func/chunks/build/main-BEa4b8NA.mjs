import { _ as _export_sfc, v as vueExports, d as useRoute, u as useRouter, s as serverRenderer_cjs_prodExports, n as navigateTo } from './server.mjs';
import { A as Alert, M as Modal } from './Modal-CvY6WRb2.mjs';
import { HomeIcon, UsersIcon, ShieldCheckIcon, CalendarDaysIcon, ClockIcon, ArrowLeftOnRectangleIcon, BellIcon } from '@heroicons/vue/24/outline';
import { u as useCookie } from './cookie-Cy4TWyBi.mjs';
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

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "main",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const authCookie = useCookie("ems_auth");
    const userCookie = useCookie("ems_user");
    const loggedInUser = vueExports.computed(() => {
      if (!userCookie.value) {
        return null;
      }
      try {
        return JSON.parse(userCookie.value);
      } catch {
        return null;
      }
    });
    function getTabFromQuery(queryValue) {
      if (Array.isArray(queryValue)) {
        return queryValue[0] ?? void 0;
      }
      if (typeof queryValue === "string") {
        return queryValue;
      }
      return void 0;
    }
    const activeTab = vueExports.ref(getTabFromQuery(route.query.tab) || "overview");
    const now = vueExports.ref(/* @__PURE__ */ new Date());
    const showSignInAlert = vueExports.ref(false);
    const isLogoutConfirmOpen = vueExports.ref(false);
    const isLoggingOutOpen = vueExports.ref(false);
    const loginQuery = getTabFromQuery(route.query.login);
    if (loginQuery === "success") {
      showSignInAlert.value = true;
    }
    const userInfo = vueExports.computed(() => {
      const u = loggedInUser.value;
      if (!u) {
        return {
          fullName: "Guest User",
          role: "Guest",
          avatar: "GU"
        };
      }
      const middleInitial = u.middleName ? `${u.middleName.charAt(0).toUpperCase()}.` : "";
      const suffixPart = u.suffix ? ` ${u.suffix}` : "";
      const fullName = `${u.lastName}, ${u.firstName}${suffixPart}` + (middleInitial ? `, ${middleInitial}` : "");
      const initials = `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
      return {
        fullName,
        role: u.role,
        avatar: initials
      };
    });
    const currentTabLabel = vueExports.computed(() => {
      if (activeTab.value === "settings") {
        return "Settings";
      }
      const tab = navItems.find((item) => item.id === activeTab.value);
      return tab?.label || "Dashboard";
    });
    const formattedDate = vueExports.computed(() => {
      return now.value.toLocaleDateString(void 0, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    });
    const navItems = [
      { label: "Dashboard", icon: HomeIcon, id: "overview" },
      { label: "Employees", icon: UsersIcon, id: "employees" },
      { label: "Departments", icon: ShieldCheckIcon, id: "departments" },
      { label: "Attendance", icon: CalendarDaysIcon, id: "attendance" },
      { label: "Transactions", icon: ClockIcon, id: "transactions" }
    ];
    vueExports.watch(() => route.query.tab, (newTab) => {
      if (newTab) {
        activeTab.value = Array.isArray(newTab) ? newTab[0] : newTab;
      }
    });
    function cancelLogout() {
      isLogoutConfirmOpen.value = false;
    }
    async function confirmLogout() {
      isLogoutConfirmOpen.value = false;
      isLoggingOutOpen.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1400));
      authCookie.value = null;
      userCookie.value = null;
      isLoggingOutOpen.value = false;
      await navigateTo("/landing");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "main-page" }, _attrs))} data-v-503e18d4><div class="signin-alert-wrap" data-v-503e18d4>`);
      if (showSignInAlert.value) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Alert, {
          title: "Signed in successfully",
          message: `Signed in as ${userInfo.value.role}`,
          variant: "success",
          dismissible: "",
          onClose: ($event) => showSignInAlert.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><aside class="main-sidebar" data-v-503e18d4><div data-v-503e18d4><div class="brand-block" data-v-503e18d4><div class="user-block" data-v-503e18d4><div class="avatar" data-v-503e18d4>${serverRenderer_cjs_prodExports.ssrInterpolate(userInfo.value.avatar)}</div><div class="user-info" data-v-503e18d4><h5 data-v-503e18d4>${serverRenderer_cjs_prodExports.ssrInterpolate(userInfo.value.fullName)}</h5><span class="role-badge" data-v-503e18d4>${serverRenderer_cjs_prodExports.ssrInterpolate(userInfo.value.role)}</span></div></div></div><div class="sidebar-divider" data-v-503e18d4></div><nav class="main-nav" aria-label="Main navigation" data-v-503e18d4><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(navItems, (item) => {
        _push(`<button class="${serverRenderer_cjs_prodExports.ssrRenderClass([{ "nav-item--active": activeTab.value === item.id }, "nav-item"])}" type="button" data-v-503e18d4>`);
        serverRenderer_cjs_prodExports.ssrRenderVNode(_push, vueExports.createVNode(vueExports.resolveDynamicComponent(item.icon), {
          class: "nav-item__icon",
          "aria-hidden": "true"
        }, null), _parent);
        _push(`<span data-v-503e18d4>${serverRenderer_cjs_prodExports.ssrInterpolate(item.label)}</span></button>`);
      });
      _push(`<!--]--></nav></div><div class="sidebar-footer" data-v-503e18d4><button class="nav-item" type="button" data-v-503e18d4>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(ArrowLeftOnRectangleIcon), {
        class: "nav-item__icon",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span data-v-503e18d4>Logout</span></button></div></aside>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isLogoutConfirmOpen.value,
        "onUpdate:open": ($event) => isLogoutConfirmOpen.value = $event,
        title: "Confirm Logout",
        description: "Are you sure you want to log out?",
        "hide-trigger": true,
        "show-footer": false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="logout-copy" data-v-503e18d4${_scopeId}></p>`);
          } else {
            return [
              vueExports.createVNode("p", { class: "logout-copy" })
            ];
          }
        }),
        footer: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button type="button" class="logout-btn logout-btn--no" data-v-503e18d4${_scopeId}>No</button><button type="button" class="logout-btn logout-btn--yes" data-v-503e18d4${_scopeId}>Yes</button>`);
          } else {
            return [
              vueExports.createVNode("button", {
                type: "button",
                class: "logout-btn logout-btn--no",
                onClick: cancelLogout
              }, "No"),
              vueExports.createVNode("button", {
                type: "button",
                class: "logout-btn logout-btn--yes",
                onClick: confirmLogout
              }, "Yes")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Modal, {
        open: isLoggingOutOpen.value,
        "onUpdate:open": ($event) => isLoggingOutOpen.value = $event,
        title: "",
        description: "",
        "hide-trigger": true,
        "show-footer": false,
        dismissible: false
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="logout-loading" role="status" aria-live="polite" data-v-503e18d4${_scopeId}><span class="logout-spinner" aria-hidden="true" data-v-503e18d4${_scopeId}></span><p data-v-503e18d4${_scopeId}>Signing out</p></div>`);
          } else {
            return [
              vueExports.createVNode("div", {
                class: "logout-loading",
                role: "status",
                "aria-live": "polite"
              }, [
                vueExports.createVNode("span", {
                  class: "logout-spinner",
                  "aria-hidden": "true"
                }),
                vueExports.createVNode("p", null, "Signing out")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="main-shell" data-v-503e18d4><header class="main-header" data-v-503e18d4><h1 data-v-503e18d4>${serverRenderer_cjs_prodExports.ssrInterpolate(currentTabLabel.value)}</h1><div class="header-right" data-v-503e18d4><div class="date-time" aria-live="polite" data-v-503e18d4><span class="date-text" data-v-503e18d4>${serverRenderer_cjs_prodExports.ssrInterpolate(formattedDate.value)}</span></div><button class="bell-btn" type="button" aria-label="Notifications" data-v-503e18d4>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(BellIcon), {
        class: "bell-icon",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button></div></header><main class="main-content" data-v-503e18d4>`);
      serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "content", { activeTab: activeTab.value }, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Main/main.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Main = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-503e18d4"]]);

export { Main as default };
//# sourceMappingURL=main-BEa4b8NA.mjs.map
