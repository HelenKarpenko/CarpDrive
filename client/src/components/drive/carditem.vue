<template>
  <span>
    <a @click="show">
    <v-card>
        <template v-if="item.isFolder">
          <v-card-media src="/static/image/folder.svg" height="250px" contain>
          </v-card-media>
        </template>
        <template v-else>
          <v-card-media :src="`http://localhost:3001/api/v1/my-drive/image/${item.data}`" height="250px" contain>
          </v-card-media>
        </template>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{item.name}}</h3>
          </div>
        </v-card-title>
        <v-card-actions>
        </v-card-actions>
    </v-card>
    </a>
    <show-file :open="showFileDialog" @close="closeShowItemDialog()" :item="item"/>
  </span>
</template>

<script>
  import ShowFile from'@/components/drive/dialog/showFileDialog';
  import foldersAPI from '@/services/folders';
  export default {
    components:{
      ShowFile,
    },
    data() {
      return {
        folderID: null,
        showFileDialog: false,
      }
    },
    props: [
      'item',
    ],
    methods: {
      async show(){
        if(this.item.isFolder){
          this.$router.push({name: this.$router.name, params: {id: this.item._id}})
        }else{
          await this.showFile();
        }
      },
      async showFile(){
        this.openShowItemDialog();
//        this.$router.push({name: 'ShowFile', params: {id: this.item._id}})
      },
      openShowItemDialog(){
        this.showFileDialog = !this.showFileDialog;
      },
      closeShowItemDialog(){
        this.showFileDialog = false;
      },
    }
  }
</script>
