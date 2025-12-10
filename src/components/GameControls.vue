<template>
  <div class="controls">
    <button @click="$emit('deselect-all')" class="btn-control">Снять отметку</button>
    <button @click="$emit('shuffle-words')" class="btn-control">Перемешать</button>
    <button 
      @click="$emit('submit-guess')" 
      :disabled="!canSubmit" 
      class="btn-submit"
      :class="{ 'enabled': canSubmit }"
    >
      Подтвердить
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
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn-control, .btn-submit {
  padding: 12px 24px;
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  background: white;
  transition: all 0.3s ease;
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
</style>