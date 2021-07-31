<template>
  <div
    class="setting"
    :class="{
      dark: $store.state.isDark
    }"
  >
    <v-card
      :dark="$store.state.isDark"
    >
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            lazy-validation
          >
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="选择出生日期"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>

            <v-btn
              color="primary"
              class="mt-2"
              @click="tapEnter"
            >
              确定
            </v-btn>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: "Setting",
    data: () => ({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
    }),
    beforeMount() {
      if(this.$store.state.account.birth) {
        this.date = (new Date(this.$store.state.account.birth - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      }
    },
    methods: {
      tapEnter() {
        this.$axios.post(`/api/setUserInfo`,{
          birth: new Date(this.date).getTime()
        }).then(res => {
          let data = res.data
          switch (data.status) {
            case 'ok':
              this.$store.commit('alert', '保存成功')
              this.$store.commit('updateAccount')
              this.$router.replace('/home')
              break
            default:
              this.$store.commit('alert', data.message)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .setting {
    height: 100%;
    overflow: auto;
    padding: 20px;
    &.dark {
      background-color: #000;
    }
  }
</style>