export interface Category {
  name: string
  words: string[]
}

export interface GameState {
  words: string[]
  categories: Category[]
  foundCategories: Category[]
  mistakes: number
  gameOver: boolean
  gameDate: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface CheckSelectionResponse {
  valid: boolean
  category_name?: string
  message?: string
  remaining?: number
  game_complete?: boolean
}

export interface DailyInfo {
  today: string
  current_game_date: string | null
  is_new_day: boolean
  game_complete: boolean
  found_count: number
}