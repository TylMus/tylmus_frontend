<template>
  <div v-if="show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 max-w-sm w-11/12 relative shadow-xl">
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div class="flex flex-col gap-5 pt-2">
        <!-- result header -->
        <div class="text-center">
          <h2 :class="isWin ? 'text-green-600' : 'text-red-600'" class="text-2xl font-bold mb-2">
            {{ isWin ? 'Победа!' : 'Поражение' }}
          </h2>
          <div class="text-gray-600 text-sm">
            Найдено категорий: {{ foundCount }}/4<br />
            Ошибок: {{ mistakes }}/4
          </div>
        </div>

        <!-- game history -->
        <GameHistory :attempts="attemptHistory" />

        <!-- countdown -->
        <CountdownTimer @expired="$emit('expired')" />

        <!-- share button -->
        <ShareButton @share="$emit('share')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameHistory from './GameHistory.vue'
import CountdownTimer from './CountdownTimer.vue'
import ShareButton from './ShareButton.vue'

defineProps<{
  show: boolean
  isWin: boolean
  foundCount: number
  mistakes: number
  attemptHistory: any[]
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'share'): void
  (e: 'expired'): void
}>()
</script>