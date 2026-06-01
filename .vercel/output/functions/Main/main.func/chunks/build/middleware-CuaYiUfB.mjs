import { f as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
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

const middleware = defineNuxtRouteMiddleware((to) => {
  const authCookie = useCookie("ems_auth");
  const userCookie = useCookie("ems_user");
  if (!authCookie.value || !userCookie.value) {
    authCookie.value = "true";
    userCookie.value = JSON.stringify({
      employeeId: 1,
      accountId: 1,
      username: "admin",
      firstName: "Demo",
      middleName: "",
      lastName: "User",
      suffix: "",
      displayName: "Demo User",
      role: "admin",
      department: "Human Resources"
    });
  }
  const path = to.path.toLowerCase();
  const isAuthenticated = authCookie.value === "true";
  const isMainRoute = path === "/main" || path.startsWith("/main/");
  const isLandingRoute = path === "/landing" || path === "/";
  if (isMainRoute && !isAuthenticated) {
    return navigateTo("/landing");
  }
  if (isLandingRoute && isAuthenticated) {
    return navigateTo("/main");
  }
});

export { middleware as default };
//# sourceMappingURL=middleware-CuaYiUfB.mjs.map
