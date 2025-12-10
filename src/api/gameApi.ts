import axios from 'axios'
import type { CheckSelectionResponse, DailyInfo } from '../types/game'

const API_BASE_URL = 'https://tylmus-tylmus-backend-a4a1.twc1.net'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

export const testConnection = async () => {
  try {
    console.log('🔗 Testing connection to:', API_BASE_URL)
    const response = await axios.get(`${API_BASE_URL}/`)
    console.log('✅ Backend is reachable:', response.data)
    return true
  } catch (error) {
    console.error('❌ Backend is not reachable:', error)
    return false
  }
}

export const gameApi = {
  async getGame() {
    console.log('🚀 Fetching game from:', `${API_BASE_URL}/game`)

    const connected = await testConnection()
    if (!connected) {
      throw new Error('Backend server is not reachable')
    }

    try {
      const response = await api.get('/api/game')
      console.log('✅ Game data received:', response.data)
      console.log('📝 Words count:', response.data.words?.length)
      console.log('📝 Words:', response.data.words)
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch game:', error)
      throw error
    }
  },

  async checkSelection(selectedWords: string[]): Promise<CheckSelectionResponse> {
    console.log('📤 Submitting selection:', selectedWords)
    try {
      const response = await api.post('/api/check_selection', selectedWords)
      console.log('✅ Selection response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Selection error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },

  async getGameStatus() {
    const response = await api.get('/api/game_status')
    return response.data
  },

  async getDailyInfo(): Promise<DailyInfo> {
    const response = await api.get('/api/daily_info')
    return response.data
  }
}