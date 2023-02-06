import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Columns from '../components/column/Columns.vue'
import AllColumns from '../components/column/AllColumns.vue'
import Floors from '../components/floor/Floors.vue'
import Boards from '../components/board/Boards.vue'
import { getToken } from '@/utils/auth'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/welcome', children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users},
      { path: '/columns', component: Columns },
      { path: '/allColumns', component: AllColumns},
      { path: '/floors', component: Floors },
      { path: '/boards', component: Boards }
    ]
  }
]

const router = new VueRouter({
  routes: routes,
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //    next() 代表放行
  //    next('/login') 强制跳转
  const tokenStr = getToken();
  if (to.path === '/login') {
    if (tokenStr) return next('/home');
    return next();
  }
  if (!tokenStr) return next('/login');
  next();
})


export default router
