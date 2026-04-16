<template>
  <header class="w-full bg-white shadow-md mb-4 py-3 px-4 sm:px-6 md:px-8">
    <div class="w-full max-w-5xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-2">
        <img src="/icon.svg" alt="Logo" class="h-10 w-10" />
        <h3 class="text-xl font-bold text-black sm:text-2xl">ТылМус</h3>
      </div>
      <div class="flex items-center gap-4">
        <div v-if="gameDisplay" class="text-gray-500 text-sm sm:text-base">
          <span class="hidden sm:inline">{{ gameDisplay }}</span>
          <span class="inline sm:hidden">{{ shortDate }}</span>
        </div>
        <button @click="$emit('open-leaderboard')" class="text-2xl hover:scale-110 transition p-2" title="Таблица лидеров">
          🏆
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{ gameDisplay: string }>()
defineEmits<{ (e: 'open-leaderboard'): void }>()

const shortDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
})
</script>