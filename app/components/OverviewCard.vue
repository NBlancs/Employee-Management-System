<template>
  <div class="overview-card" :style="{ backgroundColor: bgColor }">
    <div class="card-icon" :style="{ backgroundColor: iconBgColor, color: iconColor }">
      <component :is="icon" />
    </div>
    <div class="card-content">
      <p class="card-label">{{ label }}</p>
      <h3 class="card-value">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: any
  label: string
  value: string | number
  bgColor?: string
  iconBgColor?: string
  iconStroke?: string
  iconColor?: string
}

withDefaults(defineProps<Props>(), {
  bgColor: '#e9f2ff',
  iconBgColor: '#d0e5ff',
  iconColor: '#3686ff'
})
</script>

<style scoped>
.overview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  height: 100%;
  box-sizing: border-box;
  border-radius: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-icon {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
}

.card-icon :deep(svg) {
  width: 1.75rem;
  height: 1.75rem;
  stroke-width: 2;
}

.card-content {
  flex: 1;
}

.card-label {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}


</style>
