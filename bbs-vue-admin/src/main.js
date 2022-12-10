import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'

import axios from 'axios'

import { getToken } from '@/utils/auth'
axios.defaults.baseURL = 'http://127.0.0.1:8989/'
axios.interceptors.request.use(config => {
  config.headers.token = getToken()
  // 在最后必须 return config
  return config
})
// 配置请求的根路径
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
