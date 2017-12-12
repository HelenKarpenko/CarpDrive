import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    username: null,
    password: null,
    isUserLoggedIn: false,
    user: null,
  },
  plugins: [
    createPersistedState()
  ],
  mutations: {
    setUsername (state, value) {
      state.username = value;
    },
    setPassword (state, value) {
      state.password = value;
    },
    setUser (state, value) {
      state.user = value;
    },
  },
  getters:{
    isUserLoggedIn:(state)=>()=>{
      return Boolean(state.user)
    }
  },
  actions: {
    setUsername ({commit}, value) {
      commit('setUsername', value);
    },
    setPassword ({commit}, value) {
      commit('setPassword', value);
    },
    setUser ({commit}, value) {
      commit('setUser', value);
    },
  }
})
