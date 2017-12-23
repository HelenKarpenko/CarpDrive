<template>
  <v-container>
    <v-dialog v-model="show" max-width="500px">
      <template v-if="item">
        <v-card>
          <v-card-title>
            <h1>Remove folder {{item.name}} ({{item.id}})</h1>
          </v-card-title>
          <v-card-text>
            Are you sure?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="error" @click.stop="removeFolder()">Remove</v-btn>
            <v-btn flat @click.native="closeDialog()">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data(){
      return{
        show: false,
      }
    },
    props: [
      'item'
    ],
    watch:{
      item(){
        this.show = Boolean(this.item);
      }
    },
    methods: {
      removeFolder: async function () {
        this.$emit('remove', this.item);
      },
      closeDialog(){
        this.show = false;
        this.$emit('close');
      }
    }
  }

</script>
