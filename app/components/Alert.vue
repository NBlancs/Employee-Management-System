<script setup lang="ts">
import { computed } from 'vue'

type AlertVariant = 'error' | 'success' | 'warning' | 'info'

interface Props {
  title?: string
  message?: string
  variant?: AlertVariant
  dismissible?: boolean
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  message: '',
  variant: 'info',
  dismissible: false,
  showIcon: true,
})

const visible = defineModel<boolean>('visible', {
  default: true,
})

const emit = defineEmits<{
  close: []
}>()

const variantClass = computed(() => `app-alert--${props.variant}`)

const iconSymbol = computed(() => {
  if (props.variant === 'success') return 'check'
  if (props.variant === 'warning') return 'warning'
  if (props.variant === 'error') return 'error'
  return 'info'
})

function closeAlert() {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Transition name="alert-slide">
    <section
      v-if="visible"
      class="app-alert"
      :class="variantClass"
      role="alert"
      aria-live="polite"
    >
      <span v-if="showIcon" class="app-alert__icon" aria-hidden="true">
        <svg v-if="iconSymbol === 'check'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m20 6-11 11-5-5" />
        </svg>
        <svg v-else-if="iconSymbol === 'warning'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
        <svg v-else-if="iconSymbol === 'error'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </span>

      <div class="app-alert__content">
        <p v-if="title || $slots.title" class="app-alert__title">
          <slot name="title">{{ title }}</slot>
        </p>
        <p v-if="message || $slots.default" class="app-alert__message">
          <slot>{{ message }}</slot>
        </p>
      </div>

      <button v-if="dismissible" type="button" class="app-alert__close" aria-label="Dismiss alert" @click="closeAlert">
        x
      </button>
    </section>
  </Transition>
</template>

<style scoped>
.app-alert {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 10px;
}

.app-alert__icon {
  margin-top: 1px;
}

.app-alert__title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
}

.app-alert__message {
  margin-top: 4px;
  font-size: 0.88rem;
  line-height: 1.45;
}

.app-alert__close {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 2px;
}

.app-alert--info {
  background: #eef4ff;
  border-color: #c7d7fe;
  color: #1e40af;
}

.app-alert--success {
  background: #ecfdf3;
  border-color: #a7f3d0;
  color: #166534;
}

.app-alert--warning {
  background: #fffbeb;
  border-color: #fcd34d;
  color: #92400e;
}

.app-alert--error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.alert-slide-enter-from,
.alert-slide-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

.alert-slide-enter-to,
.alert-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>