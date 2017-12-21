<template>
  <div >
    <!--id="app"-->

    <!--<v-layout fill-height>-->
      <!--<v-flex xs6 right>-->
        <!--<sign-up/>-->
    <!--&lt;!&ndash;<login/>&ndash;&gt;-->
      <!--</v-flex>-->
    <!--</v-layout>-->

    <v-layout row>
      <v-flex xs8>
        <v-card id="app" height="100%">
          <v-card-title>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex >
        <v-card height="100%">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="!login" flat @click="change()"><h2>Login</h2></v-btn>
            <v-btn v-else flat @click="change()"><h2>Sign up</h2></v-btn>
          </v-card-actions>
          <v-card-media>
            <v-container fill-height>
              <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                  <login v-if="login"/>
                  <sign-up v-else @signup="change()"/>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </v-flex>
    </v-layout>

  </div>

</template>

<script>
  import Login from '@/components/auth/login';
  import SignUp from '@/components/auth/signup';

  export default{
    components:{
      Login,
      SignUp
    },
    data(){
      return{
        login:false,
      }
    },
    methods: {
      change(){
        this.login = !this.login;
      }
    }
  }
</script>

<style scoped>
  #app {
    background-image: url('/static/image/startBG.jpg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 100vw;
    min-height: 100vh;
    background-size: cover;
    display: flex;
    flex-direction: column;
  }
</style>
