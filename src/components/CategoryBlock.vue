<template>
  <div class="category-block" :class="color">
    <div class="category-content">
      <strong class="category-name">{{ name }}</strong>
      <div class="category-words">
        <span 
          v-for="(word, index) in words" 
          :key="index"
          class="category-word"
        >
          {{ word }}<span v-if="index < words.length - 1">, </span>
        </span>
      </div>
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
  padding: 15px;
  border-radius: 12px;
  color: #333;
  font-weight: bold;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s ease-in;
  min-height: 80px;
  word-break: break-word;
  overflow-wrap: break-word;
  margin: 0 auto;
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 100%;
}

.category-name {
  font-size: 1.1em;
  margin-bottom: 4px;
  word-break: break-word;
  line-height: 1.2;
}

.category-words {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 0.95em;
  opacity: 0.9;
  font-weight: normal;
  line-height: 1.3;
}

.category-word {
  display: inline-block;
  white-space: nowrap;
  word-break: break-word;
}

/* Remove comma from the last word */
.category-word:last-child span {
  display: none;
}

.category-block.yellow { background: #ffcc95; }
.category-block.green { background: #aef8cb; }
.category-block.blue { background: #b6ceff; }
.category-block.purple { background: #E0ceff; }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-block {
    padding: 12px;
    min-height: 70px;
  }
  
  .category-name {
    font-size: 1em;
  }
  
  .category-words {
    font-size: 0.9em;
    gap: 6px;
  }
}

@media (max-width: 576px) {
  .category-block {
    padding: 10px;
    min-height: 65px;
    border-radius: 10px;
  }
  
  .category-name {
    font-size: 0.95em;
  }
  
  .category-words {
    font-size: 0.85em;
    gap: 4px;
  }
  
  .category-word {
    white-space: normal;
    word-break: break-word;
    max-width: 100px;
  }
}

@media (max-width: 480px) {
  .category-block {
    padding: 8px;
    min-height: 60px;
  }
  
  .category-name {
    font-size: 0.9em;
  }
  
  .category-words {
    font-size: 0.8em;
    gap: 3px;
  }
  
  .category-word {
    max-width: 80px;
  }
}

@media (max-width: 375px) {
  .category-block {
    padding: 6px;
    min-height: 55px;
  }
  
  .category-name {
    font-size: 0.85em;
  }
  
  .category-words {
    font-size: 0.75em;
    gap: 2px;
  }
  
  .category-word {
    max-width: 70px;
  }
}
</style>