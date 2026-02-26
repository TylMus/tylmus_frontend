<template>
  <section class="relative bg-gray-50 rounded-b-xl py-10 px-5 overflow-hidden">
    <!-- Corner decorations -->
    <div class="absolute top-[-100px] left-0 w-1/4 h-1/4 pointer-events-none z-10">
      <img src="/public/img/corner-top-left.svg" alt="" class="w-full h-full object-contain opacity-80" />
    </div>
    <div class="absolute top-[-100px] right-0 w-1/4 h-1/4 pointer-events-none z-10">
      <img src="/public/img/corner-top-right.svg" alt="" class="w-full h-full object-contain opacity-80" />
    </div>
    <div class="absolute bottom-[-100px] left-0 w-1/4 h-1/4 pointer-events-none z-10">
      <img src="/public/img/corner-bottom-left.svg" alt="" class="w-full h-full object-contain opacity-80" />
    </div>
    <div class="absolute bottom-[-100px] right-0 w-1/4 h-1/4 pointer-events-none z-10">
      <img src="/public/img/corner-bottom-right.svg" alt="" class="w-full h-full object-contain opacity-80" />
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
    img: '/public/img/step1.png'
  },
  {
    title: 'Найди общее',
    text: 'После того как вы прочитаете и поймёте слова, следующий шаг — найти общую тему, которая их связывает.',
    img: '/public/img/step2.png'
  },
  {
    title: 'Выбери и отправь свой ответ',
    text: 'Когда вы определите общую тему и найдёте четыре слова, подходящие под неё, пора сделать свой выбор.',
    img: '/public/img/step3.png'
  }
]
</script>