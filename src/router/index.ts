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
      path: '/docs/new',
      name: 'new-document',
      component: () => import('../views/docs/NewDocumentView.vue'),
    },
    {
      path: '/docs/:id',
      name: 'document',
      component: () => import('../views/docs/DocumentView.vue'),
      props: true
    },
    {
      path: '/tracker',
      name: 'tracker',
      component: () => import('../views/tracker/TrackerView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
  ],
})

export default router
