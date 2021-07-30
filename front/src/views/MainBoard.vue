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
          <v-btn icon target="_blank" v-on="on" @click="$store.commit('addNewRecord')">
            <v-icon>mdi-clipboard-edit-outline</v-icon>
          </v-btn>
        </template>
        <span>添加记录</span>
      </v-tooltip>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn icon target="_blank" v-on="on" @click="$store.commit('tapTheme')">
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

    <EditCard/>
  </v-app>
</template>

<script>
  import EditCard from "../components/EditCard";
  export default {
    name: "MainBoard",
    data: () => ({
      drawer: false,
    }),
    components: {
      EditCard
    }
  }
</script>

<style scoped>

</style>