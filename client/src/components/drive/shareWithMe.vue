<template>
  <span @dragover="handleDrop($event,true)"  @dragleave="handleDrop($event,false)" @drop="handleDrop($event,false)">
    <sidebar :tree="tree"/>
    <toolbar
      @toggleInfoSidebar="toggleInfoSidebar"
      :path="path"
      :edit="false"/>
    <info-sidebar ref="info-sidebar" :item="item"/>
      <v-container grid-list-md text-xs-center v-if="item">
        <v-layout row wrap>
          <template v-if=" item.children && item.children.length > 0">
            <v-flex xs3 v-for="(item, i) in item.children" :key="i">
              <card-item :item="item"/>
            </v-flex>
          </template>
          <template v-else>
            <v-flex>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Empty</h3>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
  </span>
</template>

<script>
  import InfoSidebar from '@/components/drive/infoSidebar.vue';
  import TreeItem from '@/components/drive/tree';
  import Toolbar from '@/components/drive/toolbar';
  import Sidebar from '@/components/drive/sidebar';
  import CardItem from '@/components/drive/carditem';
  import RenameDialog from '@/components/drive/dialog/renameDialog';
  import ShareDialog from '@/components/drive/dialog/shareDialog';
  import DropFile from '@/components/drive/dropFile';
  import foldersAPI from '@/services/folders';
  export default{
    components:{
      InfoSidebar,
      TreeItem,
      Toolbar,
      Sidebar,
      CardItem,
      DropFile,
      RenameDialog,
      ShareDialog,
    },
    data(){
      return{
        showDropZone:false,
        rename: false,
        share: false,
        Menu:{
          data:{}
        },
        folderID: null,
        item: {
          info: null,
          children: null,
        },
        tree: null,
        path: null,
      }
    },
    created: async function (){
      this.processRouter(this.$route.params)
      await this.getSharedTree();
      await this.load();
    },
    watch:{
      page:async function(){
        await this.load();
      }
    },
    async beforeRouteUpdate (to, from, next) {
      this.processRouter(to.params);
//      await this.getMyDriveTree();
      await this.load();
      next();
    },
    methods: {
//      handleDrop(e,b){
//        this.showDropZone = b;
//      },
//      onCtxOpen(data){
//        this.Menu.data = data;
//      },
//      async menuCall(e){
//        if(e.id == 'delete'){
//          await this.removeFolder(this.Menu.data);
//        }
//        if(e.id == 'rename'){
//          this.openRenameDialog();
//        }
//        if(e.id == 'copy'){
//          await this.copyFolder(this.Menu.data);
//        }
//        if(e.id == 'share'){
//          console.log("share")
//          this.openShareDialog();
//        }
//      },
//      addNewItem(args){
//        this.item.children.push(args);
//      },
//      async removeFolder(removeItem) {
//        try {
//          console.log("REMOVE")
//          console.log(this.item);
//          const result = await foldersAPI.removeFolder(removeItem._id);
//          console.log(result.data);
//          if (result.data.success) {
//            this.item.children.splice(this.item.children.indexOf(removeItem),1);
//          }
//        } catch (e) {
//          console.log(e);
//        }
//      },
//      async renameFolder(args) {
//        this.closeRenameDialog();
//        try {
//          const result = await foldersAPI.renameFolder(this.Menu.data._id, args);
//          console.log(result.data);
//          if(result.data.success){
//            this.item.children[this.item.children.indexOf(this.Menu.data)].name = args.name;
//          }
//        } catch (e) {
//          console.log(e);
//        }
//      },
//      openRenameDialog(){
//        this.rename = !this.rename;
//        console.log(this.rename)
//      },
//      async closeRenameDialog(){
//        console.log(3)
//        this.rename = false;
//      },
//      async copyFolder(item){
//        try {
//          const result = await foldersAPI.copyFolder(item._id);
//          console.log(result.data);
//          if (result.data.success) {
//            this.item.children.push(result.data.folder);
//          }
//        } catch (e) {
//          console.log(e);
//        }
//      },
//
//      async shareFolder(args) {
////        this.closeShareDialog();
////        try {
////          const result = await foldersAPI.sharedFolder(this.Menu.data._id, args);
////          console.log(result.data);
////          if(result.data.success){
////            this.item.children[this.item.children.indexOf(this.Menu.data)].name = args.name;
////          }
////        } catch (e) {
////          console.log(e);
////        }
//      },
//      openShareDialog(){
//        this.share = !this.share;
//      },
//      async closeShareDialog(){
//        this.share = false;
//      },


      processRouter(params){
        if(params && params.id){
          this.folderID = params.id;
        }else{
          this.folderID = this.folderID||this.$store.state.user.myDrive;
        }
      },

      async load() {
        try {
          let user = this.$store.state.user;
          let res = await foldersAPI.getSharedFolder(this.folderID);
          if(res.data.success){
            this.item = res.data.folder;
            await this.getPath();
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getSharedTree(){
        try {
          let user = this.$store.state.user;
          let res = await foldersAPI.getSharedTree(user.sharedWithMe.id);
          if(res.data.success){
            this.tree = res.data.folders;
            if(this.tree.length == 0){
              this.tree = [{
                name: 'Empty'
              }]
            }
            console.log(this.tree);
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getPath(){
        try{
          const result = await foldersAPI.getPath(this.folderID);
          if (result.data.success) {
            this.path = result.data.path;
            this.path[0] = {
              id: this.$store.state.user.sharedWithMe.id,
              name: 'Shared with me '
            };
            console.log(this.path);
          }
        }catch(e){
          console.log(e);
        }
      },
      toggleInfoSidebar() {
        this.$refs['info-sidebar'].toggle()
      }
    }
  }
</script>
<style scoped>

</style>

