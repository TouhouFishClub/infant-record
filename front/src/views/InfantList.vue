<template>
  <div class="infant-list">
    <v-data-table
      :headers="headers"
      :items="datas"
      sort-by="calories"
      class="elevation-1"
      :dark="$store.state.isDark"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: "InfantList",
    data: () => ({
      datas: [],
      headers: [
        { text: '时间', sortable: false, value: 'ts'},
        { text: '体重（kg)', value: 'weight' },
        { text: '身高（cm)', value: 'height' },
        { text: '头围', value: 'hc' },
        { text: '备注', value: 'remark' },
        { text: '操作', value: 'actions', sortable: false },
      ],
    }),

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.datas = [{
          id: 1,
          ts: 1627642398523, // 时间戳
          weight: 2.77, //体重（kg)
          height: 133, // 身高（cm)
          hc: 40, // 头围
          remark: '这是备注', // 备注
        }]
      },

      editItem (item) {
        console.log(item)
      },

      deleteItem (item) {
        console.log(item)
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>