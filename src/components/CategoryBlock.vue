<template>
  <div class="category-block grid-item" :class="color">
    <div class="category-content">
      <strong class="category-name">{{ name }}</strong>
      <div class="category-words">
        <div class="words-container">
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
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s ease-in;
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.category-name {
  font-size: 1em;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-words {
  width: 100%;
  max-height: 60%; /* Limit height for words */
  overflow: hidden;
}

.words-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px 6px;
  font-size: 0.85em;
  opacity: 0.8;
  font-weight: normal;
  line-height: 1.2;
  max-height: 100%;
  overflow: hidden;
}

.category-word {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px; /* Limit individual word width */
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
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-name {
    font-size: 0.9em;
  }
  
  .words-container {
    font-size: 0.8em;
    gap: 3px 5px;
  }
  
  .category-word {
    max-width: 70px;
  }
}

@media (max-width: 576px) {
  .category-name {
    font-size: 0.85em;
  }
  
  .words-container {
    font-size: 0.75em;
    gap: 2px 4px;
  }
  
  .category-word {
    max-width: 60px;
  }
}

@media (max-width: 480px) {
  .category-name {
    font-size: 0.8em;
  }
  
  .words-container {
    font-size: 0.7em;
    gap: 2px 3px;
  }
  
  .category-word {
    max-width: 50px;
  }
}
</style>