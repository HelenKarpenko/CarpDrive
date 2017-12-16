<template>
  <span>
    <toolbar @addNewItem="addNewItem"/>
      <v-container grid-list-md text-xs-center v-if="item">
        <v-layout row wrap>
          <template v-if=" item.children && item.children.length > 0">
            <v-flex xs3 v-for="(item, i) in item.children" :key="i">
              <v-card>
                <v-card-media src="/static/image/folder.svg" height="250px" contain>
                </v-card-media>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{item.name}}</h3>
                  </div>
                </v-card-title>
                <v-card-actions>
                </v-card-actions>
              </v-card>
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
  import TreeItem from '@/components/drive/tree';
  import Toolbar from '@/components/drive/toolbar';
  import foldersAPI from '@/services/folders';
  export default{
    components:{
      TreeItem,
      Toolbar,
    },
    data(){
      return{
        folderID: null,
        item: {
          info: null,
          children: null,
        },
      }
    },
    created: async function (){
      this.processRouter(this.$router.params)
      await this.load();
    },
    watch:{
      page:async function(){
        await this.load();
      }
    },
    async beforeRouteUpdate (to, from, next) {
     this.processRouter(to.params);
     await this.load();
     next();
    },
    methods: {
      addNewItem(args){
        console.log(args)
      },
      processRouter(params){
        if(params && params.id){
          this.folderID = params.id;
        }else{
          this.folderID = this.folderID||this.$store.state.user.myDrive;
        }
      },
      async load() {
        console.log("LOAD");
        try {
          let user = this.$store.state.user;
          console.log("<<<"+ this.folderID);
          let res = await foldersAPI.get(this.folderID);
          if(res.data.success){
            this.item = res.data.folder;
            console.log(this.item);
          }
        } catch (e) {
          console.log(e)
        }
      },
    }
  }
</script>
