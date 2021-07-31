<template>
  <div
    class="charts"
    :class="{
      dark: $store.state.isDark
    }"
  >
    <v-card
      :dark="$store.state.isDark"
    >
      <v-card-text>
        <v-container>
          <span class="text-h5">这是图表页</span>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: "Chart"
  }
</script>

<style lang="scss" scoped>
  .charts {
    height: 100%;
    overflow: auto;
    padding: 20px;
    &.dark {
      background-color: #000;
    }
  }
</style>