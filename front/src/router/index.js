import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue') },
  { path: '/main', name: 'MainBoard', component: () => import('@/views/MainBoard.vue'), redirect: '/home', children: [
      { path: '/home', name: 'Home', component: () => import('@/pages/Home.vue') },
  ]},
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
