<template>
  <v-toolbar color="amber" app  clipped-left>
    <v-toolbar-side-icon v-if="$vuetify.breakpoint.width <= 1264" @click="drawer = !drawer"></v-toolbar-side-icon>
    <!--<v-toolbar-title class="white--text">Title</v-toolbar-title>-->
    <span class="title">Cloud&nbsp;<span class="text">lab 9</span></span>
    <v-spacer></v-spacer>
    <!--<v-btn icon :to="{name:'Login'}">-->
      <!--<v-avatar v-if="$store.getters.isUserLoggedIn()">-->
        <!--&lt;!&ndash;<img src="/static/doc-images/john.jpg" alt="">&ndash;&gt;-->
        <!--<span class="white&#45;&#45;text headline">{{$store.state.user.name}}</span>-->
        <!--&lt;!&ndash;<span class="white&#45;&#45;text headline">A</span>&ndash;&gt;-->
      <!--</v-avatar>-->
    <!--</v-btn>-->
  </v-toolbar>
</template>

<script>
//  import foldersAPI from '@/services/folders';
  export default {
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
