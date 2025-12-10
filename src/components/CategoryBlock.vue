<template>
  <div class="category-block grid-item" :class="color">
    <div class="category-content">
      <strong>{{ name }}</strong>
      <div class="category-words">{{ words.join(', ') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  words: string[]
  color: string
}

defineProps<Props>()
</script>

<style scoped>
.category-block {
  padding: 10px;
  border-radius: 8px;
  color: #333;
  font-weight: bold;
  text-align: center;
  grid-column: 1 / span 4;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s ease-in;
  min-height: 60px; /* Base height for desktop */
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.category-words {
  font-size: 0.85em;
  opacity: 0.8;
  font-weight: normal;
  line-height: 1.2;
}

.category-block.yellow { background: #ffcc95; }
.category-block.green { background: #aef8cb; }
.category-block.blue { background: #b6ceff; }
.category-block.purple { background: #E0ceff; }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* Responsive height adjustments */
@media (max-width: 768px) {
  .category-block {
    min-height: 45px;
    padding: 8px;
  }
  
  .category-words {
    font-size: 0.8em;
  }
}

@media (max-width: 576px) {
  .category-block {
    min-height: 40px;
    padding: 6px;
  }
  
  .category-words {
    font-size: 0.75em;
  }
}
</style>