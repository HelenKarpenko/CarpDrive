import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    accessToken:null,
    refreshToken:null,
    user: null,
  },
  plugins: [
    createPersistedState()
  ],
  mutations: {
    setUser (state, value) {
      state.user = value;
    },
    setAccessToken (state, value) {
      state.accessToken = value;
    },
    setRefreshToken (state, value) {
      state.refreshToken = value;
    },
  },
  getters:{
    isLogged:(state)=>()=>{
      return Boolean(state.user)
    }
  },
  actions: {
    setUser ({commit}, value) {
      commit('setUser', value);
    },
    setAccessToken ({commit}, value) {
      commit('setAccessToken', value);
    },
    setRefreshToken ({commit}, value) {
      commit('setRefreshToken', value);
    },
  }
})
