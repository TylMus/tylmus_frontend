<template>
  <header class="game-header py-3 mb-4">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="game-title m-0">ТылМус</h3>
        <div class="daily-info" v-if="dailyDisplay && !isMobile">
          {{ dailyDisplay }}
        </div>
        <div class="daily-info-mobile" v-else-if="dailyDisplay && isMobile">
          {{ getShortDate }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  dailyDisplay: string
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

.daily-info {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.daily-info-mobile {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .game-header {
    padding: 10px 12px;
    margin-bottom: 15px;
  }
  
  .game-title {
    font-size: 1.2rem;
  }
  
  .daily-info-mobile {
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .game-header {
    padding: 8px 10px;
    margin-bottom: 10px;
  }
  
  .game-title {
    font-size: 1.1rem;
  }
  
  .daily-info-mobile {
    display: none; /* Hide completely on very small screens */
  }
}
</style>