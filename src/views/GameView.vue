<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <!-- Notifications -->
    <NotificationPopup
      v-if="gameStore.showMessage && !gameStore.gameOver"
      :type="gameStore.messageClass"
      :text="gameStore.messageText"
      @close="gameStore.showMessage = false"
      class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
    />

    <!-- Game Over Modal -->
    <GameOverModal
      :show="gameStore.gameOver && showGameOverModal"
      :is-win="gameStore.foundCategories.length === 4"
      :found-count="gameStore.foundCategories.length"
      :mistakes="gameStore.mistakes"
      :attempt-history="gameStore.attemptHistory"
      @close="showGameOverModal = false"
      @share="shareResults"
      @expired="handleGameExpired"
    />

    <!-- Share notification -->
    <NotificationPopup
      v-if="showShareNotification"
      type="success"
      :text="shareNotificationText"
      @close="showShareNotification = false"
    />

    <!-- Background ornaments -->
    <BackgroundOrnaments />

    <!-- Header -->
    <GameHeader :game-display="gameStore.gameDisplay" @open-leaderboard="openLeaderboard" />
    
    <!-- Leader Board -->
    <LeaderboardModal
    :show="showLeaderboard"
    :game-date="gameDate"
    :game-complete="gameStore.foundCategories.length === 4"
    :user-entry="gameStore.userLeaderboardEntry"
    :entries="gameStore.leaderboardEntries"
    @close="closeLeaderboard"
    @submitted="handleLeaderboardSubmitted"
    />
    <!-- Main game area -->
<div class="w-full max-w-4xl mx-auto px-2 py-5 min-h-[600px] flex flex-col">
  <!-- Loading / Error / Complete states -->
  <div v-if="gameStore.loading" class="text-center py-10 text-gray-500 min-h-[500px] flex items-center justify-center">
    Загрузка игры...
  </div>
  <div
    v-else-if="gameStore.words.length === 0 && gameStore.foundCategories.length === 4"
    class="text-center w-full"
  >
    <div class="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
      <CategoryBlock
        v-for="(cat, idx) in gameStore.foundCategories"
        :key="'cat-'+idx"
        :name="cat.name"
        :words="cat.words"
        :color="gameStore.getCategoryColor(idx)"
      />
    </div>
  </div>
  <div
    v-else-if="gameStore.words.length === 0"
    class="text-center py-10 text-red-500 bg-red-50 rounded-lg min-h-[500px] flex items-center justify-center"
  >
    Не удалось загрузить слова. Проверьте консоль.
  </div>
  <!-- Game grid – only shown when there are words and game not complete -->
  <div v-else class="grid grid-cols-4 gap-2 md:gap-3 mb-3 w-full max-w-3xl mx-auto">
    <!-- Found categories -->
    <CategoryBlock
      v-for="(cat, idx) in gameStore.foundCategories"
      :key="'found-'+idx"
      :name="cat.name"
      :words="cat.words"
      :color="gameStore.getCategoryColor(idx)"
      class="col-span-4"
    />
    <!-- Word cards -->
    <WordCard
      v-for="(word, idx) in gameStore.words"
      :key="'word-'+idx"
      :word="word"
      :selected="gameStore.selectedWords.includes(word)"
      :scramble-animation="gameStore.scrambleAnimation"
      @click="gameStore.toggleWord(word)"
    />
  </div>

      <!-- Mistakes display -->
      <div class="flex justify-center mb-3 sticky bottom-0 bg-white/80 backdrop-blur-sm py-2 z-10">
        <div class="flex items-center gap-2 text-sm flex-wrap justify-center">
          Осталось ошибок:
          <span v-for="n in 4" :key="n" class="text-2xl text-gray-400 transition-opacity" :class="{ 'opacity-30': (5 - n) <= gameStore.mistakes }">●</span>
        </div>
      </div>

      <!-- Controls -->
      <GameControls
        :can-submit="gameStore.selectedWords.length === 4 && !gameStore.gameOver"
        :game-over="gameStore.gameOver"
        :show-share-button="false"
        @deselect-all="gameStore.deselectAll"
        @shuffle-words="gameStore.shuffleWords"
        @submit-guess="gameStore.submitGuess"
      />
    </div>

    <!-- About & Instructions & Footer -->
    <AboutSection />
    <InstructionsSection />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import GameHeader from '../components/GameHeader.vue'
import WordCard from '../components/WordCard.vue'
import CategoryBlock from '../components/CategoryBlock.vue'
import GameControls from '../components/GameControls.vue'
import NotificationPopup from '../components/NotificationPopup.vue'
import GameOverModal from '../components/GameOverModal.vue'
import BackgroundOrnaments from '../components/BackgroundOrnaments.vue'
import AboutSection from '../components/AboutSection.vue'
import InstructionsSection from '../components/InstructionsSection.vue'
import FooterSection from '../components/FooterSection.vue'
import LeaderboardModal from '../components/LeaderboardModal.vue'

const gameStore = useGameStore()
const showShareNotification = ref(false)
const shareNotificationText = ref('')
const showGameOverModal = ref(true)
const showLeaderboard = ref(false)
const gameDate = computed(() => gameStore.gameDisplay?.split(' ')[0] || new Date().toISOString().split('T')[0])

const openLeaderboard = async () => {
  console.log('🏆 Opening leaderboard')
  showLeaderboard.value = true
  await gameStore.fetchLeaderboard()
}
const closeLeaderboard = () => {
  console.log('🏆 Closing leaderboard')
  showLeaderboard.value = false
}
const handleLeaderboardSubmitted = () => {
  gameStore.refreshLeaderboard()
}
// Share logic (same as original)
const generateShareText = (): string => {
  const today = new Date().toISOString().split('T')[0]
  const foundCount = gameStore.foundCategories.length

  const colorEmojiMap = {
    yellow: '🟨',
    green: '🟩',
    blue: '🟦',
    purple: '🟪'
  }

  let text = `🎮 ТылМус - Результаты игры\n\n`

  if (gameStore.attemptHistory && gameStore.attemptHistory.length > 0) {
    text += `📊 История попыток:\n\n`

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

const getFourColors = (attempt: any): string[] => {
  const colors = attempt.colors || []
  if (colors.length === 4) return colors
  if (attempt.type === 'success' && colors.length > 0) {
    return Array(4).fill(colors[0])
  }
  const result = [...colors]
  while (result.length < 4) result.push('gray')
  return result
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
  } catch (error) {
    console.error('❌ Ошибка при шаринге:', error)
    // Fallback copy
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
      console.error('❌ Fallback copy failed:', fallbackError)
      alert('Не удалось скопировать результат. Пожалуйста, скопируйте вручную.')
    }
  }
}

const handleGameExpired = () => {
  console.log('Game expired, reloading...')
  gameStore.initializeGame()
}

watch(() => gameStore.gameOver, (newVal) => {
  if (newVal) showGameOverModal.value = true
})

onMounted(() => {
  gameStore.initializeGame()
})
</script>
