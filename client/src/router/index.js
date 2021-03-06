import Vue from 'vue'
import Router from 'vue-router'
import MyDrive from '@/components/drive/drive.vue'
import ShareWithMe from '@/components/drive/shareWithMe.vue'
import Login from '@/components/auth/login.vue'
import Signup from '@/components/auth/signup.vue'
import Start from '@/components/drive/start.vue'
import Profile from '@/components/user/profile.vue'
import ShowFile from '@/components/drive/fileShow.vue'

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
      path: '/shared/:id',
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
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/my-drive/:id/showFile',
      name: 'ShowFile',
      component: ShowFile
    },
  ]
})
