import type { H3Event } from "h3";
import { createError, getMethod, getRequestHeaders, getRequestURL, readBody } from "h3";

const HOP_BY_HOP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
]);

const getBackendBaseUrl = (event: H3Event): string => {
  const config = useRuntimeConfig(event);
  const baseUrl = config.public.apiBaseUrl || 'http://localhost:5000';

  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Backend API base URL is not configured.",
    });
  }

  return baseUrl;
};

const buildForwardHeaders = (event: H3Event) => {
  const incomingHeaders = getRequestHeaders(event);
  const forwardedHeaders: Record<string, string> = {};

  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (value === undefined || HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      continue;
    }

    forwardedHeaders[key] = Array.isArray(value) ? value.join(",") : value;
  }

  return forwardedHeaders;
};

export async function proxyBackendRequest<T>(event: H3Event): Promise<T> {
  const method = getMethod(event);
  const requestUrl = getRequestURL(event);
  const backendUrl = new URL(requestUrl.pathname.replace(/^\/api\//, "/api/"), getBackendBaseUrl(event));

  for (const [key, value] of requestUrl.searchParams.entries()) {
    backendUrl.searchParams.append(key, value);
  }

  const body = method === "GET" || method === "HEAD" ? undefined : await readBody(event);

  try {
    return await $fetch<T>(backendUrl.toString(), {
      method,
      body,
      headers: buildForwardHeaders(event),
    });
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage:
        error?.data?.message ||
        error?.response?._data?.message ||
        error?.message ||
        "Backend request failed.",
    });
  }
}