// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// tools
import router from './router'
import {sync} from 'vuex-router-sync'
import store from '@/services/storage/storage'
// styles
import ElementUI from 'element-ui'
import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import 'vuetify/dist/vuetify.min.css';
import 'element-ui/lib/theme-chalk/index.css'
import Vuetify from 'vuetify'
import contextMenu from 'vue-context-menu'

Vue.config.productionTip = false
// register vue-auth-image directive

sync(store, router);
import {Drag, Drop} from 'vue-drag-drop';

Vue.component('drag', Drag);
Vue.component('drop', Drop);
Vue.use(contextMenu);
Vue.use(ElementUI)
Vue.use(Vuetify)
Vue.use(KeenUI)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
