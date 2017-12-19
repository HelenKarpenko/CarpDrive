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
            <v-list-tile slot="item" >
              <v-list-tile-action>
                <v-icon large>{{ item.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-flex>
      <v-flex xs9 v-show="!UI.isMini">
        <tree-item :tree="tree"/>
      </v-flex>
    </v-layout>

  </v-navigation-drawer>
</template>
<script>
  import TreeItem from '@/components/drive/tree';
  export default {
    components:{
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
