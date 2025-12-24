<template>
  <div 
    class="word-card grid-item"
    :class="{
      'selected': selected,
      'scramble-animation': scrambleAnimation,
      'long-word': isLongWord
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

// Check if word is long (more than 10 characters)
const isLongWord = computed(() => {
  return props.word.length > 10
})
</script>

<style scoped>
.word-card {
  padding: 8px 4px;
  text-align: center;
  background: #d3fbe3;
  border: 2px solid #d3fbe3;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  user-select: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  word-break: break-word;
  overflow-wrap: break-word;
}

.word-text {
  padding: 2px;
  width: 100%;
}

.word-card:hover {
  background: #a1eec0;
  transform: translateY(-2px);
}

.word-card.selected {
  background: #a1eec0;
  border-color: #88c8a1;
}

/* For long words - smaller font size and better wrapping */
.word-card.long-word {
  font-size: 0.85em;
  line-height: 1.2;
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

/* Mobile responsive styles */
@media (max-width: 768px) {
  .word-card {
    padding: 6px 3px;
    font-size: 0.9em;
    min-height: 50px;
    border-width: 1.5px;
  }
  
  .word-card.long-word {
    font-size: 0.8em;
    line-height: 1.1;
  }
}

@media (max-width: 576px) {
  .word-card {
    padding: 4px 2px;
    font-size: 0.85em;
    min-height: 45px;
    border-width: 1px;
  }
  
  .word-card.long-word {
    font-size: 0.75em;
    line-height: 1;
  }
}

@media (max-width: 480px) {
  .word-card {
    padding: 3px 1px;
    min-height: 40px;
  }
  
  .word-card.long-word {
    font-size: 0.7em;
    padding: 2px 1px;
  }
}

/* For very small screens */
@media (max-width: 375px) {
  .word-card {
    min-height: 35px;
    font-size: 0.8em;
  }
  
  .word-card.long-word {
    font-size: 0.65em;
  }
}
</style>