<template>
  <div class="flex justify-center">
    <div class="flex flex-col gap-2 max-h-52 overflow-y-auto p-4 bg-white rounded-lg border border-gray-100">
      <div v-for="(attempt, idx) in attempts" :key="idx" class="flex justify-center">
        <div class="flex gap-1.5">
          <div
            v-for="(color, cidx) in getFourColors(attempt)"
            :key="cidx"
            class="w-6 h-6 rounded"
            :class="colorClass(color)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ attempts: any[] }>()

const colorClass = (color: string) => {
  const map: Record<string, string> = {
    yellow: 'bg-category-yellow',
    green: 'bg-category-green',
    blue: 'bg-category-blue',
    purple: 'bg-category-purple',
    gray: 'bg-gray-300'
  }
  return map[color] || 'bg-gray-300'
}

const getFourColors = (attempt: any): string[] => {
  const colors = attempt.colors || []
  if (colors.length === 4) return colors
  if (attempt.type === 'success' && colors.length > 0) {
    return Array(4).fill(colors[0])
  }
  const result = [...colors]
  while (result.length < 4) result.push('gray')
  return result
}
</script>