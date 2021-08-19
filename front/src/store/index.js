import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDark: false,
    account: {},
    snackbar: {
      isShow: false
    },
    msg: '未知错误',
    editType: 0, //0: 新增，1：更改
    editInfos: {},
    editDialog: false,
    reloadReocrd: 0,

    hasImage: false,
    imgObj: null,
    clearImage: 0,
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
      state.editInfos = {
        ts: Date.now()
      }
      state.editDialog = true
      // console.log('add new record')
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
    reloadReocrd(state) {
      state.reloadReocrd = Date.now()
    },
    updateAccount(state) {
      window.axios.get('/api/user')
        .then(res => {
          if(res.data.status == 'ok') {
            // console.log(res.data.message)
            state.account = res.data.message
          }
        })
    },

    addImage(state, type) {
      state.hasImage = type
    },
    changeImage(state, imgObj) {
      state.imgObj = imgObj
    },
    clearImage(state){
      state.clearImage = Date.now()
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()],
})
