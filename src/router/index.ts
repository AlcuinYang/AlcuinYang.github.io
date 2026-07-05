import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
  { path: '/feed', name: 'feed', component: () => import('@/pages/Feed.vue') },
  { path: '/notes', name: 'notes', component: () => import('@/pages/Notes.vue') },
  {
    path: '/notes/:slug',
    name: 'note',
    component: () => import('@/pages/NoteDetail.vue'),
    props: true,
  },
  { path: '/roadmap', name: 'roadmap', component: () => import('@/pages/Roadmap.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
