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
import UserInfoPage from '../components/user/UserInfoPage.vue'
import ColumnDetail from '../components/column/ColumnDetail.vue'
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
          constBreadcrumbItems: ['板块', '板块列表'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
          ]
        },
        component: Boards
      },
      {
        path: 'userInfo',
        meta: {
          breadcrumbShow: true,
          constBreadcrumbItems: ['个人中心', '个人信息'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
          ]
        },
        component: UserInfo
      },
      {
        path: 'getUserInfo',
        meta: {
          breadcrumbShow: true,
          constBreadcrumbItems: ['查询个人信息'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
            {
              name: '板块',
              path: '/boards'
            },
            
            {
              name: '专栏',
              path: '/columns'
            }
          ]
        },
        component: UserInfoPage
      },
      {
        path: 'myColumns',
        meta: {
          breadcrumbShow: true,
          constBreadcrumbItems: ['个人中心', '我的专栏'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
          ]
        },
        component: MyColumns
      },
      {
        path: 'myCollections',
        meta: {
          breadcrumbShow: true,
          constBreadcrumbItems: ['个人中心', '我的收藏'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
          ]
        },
        component: MyCollections
      },
      {
        path: 'columns',
        meta: {
          breadcrumbShow: true,
          constBreadcrumbItems: ['专栏'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
            {
              name: '板块',
              path: '/boards'
            }
          ]
        },
        component: Columns
      },
      {
        path: 'addColumns',
        meta: {
          breadcrumbShow: true,
          constBreadcrumbItems: ['专栏', '新建专栏'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
            {
              name: '板块',
              path: '/boards'
            },
          ]
        },
        component: AddColumn
      },
      {
        path: 'columnDetail',
        meta: {
          breadcrumbShow: true,
          constBreadcrumbItems: ['专栏', '专栏详情'],
          toBreadcrumbItems: [
            {
              name: '首页',
              path: '/home'
            },
            {
              name: '板块',
              path: '/boards'
            },
          ]
        },
        component: ColumnDetail
      },
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
