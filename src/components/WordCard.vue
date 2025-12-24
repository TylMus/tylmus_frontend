<template>
  <div 
    class="word-card grid-item"
    :class="{
      'selected': selected,
      'scramble-animation': scrambleAnimation
    }"
    @click="$emit('click', word)"
  >
    <div class="word-text">
      {{ word }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  word: string
  selected?: boolean
  scrambleAnimation?: boolean
}

interface Emits {
  (e: 'click', word: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.word-card {
  background: #d3fbe3;
  border: 2px solid #d3fbe3;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.word-card:hover {
  background: #a1eec0;
  transform: translateY(-2px);
}

.word-card.selected {
  background: #a1eec0;
  border-color: #88c8a1;
}

.word-text {
  width: 100%;
  max-height: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
}

.scramble-animation {
  animation: scramble 0.3s ease-in-out;
}

@keyframes scramble {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}
</style>