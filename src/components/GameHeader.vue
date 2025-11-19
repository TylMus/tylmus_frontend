<template>
  <header class="game-header py-3 mb-4">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="game-title m-0">ТылМус</h3>
        <div class="daily-info" v-if="dailyDisplay">
          {{ dailyDisplay }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  dailyDisplay: string
}

defineProps<Props>()
</script>

<style scoped>
.game-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding-left: 15px;
}

.daily-info {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}
</style>