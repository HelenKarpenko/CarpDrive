<template>
  <div id="app">
    <v-app>
      <my-header/>
      <v-content>
      <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  import myHeader from '@/components/globals/header.vue';
  export default {
    name: 'app',
    data(){
      return{
        msg:'lena',
      }
    },
    components:{
      myHeader,
    },
  }
</script>

<style>
</style>
