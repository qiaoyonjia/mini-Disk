<template>
  <div>
    <!-- 添加到收藏夹对话框 -->
    <v-dialog v-model="dialog1" width="400" hide-overlay>
      <v-card class="d-flex flex-column justify-space-around align-center pt-10 pb-10" height="500" width="400">
        <span class="orange--text darken-1 text-h4">加入到收藏夹</span>
        <v-icon size="100" color="orange lighten-3">mdi-folder</v-icon>
        <div style="width:80%">
          <v-select :items="$store.state.folders" color="orange darken-1" item-color="orange darken-1" label="请选择收藏夹" v-model="folder" dense></v-select>
        </div>
        <div class="d-flex justify-space-around">
          <v-btn @click="dialog1 = false" width="130" rounded color="blue-grey lighten-4 mr-5">取消</v-btn>
          <v-btn @click="addFolder" width="130" rounded color="orange darken-1 ">加入</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除对话框 -->
    <v-dialog v-model="dialog2" width="400" hide-overlay>
      <v-card class="d-flex flex-column justify-space-around align-center pt-10 pb-10" height="300" width="400">
        <span class="orange--text darken-1 text-h4">确定删除吗？</span>
        <div class="d-flex justify-space-around">
          <v-btn @click="dialog2 = false" width="110" rounded color="blue-grey lighten-4 mr-5">取消</v-btn>
          <v-btn @click="deleteFile" width="110" rounded color="orange darken-1">确定</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-overlay>
      <div class="d-flex align-center justify-center" @click.self="outClick" style="width:100vw;height:100vh">
        <v-card class="rounded-0 d-flex align-center" height="45vw" width="85vw" color="#000000a4">
          <v-icon class="close-icon" color="red" tag="button" @click="outClick">
            mdi-close-circle
          </v-icon>
          <v-img v-if="/image/.test(file_data.file_type)" :src="file_data.file_src" width="70%" height="100%" contain></v-img>
          <video v-if="/video/.test(file_data.file_type)" controls :src="file_data.file_src" width="70%" height="100%"></video>
          <div class="content">
            <div class="d-flex flex-column justify-center align-center" style="height:50%">
              <!-- 上引号 -->
              <div style="width:100%">
                <v-icon color="#bdbdbd" size="50" style="transform: rotate(180deg)">mdi-format-quote-close</v-icon>
              </div>
              <h2 v-if="!dialog3" @dblclick="dialog3 = true">
                {{ file_data.file_memo || "无备忘" }}
              </h2>
              <div v-else style="height:80px;width:90%">
                <v-text-field
                  v-model="memo"
                  autofocus
                  placeholder="请填写备忘，最大不超过50字"
                  color="orange darken-1"
                  counter="50"
                  @keydown.enter="editMemo"
                  @blur="editMemo"
                ></v-text-field>
              </div>
              <!-- 下引号 -->
              <div class="d-flex justify-end" style="width:100%">
                <v-icon color="#bdbdbd" size="50">mdi-format-quote-close</v-icon>
              </div>
            </div>
            <div class="d-flex flex-column justify-end align-center">
              <div class="file-info d-flex flex-column align-start">
                <span
                  >名称：<span>{{ file_data.file_name }}</span></span
                >
                <span
                  >照片大小：<span>{{ file_data.file_size | formatSize }}MB</span></span
                >
                <span
                  >上传时间：<span>{{ file_data.file_time }}</span></span
                >
                <span
                  >收藏夹：<span>{{ file_data.file_folder }}</span></span
                >
              </div>
              <div class=" mb-10 d-flex justify-space-around align-center" style="width:80%">
                <v-btn small fab color="red darken-3" @click="dialog2 = true">
                  <v-icon>
                    mdi-delete-forever
                  </v-icon>
                </v-btn>
                <v-btn small fab color="blue accent-4" @click="dialog1 = true">
                  <v-icon>
                    mdi-folder
                  </v-icon>
                </v-btn>
                <v-btn small fab color="green darken-3" @click="downloadFile">
                  <v-icon>
                    mdi-download
                  </v-icon>
                </v-btn>
                <v-btn small fab color="orange darken-1" @click="dialog3 = true">
                  <v-icon>
                    mdi-lead-pencil
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script>
export default {
  name: "FileShow",
  data() {
    return {
      //加入收藏夹对话框
      dialog1: false,
      //删除对话框
      dialog2: false,
      //编辑备忘对话框
      dialog3: false,
      //备忘
      memo: "",
      //文件加入的收藏夹名称
      folder: ""
    }
  },
  props: {
    file: Object
  },
  computed: {
    file_data: function() {
      return this.file
    }
  },
  mounted() {
    //页面滚动时，关闭文件展示组件
    window.addEventListener("scroll", this.outClick)
  },
  methods: {
    // 利用.self修饰符，点击图片外部，关闭组件
    outClick() {
      //子组件直接修改父组件，利用.sync修饰符
      this.$emit("update:file", null)
    },
    //删除
    async deleteFile() {
      const config = {
        url: "/data/deleteFile",
        method: "delete",
        data: {
          file_id: this.file.file_id
        }
      }
      const result = await this.$http(config)
      if (result.data.code === 808) {
        //删除成功，关闭文件展示窗口
        this.$emit("update:file", null)
        //将文件操作发布到事件总线
        this.$bus.$emit("fileHandle", { type: "delete", file_id: this.file.file_id })
        this.$store.commit("message", { color: "success", text: "删除成功" })
      } else {
        //删除失败
        this.$store.commit("message", { color: "error", text: "删除失败" })
      }
    },
    //下载
    downloadFile() {
      const a = document.createElement("a")
      a.setAttribute("href", this.file.file_src)
      a.click() // 自执行点击事件
      this.$store.commit("message", { color: "success", text: "已开始下载" })
    },
    //加入收藏夹
    async addFolder() {
      if (this.folder == this.file_data.file_folder) {
        // 没有改变，直接关闭
        this.dialog1 = false
        this.$store.commit("message", { color: "error", text: "该文件已在此收藏夹中，操作无效" })
        return
      }
      const config = {
        url: "/data/addFolder",
        method: "post",
        data: {
          file_id: this.file_data.file_id,
          file_folder: this.folder
        }
      }
      const result = await this.$http(config)
      if (result.data.code === 808) {
        this.$store.commit("message", { color: "success", text: "已加入收藏夹" })
        // 修改文件的收藏夹
        this.file_data.file_folder = this.folder
        // 将修改收藏夹的操作发布到事件总线
        this.$bus.$emit("fileHandle", {
          type: "addFolder",
          file_id: this.file.file_id,
          file_folder: this.folder
        })
      } else {
        this.$store.commit("message", { color: "error", text: "操作失败" })
      }
      this.dialog1 = false
    },
    //编写备忘
    async editMemo() {
      if (this.memo.length == 0) {
        this.dialog3 = false
        this.$store.commit("message", { color: "error", text: "备忘内容为空" })
        return
      }
      if (this.memo.length > 50) {
        this.$store.commit("message", { color: "error", text: "备忘字数不可超过50字" })
        return
      }
      //修改服务器，fileshow，修改父组件
      const config = {
        url: "/data/editMemo",
        method: "put",
        data: {
          file_id: this.file_data.file_id,
          file_memo: this.memo
        }
      }
      const result = await this.$http(config)
      if (result.data.code === 808) {
        this.$store.commit("message", { color: "success", text: "备忘编辑成功" })
        this.file_data.file_memo = this.memo
        //将文件操作发布到事件总线
        this.$bus.$emit("fileHandle", {
          type: "editMemo",
          file_id: this.file.file_id,
          file_memo: this.memo
        })
      } else {
        this.$store.commit("message", { color: "error", text: "备忘编写失败" })
      }
      this.dialog3 = false
    }
  }
}
</script>

<style lang="scss" scoped>
.close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
}
.content {
  overflow: hidden;
  width: 30%;
  height: 100%;
  padding: 0px 10px;
  border-left: 2px black solid;
}
.file-info {
  width: 100%;
  margin-bottom: 50px;
  span {
    margin: 5px 0px;
    color: #bdbdbd;
    span {
      color: var(--theme-color);
    }
  }
}
</style>
