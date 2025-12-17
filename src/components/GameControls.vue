<template>
  <div class="controls">
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
    <button 
      @click="handleShare" 
      :disabled="!canShare"
      class="btn-share"
      :class="{ 'enabled': canShare }"
    >
      <span class="btn-text">📢 Поделиться</span>
      <span class="btn-text-mobile">📢 Поделиться</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  canSubmit: boolean
  gameOver: boolean
  canShare: boolean
}

interface Emits {
  (e: 'deselect-all'): void
  (e: 'shuffle-words'): void
  (e: 'submit-guess'): void
  (e: 'share-result'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleShare = () => {
  console.log('🔘 Кнопка "Поделиться" нажата в GameControls')
  console.log('canShare:', props.canShare)
  emit('share-result')
}
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

/* ДОБАВЬТЕ .btn-share В ЭТОТ СЕЛЕКТОР */
.btn-control, .btn-submit, .btn-share {
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

.btn-control:hover, .btn-submit:not(:disabled):hover, .btn-share:not(:disabled):hover {
  background: #d4edda;
}

.btn-submit:disabled, .btn-share:disabled {
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

/* СДЕЛАЙТЕ ТАК ЖЕ КАК ДРУГИЕ КНОПКИ */
.btn-share.enabled:not(:disabled) {
  background: white;
  color: black;
  border-color: black;
}

.btn-share.enabled:not(:disabled):hover {
  background: #d4edda;
}

/* ДОБАВЬТЕ .btn-share ВО ВСЕ МЕДИА-ЗАПРОСЫ */

@media (max-width: 768px) {
  .controls {
    gap: 6px;
    margin-bottom: 15px;
    padding: 0 4px;
    flex-direction: row !important;
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 10px 8px;
    font-size: 0.8em;
    max-width: 120px;
    flex: 1 1 0;
  }
}

@media (max-width: 576px) {
  .controls {
    gap: 4px;
    margin-bottom: 12px;
    padding: 0 3px;
    flex-direction: row !important;
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 8px 6px;
    font-size: 0.7em;
    max-width: 100px;
    border-radius: 6px;
    border-width: 1px;
    flex: 1 1 0;
  }
  
  .btn-text {
    display: none;
  }
  
  .btn-text-mobile {
    display: inline;
  }
}

@media (max-width: 480px) {
  .controls {
    gap: 3px;
    padding: 0 2px;
    flex-direction: row !important;
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 6px 4px;
    font-size: 0.6em;
    max-width: 85px;
    flex: 1 1 0;
  }
}

@media (max-width: 360px) {
  .controls {
    gap: 2px;
    flex-direction: row !important;
  }
  
  .btn-control, .btn-submit, .btn-share {
    padding: 5px 3px;
    font-size: 0.5em;
    max-width: 75px;
    min-height: 36px;
    flex: 1 1 0;
  }
}

@media (max-width: 320px) {
  .btn-control, .btn-submit, .btn-share {
    padding: 4px 2px;
    font-size: 0.45em;
    max-width: 70px;
    flex: 1 1 0;
  }
}
</style>