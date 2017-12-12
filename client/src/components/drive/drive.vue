<template>
  <!--<v-container>-->
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <template v-if="item.children.length > 0">
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
  <!--</v-container>-->
</template>

<script>
  import TreeItem from '@/components/drive/tree';
  import foldersAPI from '@/services/folders';
  export default{
    components:{
      TreeItem
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
    },
    watch:{
      page:async function(){
        await this.load();
      }
    },
    async beforeRouteUpdate (to, from, next) {
     this.folderID = to.params.id;
     await this.load();
     next();
    },
    methods: {
      load: async function () {
        try {
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
