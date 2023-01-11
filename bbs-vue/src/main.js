import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
// markdown 语法
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import request from '@/utils/request'

// 配置请求的根路径
Vue.prototype.$http = request;

Vue.config.productionTip = false

Vue.use(mavonEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
