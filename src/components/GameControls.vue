<template>
  <div class="controls">
    <!-- Основные кнопки управления -->
    <button @click="$emit('deselect-all')" class="btn-control">
      <span class="btn-text">Снять отметку</span>
      <span class="btn-text-mobile">Снять отметку</span>
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
    
    <!-- Кнопка "Поделиться результатом!" -->
    <button 
      v-if="showShareButton"
      @click="$emit('share-results')"
      class="btn-share"
    >
      <span class="btn-text">Поделиться результатом!</span>
      <span class="btn-text-mobile">Поделиться</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  canSubmit: boolean
  gameOver: boolean
  showShareButton: boolean
}

interface Emits {
  (e: 'deselect-all'): void
  (e: 'shuffle-words'): void
  (e: 'submit-guess'): void
  (e: 'share-results'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: row; /* EXPLICITLY SET TO ROW */
  flex-wrap: nowrap; /* PREVENT WRAPPING */
  gap: 8px;
  justify-content: center;
  align-items: center; /* Center vertically */
  margin-bottom: 20px;
  padding: 0 5px;
  width: 100%;
}

.btn-control, .btn-submit, .btn-share {
  padding: 12px 16px;
  border: 2px solid black;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  background: white;
  transition: all 0.3s ease;
  flex: 1 1 auto; /* Allow growth and shrinkage */
  min-width: 0; /* Allow buttons to shrink below min-content */
  max-width: 150px; /* Maximum width for desktop */
  text-align: center;
  white-space: nowrap; /* Prevent text from wrapping inside button */
  color: black; /* EXPLICITLY SET TEXT COLOR */
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
}

/* Remove default button styling on iOS */
.btn-control, .btn-submit, .btn-share {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.btn-control:hover, .btn-submit:not(:disabled):hover, .btn-share:hover {
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

/* Стиль для кнопки шаринга */
.btn-share {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.btn-share:hover {
  background: #45a049;
  border-color: #45a049;
}

/* Hide mobile text by default */
.btn-text-mobile {
  display: none;
}

/* Tablet */
@media (max-width: 768px) {
  .controls {
    gap: 6px;
    margin-bottom: 15px;
    padding: 0 4px;
    flex-direction: row !important; /* FORCE ROW */
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 10px 8px;
    font-size: 0.8em;
    max-width: 120px;
    flex: 1 1 0; /* Equal distribution */
    color: black; /* Ensure text color stays black */
  }
}

/* Mobile */
@media (max-width: 576px) {
  .controls {
    gap: 4px;
    margin-bottom: 12px;
    padding: 0 3px;
    flex-direction: row !important; /* FORCE ROW */
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 8px 6px;
    font-size: 0.7em;
    max-width: 100px;
    border-radius: 6px;
    border-width: 1px;
    flex: 1 1 0; /* Equal distribution */
    color: black; /* Ensure text color stays black */
  }
  
  /* Show mobile text, hide desktop text */
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
    flex-direction: row !important; /* FORCE ROW */
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 6px 4px;
    font-size: 0.6em;
    max-width: 85px;
    flex: 1 1 0; /* Equal distribution */
    color: black; /* Ensure text color stays black */
  }
}

/* Very Small Mobile */
@media (max-width: 360px) {
  .controls {
    gap: 2px;
    flex-direction: row !important; /* FORCE ROW */
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 5px 3px;
    font-size: 0.5em;
    max-width: 75px;
    min-height: 36px;
    flex: 1 1 0; /* Equal distribution */
    color: black; /* Ensure text color stays black */
  }
}

/* Fix for iPhone SE and similar very small screens */
@media (max-width: 320px) {
  .btn-control, .btn-submit, .btn-share {
    padding: 4px 2px;
    font-size: 0.45em;
    max-width: 70px;
    flex: 1 1 0; /* Equal distribution */
    color: black; /* Ensure text color stays black */
  }
}
</style>