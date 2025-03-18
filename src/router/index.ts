import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('../views/docs/DocsView.vue'),
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: () => import('../views/tracker/TrackerView.vue'),
    },
  ],
})

export default router
