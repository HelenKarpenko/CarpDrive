<template>
  <span>
    <v-toolbar color="grey lighten-3">
      <v-icon>folder</v-icon>
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item
          v-for="item in path" :key="item.name"
          :disabled="false"
          :to="{name:'Drive', params: {id: item.id}}"
        >
            {{item.name}}
        </v-breadcrumbs-item>
      </v-breadcrumbs>

      <v-spacer/>
        <v-text-field
          v-model="filterString"
          @input="changeFilter()"
          label="Search"
          prepend-icon="search"
        ></v-text-field>
      <v-btn icon @click.stop="openAddDialog()">
        <v-icon>create_new_folder</v-icon>
      </v-btn>
      <el-upload
        class="upload-demo"
        ref="list"
        action=""
        :auto-upload="false"
        :show-file-list="false"
        :on-change="hookUploadFile"
      >
        <v-btn icon>
          <v-icon>file_upload</v-icon>
        </v-btn>
      </el-upload>
      <v-btn icon>
        <v-icon>info</v-icon>
      </v-btn>
    </v-toolbar>
    <add-dialog :open="create" @close="closeAddDialog()" @add="addNewFolder" hidden/>
  </span>

</template>

<script>
  import addDialog from '@/components/drive/dialog/addDialog.vue';
  import foldersAPI from '@/services/folders';
  export default{
    components:{
      addDialog,
    },
    props: [
      'path',
      'clearFilterString'
    ],
    watch:{
      clearFilterString(){
        if(this.clearFilterString){
          this.filterString = "";
        }
      }
    },
    data(){
      return{
        folderID: null,
        item: {
          info: null,
          children: null,
        },
        create: false,
        filterString: ""
      }
    },
    methods:{
      async addNewFolder (args) {
        this.closeAddDialog();
        try {
          const result = await foldersAPI.addNewFolder(this.$route.params.id,args);
          if (result.data.success) {
            this.$emit('addNewItem', result.data.folder);
          }
        } catch (e) {
          console.log(e);
        }
      },
      openAddDialog(){
        this.create = true;
      },
      closeAddDialog(){
        this.create = false;
      },
//      async uploadFile(response, file, fileList){
//        try {
//          console.log(file.name);
//          console.log(response);
//
//          console.log(fileList);
//          const result = await foldersAPI.addNewFolder(this.$route.params.id, file);
//          console.log(result.data);
//          if (result.data.success) {
//            this.$emit('addNewItem', result.data.folder);
//          }
//        } catch (e) {
//          console.log(e);
//        }
//      },
      async hookUploadFile(file, fileList){
        let args = {
          name: file.name,
          img: file.raw,
        }
        try{
          const result = await foldersAPI.addNewFile(this.$route.params.id, args);
          if (result.data.success) {
            this.$emit('addNewFile', result.data.folder);
          }
        }catch(e){
          console.log(e);
        }
        fileList.splice(0,fileList.length)
      },
      async clickPath(item){
        this.$route.push({name:'Drive', params: {id: item.id}})

      },
      async changeFilter () {
        this.$emit('changeFilter', this.filterString);
      },
    }
  }
</script>
