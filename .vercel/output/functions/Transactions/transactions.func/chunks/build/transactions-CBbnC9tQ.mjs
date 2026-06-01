import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { I as IconInput } from './IconInput-DYVe1Baj.mjs';
import { B as Button } from './Button-Du_vXkIz.mjs';
import { T as Table } from './Table-DpzCIhLT.mjs';
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
  __name: "transactions",
  __ssrInlineRender: true,
  setup(__props) {
    const searchQuery = vueExports.ref("");
    const selectedDate = vueExports.ref("");
    const transactionRows = vueExports.ref([]);
    vueExports.ref(false);
    const transactionColumns = [
      { accessorKey: "transactionNo", header: "Transaction No." },
      { accessorKey: "processedBy", header: "Processed By" },
      { accessorKey: "classification", header: "Classification" },
      { accessorKey: "referenceNo", header: "Reference No." },
      { accessorKey: "date", header: "Date" }
    ];
    const filteredTransactionRows = vueExports.computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      const dateFilter = selectedDate.value;
      return transactionRows.value.filter((row) => {
        const matchesQuery = !query || row.transactionNo.toLowerCase().includes(query);
        const matchesDate = !dateFilter || row.dateValue === dateFilter;
        return matchesQuery && matchesDate;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "transaction-page" }, _attrs))} data-v-653072fc><h1 class="transaction-title" data-v-653072fc>Transaction Management</h1><form class="transaction-search" data-v-653072fc><div class="search-input-wrap" data-v-653072fc>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(IconInput, {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        size: "sm",
        placeholder: "Search transaction",
        "aria-label": "Search transaction"
      }, {
        icon: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(MagnifyingGlassIcon), { class: "search-icon" }, null, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(vueExports.unref(MagnifyingGlassIcon), { class: "search-icon" })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (searchQuery.value) {
        _push(`<button type="button" class="clear-search-btn" aria-label="Clear search" data-v-653072fc>`);
        _push(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(XMarkIcon), { class: "clear-icon" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Button, {
        label: "Search",
        variant: "solid",
        type: "submit",
        class: "search-button"
      }, null, _parent));
      _push(`<div class="date-field" data-v-653072fc><input id="transaction-date"${serverRenderer_cjs_prodExports.ssrRenderAttr("value", selectedDate.value)} type="date" class="date-input" aria-label="Filter by transaction date" data-v-653072fc>`);
      if (selectedDate.value) {
        _push(`<button type="button" class="clear-date-button" data-v-653072fc> Clear </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form><div class="form-divider" aria-hidden="true" data-v-653072fc></div><div class="transactions-table-wrap" data-v-653072fc>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(Table, {
        data: filteredTransactionRows.value,
        columns: transactionColumns,
        class: "transactions-table"
      }, null, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Transactions/transactions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Transactions = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-653072fc"]]);

export { Transactions as default };
//# sourceMappingURL=transactions-CBbnC9tQ.mjs.map
