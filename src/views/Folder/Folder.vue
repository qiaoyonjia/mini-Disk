<template>
  <div class="folder d-flex flex-wrap">
    <folder-show v-if="folder_click" :folder.sync="folder_click"></folder-show>
    <div class="d-flex flex-column " style="width:inherit">
      <!-- 文件区域 -->
      <div class="d-flex flex-wrap">
        <div
          v-for="(item, index) of folders"
          :key="index"
          :id="item"
          class="folder-box d-flex flex-column align-center mr-10 mt-2"
          draggable
          @click="folder_click = item"
          @dragstart="startDrag(item)"
          @dragend=";(drag_start = false), (delete_zone = false)"
        >
          <v-icon size="80" color="orange lighten-3">mdi-folder</v-icon>
          <span class="text-subtitle-2">{{ item }}</span>
        </div>
        <div @click="dialog = true" class="folder-found d-flex flex-column align-center mr-10 mt-2">
          <v-icon size="80" color="white">mdi-plus</v-icon>
          <span class="grey--text darken-2 text-subtitle-2">新建收藏夹</span>
        </div>
      </div>
      <!-- 删除区域 -->
      <div v-if="delete_zone" @dragenter="enterDeletezone" dropzone class="delete-zone mt-12 d-flex justify-center align-center">
        <v-icon v-if="!drag_start" size="60">mdi-delete-outline </v-icon>
        <v-icon v-else size="60" color="red">mdi-delete-empty-outline </v-icon>
      </div>
    </div>
    <!-- 新建文件夹对话框 -->
    <v-dialog v-model="dialog" width="400" @click:outside="folder_name = ''">
      <v-card class="d-flex flex-column justify-space-around align-center pt-10 pb-10" height="500" width="400" color="#000000a4">
        <span class="orange--text darken-1 text-h3">新建文件夹</span>
        <v-icon size="100" color="orange lighten-3">mdi-folder</v-icon>
        <div style="width:80%">
          <v-text-field placeholder="请输入文件夹名" v-model="folder_name" color="orange darken-1" outlined></v-text-field>
        </div>
        <div class="d-flex justify-space-around">
          <v-btn @click=";(dialog = false), (folder_name = '')" width="130" rounded color="blue-grey lighten-4 mr-5">取消</v-btn>
          <v-btn @click="found" width="130" rounded color="orange darken-1 ">创建</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Folder",
  data() {
    return {
      //文件列表
      folders: "",
      //新建文件夹对话框
      dialog: false,
      //新建的文件夹名称
      folder_name: "",
      //点击文件夹，进入文件夹展示
      folder_click: "",
      //切换拖拽图标
      drag_start: false,
      //当前正在被拖拽的文件
      current_drag: "",
      //控制删除区域的显示
      delete_zone: false
    }
  },
  created() {
    this.folders = this.$store.state.folders
  },
  methods: {
    //创建文件夹
    async found() {
      // 检测文件夹名称-文件名长度大于1且只能包含数字字母和中文
      if (this.folder_name.length == 0 || /[^0-9a-zA-Z\u4e00-\u9fa5]/.test(this.folder_name)) {
        this.$store.commit("message", { color: "error", text: "非法文件名" })
        return
      }
      const config = {
        url: "/data/foundfolder",
        method: "post",
        data: {
          folder_name: this.folder_name
        }
      }
      const result = await this.$http(config)
      if (result.data.code == 808) {
        //创建文件夹成功，更新store里的数据
        this.$store.commit("updateFolder", this.folder_name)
        this.$store.commit("message", { color: "success", text: "创建收藏夹成功" })
        //关闭创建文件夹对话框
        this.dialog = false
        this.folder_name = ""
      } else {
        this.$store.commit("message", { color: "error", text: result.data.message })
      }
    },
    //开始拖拽
    startDrag(item) {
      setTimeout(() => {
        this.drag_start = true
      }, 200)
      this.delete_zone = true
      this.current_drag = item
    },
    //拖拽文件到删除区域
    async enterDeletezone() {
      const config = {
        url: "/data/deleteFolder",
        method: "delete",
        data: {
          folder_name: this.current_drag
        }
      }
      const result = await this.$http(config)
      if (result.data.code === 808) {
        this.$store.commit("deleteFolder", this.current_drag)
        this.$store.commit("message", { color: "success", text: "删除收藏夹成功" })
        this.$bus.$emit("fileHandle", { type: "deleteFolder", folder_name: this.current_drag })
      } else {
        this.$store.commit("message", { color: "error", text: "删除收藏夹失败" })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.folder {
  width: 100%;
}
.folder-box {
  width: 110px;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: #eeeded;
  }
  border-radius: 4px;
  span {
    width: 100%;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; //显示几行
  }
}
.folder-found {
  width: 110px;
  padding: 5px;
  cursor: pointer;
  background-color: #eeeded;
  &:hover {
    background-color: #cecdcd;
  }
  border-radius: 4px;
}
.delete-zone {
  width: 100%;
  height: 100px;
  border: 2px red dashed;
}
</style>
