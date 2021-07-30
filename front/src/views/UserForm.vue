<template>
  <v-app class="main-container">
    <v-card
      class="mx-auto my-auto"
      max-width="344"
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
  }
  .logo {
    margin: 30px auto 0;
    display: block;
  }
</style>