import { defineEventHandler, getMethod } from "h3";
import { proxyBackendRequest } from "../utils/backend";

const mapEmployee = (e: any) => {
  const info = e.user_informations ?? {};
  const position = e.positions ?? {};
  const department = position.departments ?? {};
  const card = e.cards ?? null;

  const first = (info.first_name ?? '').trim();
  const last = (info.last_name ?? '').trim();
  const middle = (info.middle_name ?? '').trim();
  const suffix = (info.suffix ?? '').trim();

  const nameParts = [last, first + (middle ? ' ' + middle : '')].filter(Boolean);
  const name = nameParts.join(', ');

  return {
    id: e.employee_id,
    name,
    department: department.department_name ?? '',
    cardStatus: card?.card_number ? 'Has Card' : 'No Card',
    cardNumber: card?.card_number ?? '',
    raw: e,
  };
};

export default defineEventHandler(async (event) => {
  const method = getMethod(event).toUpperCase();

  // For listing employees we transform the backend shape into the small table shape
  if (method === 'GET') {
    const resp = await proxyBackendRequest<any>(event);

    // If backend used the standard envelope { success, message, data }
    const employees = Array.isArray(resp?.data) ? resp.data : resp;

    return {
      success: true,
      message: 'Employees retrieved (proxied and mapped).',
      data: employees.map(mapEmployee),
    };
  }

  // For other methods (POST/PUT/DELETE) just forward to backend
  return proxyBackendRequest(event);
});
