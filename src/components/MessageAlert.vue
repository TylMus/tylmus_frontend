<template>
  <div 
    v-if="show" 
    class="message" 
    :class="type"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  text: string
  type: 'success' | 'error' | 'info'
}

defineProps<Props>()
</script>

<style scoped>
.message {
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  margin-top: 20px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>