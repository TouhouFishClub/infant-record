<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
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
    resize() {

    }
  },
};
</script>
