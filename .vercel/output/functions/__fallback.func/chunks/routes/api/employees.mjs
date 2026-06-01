import { d as defineEventHandler, a as getMethod } from '../../_/nitro.mjs';
import { p as proxyBackendRequest } from '../../_/backend.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const mapEmployee = (e) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const info = (_a = e.user_informations) != null ? _a : {};
  const position = (_b = e.positions) != null ? _b : {};
  const department = (_c = position.departments) != null ? _c : {};
  const card = (_d = e.cards) != null ? _d : null;
  const first = ((_e = info.first_name) != null ? _e : "").trim();
  const last = ((_f = info.last_name) != null ? _f : "").trim();
  const middle = ((_g = info.middle_name) != null ? _g : "").trim();
  ((_h = info.suffix) != null ? _h : "").trim();
  const nameParts = [last, first + (middle ? " " + middle : "")].filter(Boolean);
  const name = nameParts.join(", ");
  return {
    id: e.employee_id,
    name,
    department: (_i = department.department_name) != null ? _i : "",
    cardStatus: (card == null ? void 0 : card.card_number) ? "Has Card" : "No Card",
    cardNumber: (_j = card == null ? void 0 : card.card_number) != null ? _j : "",
    raw: e
  };
};
const employees = defineEventHandler(async (event) => {
  const method = getMethod(event).toUpperCase();
  if (method === "GET") {
    const resp = await proxyBackendRequest(event);
    const employees = Array.isArray(resp == null ? void 0 : resp.data) ? resp.data : resp;
    return {
      success: true,
      message: "Employees retrieved (proxied and mapped).",
      data: employees.map(mapEmployee)
    };
  }
  return proxyBackendRequest(event);
});

export { employees as default };
//# sourceMappingURL=employees.mjs.map
