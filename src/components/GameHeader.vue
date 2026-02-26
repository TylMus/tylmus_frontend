<template>
  <header class="bg-white shadow-md mb-4 px-4 py-3">
    <div class="container mx-auto flex justify-between items-center">
      <h3 class="text-xl font-bold text-black sm:text-2xl">ТылМус</h3>
      <div v-if="gameDisplay" class="text-gray-500 text-sm sm:text-base">
        <span class="hidden sm:inline">{{ gameDisplay }}</span>
        <span class="inline sm:hidden">{{ shortDate }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = computed(() => {
  gameDisplay: string
}>()

const shortDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
})
</script>