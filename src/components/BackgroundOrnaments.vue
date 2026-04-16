<template>
  <!--
    Outer band extends below the first viewport so tall ornaments are not clipped
    right under the game buttons; inner 100dvh keeps top-1/2 aligned to the screen
    center (not the middle of a very tall box).
  -->
  <div
    class="absolute left-0 right-0 top-0 h-[calc(100dvh+min(32vh,300px))] -z-10 w-full pointer-events-none overflow-hidden"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[100dvh]">
      <img
        src="/img/background-ornament.svg"
        alt=""
        class="absolute top-1/2 left-[5%] h-[min(220vh,3000px)] max-sm:h-[min(320vh,4800px)] w-auto max-w-[100vw] sm:max-w-[65vw] -translate-x-1/2 -translate-y-1/2 rotate-90 object-contain opacity-100 select-none origin-center max-sm:scale-[2] sm:scale-100"
      />
      <img
        src="/img/background-ornament.svg"
        alt=""
        class="absolute top-1/2 right-[5%] h-[min(220vh,3000px)] max-sm:h-[min(320vh,4800px)] w-auto max-w-[100vw] sm:max-w-[65vw] translate-x-1/2 -translate-y-1/2 -rotate-90 object-contain opacity-100 select-none origin-center max-sm:scale-[2] sm:scale-100"
      />
    </div>
  </div>
</template>
