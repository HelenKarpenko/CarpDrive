<template>
    <drop class="drop-area fullscreen" @drop="handleDrop"/>
</template>

<script>
  import { Drag, Drop } from 'vue-drag-drop';
  import foldersAPI from '@/services/folders';
  export default {
    components: { Drag, Drop },
    methods: {
      async handleDrop(data, event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        console.log(files[0]);
        let args = {
          name: files[0].name,
          img: files[0],
        }
        try{
          console.log("enter");
          const result = await foldersAPI.addNewFile(this.$route.params.id, args);
          if (result.data.success) {
            console.log("addFile");
            this.$emit('addFile', result.data.folder);
          }
        }catch(e){
          console.log(e);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .fullscreen{
    z-index: 1000;
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right: 0;
    width: 100%;
    height: 100%;
  }
  .drop-area{
    box-sizing: border-box;
    display: block;
    border:dashed blue 2px;
    background-color: rgba(255,255,255,0.5);
  }
</style>

