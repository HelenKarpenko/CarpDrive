<template>
  <v-container grid-list-md text-xs-center>
    <v-card v-if="!$store.getters.isLogged()" flat>
      <v-card-title>
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                v-model="credentials.username"
                label="Username"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                v-model="credentials.password"
                label="Password"
                type="password"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-card-actions>
            <v-btn @click.stop="login()" block>Login</v-btn>
          </v-card-actions>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card color="grey lighten-4" v-else flat>
      <v-card-text>
        logined
      </v-card-text>
      <v-card-actions>
        <v-btn @click.stop="logout()" block>logout</v-btn>
      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
  import authAPI from '@/services/auth';

  export default {
    components: {},
    data(){
      return{
        credentials:{
          username: null,
          password: null,
        },
        items: [],
      }
    },
    methods:{
      login:async function(){
        try{
          const result = await authAPI.login(this.credentials);
          console.log(result.data);
          if(result.data.success) {
            this.$store.dispatch('setUser', result.data.user);
            this.$store.dispatch('setAccessToken', result.data.tokens.access);
            this.$store.dispatch('setRefreshToken', result.data.tokens.refresh);
            this.$router.push({name:'Drive', params: {id: this.$store.state.user.myDrive}})
          }
        }catch(e){console.log(e);}
      },
      logout:async function(){
        try {
          await authAPI.logout(this.credentials);
        }catch (e){

        }
        this.$store.dispatch('setUser', null);
        this.$store.dispatch('setAccessToken', null);
        this.$store.dispatch('setRefreshToken', null);
      }
    },
  }

</script>
