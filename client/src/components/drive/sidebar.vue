<template>
  <v-navigation-drawer
    :mini-variant="UI.isMini"
    fixed
    clipped
    :permanent="true"
    app
    >
    <v-layout>
      <v-flex>
        <v-list>
          <v-list-group v-for="item in navigation" :key="item.title" @click="chooseItem(item)" >
            <v-list-tile slot="item">
              <template v-if="item.id!='Loading'">
              <v-list-tile-action>
                <v-icon large>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              </template>
              <template v-else>
              <template  v-for="file in item.items">
                <!--<v-list-tile-action >-->
                  <!--<v-progress-circular indeterminate color="amber"/>-->
                <!--</v-list-tile-action>-->
                <!--<v-list-tile-content v-if="activeItem && activeItem.id=='Loading'">-->
                  <!--{{file}}-->
                <!--</v-list-tile-content>-->
              </template>
              </template>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-flex>
      <v-flex xs9 v-show="!UI.isMini && activeItem.id!='Loading'">
        <tree-item :tree="tree"/>
      </v-flex>
    </v-layout>

  </v-navigation-drawer>
</template>
<script>
  import TreeItem from '@/components/drive/tree';
  import VListTileAction from "vuetify/src/components/VList/VListTileAction";
  export default {
    components:{
      VListTileAction,
      TreeItem
    },
    data() {
      return {
        UI: {
          isShown: true,
          isMini: true,
        },
        navigation: [
          {id: 'Drive', icon: 'cloud'},
          {id: 'ShareWithMe', icon: 'folder_shared'},
          {id: 'Loading',items:['some file']}
        ],
        activeItem: null,
      }
    },
    props:
      [
        'tree'
      ],
    methods: {
      toggleSize(item) {
        if(item == this.activeItem || !this.activeItem){
          this.UI.isMini = !this.UI.isMini;
        }
      },
      async chooseItem(item){
        if(item.id == 'Drive'){
          this.$router.push({
            name: item.id,
            params: {id: this.$store.state.user.myDrive}
          })
        }
        if(item.id == 'ShareWithMe'){
          this.$router.push({
            name: item.id,
            params: {id: this.$store.state.user.sharedWithMe.id}
          })
        }
        this.toggleSize(item);
        this.activeItem = item;
      }
    }
  }
</script>
