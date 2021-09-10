import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import protectedRoute from '../middlewares/protected'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/pagetwo',
    name: 'PageTwo',
    component: () => import('@/views/pageTwo.vue'),
    beforeEnter: protectedRoute,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
