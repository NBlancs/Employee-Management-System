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
  const path = to.path.toLowerCase();
  const parseUserCookie = () => {
    if (!userCookie.value) {
      return null;
    }
    try {
      return JSON.parse(userCookie.value);
    } catch {
      return null;
    }
  };
  const currentUser = parseUserCookie();
  const isAuthenticated = authCookie.value === "true" && !!currentUser;
  const userRole = currentUser?.role?.toLowerCase() ?? "";
  const userDepartment = currentUser?.department?.toLowerCase() ?? "";
  const isAllowedDepartmentAndPosition = () => {
    const isHRDepartment = userDepartment.includes("human resources") || userDepartment.includes("hr");
    const allowedPositions = [
      "department head",
      "chief human resources officer",
      "hr generalist",
      "admin"
    ];
    const isAllowedPosition = allowedPositions.includes(userRole);
    return isHRDepartment && isAllowedPosition;
  };
  const isAllowedRole = isAllowedDepartmentAndPosition();
  const isMainRoute = path === "/main" || path.startsWith("/main/");
  if (isAuthenticated && !isAllowedRole) {
    authCookie.value = null;
    userCookie.value = null;
    if (isMainRoute) {
      return navigateTo("/landing");
    }
  }
  if (authCookie.value === "true" && !currentUser) {
    authCookie.value = null;
    userCookie.value = null;
  }
  if (isMainRoute && (!isAuthenticated || !isAllowedRole)) {
    return navigateTo("/landing");
  }
});

export { middleware as default };
//# sourceMappingURL=middleware-BxQO7Idf.mjs.map
