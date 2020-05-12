import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Toasted from 'vue-toasted'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './assets/scss/app.scss'
import 'bootstrap/dist/css/bootstrap.min.css'


Vue.use(Toasted, { duration: 4000 })
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = true
Vue.config.disableHostCheck = true

window._Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
