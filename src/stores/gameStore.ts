import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Category, DailyInfo } from '../types/game'
import { gameApi } from '../api/gameApi'

// Types for attempt history
export interface AttemptHistoryItem {
  type: 'success' | 'mistake'
  colors: string[]
  timestamp: Date
  words?: string[]
}

export interface StoredAttemptHistory {
  gameDate: string
  attempts: AttemptHistoryItem[]
}

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
  const wordColors = ref<Record<string, string>>({})

  // Leaderboard state
  const leaderboardEntries = ref<any[]>([])
  const userLeaderboardEntry = ref<any | null>(null)
  const loadingLeaderboard = ref(false)

  // Local storage keys
  const ATTEMPT_HISTORY_KEY = 'tylmus_attempt_history'
  const CURRENT_GAME_DATE_KEY = 'tylmus_current_game_date'

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

  // ========== Leaderboard functions ==========
  const fetchLeaderboard = async () => {
  loadingLeaderboard.value = true
  try {
    const response = await axios.get('/api/leaderboard/today')
    leaderboardEntries.value = response.data.entries
    userLeaderboardEntry.value = response.data.user_entry
  } catch (error) {
    console.error('Failed to fetch leaderboard', error)
    // Don't close modal on error – keep it open
  } finally {
    loadingLeaderboard.value = false
  }
}

  const refreshLeaderboard = async () => {
    await fetchLeaderboard()
  }

  // ========== LocalStorage helpers ==========
  const loadAttemptHistory = (): AttemptHistoryItem[] => {
    try {
      const storedGameDate = localStorage.getItem(CURRENT_GAME_DATE_KEY)
      const today = new Date().toISOString().split('T')[0]
      
      if (storedGameDate !== today) {
        console.log('🆕 New day detected, clearing attempt history')
        localStorage.removeItem(ATTEMPT_HISTORY_KEY)
        localStorage.setItem(CURRENT_GAME_DATE_KEY, today)
        return []
      }
      
      const stored = localStorage.getItem(ATTEMPT_HISTORY_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as StoredAttemptHistory
        const attempts = parsed.attempts.map(attempt => ({
          ...attempt,
          timestamp: new Date(attempt.timestamp)
        }))
        console.log('📂 Loaded attempt history:', attempts.length)
        return attempts
      }
    } catch (error) {
      console.error('Error loading attempt history:', error)
    }
    return []
  }

  const saveAttemptHistory = (attempts: AttemptHistoryItem[]) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const historyToSave: StoredAttemptHistory = {
        gameDate: today,
        attempts: attempts.map(attempt => ({
          ...attempt,
          timestamp: attempt.timestamp
        }))
      }
      localStorage.setItem(ATTEMPT_HISTORY_KEY, JSON.stringify(historyToSave))
      localStorage.setItem(CURRENT_GAME_DATE_KEY, today)
      console.log('💾 Saved attempt history:', attempts.length)
    } catch (error) {
      console.error('Error saving attempt history:', error)
    }
  }

  const attemptHistory = ref<AttemptHistoryItem[]>(loadAttemptHistory())

  // ========== Game initialization ==========
  const checkDayChange = async (): Promise<boolean> => {
    try {
      dailyInfo.value = await gameApi.getDailyInfo()
      console.log('📅 Daily info:', dailyInfo.value)
      if (dailyInfo.value?.is_new_day) {
        console.log('🆕 New day detected')
        attemptHistory.value = []
        saveAttemptHistory([])
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
      const isNewDay = await checkDayChange()
      if (!isNewDay) {
        attemptHistory.value = loadAttemptHistory()
      }
      
      const response = await gameApi.getGame()
      gameDate.value = response.game_date
      if (response.word_colors) {
        wordColors.value = response.word_colors
      }
      
      foundCategories.value = response.found_categories || []
      mistakes.value = response.mistakes ?? 0

      if (response.words) {
        const foundWords = foundCategories.value.flatMap(cat => cat.words)
        words.value = response.words.filter(word => !foundWords.includes(word))
      } else {
        words.value = []
      }

      const hasWon = response.game_complete === true || foundCategories.value.length === 4
      const hasLost = mistakes.value >= 4
      gameOver.value = hasWon || hasLost
      if (hasWon) words.value = []

      selectedWords.value = []
      showMessage.value = false
    } catch (error) {
      console.error('Error loading game:', error)
      showMessage.value = true
      messageText.value = 'Ошибка загрузки игры'
      messageClass.value = 'error'
      words.value = []
      foundCategories.value = []
      mistakes.value = 0
      gameOver.value = false
      wordColors.value = {}
      attemptHistory.value = []
    } finally {
      loading.value = false
    }
  }

  // ========== Game actions ==========
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

  const handleSuccess = (result: any) => {
    showMessage.value = true
    messageText.value = `Правильно! "${result.category_name}"`
    messageClass.value = 'success'

    const newCategory = {
      name: result.category_name!,
      words: [...selectedWords.value],
      color: result.category_color || 'yellow'
    }
    foundCategories.value.push(newCategory)

    words.value = words.value.filter(word => !selectedWords.value.includes(word))
    
    const attemptColors = selectedWords.value.map(word => wordColors.value[word] || 'gray')
    const newAttempt: AttemptHistoryItem = {
      type: 'success',
      colors: attemptColors,
      timestamp: new Date(),
      words: [...selectedWords.value]
    }
    attemptHistory.value.push(newAttempt)
    saveAttemptHistory(attemptHistory.value)
    
    selectedWords.value = []

    if (result.game_complete) {
      gameOver.value = true
      words.value = []
      setTimeout(() => {
        showMessage.value = true
        messageText.value = 'Поздравляем! Вы нашли все категории!'
        messageClass.value = 'success'
      }, 1000)
    }

    setTimeout(() => {
      showMessage.value = false
    }, 3000)
  }

  const handleMistake = (message: string, result?: any) => {
    showMessage.value = true
    messageText.value = message
    messageClass.value = 'error'
    
    let attemptColors: string[]
    if (result?.selected_colors?.length === 4) {
      attemptColors = result.selected_colors
    } else {
      attemptColors = selectedWords.value.map(word => wordColors.value[word] || 'gray')
    }
    
    const newAttempt: AttemptHistoryItem = {
      type: 'mistake',
      colors: attemptColors,
      timestamp: new Date(),
      words: [...selectedWords.value]
    }
    attemptHistory.value.push(newAttempt)
    saveAttemptHistory(attemptHistory.value)
    
    selectedWords.value = []

    if (mistakes.value >= 4) {
      gameOver.value = true
      setTimeout(() => {
        showMessage.value = true
        messageText.value = 'Игра окончена! Слишком много ошибок.'
        messageClass.value = 'error'
      }, 1000)
    }

    setTimeout(() => {
      showMessage.value = false
    }, 3000)
  }

  const submitGuess = async () => {
    if (selectedWords.value.length !== 4) return
    console.log('📤 Submitting guess:', selectedWords.value)
    loading.value = true
    try {
      const result = await gameApi.checkSelection(selectedWords.value)
      if (result.valid) {
        handleSuccess(result)
      } else {
        if (result.mistakes !== undefined && result.mistakes !== null) {
          mistakes.value = result.mistakes
        }
        handleMistake(result.message || 'Неправильно! Попробуйте еще раз.', result)
      }
    } catch (error: any) {
      console.error('❌ Error submitting guess:', error)
      let errorMsg = 'Ошибка соединения'
      if (error.response) {
        errorMsg = `Ошибка сервера: ${error.response.data.error || error.response.status}`
      } else if (error.request) {
        errorMsg = 'Не удалось соединиться с сервером'
      }
      showMessage.value = true
      messageText.value = errorMsg
      messageClass.value = 'error'
    } finally {
      loading.value = false
    }
  }

  // ========== Utilities ==========
  const getCategoryColor = (index: number) => {
    const colors = ['yellow', 'green', 'blue', 'purple']
    return colors[index % colors.length]
  }

  const getWordColor = (word: string): string => {
    return wordColors.value[word] || 'gray'
  }

  const clearAttemptHistory = () => {
    attemptHistory.value = []
    localStorage.removeItem(ATTEMPT_HISTORY_KEY)
    localStorage.removeItem(CURRENT_GAME_DATE_KEY)
    console.log('🧹 Attempt history cleared')
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
    wordColors,
    gameStatus,
    gameDisplay,
    leaderboardEntries,
    userLeaderboardEntry,
    loadingLeaderboard,
    fetchLeaderboard,
    refreshLeaderboard,
    initializeGame,
    toggleWord,
    deselectAll,
    shuffleWords,
    submitGuess,
    getCategoryColor,
    getWordColor,
    resetGameState,
    clearAttemptHistory
  }
})