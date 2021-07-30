<template>
  <div
    class="home"
    :class="{
      dark: $store.state.isDark
    }"
  >
    <InfantList/>
  </div>
</template>

<script>
  import InfantList from "@/views/InfantList";
  export default {
    name: 'Home',
    props: {
      drawer: {
        type: Boolean
      }
    },
    components: {
      InfantList
    }
  }
</script>
<style lang="scss" scope>
  .home {
    height: 100%;
    overflow: auto;
    padding: 20px 10px;
    &.dark {
      background-color: #000;
    }
  }
</style>
