<template>
  <div
    class="rounded-xl text-gray-800 font-semibold text-center w-full flex items-center justify-center animate-fade-in h-[75px] sm:h-[85px] md:h-[100px] p-2"
    :class="colorClass"
  >
    <div class="flex flex-col gap-1 w-full">
      <strong class="text-sm md:text-base break-words">{{ name }}</strong>
      <div class="flex flex-wrap justify-center gap-1 text-xs md:text-sm opacity-90 font-normal">
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