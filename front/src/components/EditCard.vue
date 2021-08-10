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

<div class="send-pic">
<v-btn icon @click="selectImage">
<v-icon>mdi mdi-camera-image</v-icon>
</v-btn>
<input
   type="file"
   name="file"
   accept="image/png,image/gif,image/jpg,image/jpeg"
   ref="fileInput"
   @change="updateImage"
   style="width: 100px; display: none;"
>
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
  export default {
    name: "EditCard",
    data: () => ({
      dialog: true,
    }),
    computed: {
      ...mapState([
        'editDialog',
        'editInfos',
      ])
    },
    methods: {

deleteFile() {
this.$refs.fileInput.value = ''
this.imagePre = ''
this.$store.commit('addImage', false)
},
selectImage() {
  console.log(111)
this.$refs.fileInput.click()
},
updateImage() {
let input = this.$refs.fileInput
let file = input.files[0]
  var data = new FormData();
  data.append("i",file);
  this.$axios.post('http://localhost:3000/upload_img', data)
.then(res => {
let data = res.data
console.log(data)
this.editInfos.extra=(this.editInfos.extra==undefined?'':(this.editInfos.extra+",")) + data.filename
console.log(this.editInfos.extra)
})


},





      saveEdit() {
        if(this.editInfos.extra){
          if(this.editInfos.remark){
            this.editInfos.remark = this.editInfos.remark + '[img:'+this.editInfos.extra+']'
          }else{
            this.editInfos.remark = '[img:'+this.editInfos.extra+']'
          }
        }
        this.$axios.post('/api/update', this.editInfos)
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
    watch() {
      'editDialog'
    }
  }
</script>

<style scoped>

</style>