// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// bulma stuff via buefy
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import moment from 'moment'
import VTooltip from 'v-tooltip'


import App from './App'
import router from './router'
import underscore from 'vue-underscore'

Vue.use(underscore)
Vue.use(VTooltip)

// Object.defineProperty(Vue.prototype, '$moment', { value: moment })

Vue.config.productionTip = false

Vue.use(Buefy)

Object.defineProperty(Vue.prototype, '$MOMENT', { value: moment })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
