<template>
  <div class="controls">
    <button @click="$emit('deselect-all')" class="btn-control">
      <span class="btn-text">Снять отметку</span>
      <span class="btn-text-mobile">Снять</span>
    </button>
    <button @click="$emit('shuffle-words')" class="btn-control">
      <span class="btn-text">Перемешать</span>
      <span class="btn-text-mobile">Мешать</span>
    </button>
    <button 
      @click="$emit('submit-guess')" 
      :disabled="!canSubmit" 
      class="btn-submit"
      :class="{ 'enabled': canSubmit }"
    >
      <span class="btn-text">Подтвердить</span>
      <span class="btn-text-mobile">Готово</span>
    </button>
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
  (e: 'submit-guess'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
  padding: 0 5px;
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
  flex: 1;
  min-width: 0; /* Allow buttons to shrink below min-content */
  max-width: 150px; /* Maximum width for desktop */
  text-align: center;
  position: relative;
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

/* Hide mobile text by default */
.btn-text-mobile {
  display: none;
}

/* Tablet */
@media (max-width: 768px) {
  .controls {
    gap: 6px;
    margin-bottom: 15px;
  }
  
  .btn-control, .btn-submit {
    padding: 10px 12px;
    font-size: 0.9em;
    max-width: 130px;
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
    font-size: 0.85em;
    max-width: 110px;
    border-radius: 6px;
    border-width: 1px;
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
  }
  
  .btn-control, .btn-submit {
    padding: 6px 4px;
    font-size: 0.75em;
    max-width: 90px;
  }
  
  /* Even shorter text for very small screens */
  .btn-control:first-child .btn-text-mobile {
    content: "Снять";
  }
  
  .btn-control:nth-child(2) .btn-text-mobile {
    content: "Мешать";
  }
  
  .btn-submit .btn-text-mobile {
    content: "Готово";
  }
}

/* Very Small Mobile */
@media (max-width: 360px) {
  .controls {
    gap: 2px;
  }
  
  .btn-control, .btn-submit {
    padding: 5px 3px;
    font-size: 0.7em;
    max-width: 80px;
    min-height: 36px; /* Ensure buttons have minimum height */
  }
}

/* Fix for iPhone SE and similar very small screens */
@media (max-width: 320px) {
  .btn-control, .btn-submit {
    padding: 4px 2px;
    font-size: 0.65em;
    max-width: 75px;
  }
}
</style>