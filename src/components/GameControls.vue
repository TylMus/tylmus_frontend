<template>
  <div class="controls">
    <!-- Кнопки во время игры -->
    <template v-if="!gameOver">
      <button @click="$emit('deselect-all')" class="btn-control">
        <span class="btn-text">Снять отметку</span>
        <span class="btn-text-mobile">Снять</span>
      </button>
      <button @click="$emit('shuffle-words')" class="btn-control">
        <span class="btn-text">Перемешать</span>
        <span class="btn-text-mobile">Перемешать</span>
      </button>
      <button 
        @click="$emit('submit-guess')" 
        :disabled="!canSubmit" 
        class="btn-submit"
        :class="{ 'enabled': canSubmit }"
      >
        <span class="btn-text">Подтвердить</span>
        <span class="btn-text-mobile">Подтвердить</span>
      </button>
    </template>
    
    <!-- Кнопка после завершения игры -->
    <template v-else>
      <button @click="$emit('share-game')" class="btn-control share">
        <span class="btn-text">Поделиться</span>
        <span class="btn-text-mobile">Поделиться</span>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  canSubmit: boolean
  gameOver: boolean
}

interface Emits {
  (e: 'deselect-all'): void
  (e: 'shuffle-words'): void
  (e: 'share-game'): void
  (e: 'submit-guess'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 5px;
  width: 100%;
}

.btn-control, .btn-submit {
  padding: 12px 16px;
  border: 2px solid black;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  background: white;
  transition: all 0.3s ease;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 150px;
  text-align: center;
  white-space: nowrap;
}

.btn-control:hover, .btn-submit:not(:disabled):hover {
  background: #d4edda;
}

.btn-submit:disabled {
  cursor: not-allowed;
  border-color: gray;
  color: gray;
}

.btn-submit.enabled:not(:disabled) {
  background: black;
  color: white;
}

.btn-submit.enabled:not(:disabled):hover {
  background: #333;
  color: white;
}

/* Кнопка "Поделиться" получает те же стили, что и btn-control */
.btn-control.share {
  background: white;
  color: black;
  border-color: black;
}

.btn-control.share:hover {
  background: #d4edda;
}

.btn-text-mobile {
  display: none;
}

/* Tablet */
@media (max-width: 768px) {
  .controls {
    gap: 6px;
    margin-bottom: 15px;
    padding: 0 4px;
  }
  
  .btn-control, .btn-submit {
    padding: 10px 8px;
    font-size: 0.8em;
    max-width: 120px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .controls {
    gap: 4px;
    margin-bottom: 12px;
    padding: 0 3px;
  }
  
  .btn-control, .btn-submit {
    padding: 8px 6px;
    font-size: 0.7em;
    max-width: 100px;
    border-radius: 6px;
    border-width: 1px;
  }
  
  .btn-text {
    display: none;
  }
  
  .btn-text-mobile {
    display: inline;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .controls {
    gap: 3px;
    padding: 0 2px;
  }
  
  .btn-control, .btn-submit {
    padding: 6px 4px;
    font-size: 0.6em;
    max-width: 85px;
  }
}

/* Very Small Mobile */
@media (max-width: 360px) {
  .controls {
    gap: 2px;
  }
  
  .btn-control, .btn-submit {
    padding: 5px 3px;
    font-size: 0.5em;
    max-width: 75px;
    min-height: 36px;
  }
}

/* Fix for iPhone SE and similar very small screens */
@media (max-width: 320px) {
  .btn-control, .btn-submit {
    padding: 4px 2px;
    font-size: 0.45em;
    max-width: 70px;
  }
}
</style>