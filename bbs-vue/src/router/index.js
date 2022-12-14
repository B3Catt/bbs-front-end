import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import Welcome from '../components/Welcome.vue'
import Boards from '../components/board/Boards.vue'
import UserInfo from '../components/user/UserInfo.vue'
import MyColumns from '../components/user/MyColumns.vue'
import MyCollections from '../components/user/MyCollections'
import { getToken } from '@/utils/auth'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home', component: Home, redirect: '/welcome', children: [
      { path: '/welcome', component: Welcome },
      { path: '/boards', component: Boards },
      { path: '/userInfo', component: UserInfo },
      { path: '/myColumns', component: MyColumns },
      { path: '/myCollections', component: MyCollections }
    ]
  }
]

const router = new VueRouter({
  routes: routes,
})

export default router
