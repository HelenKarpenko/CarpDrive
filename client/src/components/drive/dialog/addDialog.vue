<template>
  <v-container>
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <h1>Create new folder</h1>
        </v-card-title>
        <hr>
        <v-card-text>
          <v-text-field
            label="Folder name"
            prepend-icon="folder"
            v-model="create.name"
            :rules="[rules.required]"
          ></v-text-field>
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
          name: null,
          isFolder: true,
        },
        rules: {
          required: (value) => !!value || 'Required.',
        }
      }
    },
    props: [
      'open',
    ],
    watch:{
      open(){
        this.show = Boolean(this.open);
        this.create.name = null;
      }
    },
    methods: {
      async addNewFolder () {
        if(this.create.name){
          this.$emit('add',this.create);
        }
      },
      closeDialog(){
        this.$emit('close');
        this.create.name = null;
      }
    }
  }

</script>

