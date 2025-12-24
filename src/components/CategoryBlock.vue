<template>
  <div class="category-block grid-item" :class="color">
    <div class="category-content">
      <strong class="category-name">{{ name }}</strong>
      <div class="category-words">
        <span 
          v-for="(word, index) in words" 
          :key="index"
          class="category-word"
          :class="{'long-word': word.length > 10}"
        >
          {{ word }}<span v-if="index < words.length - 1">,</span>
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
  word-break: break-word;
  overflow-wrap: break-word;
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.category-name {
  font-size: 1em;
  margin-bottom: 2px;
  word-break: break-word;
}

.category-words {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px 6px;
  font-size: 0.85em;
  opacity: 0.8;
  font-weight: normal;
  line-height: 1.2;
}

.category-word {
  display: inline-block;
  white-space: nowrap;
}

.category-word.long-word {
  white-space: normal;
  word-break: break-word;
  max-width: 100px;
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
  .category-block {
    min-height: 45px;
    padding: 8px;
  }
  
  .category-name {
    font-size: 0.95em;
  }
  
  .category-words {
    font-size: 0.8em;
    gap: 3px 5px;
  }
  
  .category-word.long-word {
    max-width: 80px;
    font-size: 0.75em;
  }
}

@media (max-width: 576px) {
  .category-block {
    min-height: 40px;
    padding: 6px;
  }
  
  .category-name {
    font-size: 0.9em;
  }
  
  .category-words {
    font-size: 0.75em;
    gap: 2px 4px;
  }
  
  .category-word.long-word {
    max-width: 60px;
    font-size: 0.7em;
    white-space: normal;
  }
}

@media (max-width: 480px) {
  .category-block {
    min-height: 35px;
    padding: 4px;
  }
  
  .category-name {
    font-size: 0.85em;
  }
  
  .category-words {
    font-size: 0.7em;
    gap: 2px 3px;
  }
  
  .category-word {
    max-width: 50px;
  }
  
  .category-word.long-word {
    max-width: 45px;
    font-size: 0.65em;
  }
}

/* For very small screens */
@media (max-width: 375px) {
  .category-block {
    min-height: 30px;
    padding: 3px;
  }
  
  .category-name {
    font-size: 0.8em;
  }
  
  .category-words {
    font-size: 0.65em;
    gap: 1px 2px;
  }
  
  .category-word {
    max-width: 40px;
  }
  
  .category-word.long-word {
    max-width: 35px;
    font-size: 0.6em;
  }
}
</style>