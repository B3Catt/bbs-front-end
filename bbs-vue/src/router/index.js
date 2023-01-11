import Vue from 'vue'
import VueRouter from 'vue-router'
import Controller from '../pages/Controller.vue'
import Home from '../components/Home.vue'
import Boards from '../components/board/Boards.vue'
import UserInfo from '../components/user/UserInfo.vue'
import MyColumns from '../components/user/MyColumns.vue'
import MyCollections from '../components/user/MyCollections'
import Columns from '../components/column/Columns.vue'
import AddColumn from '../components/column/AddColumn.vue'
import { getToken } from '@/utils/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', component: Controller, redirect: 'home', children: [
      {
        path: 'home',
        meta: {
          breadcrumbShow: false
        },
        component: Home
      },
      {
        path: 'boards',
        meta: {
          breadcrumbShow: true,
          breadcrumbItems: ['板块', '板块列表']
        },
        component: Boards
      },
      {
        path: 'userInfo',
        meta: {
          breadcrumbShow: true,
          breadcrumbItems: ['个人中心', '个人信息']
        },
        component: UserInfo
      },
      {
        path: 'myColumns',
        meta: {
          breadcrumbShow: true,
          breadcrumbItems: ['个人中心', '我的专栏']
        },
        component: MyColumns
      },
      {
        path: 'myCollections',
        meta: {
          breadcrumbShow: true,
          breadcrumbItems: ['个人中心', '我的收藏']
        },
        component: MyCollections
      },
      {
        path: 'columns',
        meta: {
          breadcrumbShow: true,
          breadcrumbItems: ['板块', '专栏']
        },
        component: Columns
      },
      {
        path: 'addColumns',
        meta: {
          breadcrumbShow: true,
          breadcrumbItems: ['板块', '专栏', '新建专栏']
        },
        component: AddColumn
      }
    ]
  }
]

const router = new VueRouter({
  routes: routes,
})

// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 将要访问的路径
//   // from 代表从哪个路径跳转而来
//   // next 是一个函数，表示放行
//   //    next() 代表放行
//   //    next('/login') 强制跳转
//   const tokenStr = getToken();
//   if (to.path === '/**') {
//     if (tokenStr) return next();
//     return next('/home');
//   }
//   if (!tokenStr) return next('/home');
//   next();
// })

export default router
