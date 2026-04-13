<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  name: '',
  id: '',
  disabled: false,
  readonly: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => String(props.modelValue ?? ''),
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <input
    v-model="inputValue"
    class="app-input"
    :type="type"
    :placeholder="placeholder"
    :name="name || undefined"
    :id="id || undefined"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    v-bind="$attrs"
  >
</template>

<style scoped>
.app-input {
  width: 100%;
  min-height: 36px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.app-input:focus {
  border-color: #635bff;
  box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.2);
}

.app-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>