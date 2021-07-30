import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDark: false,
    snackbar: {
      isShow: false
    },
    msg: '未知错误',
    editType: 0, //0: 新增，1：更改
    editInfos: {},
    editDialog: false,
    reloadReocrd: 0
  },
  mutations: {
    tapTheme(state) {
      state.isDark = !state.isDark
    },
    alert(state, msg) {
      state.snackbar.isShow = true
      state.msg = msg
    },
    closeAlert(state) {
      state.snackbar.isShow = false
    },
    addNewRecord(state) {
      state.editType = 0
      state.editInfos = {}
      state.editDialog = true
      console.log('add new record')
    },
    editRecord(state, infos) {
      state.editType = 1
      state.editInfos = infos
      state.editDialog = true
    },
    closeEdit(state) {
      state.editInfos = {}
      state.editDialog = false
    },
    saveEdit(state) {
      console.log(state.editInfos)
    },
    reloadReocrd(state) {
      state.reloadReocrd = Date.now()
    }
  },
  actions: {
  },
  modules: {
  }
})
