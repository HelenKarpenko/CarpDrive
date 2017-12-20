<template>
  <span>
    <a @click="show">
    <v-card>
      <!--<div @click="showFile">-->
      <!--<router-link :to="{name:$router.name, params: {id: item._id}}">-->
      <!--<router-link v-else click="showFile()">-->
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
      <!--</router-link>-->
      <!--</router-link>-->
      <!--</div>-->
    </v-card>
    </a>
  </span>
</template>

<script>
  import foldersAPI from '@/services/folders';

  export default {
    data() {
      return {
        folderID: null,
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
        this.$router.push({name: 'ShowFile', params: {id: this.item._id}})
      }
//        try {
//          console.log("SHOW FILE ENTER");
//          const result = await foldersAPI.showFile(this.item._id);
//          console.log(result.data);
//          if (result.data.success) {
//
////            this.item.children.splice(this.item.children.indexOf(removeItem),1);
////            this.getMyDriveTree();
////            this.$message({
////              message: 'Congrats, this is a success message.',
////              type: 'success',
////              icon: "new_releases"
////            });
//          }
//        } catch (e) {
//          console.log(e);
//        }
//      }
    }
  }
</script>
