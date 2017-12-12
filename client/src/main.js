// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from './router'
import VueDragTree from 'vue-drag-tree'

import {sync} from 'vuex-router-sync'
import store from '@/services/storage/storage'
import 'element-ui/lib/theme-chalk/index.css'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css';
Vue.config.productionTip = false
// register vue-auth-image directive

sync(store, router);


Vue.component('vue-drag-tree', VueDragTree)
Vue.use(ElementUI)
Vue.use(Vuetify)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
