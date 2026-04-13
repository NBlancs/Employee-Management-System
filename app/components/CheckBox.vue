<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  modelValue?: boolean
  label?: string
  id?: string
  name?: string
  disabled?: boolean
  required?: boolean
  color?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  id: '',
  name: '',
  disabled: false,
  required: false,
  color: 'primary',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (nextValue: boolean) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})
</script>

<template>
  <label class="app-checkbox" :class="`app-checkbox--${size}`">
    <input
      v-model="value"
      class="app-checkbox__input"
      type="checkbox"
      :id="id || undefined"
      :name="name || undefined"
      :disabled="disabled"
      :required="required"
      v-bind="$attrs"
    >

    <span class="app-checkbox__label">
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.app-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.app-checkbox__input {
  margin: 0;
  accent-color: #2563eb;
}

.app-checkbox__label {
  font-size: 0.875rem;
  line-height: 1.2;
  white-space: nowrap;
}

.app-checkbox--xs .app-checkbox__label {
  font-size: 0.75rem;
}

.app-checkbox--sm .app-checkbox__label {
  font-size: 0.8125rem;
}

.app-checkbox--lg .app-checkbox__label {
  font-size: 0.95rem;
}

.app-checkbox--xl .app-checkbox__label {
  font-size: 1rem;
}

.app-checkbox:has(.app-checkbox__input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>