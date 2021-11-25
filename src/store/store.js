import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export const store = new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],

  state: {
    loggedin: false,
    userName: '',
    nombreCompleto: '',
    userId: '',
  },

  mutations: {
    entrar (state) {
      state.loggedin = true;
    },
    salir (state) {
        state.loggedin = false;
    },
    setdataUser(state, {nombre_completo, username, userId}){
        state.nombreCompleto = nombre_completo;
        state.userName = username;
        state.userId = userId;
    }
  },

})