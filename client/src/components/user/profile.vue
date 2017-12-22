<template>

  <v-container grid-list-md>
    <v-layout row >

      <v-flex xs12 sm10 offset-sm1>
        <v-card>
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs5>
                <v-card-media
                  :src="previewURL"
                  height="250px"
                  contain
                ></v-card-media>
                <v-card-actions >
                  <v-spacer/>
                  <el-upload
                    class="upload-demo"
                    ref="list"
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="hookUploadFile"
                  >
                    <v-btn >
                      <v-icon>file_upload</v-icon><span>Upload new avatar</span>
                    </v-btn>
                  </el-upload>
                  <v-spacer/>
                </v-card-actions>
              </v-flex>
              <v-flex xs7>
                <div>
                  <div class="headline"><h1>{{$store.state.user.name}}</h1></div>
                </div>
                <v-card-text>
                  <v-list two-line>
                    <v-list-tile @click="">
                      <v-list-tile-action>
                        <v-icon>face</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{$store.state.user.username}}</v-list-tile-title>
                        <v-list-tile-sub-title>Username</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider inset></v-divider>
                    <v-list-tile @click="">
                      <v-list-tile-action>
                        <v-icon>mail</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>aliconnors@example.com</v-list-tile-title>
                        <v-list-tile-sub-title>Personal</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card-text>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import userAPI from '@/services/user';
  export default {
    data() {
      return {
        previewURL: '/static/image/folderYellow.svg',
      }
    },
    props: [
    ],
    created: async function () {
      console.log(this.$store.state.user.avatar);
      if (this.$store.state.user.avatar) {
        console.log("ENTER");
        await this.loadPreview();
      }
    },
    methods: {
      async hookUploadFile(file, fileList){
        let args = {
          name: file.name,
          img: file.raw,
        }
        try{
          const result = await userAPI.setAvatar(this.$store.state.user.id, args);
          if (result.data.success) {
            console.log("SUCCESS")
            this.loadPreview();
          }
        }catch(e){
          console.log(e);
        }
        fileList.splice(0,fileList.length)
      },
      loadPreview() {
        var reader = new FileReader();
        let vm = this;
        reader.onload = function (e) {
          console.log(e)
          vm.previewURL = reader.result;
        }
        userAPI.showAvatar(this.$store.state.user.id)
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
    }
  }
</script>
