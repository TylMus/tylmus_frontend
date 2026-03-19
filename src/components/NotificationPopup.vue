<template>
  <div
    class="fixed bg-white p-3 px-5 shadow-lg z-50 animate-slide-down rounded-xl max-w-sm w-11/12"
    :class="[positionClass, borderClass]"
  >
    <div class="flex items-center justify-between gap-4">
      <p class="m-0 text-sm font-medium text-gray-700 flex-1">{{ text }}</p>
      <button
        @click="$emit('close')"
        class="w-6 h-6 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-lg"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'success' | 'error' | 'info'
  text: string
  centered?: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const borderClass = computed(() => {
  return {
    'border-2 border-green-500 bg-green-50': props.type === 'success',
    'border-2 border-red-500 bg-red-50': props.type === 'error',
    'border-2 border-blue-500 bg-blue-50': props.type === 'info',
  }
})

const positionClass = computed(() => {
  if (props.centered) {
    return 'inset-0 m-auto h-fit'
  }
  return 'top-5 left-1/2 -translate-x-1/2'
})
</script>