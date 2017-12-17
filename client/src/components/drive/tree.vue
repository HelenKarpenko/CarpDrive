<template>
  <span>
    <el-tree
      :props="defaultProps"
      :load="loadNode"
      @node-click="handleNodeClick"
      :expand-on-click-node="false"
      lazy
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
        'setNewNode'
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
        this.$router.push({name: 'Drive', params: {id: data._id}})
      }
      ,
      loadNode: async function (node, resolve) {
        try {
          let firstGeneration = await foldersAPI.get(this.$store.state.user.myDrive);
          if (node.level === 0) {
            return resolve(firstGeneration.data.folder.children);
          } else {
            var data;
            if (node.data.hasChildren) {
              let children = await foldersAPI.get(node.data._id);
              console.log(children);
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
      ,
    }
  }
</script>



