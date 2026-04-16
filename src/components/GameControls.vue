<template>
  <div class="flex flex-row flex-wrap gap-2 justify-center items-center mb-5 px-0">
    <button
      @click="$emit('deselect-all')"
      type="button"
      class="flex-1 min-w-[88px] max-w-[160px] text-center px-2 py-3.5 border-2 border-black rounded-lg bg-white text-sm max-sm:text-base font-bold hover:bg-green-100 transition text-black flex items-center justify-center"
    >
      <span class="hidden sm:inline">Снять всё</span>
      <span class="inline sm:hidden">Снять</span>
    </button>
    <button
      @click="$emit('shuffle-words')"
      type="button"
      class="flex-1 min-w-[88px] max-w-[160px] text-center px-2 py-3.5 border-2 border-black rounded-lg bg-white text-sm max-sm:text-base font-bold hover:bg-green-100 transition text-black flex items-center justify-center"
    >
      <span class="hidden sm:inline">Перемешать</span>
      <span class="inline sm:hidden">Смешать</span>
    </button>
    <button
      @click="$emit('submit-guess')"
      type="button"
      :disabled="!canSubmit"
      class="flex-1 min-w-[88px] max-w-[160px] text-center px-2 py-3.5 border-2 rounded-lg text-sm max-sm:text-base font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      :class="canSubmit ? 'bg-black text-white border-black hover:bg-gray-800' : 'bg-white text-gray-400 border-gray-400'"
    >
      <span class="hidden sm:inline">Подтвердить</span>
      <span class="inline sm:hidden">Готово</span>
    </button>
    <button
      v-if="showShareButton"
      type="button"
      @click="$emit('share-results')"
      class="flex-1 min-w-[88px] max-w-[160px] text-center px-2 py-3.5 border-2 border-green-600 rounded-lg bg-green-600 text-white text-sm max-sm:text-base font-bold hover:bg-green-700 transition flex items-center justify-center"
    >
      <span class="hidden sm:inline">Поделиться результатом!</span>
      <span class="inline sm:hidden">Поделиться</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canSubmit: boolean
  gameOver: boolean
  showShareButton: boolean
}>()

defineEmits<{
  (e: 'deselect-all'): void
  (e: 'shuffle-words'): void
  (e: 'submit-guess'): void
  (e: 'share-results'): void
}>()
</script>