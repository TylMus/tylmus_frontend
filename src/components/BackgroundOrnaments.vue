<template>
  <div class="absolute inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
    <!-- Top ornament: slightly away from very top on mobile -->
    <img 
      src="/img/background-ornament.svg" 
      alt="" 
      class="absolute top-[6%] md:top-[3%] left-0 w-full scale-125 md:scale-100 opacity-100"
    />
    <!-- Bottom ornament: flipped, shifted slightly up to avoid overflowing bottom edge -->
    <img 
      src="/img/background-ornament.svg" 
      alt="" 
      class="absolute top-[22%] md:top-[26%] left-0 w-full scale-125 md:scale-100"
      :style="{ transform: 'rotate(180deg)' }"
    />
  </div>
</template>