<template>
  <div
    class="word-card bg-[#d3fbe3] border-2 border-[#d3fbe3] rounded-lg cursor-pointer select-none transition-all hover:bg-[#a1eec0] hover:-translate-y-0.5 flex items-center justify-center p-2 text-center break-words font-bold h-[70px] sm:h-[80px] md:h-[95px]"
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
  if (length <= 6) return 'text-xs sm:text-sm'              // mobile ~12px, desktop ~14px
  if (length <= 8) return 'text-[0.7rem] sm:text-sm'        // mobile slightly smaller
  if (length <= 10) return 'text-[0.6rem] sm:text-[0.8rem]'
  return 'text-[0.55rem] sm:text-[0.75rem]'
})
</script>

<style scoped>
.word-card.selected {
  background-color: #a1eec0 !important;
  border-color: #a1eec0 !important;
}

.word-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  word-break: break-word;
}
</style>