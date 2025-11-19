<template>
  <div 
    class="word-card grid-item"
    :class="{
      'selected': selected,
      'scramble-animation': scrambleAnimation
    }"
    @click="$emit('click', word)"
  >
    {{ word }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  word: string
  selected?: boolean
  scrambleAnimation?: boolean
}

interface Emits {
  (e: 'click', word: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.word-card {
  padding: 20px 10px;
  text-align: center;
  background: #d3fbe3;
  border: 2px solid #d3fbe3;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  user-select: none;
  width: 100%;
  height: 100%;
}

.word-card:hover {
  background: #a1eec0;
  transform: translateY(-2px);
}

.word-card.selected {
  background: #a1eec0;
  border-color: #88c8a1;
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