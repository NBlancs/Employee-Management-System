<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Card Title',
  subtitle: '',
})
</script>

<template>
  <article class="card">
    <header class="card-header">
      <slot name="header-top" />
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
    </header>

    <section class="card-body">
      <slot>
        <p>Add your card content here.</p>
      </slot>
    </section>

    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.card {
  background: #ffffff;
  border: 1px solid #e6e8ec;
  border-radius: 12px;
  box-shadow: 0 10px 25px -20px rgba(0, 0, 0, 0.35);
  padding: 20px;
}

.card-header {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.card-title {
  color: #1f2937;
  font-size: clamp(1rem, 1.4vw, 1.2rem);
  line-height: 1.2;
  color: #635bff;
}

.card-subtitle {
  color: #6b7280;
  margin-top: 4px;
  font-size: 0.9rem;
}

.card-body {
  color: #374151;
  font-size: 0.95rem;
}

.card-footer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #eef1f5;
}
</style>
