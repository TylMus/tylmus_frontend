<template>
  <div v-if="show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl p-6 max-w-md w-11/12 relative shadow-xl" @click.stop>
      <button @click="$emit('close')" class="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
        <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <h2 class="text-2xl font-bold text-center mb-4">🏆 Таблица лидеров</h2>
      <p class="text-center text-gray-500 text-sm mb-4">{{ gameDate }}</p>

      <!-- Submission form (only if game complete and not yet submitted) -->
      <div v-if="canSubmit" class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p class="text-green-700 font-medium mb-2">Поздравляем! Вы прошли игру</p>
        <p class="text-sm text-gray-600 mb-3">Введите никнейм (2–12 символов):</p>
        <div class="flex gap-2">
          <input
            v-model="nickname"
            type="text"
            maxlength="12"
            placeholder="Ваш ник"
            class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            :disabled="submitting"
          />
          <button
            @click="submitScore"
            :disabled="!isNicknameValid || submitting"
            class="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? '...' : 'Отправить' }}
          </button>
        </div>
        <p v-if="submitError" class="text-red-500 text-xs mt-2">{{ submitError }}</p>
      </div>

      <!-- Leaderboard list -->
      <div class="max-h-80 overflow-y-auto">
        <!-- Show empty state if entries is undefined or empty -->
        <div v-if="!entries || entries.length === 0" class="text-center py-8 text-gray-400">
          Пока нет записей. Будьте первым!
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(entry, idx) in entries"
            :key="idx"
            class="flex items-center justify-between p-3 rounded-lg"
            :class="{'bg-yellow-100': userEntry && entry.nickname === userEntry.nickname}"
          >
            <div class="flex items-center gap-3">
              <span class="font-bold w-6">{{ idx + 1 }}</span>
              <span class="font-medium">{{ entry.nickname }}</span>
            </div>
            <span class="text-sm text-gray-600">Ошибок: {{ entry.mistakes }}</span>
          </div>
        </div>
      </div>

      <!-- Show user's own entry if exists (with safe check) -->
      <p v-if="userEntry && userEntry.nickname" class="text-xs text-center text-gray-400 mt-4">
        Вы уже в таблице: {{ userEntry.nickname }} ({{ userEntry.mistakes }} ошибок)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import axios from 'axios'

const props = defineProps<{
  show: boolean
  gameDate: string
  gameComplete: boolean
  userEntry?: any | null
  entries?: any[]  // make optional with default in store
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submitted'): void
}>()

const nickname = ref('')
const submitting = ref(false)
const submitError = ref('')

const isNicknameValid = computed(() => {
  const trimmed = nickname.value.trim()
  return trimmed.length >= 2 && trimmed.length <= 12
})

const canSubmit = computed(() => {
  return props.gameComplete && !props.userEntry
})

const submitScore = async () => {
  if (!isNicknameValid.value) return
  submitError.value = ''
  submitting.value = true

  try {
    const trimmed = nickname.value.trim()
    await axios.post('/api/leaderboard/submit', null, {
      params: { nickname: trimmed }
    })
    // Success
    emit('submitted')
    nickname.value = ''
  } catch (err: any) {
    submitError.value = err.response?.data?.error || 'Ошибка отправки'
  } finally {
    submitting.value = false
  }
}

// Reset input when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    nickname.value = ''
    submitError.value = ''
  }
})
</script>