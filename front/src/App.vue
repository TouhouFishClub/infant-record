<template>
  <div>
    <v-snackbar
      v-model="snackbar.isShow"
      top
    >
      {{ $store.state.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="$store.commit('closeAlert')"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'App',
    data: () => ({
      text: '未知错误',
      screenWidth: document.documentElement.clientWidth,
      screenHeight: document.documentElement.clientHeight,
    }),
    computed: {
      ...mapState([
        'snackbar'
      ])
    },
    beforeMount() {
      this.resize()
      window.onresize = () => {
        this.screenWidth = document.documentElement.clientWidth
        this.screenHeight = document.documentElement.clientHeight
      }
    },
    methods: {
      resize() {

      }
    },
  };
</script>
