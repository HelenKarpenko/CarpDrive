<template>
  <span>
    <v-card  >
      <router-link :to="{name:'Drive', params: {id: item._id}}">
        <template v-if="item.isFolder">
          <v-card-media src="/static/image/folder.svg" height="250px" contain>
          </v-card-media>
        </template>
        <template v-else>
          <v-card-media :src="`http://localhost:3001/api/v1/my-drive/image/${item.data}`" height="250px" contain>
          </v-card-media>
        </template>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{item.name}}</h3>
          </div>
        </v-card-title>
        <v-card-actions>
        </v-card-actions>
      </router-link>
    </v-card>

  </span>
</template>

<script>
  import foldersAPI from '@/services/folders';

  export default {
    data() {
      return {
        folderID: null,
      }
    },
    props: [
      'item'
    ],
    methods: {
      openDropdown(e) {
        this.$refs.dropdown.toggle();
      }
    }
  }
</script>
