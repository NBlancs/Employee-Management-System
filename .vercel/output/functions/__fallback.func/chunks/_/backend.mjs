import { a as getMethod, b as getRequestURL, r as readBody, c as createError, e as useRuntimeConfig, f as getRequestHeaders } from './nitro.mjs';

const HOP_BY_HOP_HEADERS = /* @__PURE__ */ new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding"
]);
const getBackendBaseUrl = (event) => {
  const config = useRuntimeConfig(event);
  const baseUrl = config.public.apiBaseUrl || "http://localhost:5000";
  return baseUrl;
};
const buildForwardHeaders = (event) => {
  const incomingHeaders = getRequestHeaders(event);
  const forwardedHeaders = {};
  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (value === void 0 || HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      continue;
    }
    forwardedHeaders[key] = Array.isArray(value) ? value.join(",") : value;
  }
  return forwardedHeaders;
};
async function proxyBackendRequest(event) {
  var _a, _b, _c;
  const method = getMethod(event);
  const requestUrl = getRequestURL(event);
  const backendUrl = new URL(requestUrl.pathname.replace(/^\/api\//, "/api/"), getBackendBaseUrl(event));
  for (const [key, value] of requestUrl.searchParams.entries()) {
    backendUrl.searchParams.append(key, value);
  }
  const body = method === "GET" || method === "HEAD" ? void 0 : await readBody(event);
  try {
    return await $fetch(backendUrl.toString(), {
      method,
      body,
      headers: buildForwardHeaders(event)
    });
  } catch (error) {
    throw createError({
      statusCode: (error == null ? void 0 : error.statusCode) || (error == null ? void 0 : error.status) || 500,
      statusMessage: ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || ((_c = (_b = error == null ? void 0 : error.response) == null ? void 0 : _b._data) == null ? void 0 : _c.message) || (error == null ? void 0 : error.message) || "Backend request failed."
    });
  }
}

export { proxyBackendRequest as p };
//# sourceMappingURL=backend.mjs.map
