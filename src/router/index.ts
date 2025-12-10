import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'game',
      component: () => import('../views/GameView.vue')
    }
  ]
})

export default router