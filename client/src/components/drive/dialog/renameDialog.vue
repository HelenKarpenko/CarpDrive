<template>
    <v-dialog v-model="show" max-width="500px" @close="closeDialog()">
      <v-card>
        <v-card-title>
          <h1>Rename folder</h1>
        </v-card-title>
        <hr>
        <v-card-text>
          <v-text-field
            label="Folder name"
            prepend-icon="folder"
            v-model="create.name"
            autofocus
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click.stop="renameFolder()">Rename</v-btn>
          <v-btn flat @click.native="closeDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    data(){
      return{
        show: false,
        create: {
          name: null,
        }
      }
    },
    props: [
      'open',
      'oldName'
    ],
    watch:{
      open(){
        this.show = this.open;
//        if(this.oldName){
//          this.create.name = this.oldName;
//        }
        console.log(2)
      }
    },
    methods: {
      async renameFolder () {
        console.log("___________")
        console.log(this.create)
        this.$emit('rename',this.create);
      },
      closeDialog(){
        this.$emit('close');
//        this.create.name = null;
      }
    }
  }

</script>
