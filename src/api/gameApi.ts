import axios from 'axios'
import type { CheckSelectionResponse, DailyInfo } from '../types/game'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Test the connection
export const testConnection = async () => {
  try {
    console.log('🔗 Testing connection to:', API_BASE_URL)
    const response = await axios.get('/api') // ✅ Относительный путь
    console.log('✅ Backend is reachable:', response.data)
    return true
  } catch (error) {
    console.error('❌ Backend is not reachable:', error)
    return false
  }
}

export const gameApi = {
  async getGame() {
    console.log('🚀 Fetching game from:', ${API_BASE_URL}/game)
    
    try {
      const response = await api.get('/game')
      console.log('✅ Game data received:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch game:', error)
      throw error
    }
  },

  async checkSelection(selectedWords: string[]): Promise<CheckSelectionResponse> {
    console.log('📤 Submitting selection:', selectedWords)
    try {
      const response = await api.post('/check_selection', selectedWords)
      return response.data
    } catch (error: any) {
      console.error('❌ Selection error:', error.response?.data)
      throw error
    }
  },

  async getGameStatus() {
    const response = await api.get('/game_status')
    return response.data
  },

  async getDailyInfo(): Promise<DailyInfo> {
    const response = await api.get('/daily_info')
    return response.data
  }
}