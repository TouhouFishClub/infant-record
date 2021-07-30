<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="username"
      :counter="20"
      :rules="nameRules"
      label="账号"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      :counter="20"
      :rules="pwdRules"
      label="密码"
      type="password"
      required
    ></v-text-field>
    <v-text-field
      v-model="passwordConfirm"
      :counter="20"
      :rules="pwdConfRules"
      label="再次输入密码"
      type="password"
      required
    ></v-text-field>
    <div class="captcha-container">
      <v-text-field
        v-model="captcha"
        :counter="4"
        :rules="captchaRules"
        label="验证码"
        required
      ></v-text-field>
      <img class="captcha-code" :src="`/p/captcha?_t=${now}`" @click="now = Date.now()">
    </div>

    <v-btn
      :disabled="!valid"
      color="primary"
      class="mt-4"
      @click="validate"
      block
    >
      注册
    </v-btn>

    <v-btn
      color="primary"
      class="mt-2"
      @click="$router.go(-1)"
      outlined
      block
    >
      返回登录
    </v-btn>
  </v-form>
</template>

<script>
  export default {
    name: "Register",
    data: () => ({
      valid: true,
      now: Date.now(),
      username: '',
      nameRules: [
        v => !!v || '必须输入账号',
        v => (v && v.length <= 20) || '账号需要小于20个字符',
      ],
      password: '',
      pwdRules: [
        v => !!v || '必须输入密码',
        v => (v && v.length <= 20) || '密码需要小于20个字符',
      ],
      passwordConfirm: '',
      pwdConfRules: [
        v => !!v || '必须再次输入密码',
        v => (v && v.length <= 20) || '密码需要小于20个字符',
      ],
      captcha: '',
      captchaRules: [
        v => !!v || '必须输入验证码',
        v => (v && v.length <= 4) || '密码需要小于4个字符',
      ],
    }),
    methods: {
      validate () {
        if(this.$refs.form.validate()) {
          this.$axios.post('/p/a/register', {
            username: this.username,
            password: this.password,
            passwordConfirm: this.passwordConfirm,
            captcha: this.captcha
          }).then(res => {
            let data = res.data
            switch (data.status) {
              case 'ok':
                this.$store.commit('alert', data.message)
                this.$router.replace('/login')
                break
              case 'err_captcha':
                this.$store.commit('alert', data.message)
                this.captcha = ''
                this.now = Date.now()
                break
              default:
                this.$store.commit('alert', data.message)
                this.captcha = ''
                this.now = Date.now()
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .captcha-container {
    display: flex;
    align-items: center;
  }

</style>