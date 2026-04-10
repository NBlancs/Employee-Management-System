<script setup lang="ts">
interface Props {
  data?: Record<string, unknown>[]
}

withDefaults(defineProps<Props>(), {
  data: () => []
})
</script>

<template>
  <UTable :data="data" class="flex-1" v-bind="$attrs" />
</template>
