<template>
  <div class="notification-popup" :class="type">
    <div class="notification-content">
      <p>{{ text }}</p>
      <button class="notification-close" @click="$emit('close')">×</button>
    </div>
    
    <div v-if="text.includes('Следующая игра будет доступна через:')" class="countdown-timer">
      <span class="countdown-label">Таймер:</span>
      <span class="countdown-value">{{ extractCountdownTime(text) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'success' | 'error' | 'info'
  text: string
}

defineProps<Props>()
defineEmits(['close'])

const extractCountdownTime = (text: string): string => {
  const match = text.match(/(\d{2}:\d{2}:\d{2})/)
  return match ? match[1] : '00:00:00'
}
</script>

<style scoped>
.notification-popup {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideDown 0.3s ease;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  border: 2px solid transparent;
}

.notification-popup.success {
  border-color: #28a745;
  background: #f8fff9;
}

.notification-popup.error {
  border-color: #dc3545;
  background: #fff8f8;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.notification-content p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.notification-close:hover {
  background: #f5f5f5;
}

/* Countdown timer styles */
.countdown-timer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

.countdown-label {
  font-weight: 600;
  color: #333;
}

.countdown-value {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #dc3545;
  background: #fff0f0;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #ffcccc;
}

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .notification-popup {
    max-width: 350px;
    padding: 10px 16px;
  }
  
  .notification-content p {
    font-size: 13px;
  }
  
  .countdown-timer {
    font-size: 13px;
    gap: 6px;
  }
  
  .countdown-value {
    padding: 2px 6px;
  }
}

@media (max-width: 480px) {
  .notification-popup {
    max-width: 300px;
    top: 10px;
  }
  
  .notification-content p {
    font-size: 12px;
  }
  
  .countdown-timer {
    font-size: 12px;
    flex-direction: column;
    gap: 4px;
  }
}
</style>