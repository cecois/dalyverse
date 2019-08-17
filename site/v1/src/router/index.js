import Vue from 'vue'
import Router from 'vue-router'
import DEFAULT from '@/components/Default'
import EVENTS from '@/components/events'
import ENTITIES from '@/components/entities'
import MURDERERS from '@/components/murderers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Default',
      component: DEFAULT
    },
    {
      path: '/events/:tstart?/:tend?/:activeid?',
      name: 'Events',
      component: EVENTS
    },
    {
      path: '/entities/:activeid?',
      name: 'entities',
      component: ENTITIES
    },
    {
      path: '/murderers/:murderer?',
      name: 'murderers',
      component: MURDERERS
    }
  ]
})
