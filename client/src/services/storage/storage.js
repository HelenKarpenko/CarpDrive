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
    setUser ({commit}, value) {
      commit('setUser', value);
    },
  }
})
