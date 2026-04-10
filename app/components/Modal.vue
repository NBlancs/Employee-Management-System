<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  title?: string
  description?: string
  triggerLabel?: string
  triggerColor?: string
  triggerVariant?: string
  confirmLabel?: string
  cancelLabel?: string
  showFooter?: boolean
  dismissible?: boolean
  hideTrigger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Modal Title',
  description: '',
  triggerLabel: 'Open Modal',
  triggerColor: 'neutral',
  triggerVariant: 'subtle',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  showFooter: false,
  dismissible: true,
  hideTrigger: false,
})

const open = defineModel<boolean>('open', {
  default: false,
})

const slots = useSlots()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function closeModal() {
  open.value = false
}

function handleCancel() {
  emit('cancel')
  closeModal()
}

function handleConfirm() {
  emit('confirm')
  closeModal()
}

function openModal() {
  open.value = true
}
</script>

<template>
  <slot v-if="!hideTrigger" name="trigger" :open="openModal">
    <button type="button" class="app-modal__trigger" @click="openModal">
      {{ triggerLabel }}
    </button>
  </slot>

  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="app-modal__overlay" @click="dismissible ? closeModal() : undefined">
        <div class="app-modal" role="dialog" aria-modal="true" @click.stop>
          <header v-if="title || description || slots.header" class="app-modal__header">
            <slot name="header">
              <h3 v-if="title" class="app-modal__title">{{ title }}</h3>
              <p v-if="description" class="app-modal__description">{{ description }}</p>
            </slot>
          </header>

          <section class="app-modal__body">
            <slot>
              <p>Add your modal content here.</p>
            </slot>
          </section>

          <footer v-if="showFooter || slots.footer" class="app-modal__footer">
            <slot name="footer" :confirm="handleConfirm" :cancel="handleCancel" :close="closeModal">
              <button type="button" class="app-modal__btn app-modal__btn--ghost" @click="handleCancel">{{ cancelLabel }}</button>
              <button type="button" class="app-modal__btn app-modal__btn--primary" @click="handleConfirm">{{ confirmLabel }}</button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 999;
}

.app-modal {
  width: min(100%, 420px);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 20px 40px -24px rgba(0, 0, 0, 0.5);
  padding: 16px;
}

.app-modal__trigger {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  padding: 10px 14px;
  cursor: pointer;
}

.app-modal__header {
  margin-bottom: 12px;
}

.app-modal__title {
  color: #111827;
  font-size: 1.1rem;
  line-height: 1.2;
}

.app-modal__description {
  margin-top: 4px;
  color: #6b7280;
  font-size: 0.9rem;
}

.app-modal__body {
  color: #374151;
  font-size: 0.95rem;
}

.app-modal__footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.app-modal__btn {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.app-modal__btn--ghost {
  border-color: #d1d5db;
  background: #ffffff;
  color: #374151;
}

.app-modal__btn--primary {
  border-color: #635bff;
  background: #635bff;
  color: #ffffff;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>