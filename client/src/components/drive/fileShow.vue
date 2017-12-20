<template>
  <div>
    <!--<a href="{{data}}" target="_blank">Read more</a>-->
    <img ref="preview" >
  </div>
</template>

<script>
  import foldersAPI from '@/services/folders';

  export default {
    components: {},
    data() {
      return {
        id: this.$route.params.id,
        item: null,
        data: null,
      }
    },
    created: async function () {
      console.log(this.id);
      this.item = await foldersAPI.get(this.id);
      await this.showFile();
    },
//    watch:{
//      page:async function(){
//      }
//    },
//    async beforeRouteUpdate (to, from, next) {
//    },
    methods: {
      async showFile() {
        try {
          console.log("SHOW FILE ENTER");
          const result = await foldersAPI.showFile(this.id);
          console.log("SUCCESS");
            let vm=this;
            var reader  = new FileReader();
            reader.onload = function (e) {
              vm.$refs.preview.src=reader.result;
            }
            reader.readAsDataURL(result.data);
//            this.item.children.splice(this.item.children.indexOf(removeItem),1);
//            this.getMyDriveTree();
//            this.$message({
//              message: 'Congrats, this is a success message.',
//              type: 'success',
//              icon: "new_releases"
//            });

        } catch (e) {
          console.log(e);
        }
      }
    }
  }
</script>

