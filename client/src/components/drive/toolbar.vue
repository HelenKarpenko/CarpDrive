<template>
  <v-toolbar color="grey lighten-3">
    <add-dialog :open="create" @close="closeAddDialog()" @add="addNewFolder"></add-dialog>

    <v-spacer/>
    <v-btn icon @click.stop="openAddDialog()">
      <v-icon>create_new_folder</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>file_upload</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>info</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  import addDialog from '@/components/drive/addDialog.vue';
  import foldersAPI from '@/services/folders';
  export default{
    components:{
      addDialog,
    },
    data(){
      return{
        folderID: null,
        item: {
          info: null,
          children: null,
        },
        create: false,
      }
    },
    methods:{
      async addNewFolder (args) {
        this.closeAddDialog();
        try {
          console.log("ARGS");
          console.log(args);
          const result = await foldersAPI.addNewItem(this.$route.params.id,args);
          console.log(result.data);
          if (result.data.success) {
//            this.item.push(result.data.folder);
            this.$emit('addNewItem', result.data.folder);
          }
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
