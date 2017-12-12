<template>
  <v-navigation-drawer
    :mini-variant="UI.isMini"
    fixed
    clipped
    :permanent="UI.isShown"
    app
    v-model="UI.isShown">
    <v-layout>
      <v-flex>
        <v-list>
          <v-list-tile v-for="item in navigation" :key="item.title" @click.stop="toggleSize()">
            <v-list-tile-action>
              <v-icon large>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <!--<v-list-tile-content>-->
            <!--<v-list-tile-title>{{ item.title }}</v-list-tile-title>-->
            <!--</v-list-tile-content>-->
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs9 v-show="!UI.isMini">
        <tree-item/>
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
          {title: 'My drive', icon: 'cloud'},
          {title: 'Shared with me', icon: 'folder_shared'},
        ],
      }
    },
    props: ['toggle'],
    watch: {
      toggle() {
        console.log(1)
        this.UI.isShown = !this.UI.isShown;
        console.log(this.UI.isShown)
      },
    },
    methods: {
      toggleSize() {
        this.UI.isMini = !this.UI.isMini;
      }
    }
  }
</script>
