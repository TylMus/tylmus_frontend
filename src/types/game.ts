export interface Category {
  name: string
  words: string[]
  color?: string // ADDED: color property
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
  game_complete?: boolean // ADDED
  word_colors?: Record<string, string> // ADDED: word to color mapping
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
  category_color?: string // ADDED: color of found category
  selected_colors?: string[] // ADDED: colors of selected words for mistakes
}

export interface DailyInfo {
  today: string
  current_game_date: string | null
  is_new_day: boolean
  game_complete: boolean
  found_count: number
  mistakes?: number
}