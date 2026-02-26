<template>
  <div class="text-center text-gray-800 py-2 border-t border-b border-gray-200">
    Следующая игра через: {{ countdown }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const emit = defineEmits<{ (e: 'expired'): void }>()
const currentTime = ref(Date.now())
let interval: NodeJS.Timeout | null = null

const getNextMidnightGMT9 = (): Date => {
  const now = new Date()
  const next = new Date(now)
  const utcHours = now.getUTCHours()
  if (utcHours < 15 || (utcHours === 15 && now.getUTCMinutes() === 0 && now.getUTCSeconds() === 0)) {
    next.setUTCHours(15, 0, 0, 0)
  } else {
    next.setUTCDate(next.getUTCDate() + 1)
    next.setUTCHours(15, 0, 0, 0)
  }
  return next
}

const formatTime = (end: Date): string => {
  const diff = end.getTime() - currentTime.value
  if (diff <= 0) {
    emit('expired')
    return '00:00:00'
  }
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1000)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const countdown = computed(() => formatTime(getNextMidnightGMT9()))

onMounted(() => {
  interval = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>