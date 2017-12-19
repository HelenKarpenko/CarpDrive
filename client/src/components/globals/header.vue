<template>
  <v-toolbar color="amber" app fixed clipped-left dense>
    <!--<v-toolbar-side-icon  @click.stop="$emit('toggleSidebar')"></v-toolbar-side-icon>-->
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <span class="title">Cloud&nbsp;<span class="text">lab 9</span></span>
    <v-spacer></v-spacer>
    <v-btn icon :to="{name:'Login'}">
      <v-avatar v-if="$store.getters.isUserLoggedIn()">
        <!--<img src="/static/doc-images/john.jpg" alt="">-->
        <span class="white--text headline">{{$store.state.user.name}}</span>
        <!--<span class="white&#45;&#45;text headline">A</span>-->
      </v-avatar>
    </v-btn>
  </v-toolbar>
</template>

<script>
  import foldersAPI from '@/services/folders';
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
    }),
    props: {
      source: String
    },
  }

</script>
