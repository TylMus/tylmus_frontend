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

export interface GameResponse {
  words: string[]
  categories: Category[]
  game_date: string
  found_categories: Category[]
  remaining: number
  mistakes?: number
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
  mistakes?: number
}

export interface DailyInfo {
  today: string
  current_game_date: string | null
  is_new_day: boolean
  game_complete: boolean
  found_count: number
  mistakes?: number
}