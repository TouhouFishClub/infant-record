<template>
  <div class="infant-list">
    <v-data-table
      :headers="headers"
      :items="list"
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
        没有数据
      </template>
    </v-data-table>
    <v-dialog
      v-model="deleteDialog"
      width="500"
      :dark="$store.state.isDark"
    >
      <v-card>
        <v-card-title class="text-h5">
          删除确认
        </v-card-title>

        <v-card-text class="pt-4">
          删除数据后无法恢复，是否删除
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="enterDelete"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "InfantList",
    data: () => ({
      deleteTmp: {},
      deleteDialog: false,
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
    props: {
      list: {
        type: Array
      }
    },
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
        this.$store.commit('editRecord', item)
      },

      deleteItem (item) {
        console.log(item)
        this.deleteTmp = item
        this.deleteDialog = true
      },
      enterDelete() {
        this.$axios.post(`/api/remove`, this.deleteTmp)
          .then(res => {
            let data = res.data
            switch(data.status) {
              case 'ok':
                this.deleteDialog = false
                this.$store.commit('alert', '删除成功')
                this.$store.commit('reloadReocrd')
                break
              case 'err':
                break
            }
          })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>