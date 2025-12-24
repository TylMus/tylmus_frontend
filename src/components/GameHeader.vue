<template>
  <header class="game-header py-3 mb-4">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="game-title m-0">ТылМус</h3>
        <div class="game-info" v-if="gameDisplay && !isMobile">
          {{ gameDisplay }}
        </div>
        <div class="game-info-mobile" v-else-if="gameDisplay && isMobile">
          {{ getShortDate }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  gameDisplay: string  // Changed from dailyDisplay to gameDisplay
}

defineProps<Props>()

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const getShortDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.game-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding-left: 15px;
  padding-right: 15px;
}

.game-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
}

.game-info {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.game-info-mobile {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

/* Tablet */
@media (max-width: 991px) {
  .game-header {
    padding: 12px 15px;
    margin-bottom: 20px;
  }
  
  .game-title {
    font-size: 1.3rem;
  }
  
  .game-info-mobile {
    font-size: 0.75rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .game-header {
    padding: 10px 12px;
    margin-bottom: 15px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.1); /* Lighter shadow */
  }
  
  .game-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .game-info-mobile {
    font-size: 0.7rem;
  }
}

/* Small Mobile */
@media (max-width: 576px) {
  .game-header {
    padding: 8px 10px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .game-title {
    font-size: 1rem;
    font-weight: 600;
  }
  
  .game-info-mobile {
    font-size: 0.65rem;
    display: none; /* Hide on very small screens to save space */
  }
}

/* Very Small Mobile */
@media (max-width: 400px) {
  .game-header {
    padding: 6px 8px;
    margin-bottom: 10px;
  }
  
  .game-title {
    font-size: 0.9rem;
  }
}
</style>