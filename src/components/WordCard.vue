<template>
  <div
    class="word-card bg-[#d3fbe3] border-2 border-[#d3fbe3] rounded-lg cursor-pointer select-none transition-all hover:bg-[#a1eec0] hover:-translate-y-0.5 flex items-center justify-center p-1 text-center break-words aspect-square font-bold"
    :class="{
      'selected': selected,
      'animate-scramble will-change-transform': scrambleAnimation
    }"
    @click="$emit('click', word)"
  >
    <span class="word-text">{{ word }}</span>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  word: string
  selected?: boolean
  scrambleAnimation?: boolean
}>()
defineEmits<{ (e: 'click', word: string): void }>()
</script>

<style scoped>
.word-card.selected {
  background-color: #2e7d32 !important;
  border-color: #81c784 !important;
  color: white !important;
}

.word-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1rem;
  line-height: 1.3;
  word-break: break-word;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .word-text { font-size: 0.95rem; }
}
@media (max-width: 576px) {
  .word-text { font-size: 0.9rem; }
}
@media (max-width: 480px) {
  .word-text { font-size: 0.85rem; }
}
@media (max-width: 375px) {
  .word-text { font-size: 0.8rem; }
}
@media (max-width: 320px) {
  .word-text { font-size: 0.75rem; }
}
</style>

