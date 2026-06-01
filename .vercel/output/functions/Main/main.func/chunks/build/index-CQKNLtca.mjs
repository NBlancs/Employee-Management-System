import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import Employee from './employee-U3PwnO3k.mjs';
import NewEmployee from './new-employee-C2PY0d8c.mjs';
import EmployeeInfo from './employee-info-_T6I7PCW.mjs';
import { u as useState } from './state-CMS2XX0u.mjs';
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
import '@heroicons/vue/24/outline';
import './IconInput-DYVe1Baj.mjs';
import './Button-Du_vXkIz.mjs';
import './CheckBox-DdsHZ8M1.mjs';
import './Modal-gsHbAz6A.mjs';
import './cookie-Cy4TWyBi.mjs';
import './Input-VFrQiZfx.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const currentView = vueExports.ref("list");
    const showSuccessAlert = vueExports.ref(false);
    const selectedEmployeeId = vueExports.ref(null);
    const sharedEmployeeRows = useState("employees-table-rows", () => []);
    const employeeDirectory = vueExports.ref([
      {
        id: 1,
        department: "IT",
        position: "Senior",
        salary: 48e3,
        firstName: "Joel Kent",
        middleName: "",
        lastName: "Lascuna",
        suffix: "",
        gender: "Male",
        birthdate: "1995-06-18",
        age: 30,
        province: "Cebu",
        city: "Cebu City",
        barangay: "Lahug",
        zipCode: "6000",
        contactNumber: "09171234567",
        username: "joel.kent",
        cardStatus: "Has Card",
        cardNumber: "IDC-IT-1001"
      },
      {
        id: 2,
        department: "HR",
        position: "Manager",
        salary: 52e3,
        firstName: "Jayneth",
        middleName: "",
        lastName: "Valle",
        suffix: "",
        gender: "Female",
        birthdate: "1993-03-09",
        age: 33,
        province: "Bohol",
        city: "Tagbilaran",
        barangay: "Cogon",
        zipCode: "6300",
        contactNumber: "09172345678",
        username: "jayneth.valle",
        cardStatus: "Has Card",
        cardNumber: "IDC-HR-1002"
      },
      {
        id: 3,
        department: "Finance",
        position: "Junior",
        salary: 28e3,
        firstName: "Walter",
        middleName: "",
        lastName: "Maturan",
        suffix: "",
        gender: "Male",
        birthdate: "1998-11-23",
        age: 27,
        province: "Leyte",
        city: "Tacloban",
        barangay: "Sagkahan",
        zipCode: "6500",
        contactNumber: "09173456789",
        username: "walter.maturan",
        cardStatus: "No Card",
        cardNumber: ""
      },
      {
        id: 4,
        department: "IT",
        position: "Intern",
        salary: 18e3,
        firstName: "Je-ann",
        middleName: "",
        lastName: "Callo",
        suffix: "",
        gender: "Female",
        birthdate: "2002-01-12",
        age: 24,
        province: "Cebu",
        city: "Mandaue",
        barangay: "Banilad",
        zipCode: "6014",
        contactNumber: "09174567890",
        username: "jeann.callo",
        cardStatus: "Has Card",
        cardNumber: "IDC-IT-1004"
      }
    ]);
    vueExports.watch(sharedEmployeeRows, (rows) => {
      if (!rows || rows.length === 0) {
        return;
      }
      employeeDirectory.value = employeeDirectory.value.map((employee) => {
        const row = rows.find((item) => item.id === employee.id);
        if (!row) {
          return employee;
        }
        return {
          ...employee,
          cardStatus: row.cardStatus,
          cardNumber: row.cardNumber
        };
      });
    }, { immediate: true, deep: true });
    function formatEmployeeDisplayName(employee) {
      const firstNameTokens = employee.firstName.trim().split(/\s+/);
      const firstName = firstNameTokens[0] || "";
      const lastName = employee.lastName.trim() || "";
      const suffix = employee.suffix.trim() ? ` ${employee.suffix.trim()}` : "";
      const middleNameTrimmed = employee.middleName.trim();
      const middleInitial = middleNameTrimmed ? `${middleNameTrimmed.charAt(0).toUpperCase()}.` : "";
      return `${lastName}, ${firstName}${suffix}${middleInitial ? `, ${middleInitial}` : ""}`;
    }
    const employeeRows = vueExports.computed(() => {
      return employeeDirectory.value.map((employee) => ({
        id: employee.id,
        name: formatEmployeeDisplayName(employee),
        cardStatus: employee.cardStatus,
        department: employee.department,
        cardNumber: employee.cardNumber
      }));
    });
    function openNewEmployee() {
      selectedEmployeeId.value = null;
      currentView.value = "new";
    }
    function backToList() {
      selectedEmployeeId.value = null;
      currentView.value = "list";
    }
    function openEmployeeInfo(employeeId) {
      selectedEmployeeId.value = employeeId;
      currentView.value = "info";
    }
    function onEmployeeCreated(payload) {
      const [lastName = "", firstNameRaw = ""] = payload.name.split(",");
      const firstName = firstNameRaw.trim().split(" ")[0] ?? "";
      employeeDirectory.value = [
        ...employeeDirectory.value,
        {
          id: payload.id,
          department: payload.department,
          position: "",
          salary: 0,
          firstName,
          middleName: "",
          lastName: lastName.trim(),
          suffix: "",
          gender: "",
          birthdate: "",
          age: 0,
          province: "",
          city: "",
          barangay: "",
          zipCode: "",
          contactNumber: "",
          username: "",
          cardStatus: payload.cardStatus,
          cardNumber: payload.cardNumber
        }
      ];
      sharedEmployeeRows.value = [
        ...sharedEmployeeRows.value,
        {
          id: payload.id,
          name: payload.name,
          cardStatus: payload.cardStatus,
          department: payload.department,
          cardNumber: payload.cardNumber
        }
      ];
      showSuccessAlert.value = true;
      setTimeout(() => {
        showSuccessAlert.value = false;
      }, 3e3);
    }
    function onEmployeeCardStatusUpdated(payload) {
      employeeDirectory.value = employeeDirectory.value.map((employee) => {
        if (employee.id !== payload.employeeId) {
          return employee;
        }
        return {
          ...employee,
          cardStatus: payload.cardStatus,
          cardNumber: payload.cardNumber
        };
      });
    }
    function onEmployeeDeleted(employeeId) {
      employeeDirectory.value = employeeDirectory.value.filter((employee) => employee.id !== employeeId);
      sharedEmployeeRows.value = sharedEmployeeRows.value.filter((employee) => employee.id !== employeeId);
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (currentView.value === "list" && selectedEmployeeId.value === null) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Employee, vueExports.mergeProps({
          showSuccessAlert: showSuccessAlert.value,
          employees: employeeRows.value,
          onAddEmployee: openNewEmployee,
          onViewEmployee: openEmployeeInfo,
          onDeleteEmployee: onEmployeeDeleted
        }, _attrs), null, _parent));
      } else if (currentView.value === "new") {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(NewEmployee, vueExports.mergeProps({
          onBack: backToList,
          onEmployeeCreated
        }, _attrs), null, _parent));
      } else if (currentView.value === "info" && selectedEmployeeId.value !== null) {
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(EmployeeInfo, vueExports.mergeProps({
          employeeId: selectedEmployeeId.value,
          employees: employeeDirectory.value,
          onBack: backToList,
          onUpdateCardStatus: onEmployeeCardStatusUpdated
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Employees/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CQKNLtca.mjs.map
