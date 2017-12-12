<template>
  <div id="app">
    <v-app>
      <my-header @toggleSidebar="toggleSidebar()"/>
      <my-sidebar :toggle="UI.sidebar.toggle"/>
      <v-content>
      <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import myHeader from '@/components/globals/header.vue';
  import mySidebar from '@/components/globals/sidebar.vue';
  export default {
    name: 'app',
    data(){
      return{
        msg:'lena',
        UI:{
          sidebar: {
            toggle: true,
          }
        }
      }
    },
    components:{
      myHeader,
      mySidebar
    },
    methods:{
      toggleSidebar(){
        this.UI.sidebar.toggle = !this.UI.sidebar.toggle;
      }
    }
  }
</script>

<style>
</style>
