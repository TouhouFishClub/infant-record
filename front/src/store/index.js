import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDark: false,
    snackbar: false,
    msg: '未知错误',

  },
  mutations: {
    tapTheme(state) {
      state.isDark = !state.isDark
    },
    alert(state, msg) {
      state.snackbar = true
      state.msg = msg
    },
    closeAlert(state) {
      state.snackbar = false
    }
  },
  actions: {
  },
  modules: {
  }
})
