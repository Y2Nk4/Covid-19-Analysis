// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router/router'
import VueRouter from 'vue-router'

/* Element UI */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

/* Vue-Echarts */
import ECharts from 'vue-echarts'
import 'echarts-gl'

Vue.prototype.$http = axios // 类似于vue-resource的调用方法

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.component('v-chart', ECharts)

/* eslint-disable no-new */
new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app')
