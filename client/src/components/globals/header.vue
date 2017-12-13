<template>
  <v-toolbar color="amber" app fixed clipped-left dense extended>
    <v-toolbar-side-icon  @click.stop="$emit('toggleSidebar')"></v-toolbar-side-icon>
    <span class="title">Cloud&nbsp;<span class="text">lab 9</span></span>
    <v-spacer slot="extension"/>
    <v-btn icon slot="extension" @click.stop="openAddDialog()">
      <v-icon>create_new_folder</v-icon>
    </v-btn>
    <v-btn icon slot="extension">
      <v-icon>file_upload</v-icon>
    </v-btn>
    <v-btn icon slot="extension" >
      <v-icon>info</v-icon>
    </v-btn>
    <add-dialog :open="create" @close="closeAddDialog()" @add="addNewFolder"></add-dialog>
  </v-toolbar>
</template>

<script>
  import addDialog from '@/components/globals/addDialog.vue';
  export default {
    components:{
      addDialog
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

      create: false,
    }),
    props: {
      source: String
    },
    methods:{
      addNewFolder: async function (args) {
        this.closeAddDialog();
        try {
//          const result = await foldersAPI.addNewItem(args);
//          console.log(result.data);
//          if (result.data.success) {
//            this.items.push(result.data.folder);
//          }
        } catch (e) {
          console.log(e);
        }
      },
      openAddDialog(){
        this.create = true;
      },
      closeAddDialog(){
        this.create = false;
      },
    }
  }

</script>
