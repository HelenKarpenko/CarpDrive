<template>
  <span>
    <a @click="show">
    <v-card>
        <template v-if="item.isFolder">
          <v-card-media src="/static/image/folder.svg" height="250px" contain>
          </v-card-media>
        </template>
        <template v-else>
          <v-card-media :src="previewURL" height="250px" contain/>
        </template>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{item.name}}</h3>
          </div>
        </v-card-title>
        <v-card-actions>
        </v-card-actions>
    </v-card>
    </a>
    <show-file :open="showFileDialog" @close="closeShowItemDialog()" :item="item"/>
  </span>
</template>

<script>
  import ShowFile from '@/components/drive/dialog/showFileDialog';
  import foldersAPI from '@/services/folders';
  import globals from '@/services/globals';
  import VCardMedia from "vuetify/src/components/VCard/VCardMedia";

  export default {
    components: {
      VCardMedia,
      ShowFile,
    },
    data() {
      return {
        previewURL: '/static/image/folder.svg',
        folderID: null,
        type: 'file',
        showFileDialog: false,
      }
    },
    props: [
      'item',
    ],
    created: async function () {
      if (!this.item.isFolder) {
        await this.getFileType();
        console.log("------------")
        console.log(this.type);
        console.log("------------")
        if(this.type[0] == 'image'){
          this.loadPreview();
        }else{
          if(this.type[1] == 'pdf'){
            this.previewURL = '/static/image/pdf.svg'
          }

        }

      }
    },
    methods: {
      loadPreview() {
        var reader = new FileReader();
        let vm = this;
        reader.onload = function (e) {
          console.log(e)
          vm.previewURL = reader.result;
        }
        foldersAPI.showFile(this.item._id)
          .then(result => {
            console.log("success")
            return result.data
          })
          .then(data => {
            reader.readAsDataURL(data);
          })
          .catch(err => {
            console.log(err)
          })
      },
      async show() {
        if (this.item.isFolder) {
          this.$router.push({name: this.$router.name, params: {id: this.item._id}})
        } else {
          await this.showFile();
        }
      },
      async showFile() {
        this.openShowItemDialog();
//        this.$router.push({name: 'ShowFile', params: {id: this.item._id}})
      },
      openShowItemDialog() {
        this.showFileDialog = !this.showFileDialog;
      },
      closeShowItemDialog() {
        this.showFileDialog = false;
      },
      async getFileType() {
        try {
          const result = await foldersAPI.getFileType(this.item._id);
          if (result.data.success) {
            let type = result.data.type.split('/');
            this.type = type;
          }
        } catch (e) {
          console.log(e);
          this.type = "file";
        }
      },
    },
    computed: {
      rootURL() {
        return globals.ROOT_URL;
      }
    },
  }
</script>
