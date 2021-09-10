import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import protectedRoute from '../middlewares/protected'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/user',
    redirect: '/login',
    component: () => import('@/views/layouts/user/BeforeLogin.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        // component: () => import('@/views/pages/user/Login.vue')
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/pages/pages/user/Register.vue')
      },
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/pageTwo.vue'),
    beforeEnter: protectedRoute,
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
