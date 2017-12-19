<template>
  <span>
    <el-tree
      :props="defaultProps"
      :data="tree"
      @node-click="handleNodeClick"
      :expand-on-click-node="false"
      node-key="id"
      ref="tree"
    />
  </span>
</template>

<script>
  import foldersAPI from '@/services/folders';
  import Toolbar from '@/components/drive/toolbar';

  export default {
    components: {
      Toolbar,
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      }
    },

    props:
      [
        'toggle',
        'setNewNode',
        'tree'
      ],
    watch:
      {
        toggle() {
          console.log(1)
          this.UI.isShown = !this.UI.isShown;
          console.log(this.UI.isShown)
        },
      },
    methods: {
      handleNodeClick: async function (data) {
        this.$router.push({name: this.$router.name, params: {id: data._id}})
      },
//      loadNode: async function (node, resolve) {
//        try {
//          let firstGeneration = await foldersAPI.get(this.$store.state.user.myDrive);
//          if (node.level === 0) {
//            return resolve(firstGeneration.data.folder.children);
//          } else {
//            var data;
//            if (node.data.hasChildren) {
//              let children = await foldersAPI.get(node.data._id);
//              console.log(children);
//              data = children.data.folder.children;
//            } else {
//              data = [];
//            }
//            resolve(data);
//          }
//        } catch (e) {
//          console.log(e)
//        }
//      }
//      ,
    }
  }
</script>



