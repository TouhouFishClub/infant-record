<template>
  <v-list
    dense
    nav
  >
    <v-list-item-group
      v-model="selectedItem"
      color="primary"
    >
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        @click="$router.replace(item.route)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
  export default {
    name: "NavigationList",
    data () {
      return {
        items: [
          { title: '列表', icon: 'mdi-clipboard-text', route: '/home' },
          { title: '图表', icon: 'mdi-chart-line', route: '/chart' },
          { title: '设置', icon: 'mdi-cog', route: '/setting' },
        ],
        right: null,
        selectedItem: 0,
      }
    },
  }
</script>

<style scoped>

</style>