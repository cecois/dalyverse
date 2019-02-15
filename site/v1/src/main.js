// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// bulma stuff via buefy
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import 'nouislider/distribute/nouislider.min.css'
import moment from 'moment'
import nouislider from 'nouislider'
import VTooltip from 'v-tooltip'
import App from './App'
import router from './router'
import underscore from 'vue-underscore'
import vueHeadful from 'vue-headful'

Vue.component('vue-headful', vueHeadful)

Vue.use(underscore)
Vue.use(VTooltip)
Vue.config.productionTip = false

Vue.use(Buefy)

Object.defineProperty(Vue.prototype, '$MOMENT', { value: moment })
Object.defineProperty(Vue.prototype, '$NOUISLIDER', { value: nouislider })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
