import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/home.vue';
import Serach from '../pages/serach.vue';
import Home1 from '../pages/home1.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home,
      children: [{
        path: '/home1',
        name: 'Home1',
        component: Home1,
      }]
    },
    {
      path: '/serach',
      name: 'Serach',
      component: Serach
    }
  ]
})
