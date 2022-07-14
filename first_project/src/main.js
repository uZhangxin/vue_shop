import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import {request} from "./network";


import 'element-ui/lib/theme-chalk/index.css';
import './assets/font/iconfont.css'
import './assets/css/global.css'

//使用element-ui
Vue.use(ElementUI)

Vue.prototype.$http = request

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
