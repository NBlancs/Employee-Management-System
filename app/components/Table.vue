<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface TableColumn {
  accessorKey?: string
  id?: string
  header: string
}

interface Props {
  data?: Record<string, unknown>[]
  columns?: TableColumn[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => []
})
const slots = useSlots()

const resolvedColumns = computed<TableColumn[]>(() => {
  if (props.columns && props.columns.length > 0) {
    return props.columns
  }

  const firstRow = props.data?.[0]
  if (!firstRow) {
    return []
  }

  return Object.keys(firstRow).map(key => ({
    accessorKey: key,
    header: key
  }))
})

function slotNameForColumn(column: TableColumn): string {
  return `${column.id ?? column.accessorKey ?? ''}-cell`
}

function hasSlot(column: TableColumn): boolean {
  return Boolean(slots[slotNameForColumn(column)])
}

function getCellValue(row: Record<string, unknown>, column: TableColumn): unknown {
  const key = column.accessorKey
  return key ? row[key] : ''
}
</script>

<template>
  <div class="app-table-wrap" v-bind="$attrs">
    <table class="app-table">
      <thead>
        <tr>
          <th v-for="column in resolvedColumns" :key="column.id ?? column.accessorKey ?? column.header">
            {{ column.header }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in data" :key="`row-${index}`">
          <td v-for="column in resolvedColumns" :key="`${index}-${column.id ?? column.accessorKey ?? column.header}`">
            <slot
              v-if="hasSlot(column)"
              :name="slotNameForColumn(column)"
              :row="{ original: row }"
            />
            <template v-else>
              {{ getCellValue(row, column) }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
