<template>
  <div>
    <v-overlay opacity="0">
      <file-show v-if="file" :file.sync="file"></file-show>
      <v-card v-else class="d-flex" width="80vw" height="45vw" color="grey darken-4">
        <div class="folder-info d-flex justify-center">
          <span class="grey--text lighten-1 text-h3 mt-16">{{ folder }}</span>
          <div class="info-detail">
            <span class="orange--text darken-1 mx-1 font-weight-bold">共计{{ image_counter }}张照片,{{ video_counter }}个视频</span>
          </div>
        </div>
        <div class="folder-content d-flex flex-column">
          <!-- 关闭按钮 -->
          <div class="d-flex justify-end" style="width:100%">
            <v-icon @click="closeFolder" color="red" tag="button">mdi-close-circle</v-icon>
          </div>
          <div class="d-flex flex-wrap">
            <div v-for="(item, index) of files" :key="index" class="item d-flex flex-column align-center">
              <v-card hover class="rounded-0" @click="file = item">
                <div
                  class="d-flex align-center justify-center"
                  :style="{
                    height: '100px',
                    width: '100px',
                    backgroundImage: `url(${item.file_mini})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }"
                >
                  <v-icon v-if="/video/.test(item.file_type)" color="orange" x-large>mdi-play-circle-outline</v-icon>
                </div>
              </v-card>
              <span>{{ item.file_name }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
export default {
  name: "FolderShow",
  data() {
    return {
      //文件列表
      files: [],
      file: null,
      image_counter: 0,
      video_counter: 0
    }
  },
  props: {
    //文件夹名称
    folder: String
  },
  mounted() {
    // 监听文件操作
    this.$bus.$on("fileHandle", this.fileHandle)
    this.init()
  },
  methods: {
    //数据初始化
    async init() {
      const config = {
        url: "/data/getFolderData",
        method: "get",
        params: {
          folder: this.folder
        }
      }
      const result = await this.$http(config)
      this.files = result.data.data.result
      this.image_counter = result.data.data.counter.image
      this.video_counter = result.data.data.counter.video
    },
    //关闭文件夹
    closeFolder() {
      this.$emit("update:folder", null)
    },
    //监听文件删除和修改文件收藏夹的操作
    fileHandle(params) {
      const { type, file_id } = params
      if (type === "delete") {
        for (let index in this.files) {
          if (this.files[index].file_id == file_id) {
            this.files.splice(index, 1)
            break
          }
        }
      } else {
        for (let index in this.files) {
          if (this.files[index].file_id == file_id) {
            this.files.splice(index, 1)
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.folder-info {
  border-right: 1px black solid;
  box-sizing: border-box;
  width: 25%;
  height: 100%;
  padding: 10px;
  position: relative;
  span {
    width: 90%;
  }
  .info-detail {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
.folder-content {
  width: 75%;
  height: 100%;
  padding: 10px;
  overflow: scroll;
}
.item {
  height: 150px;
  width: 150px;
  margin-top: 30px;
  span {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; //显示几行
  }
}
</style>
