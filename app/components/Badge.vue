<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    color?: string
    variant?: string
    size?: string
    ui?: Record<string, unknown>
  }>(),
  {
    label: 'Badge',
    color: 'neutral',
    variant: 'outline'
  }
)
</script>

<template>
  <UBadge :color="color" :variant="variant" :size="size" :ui="ui">
    <slot>{{ label }}</slot>
  </UBadge>
</template>