import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDark: false,
  },
  mutations: {
    tapTheme(state) {
      state.isDark = !state.isDark
    },
  },
  actions: {
  },
  modules: {
  }
})
