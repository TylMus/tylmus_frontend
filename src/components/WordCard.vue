<template>
  <div
    class="bg-[#d3fbe3] border-2 border-[#d3fbe3] rounded-lg cursor-pointer select-none transition-all hover:bg-[#a1eec0] hover:-translate-y-0.5 flex items-center justify-center p-2 text-center break-words"
    :class="{
      'bg-[#a1eec0] border-[#88c8a1]': selected,
      'animate-scramble': scrambleAnimation
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
  .word-text {
    font-size: 0.95rem;
  }
}
@media (max-width: 576px) {
  .word-text {
    font-size: 0.9rem;
  }
}
@media (max-width: 480px) {
  .word-text {
    font-size: 0.85rem;
  }
}
@media (max-width: 375px) {
  .word-text {
    font-size: 0.8rem;
  }
}
@media (max-width: 320px) {
  .word-text {
    font-size: 0.75rem;
  }
}
</style>