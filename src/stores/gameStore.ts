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

  const gameStatus = computed(() => {
    if (gameOver.value) return 'game-over'
    if (foundCategories.value.length === 4) return 'won'
    return 'playing'
  })

  const dailyDisplay = computed(() => {
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

  const initializeGame = async () => {
    console.log('🔄 Initializing game...')
     try {
    const stored = localStorage.getItem('tylmus_game_backup')
    if (stored) {
      const backup = JSON.parse(stored)
      // Проверяем, что бэкап не старше 24 часов
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000
      
      if (now - backup.timestamp < oneDay) {
        console.log('📦 Found valid localStorage backup:', backup)
        
        // Используем бэкап как временное состояние пока грузится с сервера
        words.value = backup.words || []
        foundCategories.value = backup.foundCategories || []
        mistakes.value = backup.mistakes || 0
        gameDate.value = backup.gameDate || ''
        
        // Восстанавливаем статус игры
        if (foundCategories.value.length === 4 || mistakes.value >= 4) {
          gameOver.value = true
        }
        
        console.log('⚡ Fast restore from localStorage complete')
      } else {
        // Удаляем старый бэкап
        localStorage.removeItem('tylmus_game_backup')
      }
    }
  } catch (e) {
    console.warn('⚠️ Error reading localStorage:', e)
  }
    loading.value = true
    try {
      const response = await gameApi.getGame()
      console.log('✅ Game data in store:', response)

      if (response.found_categories && Array.isArray(response.found_categories)) {
        foundCategories.value = response.found_categories
        console.log('🎯 Restored found categories:', foundCategories.value)
      } else {
        console.log('📝 No found categories to restore')
        foundCategories.value = []
      }

      if (response.mistakes !== undefined) {
        mistakes.value = response.mistakes
        console.log('❌ Restored mistakes:', mistakes.value)
      } else {
        mistakes.value = 0
        console.log('📝 No mistakes to restore')
      }

      if (response.words && Array.isArray(response.words)) {
        const foundWords = foundCategories.value.flatMap((category: Category) => category.words)
        console.log('🗑️ Removing found words from available:', foundWords)

        words.value = response.words.filter((word: string) => !foundWords.includes(word))
        console.log('📝 Available words after filtering:', words.value)
      } else {
        console.error('❌ No words in response:', response)
        words.value = []
      }

      gameDate.value = response.game_date

      selectedWords.value = []
      showMessage.value = false

      if (foundCategories.value.length === 4) {
        gameOver.value = true
        console.log('🏆 Game already completed')
      } else if (mistakes.value >= 4) {
        gameOver.value = true
        console.log('💀 Game over due to too many mistakes')
      } else {
        gameOver.value = false
      }

      await checkDayChange()
    } catch (error) {
      console.error('❌ Error loading game:', error)
      showMessage.value = true
      messageText.value = 'Ошибка загрузки игры'
      messageClass.value = 'error'
      words.value = []
      foundCategories.value = []
    } finally {
      loading.value = false
    }
  }

  const checkDayChange = async () => {
    try {
      dailyInfo.value = await gameApi.getDailyInfo()
      console.log('📅 Daily info:', dailyInfo.value)
    } catch (error) {
      console.error('Error checking day change:', error)
    }
  }

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
        if (result.mistakes !== undefined) {
          mistakes.value = result.mistakes
        }
        handleMistake(result.message || 'Неправильно! Попробуйте еще раз.')
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

    foundCategories.value.push({
      name: result.category_name!,
      words: [...selectedWords.value]
    })

    words.value = words.value.filter((word: string) => !selectedWords.value.includes(word))
    selectedWords.value = []

    if (result.game_complete) {
      gameOver.value = true
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

  const handleMistake = (message: string) => {
    showMessage.value = true
    messageText.value = message
    messageClass.value = 'error'
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

  const getCategoryColor = (index: number) => {
    const colors = ['yellow', 'green', 'blue', 'purple']
    return colors[index % colors.length]
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

    gameStatus,
    dailyDisplay,

    initializeGame,
    toggleWord,
    deselectAll,
    shuffleWords,
    submitGuess,
    getCategoryColor,
    resetGameState
  }
})