<template>
  <v-container>
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <h1>Create new folder</h1>
        </v-card-title>
        <hr>
        <v-card-text>
          <v-icon>image</v-icon>
          <!--<input type='file' name="img" id="img" class="custom-file-input" required @change="loadFile" ref="file"/>-->
          <v-text-field label="Folder name" prepend-icon="folder" required v-model="create.name"></v-text-field>
          <!--<v-text-field box multi-line label="Description" v-model="create.description"></v-text-field>-->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click.stop="addNewFolder()">Create</v-btn>
          <v-btn flat @click.native="closeDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data(){
      return{
        show: false,
        create: {
//          img: null,
          name: null,
//          description: null,
        }
      }
    },
    props: [
      'open'
    ],
    watch:{
      open(){
        this.show = Boolean(this.open);
      }
    },
    methods: {
      loadFile(event){
        this.create.img = event.target.files[0];
        console.log(this.create.img);
      },
      async addNewFolder () {
        this.$emit('add',this.create);

//        this.create.name = null;
//        this.create.description = null;
//        this.create.img = null;
//        this.$refs.file.value = "";
      },
      closeDialog(){
        this.$emit('close');
//        this.create.img = null;
        this.create.name = null;
//        this.create.description = null;
//        this.$refs.file.value = "";

      }
    }
  }

</script>
