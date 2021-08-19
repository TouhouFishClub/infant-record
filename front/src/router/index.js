import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/user', redirect: '/login', component: () => import('@/views/UserForm.vue'), children: [
    { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('@/pages/Register.vue') },
  ]},
  { path: '/main', name: 'MainBoard', component: () => import('@/views/MainBoard.vue'), redirect: '/home', children: [
      { path: '/home', name: 'Home', component: () => import('@/pages/Home.vue') },
      { path: '/chart', name: 'Home', component: () => import('@/pages/Chart.vue') },
      { path: '/setting', name: 'Home', component: () => import('@/pages/Setting.vue') },
  ]},
  { path: '/test', component: () => import('@/pages/test.vue') },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
