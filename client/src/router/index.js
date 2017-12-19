import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import MyDrive from '@/components/drive/drive.vue'
import ShareWithMe from '@/components/drive/shareWithMe.vue'
import Login from '@/components/auth/Login.vue'
import Signup from '@/components/auth/signup.vue'
import Start from '@/components/drive/start.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
    },
    {
      path: '/my-drive/',
      name: 'MyDrive',
      component: MyDrive
    },
    {
      path: '/my-drive/:id',
      name: 'Drive',
      component: MyDrive
    },
    {
      path: '/share/:id',
      name: 'ShareWithMe',
      component: ShareWithMe
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
  ]
})
