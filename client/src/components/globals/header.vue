<template>
  <v-toolbar color="amber" app fixed clipped-left dense>
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <span class="title">Carpdrive&nbsp;</span>
    <v-spacer></v-spacer>
    <v-btn icon @click.prevent="$refs.ctx.open($event,item)">
      <v-icon>face</v-icon>
    </v-btn>
    <context-menu ref="ctx" @ctx-open="onCtxOpen">
      <ui-menu class="text-xs-left"
               contain-focus
               has-icons
               has-secondary-text
               :options="menuOptions"
               @select="menuCall($event)"/>
    </context-menu>

  </v-toolbar>
</template>

<script>
  import foldersAPI from '@/services/folders';
  import authAPI from '@/services/auth';

  export default {
    components:{
    },
    data: () => ({
      drawer: null,
      items: [
        { icon: 'lightbulb_outline', text: 'Notes' },
        { icon: 'touch_app', text: 'Reminders' },
        { divider: true },
        { heading: 'Labels' },
        { icon: 'add', text: 'Create new label' },
        { divider: true },
        { icon: 'archive', text: 'Archive' },
        { icon: 'delete', text: 'Trash' },
        { divider: true },
        { icon: 'settings', text: 'Settings' },
        { icon: 'chat_bubble', text: 'Trash' },
        { icon: 'help', text: 'Help' },
        { icon: 'phonelink', text: 'App downloads' },
        { icon: 'keyboard', text: 'Keyboard shortcuts' }
      ],

      menuOptions: [
        {
          id: 'profile',
          label: 'Profile',
          icon: 'perm_identity',
        },
        {
          type: 'divider'
        },
        {
          id: 'signOut',
          label: 'Sign Out',
          icon: 'exit_to_app',
        }
      ],
      Menu:{
        data:{}
      },
    }),
    props: {
      source: String
    },
    methods:{
      onCtxOpen(data){
        this.Menu.data = data;
      },
      async menuCall(e){
        if(e.id == 'profile'){
          this.$router.push({name:'Profile'})
        }
        if(e.id == 'signOut'){
          try {
            await authAPI.logout({
              username: this.$store.state.username,
              password:  this.$store.state.password,
            });
          }catch (e){

          }
          this.$store.dispatch('setUser', null);
          this.$store.dispatch('setAccessToken', null);
          this.$store.dispatch('setRefreshToken', null);

          this.$router.push({name:'Login'})
        }
      },
    }
  }

</script>
