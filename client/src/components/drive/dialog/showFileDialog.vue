<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" fullscreen transition="dialog-bottom-transition" :overlay=false>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="closeDialog()" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{item.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!--<v-btn icon :href="`http://localhost:3001/api/v1/my-drive/${item._id}/file`" dark>-->
              <!--<v-icon>file_download</v-icon>-->
            <!--</v-btn>-->

            <v-btn icon @click.stop="downloadFile()" dark>
              <v-icon>file_download</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <div>
            <iframe ref="preview" width="100%" height="700px" frameborder="0"/>
          </div>


        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import foldersAPI from '@/services/folders';
  import FileSaver from "file-saver"
  export default {
    data () {
      return {
        show: false,

        id: null,
        data: null,
        blob: null,
        type: null,
      }
    },
    props: [
      'open',
      'item'
    ],
    watch:{
      async open(){
        this.id = this.item._id
        this.show = Boolean(this.open);
//        let res = await foldersAPI.get(this.id);
//        this.item = res.data.folder;
        console.log(this.item)
        await this.getFileInfo();
        await this.getFileType();
        await this.fileNext();
      }
    },
    methods:{
      closeDialog(){
        this.$emit('close');
      },
      async getFileType(){
        try {
          const result = await foldersAPI.getFileType(this.id);
          if(result.data.success){
            let type = result.data.type.split('/');
            this.type = type[0];
          }
        } catch (e) {
          console.log(e);
        }
      },
      async showFile() {
        try {
          console.log("SHOW FILE ENTER");
          const result = await foldersAPI.showFile(this.id);
          console.log("SUCCESS");
          let vm = this;
          var reader  = new FileReader();
          reader.onload = function (e) {
            vm.$refs.preview.src = reader.result;
          }
          reader.readAsDataURL(result.data);
          this.blob = result.data;
//          console.log("===============================");
//          console.log(reader.readAsDataURL(result.data));
//          console.log("===============================");

        } catch (e) {
          console.log(e);
        }
      },
      async getFileInfo() {
        try {
          const result = await foldersAPI.getFileInfo(this.id);
          console.log(result.data)
          this.data = result.data;
        } catch (e) {
          console.log(e);
        }
      },
      async fileNext() {
//        if(this.type == 'image'){
//          this.showFile();
//        }
//        if(this.type == 'application'){
////          this.showFile();
//        }
        this.showFile();
      },
      async downloadFile(){

          FileSaver.saveAs(this.blob, this.data.filename);
      }
    }
  }
</script>
