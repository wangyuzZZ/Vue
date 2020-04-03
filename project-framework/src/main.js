// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//将router store 注入vue实例
import router from './router'
import store from './store'
//引入工具类
import util from '../src/assets/util'
Vue.prototype.Util = util
//引入bootstrap
import 'bootstrap'
import JQ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
//引入elment-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  JQ,
  components: {
    App
  },
  template: '<App/>'
})
