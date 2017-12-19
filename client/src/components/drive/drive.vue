<template>
  <span @dragover="handleDrop($event,true)"  @dragleave="handleDrop($event,false)" @drop="handleDrop($event,false)">
    <sidebar :tree="tree"/>
    <toolbar @addNewItem="addNewItem" @addNewFile="addNewItem" :path="path"/>
      <v-container grid-list-md text-xs-center v-if="item">
        <v-layout row wrap>
          <template v-if=" item.children && item.children.length > 0">
            <v-flex xs3 v-for="(item, i) in item.children" :key="i" @contextmenu.prevent="$refs.ctx.open($event,item)">
              <card-item :item="item" />
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
    <context-menu ref="ctx" @ctx-open="onCtxOpen">
      <ui-menu class="text-xs-left"
               contain-focus
               has-icons
               has-secondary-text
               :options="menuOptions"
               @select="menuCall($event)"/>
    </context-menu>
    <rename-dialog :open="rename"  @close="closeRenameDialog" @rename="renameFolder"/>
    <share-dialog :open="share"  @close="closeShareDialog" @rename="shareFolder"/>
    <drop-file v-show="showDropZone" @addFile="addNewItem"/>
  </span>
</template>

<script>

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
        menuOptions: [
          {
            id: 'rename',
            label: 'Rename',
            icon: 'edit',
            secondaryText: 'Ctrl+E',
          },
          {
            id: 'copy',
            label: 'Duplicate',
            icon: 'content_copy',
            secondaryText: 'Ctrl+D'
          },
          {
            id: 'share',
            label: 'Share',
            icon: 'share',
            secondaryText: 'Ctrl+Shift+S',
          },
          {
            type: 'divider'
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: 'delete',
            secondaryText: 'Del',
          }
        ],
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
      await this.getMyDriveTree();
      await this.load();
    },
    watch:{
      page:async function(){
        await this.load();
      }
    },
    async beforeRouteUpdate (to, from, next) {
      this.processRouter(to.params);
      await this.getMyDriveTree();
      await this.load();
      next();
    },
    methods: {
      handleDrop(e,b){
        this.showDropZone = b;
      },
      onCtxOpen(data){
        this.Menu.data = data;
      },
      async menuCall(e){
        if(e.id == 'delete'){
          await this.removeFolder(this.Menu.data);
        }
        if(e.id == 'rename'){
          this.openRenameDialog();
        }
        if(e.id == 'copy'){
          await this.copyFolder(this.Menu.data);
        }
        if(e.id == 'share'){
          console.log("share")
          this.openShareDialog();
        }
      },
      addNewItem(args){
        this.item.children.push(args);
      },
      async removeFolder(removeItem) {
        try {
          console.log("REMOVE")
          console.log(this.item);
          const result = await foldersAPI.removeFolder(removeItem._id);
          console.log(result.data);
          if (result.data.success) {
            this.item.children.splice(this.item.children.indexOf(removeItem),1);
          }
        } catch (e) {
          console.log(e);
        }
      },
      async renameFolder(args) {
        this.closeRenameDialog();
        try {
          const result = await foldersAPI.renameFolder(this.Menu.data._id, args);
          console.log(result.data);
          if(result.data.success){
            this.item.children[this.item.children.indexOf(this.Menu.data)].name = args.name;
          }
        } catch (e) {
          console.log(e);
        }
      },
      openRenameDialog(){
        this.rename = !this.rename;
        console.log(this.rename)
      },
      async closeRenameDialog(){
        console.log(3)
        this.rename = false;
      },
      async copyFolder(item){
        try {
          const result = await foldersAPI.copyFolder(item._id);
          console.log(result.data);
          if (result.data.success) {
            this.item.children.push(result.data.folder);
          }
        } catch (e) {
          console.log(e);
        }
      },

      async shareFolder(args) {
      },
      openShareDialog(){
        this.share = !this.share;
      },
      async closeShareDialog(){
        this.share = false;
      },


      processRouter(params){
        console.log(params  )
        if(params && params.id){
          this.folderID = params.id;
        }else{
          this.folderID = this.folderID||this.$store.state.user.myDrive;
        }
      },
      async load() {
        try {
          let user = this.$store.state.user;
          let res = await foldersAPI.get(this.folderID);
          if(res.data.success){
            this.item = res.data.folder;
            await this.getPath();
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getMyDriveTree() {
        try {
          let user = this.$store.state.user;
          let res = await foldersAPI.get(user.myDrive);
          if(res.data.success){
            this.tree = res.data.folder;
            console.log(tree);
            await this.getPath();
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getPath(){
        try{
          const result = await foldersAPI.getPath(this.folderID);
          console.log(result.data.path)
          if (result.data.success) {
            this.path = result.data.path;
            console.log(this.path);
          }
        }catch(e){
          console.log(e);
        }
      },
    }
  }
</script>
<style scoped>

</style>

