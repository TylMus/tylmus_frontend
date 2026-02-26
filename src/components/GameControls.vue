<template>
  <div class="flex flex-row flex-wrap gap-2 justify-center items-center mb-5 px-1">
    <button
      @click="$emit('deselect-all')"
      class="flex-1 min-w-[80px] max-w-[150px] text-center px-2 py-3 border-2 border-black rounded-lg bg-white font-bold hover:bg-green-100 transition text-black flex items-center justify-center"
    >
      <span class="hidden sm:inline">Снять всё</span>
      <span class="inline sm:hidden">Снять</span>
    </button>
    <button
      @click="$emit('shuffle-words')"
      class="flex-1 min-w-[80px] max-w-[150px] text-center px-2 py-3 border-2 border-black rounded-lg bg-white font-bold hover:bg-green-100 transition text-black flex items-center justify-center"
    >
      <span class="hidden sm:inline">Перемешать</span>
      <span class="inline sm:hidden">Перемешать</span>
    </button>
    <button
      @click="$emit('submit-guess')"
      :disabled="!canSubmit"
      class="flex-1 min-w-[80px] max-w-[150px] text-center px-2 py-3 border-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      :class="canSubmit ? 'bg-black text-white border-black hover:bg-gray-800' : 'bg-white text-gray-400 border-gray-400'"
    >
      <span class="hidden sm:inline">Подтвердить</span>
      <span class="inline sm:hidden">Ок</span>
    </button>
    <button
      v-if="showShareButton"
      @click="$emit('share-results')"
      class="flex-1 min-w-[80px] max-w-[150px] text-center px-2 py-3 border-2 border-green-600 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition flex items-center justify-center"
    >
      <span class="hidden sm:inline">Поделиться результатом!</span>
      <span class="inline sm:hidden">Поделиться</span>
    </button>
  </div>
</template>