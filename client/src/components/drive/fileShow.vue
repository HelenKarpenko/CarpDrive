<template>
  <span>
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <div>
      <img ref="preview" >
    </div>
  </span>
</template>

<script>
  import foldersAPI from '@/services/folders';

  export default {
    data() {
      return {
        id: this.$route.params.id,
        item: null,
        data: null,
        loadItem: true,
      }
    },
    created: async function () {
      console.log(this.id);
      this.item = await foldersAPI.get(this.id);
      this.loadItem = true;
      await this.showFile();
//      this.loadItem = false;
    },
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
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
</script>

