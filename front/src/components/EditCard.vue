<template>
  <v-dialog
    v-model="$store.state.editDialog"
    persistent
    max-width="600px"
    :dark="$store.state.isDark"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{['新增信息', '修改信息'][$store.state.editType]}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                label="时间"
                v-model="editInfos.ts"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                label="体重（kg)"
                v-model="editInfos.weight"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                label="身高（cm)"
                v-model="editInfos.height"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                label="头围"
                v-model="editInfos.hc"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
            >
              <v-text-field
                label="备注"
                v-model="editInfos.remark"
                required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
            >
              <SendPicture
                uploadType="emit"
                @upload="uploadImage"
                ref="picContext"
              />
            </v-col>
            <v-col
              cols="12"
            >
              <div class="image-container">
                <div class="image-item-container" v-for="img in imgs">
                  <img :src="`/api/image?d=${img.filename}`"/>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="$store.commit('closeEdit')"
        >
          关闭
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="saveEdit"
        >
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import SendPicture from "@/components/SendPicture";
  export default {
    name: "EditCard",
    data: () => ({
      dialog: true,
      imgs: [],
    }),
    components: {
      SendPicture,
    },
    computed: {
      ...mapState([
        'editDialog',
        'editInfos',
      ])
    },
    methods: {
      uploadImage(img) {
        let data = new FormData();
        data.append("file", img, img.name)
        // console.log(data.get('file'))
        // return axios.post("http://127.0.0.1:8233/file", data, {
        this.$axios.post(`/api/upload_img`, data, {
          headers: { "content-type": "multipart/form-data" }
        })
          .then(res => {
            // console.log(res.data)
            let { filename } = res.data
            this.imgs.push({
              filename,
              ts: Date.now()
            })
            this.$refs.picContext.closePreview()
          })
          .catch(err => {
            this.$refs.picContext.closePreview()
            console.log(err);
          })
      },
      saveEdit() {
        // if(false){
        //   if(this.editInfos.remark){
        //     this.editInfos.remark = this.editInfos.remark + '[img:'+this.editInfos.extra+']'
        //   }else{
        //     this.editInfos.remark = '[img:'+this.editInfos.extra+']'
        //   }
        // }
        this.$axios.post('/api/update', Object.assign(this.editInfos, {imgs: this.imgs}))
          .then(res => {
            let data = res.data
            switch(data.status) {
              case 'ok':
                this.$store.commit('alert', '保存成功')
                this.$store.commit('closeEdit')
                this.$store.commit('reloadReocrd')
                break
              case 'err':
                break
            }
          })
      }
    },
    watch: {
      editDialog (val, old) {
        if(val) {
          if(this.editInfos.imgs) {
            this.imgs = this.editInfos.imgs
          }
        } else {
          this.imgs = []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-container {
    overflow: hidden;
    .image-item-container {
      width: 100px;
      height: 100px;
      border: 1px solid #ddd;
      float: left;
      position: relative;
      margin-left: 10px;
      margin-bottom: 10px;
      img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
    }
  }

</style>