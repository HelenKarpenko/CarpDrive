import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import MyDrive from '@/components/drive/drive.vue'
import Login from '@/components/auth/Login.vue'
import Signup from '@/components/auth/signup.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/my-drive/:id',
      name: 'MyDrive',
      component: MyDrive
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
