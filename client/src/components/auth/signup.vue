<template>
  <v-container grid-list-md text-xs-center>
    <v-card v-if="!$store.getters.isLogged()" flat>
      <v-card-title>
        <h1>Sign Up</h1>
      </v-card-title>
      <v-card-text>
        <v-container fluid>

          <v-layout row>
            <v-flex xs12>
              <v-text-field
                v-model="registration.name"
                label="Name"
                :rules="[rules.required, rules.name]"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-text-field
                v-model="registration.username"
                label="Username"
                :rules="[rules.required, rules.username]"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-text-field
                v-model="registration.password"
                label="Password"
                type="password"
                :rules="[rules.required, rules.password]"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-card-actions>
            <v-btn @click.stop="signup()" block>Sign Up</v-btn>
          </v-card-actions>

          <v-snackbar
            :timeout="timeout"
            :top="true"
            :right="true"
            v-model="error"
          >
            {{ text }}
            <v-btn flat icon color="red" @click.native="error = false"><v-icon>close</v-icon></v-btn>
          </v-snackbar>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card color="grey lighten-4" v-else flat>
      <v-card-text>
        logined
      </v-card-text>
      <v-card-actions>
        <v-btn @click.stop="logout()">logout</v-btn>
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
        error: false,
        timeout: 5000,
        text: 'Hello, I\'m a snackbar',
        registration:{
          name: null,
          username: null,
          password: null,
          email: null,
        },
        rules: {
          required: (value) => !!value || 'Required.',
          name: (value) => {
            const pattern = /[A-Z][A-Za-z' -]*/;
            return pattern.test(value) || 'Invalid Name.'
          },
          username: (value) => {
            const pattern = /^[a-z\d\.]{5,}$/;
            return pattern.test(value) || 'Invalid Name.'
          },
          password: (value) => {
            const pattern = /^[A-Za-z0-9' ]{8,}$/;
            return pattern.test(value) || 'Invalid Name.'
          },
          email: (value) => {
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      }
    },
    methods:{
      signup: async function(){
        let result;
        try{
          result = await authAPI.signup(this.registration);
          console.log(result.data);
          if(result.data.success) {
            this.$emit('signup',this.create);
//            this.$router.push({name: 'Login'})
          }
        }catch(e){
          this.error = true;
          this.text = e.response.data.message || e.message;
//          this.focus = true
//          this.$refs.username.focus();
          console.log("ENTER")
          console.log(e);
        }
      },
    },
  }

</script>
