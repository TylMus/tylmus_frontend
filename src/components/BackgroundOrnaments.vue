<template>
  <div class="absolute inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
    <!-- Top ornament: lower on mobile (20% from top), higher on desktop (3%) -->
    <img 
      src="/img/background-ornament.svg" 
      alt="" 
      class="absolute top-[4%] md:top-[3%] left-0 w-full scale-150 md:scale-100 opacity-100"
    />
    <!-- Bottom ornament: flipped, positioned at bottom on mobile, at 26% on desktop -->
    <img 
      src="/img/background-ornament.svg" 
      alt="" 
      class="absolute bottom-[2%] md:top-[26%] left-0 w-full scale-150 md:scale-100"
      :style="{ transform: 'rotate(180deg)' }"
    />
  </div>
</template>