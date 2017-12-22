<template>
  <v-dialog v-model="show" max-width="500px" @close="closeDialog()">
    <v-card>
      <v-card-title>
        <h1>Shared folder</h1>
      </v-card-title>
      <hr>
      <v-card-text>
        <v-text-field
          label="Enter username"
          prepend-icon="face"
          required
          v-model="share.username"
          autofocus
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click.stop="shareFolder()">Share</v-btn>
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
        share: {
          username: null,
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
      async shareFolder () {
        console.log(this.share)
        this.$emit('share',this.share);
      },
      closeDialog(){
        this.$emit('close');
      }
    }
  }

</script>
