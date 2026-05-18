import { defineEventHandler } from "h3";
import { proxyBackendRequest } from "../utils/backend";

export default defineEventHandler(async (event) => {
  return proxyBackendRequest(event);
});