import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import JEAKODRCBB from '@/components/Jeakodrcbb'
import JEAKODRGARBAGE from '@/components/Jeakodrgarbage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/garbage',
      name: 'JEAKODRGARBAGE',
      component: JEAKODRGARBAGE
    }
    ,{
      path: '/cbb',
      name: 'JEAKODRCBB',
      component: JEAKODRCBB
    }
    ,{
      path: '/HW',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
