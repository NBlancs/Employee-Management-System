import { v as vueExports, s as serverRenderer_cjs_prodExports } from './server.mjs';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "Table",
  __ssrInlineRender: true,
  props: {
    data: { default: () => [] },
    columns: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const slots = vueExports.useSlots();
    const resolvedColumns = vueExports.computed(() => {
      if (props.columns && props.columns.length > 0) {
        return props.columns;
      }
      const firstRow = props.data?.[0];
      if (!firstRow) {
        return [];
      }
      return Object.keys(firstRow).map((key) => ({
        accessorKey: key,
        header: key
      }));
    });
    function slotNameForColumn(column) {
      return `${column.id ?? column.accessorKey ?? ""}-cell`;
    }
    function hasSlot(column) {
      return Boolean(slots[slotNameForColumn(column)]);
    }
    function getCellValue(row, column) {
      const key = column.accessorKey;
      return key ? row[key] : "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "app-table-wrap" }, _ctx.$attrs, _attrs))}><table class="app-table"><thead><tr><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(resolvedColumns.value, (column) => {
        _push(`<th>${serverRenderer_cjs_prodExports.ssrInterpolate(column.header)}</th>`);
      });
      _push(`<!--]--></tr></thead><tbody><!--[-->`);
      serverRenderer_cjs_prodExports.ssrRenderList(__props.data, (row, index) => {
        _push(`<tr><!--[-->`);
        serverRenderer_cjs_prodExports.ssrRenderList(resolvedColumns.value, (column) => {
          _push(`<td>`);
          if (hasSlot(column)) {
            serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, slotNameForColumn(column), {
              row: { original: row }
            }, null, _push, _parent);
          } else {
            _push(`<!--[-->${serverRenderer_cjs_prodExports.ssrInterpolate(getCellValue(row, column))}<!--]-->`);
          }
          _push(`</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Table = Object.assign(_sfc_main, { __name: "Table" });

export { Table as T };
//# sourceMappingURL=Table-DpzCIhLT.mjs.map
