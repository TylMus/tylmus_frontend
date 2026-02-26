<template>
  <div
    class="rounded-xl text-gray-800 font-semibold text-center w-full flex items-center justify-center animate-fade-in"
    :class="[colorClass, 'min-h-[100px] p-4 mx-auto']"
  >
    <div class="flex flex-col gap-2 w-full">
      <strong class="text-lg break-words">{{ name }}</strong>
      <div class="flex flex-wrap justify-center gap-2 text-sm opacity-90 font-normal">
        <span v-for="(word, idx) in words" :key="idx" class="whitespace-nowrap">
          {{ word }}<span v-if="idx < words.length - 1">, </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  words: string[]
  color: string
}>()

const colorClass = computed(() => {
  const map: Record<string, string> = {
    yellow: 'bg-category-yellow',
    green: 'bg-category-green',
    blue: 'bg-category-blue',
    purple: 'bg-category-purple',
  }
  return map[props.color] || 'bg-gray-200'
})
</script>

<style scoped>
/* Keep minimal responsive heights */
@media (max-width: 768px) {
  div[class*="min-h-"] {
    min-height: 85px;
  }
}
@media (max-width: 576px) {
  div[class*="min-h-"] {
    min-height: 75px;
  }
}
@media (max-width: 480px) {
  div[class*="min-h-"] {
    min-height: 65px;
  }
}
@media (max-width: 375px) {
  div[class*="min-h-"] {
    min-height: 55px;
  }
}
</style>