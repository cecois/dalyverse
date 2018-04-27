import Vue from 'vue'
import Router from 'vue-router'
import DALYVERSE from '@/components/DalyVerse'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dalyverse',
      name: 'DALYVERSE',
      component: DALYVERSE
    }
  ]
})
