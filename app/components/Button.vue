<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  label?: string
  color?: string
  variant?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  square?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: string
  trailingIcon?: string
  customColor?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  color: 'neutral',
  variant: 'outline',
  size: 'md',
  type: 'button',
  block: false,
  square: false,
  loading: false,
  disabled: false,
  icon: '',
  trailingIcon: '',
  customColor: '',
  textColor: '#ffffff',
})

const variantClasses = computed(() => ({
  'app-button--outline': props.variant === 'outline',
  'app-button--solid': props.variant === 'solid',
  'app-button--subtle': props.variant === 'subtle',
}))

const buttonStyle = computed(() => {
  if (props.customColor && props.variant === 'outline') {
    return {
      color: props.customColor,
      borderColor: props.customColor,
    }
  }

  if (props.customColor) {
    return {
      backgroundColor: props.customColor,
      borderColor: props.customColor,
      color: props.textColor,
    }
  }

  return undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <button
    class="app-button"
    :class="[{ 'app-button--block': block }, variantClasses]"
    :type="type"
    :disabled="disabled"
    :aria-disabled="disabled || loading ? 'true' : 'false'"
    :style="buttonStyle"
    v-bind="$attrs"
    @click="onClick"
  >
    <span v-if="icon" class="app-button__icon" :class="icon" aria-hidden="true" />
    <slot>{{ label || 'Button' }}</slot>
    <span v-if="trailingIcon" class="app-button__icon" :class="trailingIcon" aria-hidden="true" />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  margin-inline: auto;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  transform: translateY(0) scale(1);
  transition: transform 0.14s ease, box-shadow 0.2s ease;
  will-change: transform;
}

.app-button--solid {
  background-color: #635bff;
  border-color: #635bff;
  color: #ffffff;
}

.app-button--outline {
  background-color: #ffffff;
  border-color: #d1d5db;
  color: #374151;
}

.app-button--subtle {
  background-color: #f3f4f6;
  border-color: transparent;
  color: #374151;
}

.app-button--block {
  width: 100%;
  margin-inline: 0;
}

.app-button:hover {
  cursor: pointer;
}

.app-button:active {
  transform: translateY(1px) scale(0.97);
}

.app-button:disabled,
.app-button[aria-disabled='true'] {
  transform: none;
  opacity: 0.65;
  cursor: not-allowed;
}

.app-button__icon {
  line-height: 1;
}
</style>