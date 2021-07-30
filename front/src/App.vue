<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      fixed
      :dark="$store.state.isDark"
    >
      2342342

    </v-navigation-drawer>

    <v-app-bar app :dark="$store.state.isDark">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Infant Reocrd</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn icon target="_blank" v-on="on" @click="changeDarkTheme">
            <v-icon>{{$store.state.isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'}}</v-icon>
          </v-btn>
        </template>
        <span>{{$store.state.isDark ? '关闭da♂rk模式' : '开启da♂rk模式'}}</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <router-view :drawer="drawer"></router-view>
    </v-main>

    <v-footer app :dark="$store.state.isDark">
      copyright
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    drawer: false,
    screenWidth: document.documentElement.clientWidth,
    screenHeight: document.documentElement.clientHeight,
  }),
  beforeMount() {
    this.resize()
    window.onresize = () => {
      this.screenWidth = document.documentElement.clientWidth
      this.screenHeight = document.documentElement.clientHeight
    }
  },
  methods: {
    changeDarkTheme() {
      this.$store.commit('tapTheme')
    },
    resize() {

    }
  },
};
</script>
