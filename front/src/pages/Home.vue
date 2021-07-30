<template>
  <div
    class="home"
    :class="{
      dark: $store.state.isDark
    }"
  >
    <InfantList
      :list="list"
    />
  </div>
</template>

<script>
  import InfantList from "@/views/InfantList";
  export default {
    name: 'Home',
    data() {
      return {
        list: []
      }
    },
    props: {
      drawer: {
        type: Boolean
      }
    },
    components: {
      InfantList
    },
    beforeMount() {
      this.$axios.get('/api/fetch')
        .then(res => {
          let data = res.data
          switch(data.status) {
            case 'ok':
              this.list = data.message
              break
            case 'err':
              this.$store.commit('alert', data.message)
              break
          }
        })
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
