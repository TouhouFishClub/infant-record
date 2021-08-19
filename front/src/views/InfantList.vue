<template>
  <div class="infant-list">
    <v-card :dark="$store.state.isDark" class="pagenation-card top">
      <v-card-text>
        <div class="pagenation-container">
          <v-pagination
            v-model="page"
            :length="pageCount"
            class="main-pagenation"
          ></v-pagination>
          <v-text-field
            class="pagenation-setting"
            :value="itemsPerPage"
            label="每页显示数量"
            type="number"
            min="-1"
            max="50"
            @input="itemsPerPage = parseInt($event, 50)"
          ></v-text-field>
        </div>
      </v-card-text>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="list"
      sort-by="calories"
      class="elevation-1"
      :dark="$store.state.isDark"

      hide-default-footer
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"

      mobile-breakpoint="100"
    >

      <template v-slot:item.ts="{ item }">
        {{ item.ts | timeFmt }}
        <span v-if="$store.state.account.birth">
          (第 {{Math.round((new Date(item.ts).getTime() - $store.state.account.birth) / 24 / 60 / 60 / 1000)}} 天)
        </span>
      </template>


      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-4"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        没有数据
      </template>
    </v-data-table>

    <v-card :dark="$store.state.isDark" class="pagenation-card bottom">
      <v-card-text>
        <div class="pagenation-container">
          <v-pagination
            v-model="page"
            :length="pageCount"
            class="main-pagenation"
          ></v-pagination>
          <v-text-field
            class="pagenation-setting"
            :value="itemsPerPage"
            label="每页显示数量"
            type="number"
            min="-1"
            max="50"
            @input="itemsPerPage = parseInt($event, 50)"
          ></v-text-field>
        </div>
      </v-card-text>
    </v-card>

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
  import formatTime from "@/utils/formatTime.js";
  export default {
    name: "InfantList",
    data: () => ({
      deleteTmp: {},
      deleteDialog: false,

      page: 1,
      pageCount: 0,
      itemsPerPage: 50,
      imgsrc: "111",
      datas: [],
      headers: [
        { text: '时间', value: 'ts'},
        { text: '体重（kg)', value: 'weight' },
        { text: '身高（cm)', value: 'height' },
        { text: '头围', value: 'hc' },
        { text: '备注', value: 'remark', sortable: false },
        { text: '图片', value: 'imgs', sortable: false },
        { text: '操作', value: 'actions', sortable: false },
      ],
    }),
    // computed: {
    //   height () {
    //     switch (this.$vuetify.breakpoint.name) {
    //       case 'xs': return 220
    //       case 'sm': return 400
    //       case 'md': return 500
    //       case 'lg': return 600
    //       case 'xl': return 800
    //     }
    //   },
    // },
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


    filters: {
      timeFmt(data) {
        return data ? formatTime(data, 'fullDateTime') : "";
      }
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
  .pagenation-card {
    &.top {
      margin-bottom: 10px;
    }
    &.bottom {
      margin-top: 10px;
    }
    .pagenation-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .main-pagenation {
        flex-grow: 1;
        text-align: center;
      }
      .pagenation-setting {
        width: 100px;
        min-width: 100px;
        max-width: 100px;
        flex-shrink: 0;
      }
    }
  }

</style>
<style lang="scss">
  //覆盖vuetify样式
  .v-data-table .text-start {
    white-space: nowrap;
  }

</style>