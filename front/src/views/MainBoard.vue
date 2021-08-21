<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      fixed
      :dark="$store.state.isDark"
    >
      <v-sheet
        class="pa-4"
      >
        <v-avatar
          class="mb-4"
          color="grey darken-1"
          size="64"
        ></v-avatar>

        <div>欢迎，{{$store.state.account.username}}</div>
<!--        <div>{{$store.state.account.birth}}</div>-->
      </v-sheet>
      <NavigationList/>

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
  import EditCard from "@/components/EditCard";
  import NavigationList from "@/views/NavigationList";
  export default {
    name: "MainBoard",
    data: () => ({
      drawer: false,
    }),
    components: {
      EditCard,
      NavigationList,
    },
    beforeMount() {
      if(sessionStorage.getItem('openDrawer')) {
        this.drawer = true
      }
      console.log('before mainboard mount')
      var un = this.getQueryString("u");
      var pwd = this.getQueryString("p");
      localStorage.setItem("un",un);
      localStorage.setItem("pwd",pwd);
      console.log(un,pwd);
      this.$store.commit('updateAccount')
      // 关闭一下编辑框
      this.$store.commit('closeEdit')
    },
    watch: {
      drawer(val) {
        if(val) {
          sessionStorage.setItem('openDrawer', true)
        } else {
          sessionStorage.removeItem('openDrawer')
        }
      }
    },
    methods: {
      getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    }
  }
</script>

<style scoped>

</style>