<template>
  <v-toolbar color="amber" app fixed clipped-left dense >
    <v-toolbar-side-icon  @click.stop="$emit('toggleSidebar')"></v-toolbar-side-icon>
    <span class="title">Cloud&nbsp;<span class="text">lab 9</span></span>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
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
