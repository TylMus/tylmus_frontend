<template>
  <div
    class="word-card w-full min-w-[78px] sm:min-w-[96px] md:min-w-[116px] bg-[#d3fbe3] border-2 border-[#d3fbe3] rounded-lg cursor-pointer select-none transition-all hover:bg-[#baf4d1] hover:border-[#baf4d1] hover:-translate-y-0.5 flex items-center justify-center p-2 text-center break-words font-bold uppercase h-[80px] sm:h-[90px] md:h-[102px]"
    :class="[
      textSizeClass,
      {
        'selected': selected,
        'animate-scramble will-change-transform': scrambleAnimation
      }
    ]"
    @click="$emit('click', word)"
  >
    <span class="word-text">{{ word }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  word: string
  selected?: boolean
  scrambleAnimation?: boolean
}>()

defineEmits<{ (e: 'click', word: string): void }>()

const textSizeClass = computed(() => {
  const length = props.word.length
  if (length <= 4) return 'text-sm sm:text-base'
  if (length <= 6) return 'text-xs sm:text-sm'
  if (length <= 8) return 'text-xs sm:text-sm'
  if (length <= 10) return 'text-[0.72rem] sm:text-[0.82rem]'
  return 'text-[0.65rem] sm:text-[0.72rem]'
})
</script>

<style scoped>
.word-card.selected {
  background-color: #a1eec0 !important;
  border-color: #1b6a44 !important;
}

.word-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.15;
  word-break: break-word;
  max-width: 100%;
  width: 100%;
  text-wrap: balance;
}
</style>