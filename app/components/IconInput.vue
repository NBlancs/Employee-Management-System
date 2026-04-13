<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineOptions({
  inheritAttrs: false,
})

type InputSize = 'sm' | 'md' | 'lg'
type InputVariant = 'outline' | 'soft'

interface Props {
  id?: string
  name?: string
  type?: string
  placeholder?: string
  icon?: string
  label?: string
  hint?: string
  error?: string
  size?: InputSize
  variant?: InputVariant
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  name: '',
  type: 'text',
  placeholder: '',
  icon: '',
  label: '',
  hint: '',
  error: '',
  size: 'md',
  variant: 'outline',
  disabled: false,
  readonly: false,
  required: false,
  fullWidth: true,
})

const model = defineModel<string | number>({
  default: '',
})

const slots = useSlots()

const hasLeadingIcon = computed(() => Boolean(slots.icon) || Boolean(props.icon))
const hasTrailingSlot = computed(() => Boolean(slots.trailing))

const wrapperClasses = computed(() => ({
  'icon-input--full': props.fullWidth,
}))

const inputClasses = computed(() => ({
  'icon-input__field--sm': props.size === 'sm',
  'icon-input__field--md': props.size === 'md',
  'icon-input__field--lg': props.size === 'lg',
  'icon-input__field--outline': props.variant === 'outline',
  'icon-input__field--soft': props.variant === 'soft',
  'icon-input__field--error': Boolean(props.error),
  'icon-input__field--with-leading': hasLeadingIcon.value,
  'icon-input__field--with-trailing': hasTrailingSlot.value,
}))
</script>

<template>
  <div class="icon-input" :class="wrapperClasses">
    <label v-if="label" class="icon-input__label" :for="id || undefined">
      {{ label }}
      <span v-if="required" class="icon-input__required" aria-label="required">*</span>
    </label>

    <div class="icon-input__control">
      <span v-if="hasLeadingIcon" class="icon-input__leading" aria-hidden="true">
        <slot name="icon">
          <span class="icon-input__icon" :class="icon" />
        </slot>
      </span>

      <input
        :id="id || undefined"
        v-model="model"
        class="icon-input__field"
        :class="inputClasses"
        :name="name || undefined"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="error ? 'true' : 'false'"
        v-bind="$attrs"
      />

      <span v-if="hasTrailingSlot" class="icon-input__trailing">
        <slot name="trailing" />
      </span>
    </div>

    <p v-if="error" class="icon-input__error">{{ error }}</p>
    <p v-else-if="hint" class="icon-input__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.icon-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.icon-input--full {
  width: 100%;
}

.icon-input__label {
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
}

.icon-input__required {
  color: #ef4444;
  margin-left: 2px;
}

.icon-input__control {
  position: relative;
  width: 100%;
}

.icon-input__leading,
.icon-input__trailing {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.icon-input__leading {
  left: 12px;
}

.icon-input__trailing {
  right: 12px;
}

.icon-input__icon {
  font-size: 1rem;
  line-height: 1;
}

.icon-input__field {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  color: #111827;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.icon-input__field:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.icon-input__field:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.icon-input__field--outline {
  background-color: #ffffff;
}

.icon-input__field--soft {
  background-color: #f9fafb;
}

.icon-input__field--sm {
  min-height: 36px;
  padding: 8px 12px;
  font-size: 0.875rem;
}

.icon-input__field--md {
  min-height: 42px;
  padding: 10px 12px;
  font-size: 0.95rem;
}

.icon-input__field--lg {
  min-height: 48px;
  padding: 12px 14px;
  font-size: 1rem;
}

.icon-input__field--with-leading.icon-input__field--sm {
  padding-left: 34px;
}

.icon-input__field--with-leading.icon-input__field--md,
.icon-input__field--with-leading.icon-input__field--lg {
  padding-left: 38px;
}

.icon-input__field--with-trailing.icon-input__field--sm {
  padding-right: 34px;
}

.icon-input__field--with-trailing.icon-input__field--md,
.icon-input__field--with-trailing.icon-input__field--lg {
  padding-right: 38px;
}

.icon-input__field--error {
  border-color: #dc2626;
}

.icon-input__field--error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.icon-input__error,
.icon-input__hint {
  font-size: 0.8rem;
}

.icon-input__error {
  color: #dc2626;
}

.icon-input__hint {
  color: #6b7280;
}
</style>