<template>
  <v-navigation-drawer
    v-model="open"
    fixed
    clipped
    app
    right
  >
    <template v-if="item && item.info">
        <v-card-title >
          <h1>{{item.info.name}}</h1>
        </v-card-title>
      <v-divider/>
      <template v-if="item.info.isFolder">
        <v-card-media src="/static/image/folderImage.svg" height="250px" contain/>
      </template>
      <v-divider></v-divider>
      <template v-if="item.info.sharedWith.length == 0">
        <v-icon>lock</v-icon><span>Вы жадина-говядина соленый огурец</span>
      </template>
      <template v-else>
        <v-avatar v-for="(item, i) in item.info.sharedWith" :key="i">
          <img :src="previewURL">
        </v-avatar>
      </template>
      <v-divider></v-divider>
      <v-card-text>
        Name: <b>{{item.info.name}}</b> <br>
        Type: <b>Folder</b> <br>
        Created: <b>{{item.info.info.created}}</b><br>
        Modified: <b>{{item.info.info.modified}}</b>
      </v-card-text>
    </template>
  </v-navigation-drawer>
</template>
<script>
  import TreeItem from '@/components/drive/tree';
  import userAPI from '@/services/user';
  export default {
    components:{
      TreeItem
    },
    data() {
      return {
        open: false,
        UI: {
          shown: true,
          isMini: true,
        },
        navigation: [
          {id: 'Drive', icon: 'cloud'},
          {id: 'ShareWithMe', icon: 'folder_shared'},
        ],
        activeItem: null,
        previewURL: '/static/image/folderYellow.svg',
      }
    },
    props: [
      'item',
    ],
    methods: {
      toggle(){
        this.open = !this.open;
        if(this.item.info.sharedWith != 0){
          for(let user of this.item.info.sharedWith){
            this.loadAvatar(user);
          }
        }
      },
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
      },
      loadAvatar(user) {
        var reader = new FileReader();
        let vm = this;
        reader.onload = function (e) {
          vm.previewURL = reader.result;
        }
        userAPI.showAvatar(user._id)
          .then(result => {
            return result.data
          })
          .then(data => {
            reader.readAsDataURL(data);
          })
          .catch(err => {
            console.log(err)
          })
      },
    }
  }
</script>
