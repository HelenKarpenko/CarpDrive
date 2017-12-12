
<template>
  <container>
    <v-layout row>
      <v-navigation-drawer permanent light>
        <v-list>
          <v-list-tile v-for="item in navigation" :key="item.title" @click="">
            <v-list-tile-action>
              <v-icon large>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-flex xs-5>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </v-flex>

    </v-layout>
  </container>
</template>


<!--<template>-->
  <!--<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
<!--</template>-->
<script>
  import TreeItem from './item.vue';
  import foldersAPI from '@/services/folders';
  export default{
    components:{
      TreeItem
    },
    data(){
      return{
        navigation: [
          { title: 'My drive', icon: 'cloud' },
          { title: 'Shared with me', icon: 'folder_shared' },
        ],
        mini: true,
        right: null,
        data: [{
          name: 'Level one 1',
          children: [{
            name: 'Level two 1-1',
            children: [{
              name: 'Level three 1-1-1'
            }]
          }]
          }, {
          name: 'Level one 2',
          children: [{
            name: 'Level two 2-1',
            children: [{
              name: 'Level three 2-1-1'
            }]
          }, {
            name: 'Level two 2-2',
            children: [{
              name: 'Level three 2-2-1'
            }]
          }]
        }, {
          name: 'Level one 3',
          children: [{
            name: 'Level two 3-1',
            children: [{
              name: 'Level three 3-1-1'
            }]
          }, {
            name: 'Level two 3-2',
            children: [{
              name: 'Level three 3-2-1'
            }]
          }]
        }],

        defaultProps: {
          children: 'children',
          label: 'name'
        },
      }
    },
    created: async function (){
      await this.load();
    },
    watch:{
      page:async function(){
        await this.load();
      }
    },
    methods: {
      load: async function () {
        try {
          let res = await foldersAPI.find();
          this.data = res.data;
          console.log(this.items);

        } catch (e) {
          console.log(e)
        }
      },
    }
  }
</script>
