<template>
  <button
    @click="$emit('share')"
    class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
  >
    Поделиться результатом
  </button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'share'): void }>()
</script>