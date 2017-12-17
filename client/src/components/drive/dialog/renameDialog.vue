<template>
    <v-dialog v-model="show" max-width="500px" @close="closeDialog()">
      <v-card>
        <v-card-title>
          <h1>Rename folder</h1>
        </v-card-title>
        <hr>
        <v-card-text>
          <v-text-field label="Folder name" prepend-icon="folder" required v-model="create.name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click.stop="renameFolder()">Create</v-btn>
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
      'open'
    ],
    watch:{
      open(){
        this.show = this.open;
        console.log(2)
      }
    },
    methods: {
      loadFile(event){
        this.create.img = event.target.files[0];
        console.log(this.create.img);
      },
      async renameFolder () {
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
