<template>
  <div
    class="bg-[#d3fbe3] border-2 border-[#d3fbe3] rounded-lg cursor-pointer select-none transition-all hover:bg-[#a1eec0] hover:-translate-y-0.5 grid-item"
    :class="{
      'bg-[#a1eec0] border-[#88c8a1]': selected,
      'animate-scramble': scrambleAnimation
    }"
    @click="$emit('click', word)"
  >
    <div class="w-full max-h-full overflow-hidden line-clamp-3 text-center break-words p-2">
      {{ word }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  word: string
  selected?: boolean
  scrambleAnimation?: boolean
}>()

defineEmits<{
  (e: 'click', word: string): void
}>()
</script>

<style scoped>
/* Keep minimal scoped styles if needed for grid-item sizing */
.grid-item {
  min-height: 100px;
  max-height: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 6px;
  font-weight: 600;
  text-align: center;
  overflow: hidden;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
  font-size: 1em;
}

@media (max-width: 768px) {
  .grid-item {
    min-height: 85px;
    max-height: 85px;
    height: 85px;
    font-size: 0.95em;
  }
}

@media (max-width: 576px) {
  .grid-item {
    min-height: 75px;
    max-height: 75px;
    height: 75px;
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .grid-item {
    min-height: 65px;
    max-height: 65px;
    height: 65px;
    font-size: 0.85em;
  }
}

@media (max-width: 375px) {
  .grid-item {
    min-height: 55px;
    max-height: 55px;
    height: 55px;
    font-size: 0.8em;
  }
}
</style>