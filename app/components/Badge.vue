<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  color?: string
  variant?: string
  size?: string
  ui?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Badge',
  color: 'neutral',
  variant: 'subtle',
  size: 'sm'
})

const badgeClasses = computed(() => ({
  'app-badge--sm': props.size === 'sm',
  'app-badge--md': props.size === 'md',
  'app-badge--lg': props.size === 'lg',
  'app-badge--outline': props.variant === 'outline',
  'app-badge--soft': props.variant === 'soft',
  'app-badge--subtle': props.variant === 'subtle',
  'app-badge--solid': props.variant === 'solid',
  'app-badge--green': props.color === 'green',
  'app-badge--red': props.color === 'red',
  'app-badge--neutral': !['green', 'red'].includes(props.color)
}))
</script>

<template>
  <span class="app-badge" :class="badgeClasses">
    <slot>{{ label }}</slot>
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid transparent;
  line-height: 1;
  white-space: nowrap;
  font-size: 0.6rem;
  font-weight: 200;
}

.app-badge--sm {
  min-height: 22px;
  padding: 4px 10px;
  font-size: 0.6rem;
}

.app-badge--md {
  min-height: 24px;
  padding: 5px 11px;
  font-size: 0.6rem;
}

.app-badge--lg {
  min-height: 28px;
  padding: 6px 12px;
  font-size: 0.6rem;
}

.app-badge--subtle.app-badge--green,
.app-badge--soft.app-badge--green {
  color: #166534;
  background: #dcfce7;
  border-color: #bbf7d0;
}

.app-badge--subtle.app-badge--red,
.app-badge--soft.app-badge--red {
  color: #991b1b;
  background: #fee2e2;
  border-color: #fecaca;
}

.app-badge--subtle.app-badge--neutral,
.app-badge--soft.app-badge--neutral {
  color: #374151;
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.app-badge--outline.app-badge--green {
  color: #166534;
  background: #ffffff;
  border-color: #86efac;
}

.app-badge--outline.app-badge--red {
  color: #991b1b;
  background: #ffffff;
  border-color: #fca5a5;
}

.app-badge--outline.app-badge--neutral {
  color: #374151;
  background: #ffffff;
  border-color: #d1d5db;
}

.app-badge--solid.app-badge--green {
  color: #ffffff;
  background: #16a34a;
  border-color: #16a34a;
}

.app-badge--solid.app-badge--red {
  color: #ffffff;
  background: #dc2626;
  border-color: #dc2626;
}

.app-badge--solid.app-badge--neutral {
  color: #ffffff;
  background: #6b7280;
  border-color: #6b7280;
}
</style>