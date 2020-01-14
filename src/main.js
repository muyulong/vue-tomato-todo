import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store/index'

import 'normalize.css'
import 'font-awesome/css/font-awesome.css'
import '@/styles/index.less'

import MyPlugins from './components/plugins'

import VueI18n from 'vue-i18n'

import ECharts from 'vue-echarts'
import 'echarts'
import roma from './roma'

import './components/plugins/calendar/style.less'
import Calendar from './components/plugins/calendar'

ECharts.registerTheme('roma', roma.theme)


// 自动化全局注册common目录下的组件
const requireComponent = require.context('./components/common', true, /\.vue$/)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 剥路径`/xx`和文件类型`.xx`
  const componentName = fileName.split('/').pop().replace(/\.\w+$/, '')
  // 全局注册组件
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  messages: {
    'zh': require('./assets/lang/zh')
  }
})

Vue.use(MyPlugins)
Vue.component('v-chart', ECharts)
Vue.use(Calendar, {
  locale: 'zh',
  color: '#f29543'
})

Vue.mixin({
  beforeRouteLeave (to, from, next) {
    if (from.meta.parent && to.meta.child || from.meta.child && to.meta.parent) {
      this.$root.keepAlive = ['Todo']
    } else {
      this.$root.keepAlive = ['None']
    }
    setTimeout(() => {
      next()
    })
  }
})

Vue.prototype.$http = axios

Vue.config.productionTip = false


new Vue({
  router,
  store,
  i18n,
  data: {
    keepAlive: []
  },
  render: h => h(App)
}).$mount('#app')