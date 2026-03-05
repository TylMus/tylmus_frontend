<template>
  <section class="relative bg-gray-50 rounded-b-xl py-16 px-5 overflow-hidden">
    <!-- corners (keep as before, but adjust positioning later) -->
    <!-- Top-left corner -->
    <div class="absolute -top-8 left-0 w-32 h-32 md:-top-16 md:w-48 md:h-48 pointer-events-none z-10">
      <img src="/img/corner-top-left.svg" alt="" class="w-full h-full object-contain opacity-80" />
    </div>

    <!-- Top-right corner -->
    <div class="absolute -top-8 right-0 w-32 h-32 md:-top-16 md:w-48 md:h-48 pointer-events-none z-10">
      <img src="/img/corner-top-right.svg" alt="" class="w-full h-full object-contain opacity-80" />
    </div>

    <!-- Bottom-left corner -->
    <div class="absolute -bottom-8 left-0 w-32 h-32 md:-bottom-16 md:w-48 md:h-48 pointer-events-none z-10">
      <img src="/img/corner-bottom-left.svg" alt="" class="w-full h-full object-contain opacity-80" />
    </div>

    <!-- Bottom-right corner -->
    <div class="absolute -bottom-8 right-0 w-32 h-32 md:-bottom-16 md:w-48 md:h-48 pointer-events-none z-10">
      <img src="/img/corner-bottom-right.svg" alt="" class="w-full h-full object-contain opacity-80" />
    </div>
    <div class="container mx-auto text-center relative z-20">
      <h3 class="text-2xl font-bold text-black mb-6">Как играть в ТылМус</h3>
      <ul class="space-y-10">
        <li v-for="(step, idx) in steps" :key="idx" class="flex flex-col items-center">
          <h4 class="text-xl font-semibold text-black mb-2">{{ step.title }}</h4>
          <p class="text-gray-700 max-w-2xl mx-auto mb-5">{{ step.text }}</p>
          <img :src="step.img" alt="" class="rounded-lg shadow-lg max-w-xs w-full" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Прочти слова',
    text: 'Первый шаг — внимательно прочитать и понять слова, представленные в игре "ТылМус". Не спешите, постарайтесь понять каждое слово и подумать, что оно означает в контексте головоломки.',
    img: '/img/step1.png'
  },
  {
    title: 'Найди общее',
    text: 'После того как вы прочитаете и поймёте слова, следующий шаг — найти общую тему, которая их связывает.',
    img: '/img/step2.png'
  },
  {
    title: 'Выбери и отправь свой ответ',
    text: 'Когда вы определите общую тему и найдёте четыре слова, подходящие под неё, пора сделать свой выбор.',
    img: '/img/step3.png'
  }
]
</script>