<template>
  <li>
    <div :class="{bold: isFolder}" @click="toggle">
      {{model.name}}
      <span v-if="isFolder">
        [{{open ? '-' : '+'}}]
      </span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="model in model.children"
        :key="model.name"
        :model="model"
      />
      <!--<li class="add" @click="addChild">+</li>-->
    </ul>
  </li>

</template>

<!--<template>-->
<!--<v-container>-->
<!--<v-list-tile @click="toggle">-->
<!--<v-list-tile-action>-->
<!--<v-icon>folder</v-icon>-->
<!--</v-list-tile-action>-->
<!--<v-list-tile-content>-->
<!--<v-list-tile-title>{{ model.name }}</v-list-tile-title>-->
<!--</v-list-tile-content>-->
<!--<v-list-tile-action>-->
<!--<v-icon>keyboard_arrow_down</v-icon>-->
<!--</v-list-tile-action>-->
<!--</v-list-tile>-->
<!--<template v-show="open">-->
<!--<item-->
<!--class="item"-->
<!--v-for="model in model.children"-->
<!--:key="model.name"-->
<!--:model="model"-->
<!--/>-->
<!--</template>-->
<!--</v-container>-->
<!--</template>-->


<script>
  export default {
    name: 'item',
    props: [
      'model'
    ],
    data: function () {
      return {
        open: false
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children &&
          this.model.children.length
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      addChild: function () {
        this.model.children.push({
          name: 'new stuff'
        })
      }
    }
  }

</script>
