<template>
  <div class="app-container">
    <!-- Notifications -->
    <NotificationPopup 
      v-if="gameStore.showMessage && !gameStore.gameOver" 
      :type="gameStore.messageClass"
      :text="gameStore.messageText"
      @close="closePopup"
    />
    
    <!-- Game Over Modal - Super Simplified -->
    <div v-if="gameStore.gameOver" class="game-over-modal-overlay">
      <div class="game-over-modal">
        <div class="modal-content">
          <!-- Game Result Header -->
          <div class="game-result-header">
            <h2 v-if="gameStore.foundCategories.length === 4"> Победа!</h2>
            <h2 v-else> Поражение</h2>
            <div class="result-stats">
              Найдено категорий: {{ gameStore.foundCategories.length }}/4
              <br>
              Ошибок: {{ gameStore.mistakes }}/4
            </div>
          </div>
          
          <!-- Game History Visualization -->
          <div class="game-history">
            <div class="history-grid">
              <div 
                v-for="(attempt, index) in gameStore.attemptHistory" 
                :key="index"
                class="attempt-row"
              >
                <div class="attempt-squares">
                  <div 
                    v-for="(color, colorIndex) in getFourColors(attempt)" 
                    :key="colorIndex"
                    class="color-square"
                    :class="color"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Next Game Timer - Plain Text -->
          <div class="next-game-timer">
            Следующая игра через: {{ countdownTime }}
          </div>
          
          <!-- Share Button -->
          <button 
            @click="shareResults"
            class="share-button"
          >
            Поделиться результатом
          </button>
        </div>
      </div>
    </div>
    
    <!-- Уведомление о копировании -->
    <NotificationPopup 
      v-if="showShareNotification"
      type="success"
      :text="shareNotificationText"
      @close="closeShareNotification"
    />

    <div class="background-ornament">
      <img 
        src="/public/img/background-ornament.svg" 
        alt="Background ornament" 
      />
    </div>
    <!-- Unified Background -->
    <div class="background-ornament2">
      <img 
        src="/public/img/background-ornament.svg" 
        alt="Background ornament" 
      />
    </div>

    <!-- Game Header -->
    <GameHeader :game-display="gameStore.gameDisplay" />
    
    <!-- Main Game Area -->
    <div class="game-screen">
      <div class="container">
        <!-- Loading State - Fixed height container -->
        <div v-if="gameStore.loading" class="loading">
          Загрузка игры...
        </div>
        
        <!-- Game Complete State -->
        <div v-else-if="gameStore.words.length === 0 && gameStore.foundCategories.length === 4" class="game-complete">
          <div class="combined-grid complete-mode">
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
        
        <!-- Game Grid - Fixed height container -->
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
          :show-share-button="false"
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
            уровень волнения и стратегического мышления, так как игроки нуждаются в тщательном обдумывании своих выборов и связей.
          </p>
        </div>
      </div>
    </section>

    <!-- Instructions Section -->
    <section class="instructions-section">
    
      <!-- Corner SVGs -->
      <div class="corner corner-top-left">
        <img 
          src="/public/img/corner-top-left.svg" 
          alt="Decorative corner" 
        />
      </div>
      <div class="corner corner-top-right">
        <img 
          src="/public/img/corner-top-right.svg" 
          alt="Decorative corner" 
        />
      </div>
      <div class="corner corner-bottom-left">
        <img 
          src="/public/img/corner-bottom-left.svg" 
          alt="Decorativ	e corner" 
        />
      </div>
      <div class="corner corner-bottom-right ">
        <img 
          src="/public/img/corner-bottom-right.svg" 
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
                <img class="adaptive-image" src="/public/img/step1.png" alt="Прочти слова">
              </div>
            </li>
            <li class="instruction-item">
              <h4 class="instruction-step">Найди общее</h4>
              <p class="instruction-text">После того как вы прочитаете и поймёте слова, следующий шаг — найти общую тему, которая их связывает.</p>
              <div class="instruction-image">
                <img class="adaptive-image" src="/public/img/step2.png" alt="Найди общее">
              </div>
            </li>
            <li class="instruction-item">
              <h4 class="instruction-step">Выбери и отправь свой ответ</h4>
              <p class="instruction-text">Когда вы определите общую тему и найдёте четыре слова, подходящие под неё, пора сделать свой выбор.</p>
              <div class="instruction-image">
                <img class="adaptive-image" src="/public/img/step3.png" alt="Выбери и отправь свой ответ">
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
import { onMounted, ref, computed, onUnmounted, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import GameHeader from '../components/GameHeader.vue'
import WordCard from '../components/WordCard.vue'
import CategoryBlock from '../components/CategoryBlock.vue'
import GameControls from '../components/GameControls.vue'
import NotificationPopup from '../components/NotificationPopup.vue'

const gameStore = useGameStore()
const countdownInterval = ref<NodeJS.Timeout | null>(null)
const showShareNotification = ref(false)
const shareNotificationText = ref('')

const closePopup = () => {
  gameStore.showMessage = false
}

const closeShareNotification = () => {
  showShareNotification.value = false
}

// Function to get next midnight in GMT+9
const getNextMidnightGMT9 = (): Date => {
  const now = new Date()
  
  // Convert current time to GMT+9
  const gmt9Offset = 9 * 60 // 9 hours in minutes
  const localOffset = now.getTimezoneOffset()
  const totalOffset = gmt9Offset + localOffset
  
  // Create date in GMT+9
  const gmt9Time = new Date(now.getTime() + totalOffset * 60 * 1000)
  
  // Set to next midnight in GMT+9
  const nextMidnightGMT9 = new Date(gmt9Time)
  nextMidnightGMT9.setHours(24, 0, 0, 0)
  
  // Convert back to local time
  const localNextMidnight = new Date(nextMidnightGMT9.getTime() - totalOffset * 60 * 1000)
  
  return localNextMidnight
}

// Format time remaining
const formatTimeRemaining = (endTime: Date): string => {
  const now = new Date()
  const diff = endTime.getTime() - now.getTime()
  
  if (diff <= 0) {
    return "00:00:00"
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Helper to ensure 4 colors per attempt
const getFourColors = (attempt: any): string[] => {
  const colors = attempt.colors || []
  
  // If we have exactly 4 colors, use them
  if (colors.length === 4) {
    return colors
  }
  
  // If we have fewer than 4 colors (old data or mistake without colors)
  // For success, repeat the first color 4 times
  if (attempt.type === 'success' && colors.length > 0) {
    return Array(4).fill(colors[0])
  }
  
  // For mistakes with fewer than 4 colors, fill missing ones with 'gray'
  const result = [...colors]
  while (result.length < 4) {
    result.push('gray')
  }
  return result
}

// Reactive value to force updates
const forceUpdate = ref(0)

// Computed countdown time
const countdownTime = computed(() => {
  const nextMidnight = getNextMidnightGMT9()
  return formatTimeRemaining(nextMidnight)
})

// Start countdown timer
const startCountdownTimer = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  
  if (gameStore.gameOver) {
    countdownInterval.value = setInterval(() => {
      forceUpdate.value++
    }, 1000)
  }
}

const generateShareText = (): string => {
  const today = new Date().toISOString().split('T')[0]
  const foundCount = gameStore.foundCategories.length
  
  const colorEmojiMap = {
    'yellow': '🟨',
    'green': '🟩',
    'blue': '🟦',
    'purple': '🟪'
  }
  
  let text = `🎮 ТылМус - Результаты игры\n\n`
  
  if (gameStore.attemptHistory && gameStore.attemptHistory.length > 0) {
    text += `📊 История попыток:\n\n`
    
    // Show all attempts with exactly 4 squares
    gameStore.attemptHistory.forEach(attempt => {
      if (attempt.type === 'success') {
        const color = attempt.colors[0] || 'yellow'
        const emoji = colorEmojiMap[color as keyof typeof colorEmojiMap] || '🟨'
        text += `${emoji}${emoji}${emoji}${emoji}\n`
      } else if (attempt.type === 'mistake') {
        const fourColors = getFourColors(attempt)
        fourColors.forEach(color => {
          text += colorEmojiMap[color as keyof typeof colorEmojiMap] || '⬜'
        })
        text += '\n'
      }
    })
    
    // Add missing categories as found for complete games
    if (foundCount === 4) {
      const shownColors = gameStore.attemptHistory
        .filter(a => a.type === 'success')
        .map(a => a.colors[0])
      
      const allColors = ['yellow', 'green', 'blue', 'purple']
      allColors.forEach(color => {
        if (!shownColors.includes(color)) {
          const emoji = colorEmojiMap[color as keyof typeof colorEmojiMap]
          text += `${emoji}${emoji}${emoji}${emoji}\n`
        }
      })
    }
    
    text += `\n`
  }
  
  if (foundCount === 4) {
    text += `🏆 ПОБЕДА!\n`
  } else {
    text += `📊 РЕЗУЛЬТАТ:\n`
  }
  
  text += `✅ Найдено категорий: ${foundCount}/4\n`
  text += `❌ Ошибок: ${gameStore.mistakes}\n`
  text += `📅 Дата: ${today}\n\n`
  
  if (foundCount < 4) {
    const remaining = 4 - foundCount
    text += `⚠️ Осталось найти: ${remaining} категори${remaining === 1 ? 'я' : 'и'}\n\n`
  }
  
  text += `🔗 Играйте в ТылМус: tylmus.ru\n`
  text += `#ТылМус #СвязатьСлова`
  
  return text
}

const shareResults = async () => {
  try {
    const shareText = generateShareText()
    
    if (navigator.share) {
      await navigator.share({
        title: 'ТылМус - Мои результаты',
        text: shareText,
        url: window.location.origin
      })
    } else {
      await navigator.clipboard.writeText(shareText)
      showShareNotification.value = true
      shareNotificationText.value = 'Результат скопирован в буфер обмена!'
      
      setTimeout(() => {
        showShareNotification.value = false
      }, 3000)
    }
    
    console.log('📋 Результаты игры скопированы для шаринга')
  } catch (error) {
    console.error('❌ Ошибка при шаринге результатов:', error)
    
    try {
      const textArea = document.createElement('textarea')
      textArea.value = generateShareText()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      showShareNotification.value = true
      shareNotificationText.value = 'Результат скопирован в буфер обмена!'
      
      setTimeout(() => {
        showShareNotification.value = false
      }, 3000)
    } catch (fallbackError) {
      console.error('❌ Ошибка fallback копирования:', fallbackError)
      alert('Не удалось скопировать результат. Пожалуйста, скопируйте текст вручную.')
    }
  }
}

onMounted(() => {
  console.log('🎮 GameView mounted, initializing game...')
  gameStore.initializeGame().then(() => {
    console.log('✅ Game initialization complete')
    startCountdownTimer()
  }).catch(error => {
    console.error('❌ Game initialization failed:', error)
  })
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})

watch(() => gameStore.gameOver, (newVal) => {
  if (newVal) {
    startCountdownTimer()
  } else if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
})
</script>

<style scoped>
/* Super Simplified Game Over Modal */
.game-over-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.game-over-modal {
  background: white;
  border-radius: 12px;
  padding: 25px;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Game Result Header */
.game-result-header {
  text-align: center;
}

.game-result-header h2 {
  font-size: 26px;
  margin-bottom: 10px;
  color: #333;
}

.game-result-header h2:first-child {
  color: #28a745;
}

.game-result-header h2:last-child {
  color: #dc3545;
}

.result-stats {
  font-size: 15px;
  color: #666;
  line-height: 1.4;
}

/* Game History */
.game-history {
  display: flex;
  justify-content: center;
}

.history-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 220px;
  overflow-y: auto;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.attempt-row {
  display: flex;
  justify-content: center;
}

.attempt-squares {
  display: flex;
  gap: 6px;
}

.color-square {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.color-square.yellow { background: #ffcc95; }
.color-square.green { background: #aef8cb; }
.color-square.blue { background: #b6ceff; }
.color-square.purple { background: #E0ceff; }
.color-square.gray { background: #ddd; }

/* Next Game Timer - Plain Text */
.next-game-timer {
  text-align: center;
  font-size: 16px;
  color: #333;
  padding: 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

/* Share Button */
.share-button {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.share-button:hover {
  background: #45a049;
}

/* Responsive styles */
@media (max-width: 768px) {
  .game-over-modal {
    padding: 20px;
    width: 95%;
  }
  
  .game-result-header h2 {
    font-size: 22px;
  }
  
  .result-stats {
    font-size: 14px;
  }
  
  .color-square {
    width: 22px;
    height: 22px;
  }
  
  .next-game-timer {
    font-size: 15px;
  }
  
  .share-button {
    padding: 10px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .game-over-modal {
    padding: 15px;
  }
  
  .game-result-header h2 {
    font-size: 20px;
  }
  
  .color-square {
    width: 20px;
    height: 20px;
  }
  
  .attempt-squares {
    gap: 4px;
  }
  
  .share-button {
    padding: 8px;
    font-size: 14px;
  }
}

/* Rest of existing styles */
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
  min-height: 550px;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 0 10px;
  margin: 0 auto;
}

.combined-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  min-height: 400px;
}

.grid-item {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-block {
  margin: 0;
  grid-column: 1 / span 4;
  min-height: 60px;
  padding: 10px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-info {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
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

/* About Section */
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
  color: #000;
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
  color: #000;
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
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-complete {
  text-align: center;
}

/* ========== RESPONSIVE IMAGE SIZING (ORIGINAL - RESTORED) ========== */
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

/* Tablet (768px to 991px) - FIXED */
@media (min-width: 768px) and (max-width: 991px) {
  .instruction-image {
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Fixed: Always use 4 columns on tablet */
  .combined-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    max-width: 600px;
    min-height: 350px;
  }
  
  .grid-item {
    min-height: 45px;
    font-size: 13px;
    padding: 8px 4px;
  }
  
  .category-block {
    grid-column: 1 / span 4;
    min-height: 45px;
    padding: 8px;
  }
}

/* Small Tablet (576px to 767px) - FIXED */
@media (min-width: 576px) and (max-width: 767px) {
  .instruction-image {
    max-width: 60%;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Fixed: Always use 4 columns on small tablet */
  .combined-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    max-width: 500px;
    min-height: 300px;
  }
  
  .grid-item {
    min-height: 40px;
    font-size: 12px;
    padding: 6px 3px;
  }
  
  .category-block {
    grid-column: 1 / span 4;
    min-height: 40px;
    padding: 6px;
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

/* ========== MOBILE TEXT SIZE ADJUSTMENTS ========== */
@media (max-width: 768px) {
  .about-section {
    padding: 30px 15px;
    margin-top: 30px;
  }
  
  .about-title {
    font-size: 18px;
  }
  
  .about-text {
    font-size: 14px;
  }
  
  .instructions-section {
    padding: 30px 15px;
  }
  
  .instructions-title {
    font-size: 20px;
  }
  
  .instruction-step {
    font-size: 18px;
  }
  
  .instruction-text {
    font-size: 14px;
  }
  
  .footer {
    padding: 20px 0;
    margin-top: 30px;
  }
  
  .footer p {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .about-section {
    padding: 25px 10px;
    margin-top: 25px;
  }
  
  .about-title {
    font-size: 16px;
  }
  
  .about-text {
    font-size: 13px;
  }
  
  .instructions-section {
    padding: 25px 10px;
  }
  
  .instructions-title {
    font-size: 18px;
  }
  
  .instruction-step {
    font-size: 16px;
  }
  
  .instruction-text {
    font-size: 13px;
  }
  
  .footer {
    padding: 15px 0;
    margin-top: 25px;
  }
  
  .footer p {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .about-title {
    font-size: 15px;
  }
  
  .about-text {
    font-size: 12px;
  }
  
  .instructions-title {
    font-size: 16px;
  }
  
  .instruction-step {
    font-size: 14px;
  }
  
  .instruction-text {
    font-size: 12px;
  }
  
  .footer p {
    font-size: 10px;
  }
}

/* ========== MOBILE RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .game-screen {
    padding: 15px 8px;
    min-height: 450px;
  }
  
  .container {
    padding: 0 8px;
  }
  
  .combined-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    max-width: 500px;
    min-height: 350px;
  }
  
  .grid-item {
    min-height: 45px;
    font-size: 14px;
    padding: 8px 4px;
  }
  
  .category-block {
    grid-column: 1 / span 2;
    min-height: 45px;
    padding: 8px;
  }
  
  .loading,
  .no-words {
    min-height: 350px;
  }
}

@media (max-width: 576px) {
  .game-screen {
    padding: 12px 5px;
    min-height: 400px;
  }
  
  .container {
    padding: 0 5px;
  }
  
  .combined-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    max-width: 400px;
    min-height: 300px;
  }
  
  .grid-item {
    min-height: 40px;
    font-size: 12px;
    padding: 6px 2px;
  }
  
  .category-block {
    grid-column: 1 / span 4;
    min-height: 40px;
    padding: 6px;
  }
  
  .loading,
  .no-words {
    min-height: 300px;
  }
}

@media (max-width: 375px) {
  .grid-item {
    min-height: 35px;
    font-size: 11px;
  }
  
  .category-block {
    min-height: 35px;
  }
  
  .combined-grid {
    min-height: 280px;
  }
  
  .loading,
  .no-words {
    min-height: 280px;
  }
  
  .game-complete {
    text-align: center;
  }

  /* Use the same grid layout for complete mode */
  .complete-mode {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    max-width: 700px;
    margin: 0 auto;
  }

  .complete-mode .category-block {
    grid-column: 1;
    min-height: 60px;
    padding: 10px;
  }
}
</style>