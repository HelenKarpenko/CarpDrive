<template>
  <el-tree
    lazy
    :props="defaultProps"
    :load="loadNode"
    @node-click="handleNodeClick"/>
</template>

<script>
  import foldersAPI from '@/services/folders';
  export default{
    data(){
      return{
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    props:['toggle'],
    watch:{
      toggle(){
        console.log(1)
        this.UI.isShown = !this.UI.isShown;
        console.log(this.UI.isShown)
      }
    },
    methods: {
      handleNodeClick: async function (data) {
        this.$router.push({name: 'MyDrive', params:{id:data._id}})
      },
      loadNode: async function (node, resolve) {
        try {
          let firstGeneration = await foldersAPI.get('5a2da94fc745e95a0cdb8783');
          if (node.level === 0) {
            return resolve(firstGeneration.data.folder.children);
          }else{
            var data;
            if (node.data.hasChildren) {
              let children = await foldersAPI.get(node.data._id);
              data = children.data.folder.children;
            } else {
              data = [];
            }
            resolve(data);
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
