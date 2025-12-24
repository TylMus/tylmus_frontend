import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, DailyInfo } from '../types/game'
import { gameApi } from '../api/gameApi'

export const useGameStore = defineStore('game', () => {
  const words = ref<string[]>([])
  const foundCategories = ref<Category[]>([])
  const selectedWords = ref<string[]>([])
  const mistakes = ref(0)
  const gameOver = ref(false)
  const scrambleAnimation = ref(false)
  const showMessage = ref(false)
  const messageText = ref('')
  const messageClass = ref<'success' | 'error' | 'info'>('info')
  const loading = ref(false)
  const gameDate = ref('')
  const dailyInfo = ref<DailyInfo | null>(null)
  const wordColors = ref<Record<string, string>>({}) // ADDED: Store word colors from backend

  const gameStatus = computed(() => {
    if (gameOver.value) return 'game-over'
    if (foundCategories.value.length === 4) return 'won'
    return 'playing'
  })

  const gameDisplay = computed(() => {
    if (!gameDate.value) return 'Загрузка...'

    const gameDateObj = new Date(gameDate.value)
    const todayObj = new Date()
    const isToday = gameDateObj.toDateString() === todayObj.toDateString()

    if (isToday) {
      return `Сегодняшняя игра • ${foundCategories.value.length}/4 найдено • Ошибок: ${mistakes.value}/4`
    } else {
      return `Игра за ${gameDateObj.toLocaleDateString()} • ${foundCategories.value.length}/4 найдено • Ошибок: ${mistakes.value}/4`
    }
  })

  // Check day change using backend daily info
  const checkDayChange = async (): Promise<boolean> => {
    try {
      dailyInfo.value = await gameApi.getDailyInfo()
      console.log('📅 Daily info from backend:', dailyInfo.value)
      
      if (dailyInfo.value?.is_new_day) {
        console.log('🆕 Backend detected new day')
        // Clear attempt history for new day
        attemptHistory.value = []
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking day change:', error)
      return false
    }
  }

  const initializeGame = async () => {
    console.log('🔄 Initializing game...')
    loading.value = true
    
    try {
      // First check if it's a new day via backend
      const isNewDay = await checkDayChange()
      console.log('📅 New day check result:', isNewDay)
      
      const response = await gameApi.getGame()
      console.log('✅ Game data in store:', response)
      
      // Save the game date from backend
      gameDate.value = response.game_date
      
      // Store word colors from backend if available
      if (response.word_colors) {
        wordColors.value = response.word_colors
        console.log('🎨 Word colors loaded:', Object.keys(wordColors.value).length)
      }
      
      // Parse the game date from backend
      const backendGameDate = new Date(response.game_date)
      const today = new Date()
      const isTodayGame = backendGameDate.toDateString() === today.toDateString()
      
      console.log('📊 Date analysis:', {
        backendDate: backendGameDate.toDateString(),
        today: today.toDateString(),
        isTodayGame,
        isNewDay,
        foundCategoriesCount: response.found_categories?.length,
        mistakes: response.mistakes,
        gameComplete: response.game_complete
      })
      
      // Always use the backend's game state - it handles day changes via cookies
      // The backend ensures we get the correct state for today
      
      if (response.found_categories && Array.isArray(response.found_categories)) {
        foundCategories.value = response.found_categories
        console.log('🎯 Found categories from backend:', foundCategories.value.length)
      } else {
        console.log('📝 No found categories in response')
        foundCategories.value = []
      }

      if (response.mistakes !== undefined && response.mistakes !== null) {
        mistakes.value = response.mistakes
        console.log('❌ Mistakes from backend:', mistakes.value)
      } else {
        mistakes.value = 0
        console.log('📝 No mistakes in response')
      }

      if (response.words && Array.isArray(response.words)) {
        const foundWords = foundCategories.value.flatMap((category: Category) => category.words)
        console.log('🗑️ Removing found words from available:', foundWords.length)

        words.value = response.words.filter((word: string) => !foundWords.includes(word))
        console.log('📝 Available words after filtering:', words.value.length)
      } else {
        console.error('❌ No words in response:', response)
        words.value = []
      }

      // Check game status - IMPORTANT: Use all available info
      const hasWonFromBackend = response.game_complete === true
      const hasWonFromCategories = foundCategories.value.length === 4
      const hasLost = mistakes.value >= 4
      
      console.log('🎮 Game status check:', {
        hasWonFromBackend,
        hasWonFromCategories,
        hasLost,
        mistakes: mistakes.value,
        foundCategories: foundCategories.value.length
      })
      
      // Determine game over state
      if (hasWonFromBackend || hasWonFromCategories) {
        gameOver.value = true
        console.log('🏆 Game already completed - WIN')
        // Clear words when game is won
        words.value = []
      } else if (hasLost) {
        gameOver.value = true
        console.log('💀 Game over due to too many mistakes')
      } else {
        gameOver.value = false
        console.log('🎮 Game continues, found:', foundCategories.value.length, 'mistakes:', mistakes.value)
      }
      
      selectedWords.value = []
      showMessage.value = false
      
    } catch (error) {
      console.error('❌ Error loading game:', error)
      showMessage.value = true
      messageText.value = 'Ошибка загрузки игры'
      messageClass.value = 'error'
      words.value = []
      foundCategories.value = []
      mistakes.value = 0
      gameOver.value = false
      wordColors.value = {}
    } finally {
      loading.value = false
    }
  }

  const attemptHistory = ref<Array<{
    type: 'success' | 'mistake'
    colors: string[]
    timestamp: Date
    words?: string[]
  }>>([])

  const resetGameState = () => {
    selectedWords.value = []
    showMessage.value = false
  }

  const toggleWord = (word: string) => {
    if (gameOver.value) return

    const index = selectedWords.value.indexOf(word)
    if (index > -1) {
      selectedWords.value.splice(index, 1)
    } else if (selectedWords.value.length < 4) {
      selectedWords.value.push(word)
    }
    console.log('🔘 Selected words:', selectedWords.value)
  }

  const deselectAll = () => {
    selectedWords.value = []
  }

  const shuffleWords = () => {
    selectedWords.value = []
    scrambleAnimation.value = true
    const shuffled = [...words.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    words.value = shuffled

    setTimeout(() => {
      scrambleAnimation.value = false
    }, 300)
  }

  const submitGuess = async () => {
    if (selectedWords.value.length !== 4) return

    console.log('📤 Submitting guess:', selectedWords.value)
    loading.value = true
    try {
      const result = await gameApi.checkSelection(selectedWords.value)
      console.log('✅ Guess result:', result)

      if (result.valid) {
        handleSuccess(result)
      } else {
        if (result.mistakes !== undefined && result.mistakes !== null) {
          mistakes.value = result.mistakes
          console.log('❌ Updated mistakes from backend:', mistakes.value)
        }
        handleMistake(result.message || 'Неправильно! Попробуйте еще раз.', result)
      }
    } catch (error: any) {
      console.error('❌ Error submitting guess:', error)

      if (error.response) {
        console.error('Response error:', error.response.data)
        showMessage.value = true
        messageText.value = `Ошибка сервера: ${error.response.data.error || error.response.status}`
      } else if (error.request) {
        console.error('Request error:', error.request)
        showMessage.value = true
        messageText.value = 'Не удалось соединиться с сервером'
      } else {
        console.error('Error:', error.message)
        showMessage.value = true
        messageText.value = `Ошибка: ${error.message}`
      }
      messageClass.value = 'error'
    } finally {
      loading.value = false
    }
  }

const handleSuccess = (result: any) => {
  showMessage.value = true
  messageText.value = `Правильно! "${result.category_name}"`
  messageClass.value = 'success'

  // Add the found category with color from backend
  const newCategory = {
    name: result.category_name!,
    words: [...selectedWords.value],
    color: result.category_color || 'yellow'
  }
  
  foundCategories.value.push(newCategory)

  // Remove found words from available words
  words.value = words.value.filter((word: string) => !selectedWords.value.includes(word))
  
  // Get colors for each word from wordColors map
  const attemptColors = selectedWords.value.map(word => 
    wordColors.value[word] || 'gray'
  )
  
  // Save to history
  attemptHistory.value.push({
    type: 'success',
    colors: attemptColors,
    timestamp: new Date(),
    words: [...selectedWords.value]
  })
  
  selectedWords.value = []

  // Check if game is complete from backend response
  if (result.game_complete) {
    gameOver.value = true
    console.log('🏆 Game complete - WIN!')
    // Clear words when game is won
    words.value = []
    setTimeout(() => {
      showMessage.value = true
      messageText.value = 'Поздравляем! Вы нашли все категории!'
      messageClass.value = 'success'
    }, 1000)
  } else {
    // Game continues
    console.log('✅ Found category, game continues. Found:', foundCategories.value.length)
  }

  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

const handleMistake = (message: string, result?: any) => {
  showMessage.value = true
  messageText.value = message
  messageClass.value = 'error'
  
  // Get colors for each word from wordColors map or use result.selected_colors
  let attemptColors: string[]
  
  if (result?.selected_colors && result.selected_colors.length === 4) {
    // Use colors from backend if available
    attemptColors = result.selected_colors
  } else {
    // Fallback: get colors from wordColors map
    attemptColors = selectedWords.value.map(word => 
      wordColors.value[word] || 'gray'
    )
  }
  
  attemptHistory.value.push({
    type: 'mistake',
    colors: attemptColors,
    timestamp: new Date(),
    words: [...selectedWords.value]
  })
  
  selectedWords.value = []

  // Check if game is over after this mistake
  console.log('❌ Mistake made. Current mistakes:', mistakes.value, 'Max: 4')
  
  // Make sure mistakes don't exceed 4
  if (mistakes.value > 4) {
    console.warn('⚠️ Mistakes exceed 4, correcting to 4')
    mistakes.value = 4
  }
  
  if (mistakes.value >= 4) {
    gameOver.value = true
    console.log('💀 Game over - too many mistakes')
    setTimeout(() => {
      showMessage.value = true
      messageText.value = 'Игра окончена! Слишком много ошибок.'
      messageClass.value = 'error'
    }, 1000)
  } else {
    console.log('🎮 Game continues after mistake')
  }

  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

  const getCategoryColor = (index: number) => {
    const colors = ['yellow', 'green', 'blue', 'purple']
    return colors[index % colors.length]
  }

  // Helper to get color for a specific word
  const getWordColor = (word: string): string => {
    return wordColors.value[word] || 'gray'
  }

  return {
    words,
    foundCategories,
    selectedWords,
    mistakes,
    gameOver,
    scrambleAnimation,
    showMessage,
    messageText,
    messageClass,
    loading,
    gameDate,
    dailyInfo,
    attemptHistory,
    wordColors, // EXPORT wordColors

    gameStatus,
    gameDisplay,

    initializeGame,
    toggleWord,
    deselectAll,
    shuffleWords,
    submitGuess,
    getCategoryColor,
    getWordColor, // EXPORT getWordColor
    resetGameState
  }
})