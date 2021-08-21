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
  import { mapState } from 'vuex'
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
    computed: {
      ...mapState([
        'reloadReocrd',
      ])
    },
    beforeMount() {
      var un = this.getQueryString("u");
      var pwd = this.getQueryString("p");
      if(un&&pwd){
        this.$axios.post('/p/a/login', {
          username: un,
          password: pwd,
          captcha: ''
        }).then(res => {
          console.log(res)
          this.fetchData()
        });
      }else{
        this.fetchData()
      }
    },
    mounted: function() {

    },
    methods: {
      fetchData() {
        this.$axios.get('/api/fetch')
            .then(res => {
              let data = res.data
              switch (data.status) {
                case 'ok':
                  this.list = data.message.reverse() || []
                  break
                case 'err_empty':
                  this.$store.commit('alert', data.message)
                  this.list = []
                  break
                case 'err':
                  this.$store.commit('alert', data.message)
                  break
              }
            })
      },
      getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }

    },
    watch: {
      reloadReocrd() {
        this.fetchData()
      }
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
