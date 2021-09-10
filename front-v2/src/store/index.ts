import Auth from '../types/authType'
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { AuthStore } from './authStore'
import createPersistedState from "vuex-persistedstate";

interface storeTypes extends Auth {}
export const key: InjectionKey<Store<storeTypes>> = Symbol()

export const store = createStore<storeTypes>({
  modules: {
    AuthStore,
  },
  plugins: [
    createPersistedState()
  ]
})
