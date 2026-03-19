<template>
  <div class="absolute inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
    <!-- Top ornament -->
    <img 
      src="/img/background-ornament.svg" 
      alt="" 
      class="absolute top-0 left-0 w-full scale-105 md:scale-100 opacity-100"
    />
    <!-- Bottom ornament -->
    <img 
      src="/img/background-ornament.svg" 
      alt="" 
      class="absolute bottom-0 left-0 w-full scale-105 md:scale-100"
      :style="{ transform: 'rotate(180deg)' }"
    />
  </div>
</template>