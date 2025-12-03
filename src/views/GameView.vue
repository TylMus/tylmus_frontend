<template>
  <div class="app-container">
    <!-- Notifications -->
    <NotificationPopup 
      v-if="gameStore.showMessage && !gameStore.gameOver" 
      :type="gameStore.messageClass"
      :text="gameStore.messageText"
      @close="closePopup"
    />
    
    <NotificationPopup 
      v-if="gameStore.gameOver && gameStore.foundCategories.length !== 4" 
      type="error"
      text="Игра окончена! Слишком много ошибок. Попробуйте снова завтра!"
      @close="closeGameOver"
    />
    
    <NotificationPopup 
      v-if="gameStore.gameOver && gameStore.foundCategories.length === 4" 
      type="success"
      text="Поздравляем! Вы нашли все категории!"
      @close="closeGameOver"
    />

    <div class="background-ornament">
      <img 
        src="/public/imgg/background-ornament.svg" 
        alt="Background ornament" 
      />
    </div>
    <!-- Unified Background -->
    <div class="background-ornament2">
      <img 
        src="/public/imgg/background-ornament.svg" 
        alt="Background ornament" 
      />
    </div>

    <!-- Game Header -->
    <GameHeader :daily-display="gameStore.dailyDisplay" />
    
    <!-- Main Game Area -->
    <div class="game-screen">
      <div class="container">
        <!-- Loading State -->
        <div v-if="gameStore.loading" class="loading">
          Загрузка игры...
        </div>
        
        <!-- Game Complete State -->
        <div v-else-if="gameStore.words.length === 0 && gameStore.foundCategories.length === 4" class="game-complete">
          <div class="categories-complete">
            <CategoryBlock
              v-for="(category, index) in gameStore.foundCategories"
              :key="'category-' + index"
              :name="category.name"
              :words="category.words"
              :color="gameStore.getCategoryColor(index)"
            />
          </div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="gameStore.words.length === 0" class="no-words">
          Не удалось загрузить слова. Проверьте консоль для ошибок.
        </div>
        
        <!-- Game Grid -->
        <div v-else class="combined-grid">
          <!-- Found Categories -->
          <CategoryBlock
            v-for="(category, index) in gameStore.foundCategories"
            :key="'category-' + index"
            :name="category.name"
            :words="category.words"
            :color="gameStore.getCategoryColor(index)"
          />
          
          <!-- Word Cards -->
          <WordCard
            v-for="(word, index) in gameStore.words"
            :key="'word-' + index"
            :word="word"
            :selected="gameStore.selectedWords.includes(word)"
            :scramble-animation="gameStore.scrambleAnimation"
            @click="gameStore.toggleWord(word)"
          />
        </div>
        
        <!-- Game Info -->
        <div class="game-info">
          <div class="mistakes">
            Осталось ошибок: 
            <span 
              v-for="n in 4" 
              :key="n"
              class="mistake"
              :class="{ 'used': (5 - n) <= gameStore.mistakes }"
            >●</span>
          </div>
        </div>
        
        <!-- Game Controls -->
        <GameControls
          :can-submit="gameStore.selectedWords.length === 4 && !gameStore.gameOver"
          :game-over="gameStore.gameOver"
          @deselect-all="gameStore.deselectAll"
          @shuffle-words="gameStore.shuffleWords"
          @submit-guess="gameStore.submitGuess"
        />
      </div>
    </div>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <h2 class="about-title">ТылМус: Связать слова</h2>
          <p class="about-text">
            Игра ТылМус — это ежедневная игра, в которой нужно находить общие связи между словами. 
            В игре ТылМус игроки стремятся сформировать четыре группы по четыре слова, при этом 
            ограничивая количество ошибок максимум четырьмя. Механика игры ТылМус добавляет дополнительный 
            уровень волнения и стратегического мышления, так как игрокам нужно тщательно обдумывать свои выборы и связи.
          </p>
        </div>
      </div>
    </section>

    <!-- Instructions Section -->
    <section class="instructions-section">
    
      <!-- Corner SVGs -->
      <div class="corner corner-top-left">
        <img 
          src="/public/imgg/corner-top-left.svg" 
          alt="Decorative corner" 
        />
      </div>
      <div class="corner corner-top-right">
        <img 
          src="/public/imgg/corner-top-right.svg" 
          alt="Decorative corner" 
        />
      </div>
      <div class="corner corner-bottom-left">
        <img 
          src="/public/imgg/corner-bottom-left.svg" 
          alt="Decorative corner" 
        />
      </div>
      <div class="corner corner-bottom-right ">
        <img 
          src="/public/imgg/corner-bottom-right.svg" 
          alt="Decorative corner" 
        />
      </div>
      <div class="spellbee-container">
        <div class="text-center">
          <h3 class="instructions-title">Как играть в ТылМус</h3>
          <ul class="instructions-list">
            <li class="instruction-item">
              <h4 class="instruction-step">Прочти слова</h4>
              <p class="instruction-text">Первый шаг — внимательно прочитать и понять слова, представленные в игре "ТылМус". 
                 Не спешите, постарайтесь понять каждое слово и подумать, что оно означает в контексте головоломки.</p>
              <div class="instruction-image">
                <img class="adaptive-image" src="/img/step1.png" alt="Прочти слова">
              </div>
            </li>
            <li class="instruction-item">
              <h4 class="instruction-step">Найди общее</h4>
              <p class="instruction-text">После того как вы прочитаете и поймёте слова, следующий шаг — найти общую тему, которая их связывает.</p>
              <div class="instruction-image">
                <img class="adaptive-image" src="/img/step2.png" alt="Найди общее">
              </div>
            </li>
            <li class="instruction-item">
              <h4 class="instruction-step">Выбери и отправь свой ответ</h4>
              <p class="instruction-text">Когда вы определите общую тему и найдёте четыре слова, подходящие под неё, пора сделать свой выбор.</p>
              <div class="instruction-image">
                <img class="adaptive-image" src="/img/step3.png" alt="Выбери и отправь свой ответ">
              </div>
            </li>
          </ul>
        </div>
      </div>

    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container text-center">
        <p>@LemonLemon Ltd | ТылМус | Связать слова</p>
      </div>
    </footer>
    
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import GameHeader from '../components/GameHeader.vue'
import WordCard from '../components/WordCard.vue'
import CategoryBlock from '../components/CategoryBlock.vue'
import GameControls from '../components/GameControls.vue'
import NotificationPopup from '../components/NotificationPopup.vue'
import BackgroundOrnaments from '../components/BackgroundOrnaments.vue'
import CornerOrnaments from '../components/CornerOrnaments.vue'
// import OrnamentTest from '../components/OrnamentTest.vue'

const gameStore = useGameStore()

const closePopup = () => {
  gameStore.showMessage = false
}

const closeGameOver = () => {
  // Game over popup can't be closed for now
}

onMounted(() => {
  console.log('🎮 GameView mounted, initializing game...')
  gameStore.initializeGame().then(() => {
    console.log('✅ Game initialization complete')
  }).catch(error => {
    console.error('❌ Game initialization failed:', error)
  })
})
</script>

<style scoped>
/* Base Styles */
.app-container {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

.game-screen {
  width: 100%;
  max-width: 1000px; 
  margin: 0 auto;
  padding: 20px 10px;
  position: relative;
  min-height: 400px;
}

.container {
  width: 100%;
  padding: 0 10px;
  margin: 0 auto;
}

/* Game Grid - Desktop */
.combined-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  max-width: 800px; /* Added max-width for smaller containers */
  margin-left: auto;
  margin-right: auto;
}
.grid-item {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Game Info */
.game-info {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

.mistakes {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.mistake {
  color: #666;
  font-size: 18px;
  transition: opacity 0.3s ease;
}

.mistake.used {
  opacity: 0.3;
}

/* About Section - Full width text */
.about-section {
  background-color: #D3FBE3;
  padding: 40px 20px;
  margin-top: 40px;
  border-radius: 12px 12px 0 0;
}

.about-content {
  text-align: center;
}

.about-title {
  color: #000; 
  margin-bottom: 15px;
  font-size: 20px; 
  font-weight: 600; 
}

.about-text {
  font-size: 16px;
  line-height: 1.6; 
  color: #333; 
  text-align: center;
}
/* Instructions Section */
.instructions-section {
  position: relative;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
  padding: 40px 20px;
  overflow: hidden;
}

.spellbee-container {
  position: relative;
  z-index: 2;
}

.instructions-title {
  font-size: 24px;
  color: #000; /* Changed to black */
  margin-bottom: 25px;
  font-weight: bold;
}

.instructions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instruction-item {
  margin-bottom: 40px;
}

.instruction-step {
  color: #000; /* Changed to black */
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
}

.instruction-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.instruction-image {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.adaptive-image {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Footer */
.footer {
  background: #f8f9fa;
  padding: 25px 0;
  margin-top: 40px;
}

.footer p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Utility Classes */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.background-ornament {
  position: absolute;
  top: 3%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  height: 2%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.background-ornament2 {
  position: absolute;
  top: 18%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  height: 2%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scaleY(-1);
}
.corner {
  position: absolute;
  pointer-events: none;
  z-index: 3;
  width: 25%;
  height: 25%;
}

.corner img {
  width: 100%;
  height: 100%;
  opacity: 0.8;
  object-fit: contain;
}

.corner-top-left {
  top: -100px;
  left: 0px;
}

.corner-top-right {
  top: -100px;
  right: 0px;
}

.corner-bottom-left {
  bottom: -100px;
  left: 0px;
}

.corner-bottom-right {
  bottom: -100px;
  right: 0px;
}
.no-words {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #ff0000;
  background: #ffe6e6;
  border-radius: 8px;
}

.game-complete {
  text-align: center;
}

.categories-complete {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

/* ========== RESPONSIVE IMAGE SIZING ========== */
/* Desktop: smaller images (30-40%) */
@media (min-width: 992px) {
  .instruction-image {
    max-width: 35%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .adaptive-image {
    max-width: 100%;
    height: auto;
  }
}

/* Tablet (768px to 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .instruction-image {
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
}

/* Tablet (576px to 767px) */
@media (min-width: 576px) and (max-width: 767px) {
  .instruction-image {
    max-width: 60%;
    margin-left: auto;
    margin-right: auto;
  }
}

/* Mobile (Below 576px) */
@media (max-width: 575px) {
  .instruction-image {
    max-width: 75%;
    margin-left: auto;
    margin-right: auto;
  }
}

/* ========== MOBILE RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .game-screen {
    padding: 15px 8px;
    min-height: 350px;
  }
  
  .container {
    padding: 0 8px;
  }
  
  .combined-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .grid-item {
    min-height: 45px;
    font-size: 14px;
    padding: 8px 4px;
  }
  
  .about-section,
  .instructions-section {
    padding: 30px 15px;
    margin-top: 30px;
  }
  
  .about-title {
    font-size: 18px; 
  }
  
  .about-text {
    font-size: 15px; 
  }
  
  .instructions-title {
    font-size: 20px;
  }
  
  .instruction-step {
    font-size: 18px;
  }
  
  .instruction-text {
    font-size: 15px;
  }
  
  .footer {
    padding: 20px 0;
    margin-top: 30px;
  }
  
  .footer p {
    font-size: 13px;
  }
}

@media (max-width: 576px) {
  .game-screen {
    padding: 12px 5px;
    min-height: 300px;
  }
  
  .container {
    padding: 0 5px;
  }
  
  .combined-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }
  
  .grid-item {
    min-height: 40px;
    font-size: 12px;
    padding: 6px 2px;
  }
  
  .about-section,
  .instructions-section {
    padding: 25px 10px;
    margin-top: 25px;
  }
  
  .about-title {
    font-size: 20px;
  }
  
  .about-text {
    font-size: 15px;
  }
  
  .instructions-title {
    font-size: 18px;
  }
  
  .instruction-step {
    font-size: 16px;
  }
  
  .instruction-text {
    font-size: 14px;
  }
  
  .instruction-image {
    max-width: 85%;
  }
  
  .footer {
    padding: 15px 0;
    margin-top: 25px;
  }
  
  .footer p {
    font-size: 12px;
  }
}

@media (max-width: 375px) {
  .grid-item {
    min-height: 35px;
    font-size: 11px;
  }
  
  .about-title {
    font-size: 18px;
  }
  
  .about-text {
    font-size: 14px;
  }
  
  .instructions-title {
    font-size: 17px;
  }
  
  .instruction-step {
    font-size: 15px;
  }
  
  .instruction-text {
    font-size: 13px;
  }
}
</style>