<template>
  <v-app>
    <div class="main-container">
      <v-card
          class="mx-auto my-auto"
          min-width="300"
      >
        <Logo
            ref="logo"
            :width="100"
            :height="100"
            :strokeWidth="20"
            class="logo"
        />
        <v-card-text>
          <router-view/>
        </v-card-text>
      </v-card>
      <div class="icp">
        <a href="https://beian.miit.gov.cn/">京ICP备20031747号-1</a>
      </div>
    </div>
  </v-app>
</template>

<script>
  import Logo from "@/components/Logo";
  export default {
    name: "UserForm",
    components: {
      Logo
    },
    mounted() {
      this.$refs.logo.run()
    },
  }
</script>

<style lang="scss" scoped>
  .main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f36392 !important;
    height: 100%;
  }
  .icp {
    width: 100%;
    position: fixed;
    bottom: 20px;
    text-align: center;
    a {
      text-decoration: none;
      font-size: 14px;
      color: #fff;
    }
  }
  .logo {
    margin: 30px auto 0;
    display: block;
  }
</style>
