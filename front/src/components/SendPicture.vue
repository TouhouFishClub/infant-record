<template>
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
    <div v-if="imagePre" class="image-preview">
      <div class="img-box">
        <div class="img-container">
          <img :src="imagePre">
          <v-btn class="close" fab dark small depressed color="red" @click="deleteFile">
            <v-icon dark>mdi-close</v-icon>
          </v-btn>
          <template v-if="uploadType == 'emit'">
            <v-btn v-if="pending" class="upload rotate" fab dark small depressed color="green">
              <v-icon dark>mdi-loading</v-icon>
            </v-btn>
            <v-btn v-else class="upload" fab dark small depressed color="green" @click="uploadFile">
              <v-icon dark>mdi-cloud-upload</v-icon>
            </v-btn>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import Exif from "exif-js/exif"
  export default {
    name: "SendPicture",
    data() {
      return {
        imagePre: '',
        imgData: null,
        pending: false
      }
    },
    props: {
      /*
      * uploadType:
      * [ normal ] 组件显示图片，并通过store传参
      * [ emit   ] 将图片以emit方式传输给父组件
      * */
      uploadType: {
        type: String,
        default: 'normal'
      },
    },
    computed: {
      ...mapState([
        'actionGroupId',
        'clearImage',
      ])
    },
    methods: {
      deleteFile() {
        if(this.pending) {
          return
        }
        this.$refs.fileInput.value = ''
        this.imagePre = ''
        this.$store.commit('addImage', false)
      },
      selectImage() {
        if(this.pending) {
          return
        }
        this.$refs.fileInput.click()
      },
      updateImage() {
        let input = this.$refs.fileInput
        let file = input.files[0]
        let Orientation
        Exif.getData(file, () => {
          Orientation = Exif.getTag(file, 'Orientation')
          const reader = new FileReader()
          let dataUrl = reader.readAsDataURL(file)
          reader.onload = ()=>{
            if(file.type == 'image/jpeg' || file.type == 'image/png') {
              this.compressDataURL(reader.result, file.type, Orientation, 0.7, newDataURL => {
                let newBlob = this.dataURLtoBlob(newDataURL)
                let fileOfBlob = new File([newBlob], file.name.replace('.', `${Date.now()}.`))
                const reader2 = new FileReader()
                reader2.readAsDataURL(fileOfBlob)
                reader2.onload = () => {
                  this.imagePre = reader2.result
                  this.execImage(fileOfBlob)
                }
              });
            } else {
              this.imagePre = reader.result
              this.execImage(this.$refs.fileInput.files[0])
            }
          }
        })
      },
      execImage(fileData) {
        switch(this.uploadType) {
          case 'normal':
            this.$store.commit('addImage', true)
            this.$store.commit('changeImage', fileData)
            break;
          case 'emit':
            this.imgData = fileData
            break;
        }
      },
      uploadFile(){
        this.$emit('upload', this.imgData)
        this.changePending()
      },
      changePending() {
        this.pending = true
      },
      closePreview() {
        this.pending = false
        this.imagePre = ''
      },
      rotateImg (img, direction,canvas,ratio, level) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null)return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height / ratio;
        let width = img.width / ratio;
        let step = 2;
        if (step == null) {
          step = min_step;
        }
        switch(direction) {
          case 'right':
            step ++
            step > max_step && (step = min_step);
            break
          case 'left':
            step--;
            step < min_step && (step = max_step);
            break
          case 'right-2':
            step += 2
            step > max_step && (step = min_step);
            break
          case 'normal':
            break
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180;
        let ctx = canvas.getContext('2d');
        // console.log('=====step=====')
        // console.log(step)
        switch (step) {
          case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            break;
          case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height, width, height);
            break;
          case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height, width, height);
            break;
          case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0, width, height);
            break;
        }
        let ndata = canvas.toDataURL('image/jpeg', level);
        canvas.width = canvas.height = 0;
        return ndata;
      },
      compressDataURL (dataURL, type, Orientation, level, callback) {
        let img = new Image()
        img.src = dataURL
        img.onload = () => {
          let canvas = document.createElement("canvas")
          let ctx = canvas.getContext('2d')

          let width = img.width
          let height = img.height
          let ratio;
          if ((ratio = width * height / 1000000) > 1) {
            ratio = Math.sqrt(ratio)
            width /= ratio
            height /= ratio
          }
          // alert(Orientation)
          // console.log('======= Orientation =======')
          // console.log(Orientation)
          // 暂时屏蔽非ios图片旋转（至少小米手机Orientation不对）
          if(Orientation && Orientation != "" && Orientation != 1 && /iphone|ipod|ipad|ios/.test(navigator.userAgent.toLowerCase())){
            /* 根据压缩的图片创建新的image */
            switch(Orientation){
              case 6://需要顺时针（向左）90度旋转
                callback(this.rotateImg(img,'left',canvas,ratio, level))
                break
              case 8://需要逆时针（向右）90度旋转
                callback(this.rotateImg(img,'right',canvas,ratio, level))
                break
              case 3://需要180度旋转
                callback(this.rotateImg(img,'right-2',canvas,ratio, level))
                break
            }
          } else {
            canvas.width = width
            canvas.height = height
            //进行最小压缩
            ctx.drawImage(img, 0, 0, width, height)
            let ndata = canvas.toDataURL('image/jpeg', level)
            canvas.width = canvas.height = 0
            callback(ndata)
          }
        }
      },
      dataURLtoBlob (dataURL) {
        let binaryString = atob(dataURL.split(',')[1]);
        let arrayBuffer = new ArrayBuffer(binaryString.length);
        let intArray = new Uint8Array(arrayBuffer);
        let mime = dataURL.split(',')[0].match(/:(.*?);/)[1]
        for (let i = 0, j = binaryString.length; i < j; i++) {
          intArray[i] = binaryString.charCodeAt(i);
        }
        let data = [intArray];
        let result;
        try {
          result = new Blob(data, { type: mime });
        } catch (error) {
          window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder
          if (error.name === 'TypeError' && window.BlobBuilder){
            var builder = new BlobBuilder()
            builder.append(arrayBuffer)
            result = builder.getBlob(type)
          } else {
            alert('不支持blob')
            throw new Error('暂不支持')
          }
        }
        return result;
      }
    },
    watch: {
      clearImage() {
        this.deleteFile()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .send-pic {
    padding: 0 10px;
    position: relative;
    .image-preview {
      position: absolute;
      top: -155px;
      width: 150px;
      height: 150px;
      .img-box {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 10px;
        background: rgba(0,0,0,.5);
        .img-container {
          width: 100%;
          height: 100%;
          position: relative;
          &:before {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-top-color: rgba(0,0,0,.5);
            position: absolute;
            bottom: -30px;
            left: 5px;
          }
          .close {
            position: absolute;
            right: -30px;
            top: -30px;
          }
          .upload {
            position: absolute;
            right: -30px;
            top: 20px;
            &.rotate {
              animation: rotate 500ms linear infinite;
            }
          }
          img {
            max-width: 100%;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }

  }
</style>