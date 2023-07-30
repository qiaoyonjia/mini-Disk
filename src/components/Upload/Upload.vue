<template>
  <div class="upload">
    <!-- 上传按钮 -->
    <v-btn fab color="orange darken-1" @click="btnClick">
      <span class="white--text" v-if="uploading"
        >{{ completed_counter }}/{{ files.length }}</span
      >
      <v-icon v-else large color="white">mdi-plus</v-icon>
    </v-btn>
    <v-file-input
      v-model="files"
      style="display:none"
      id="file"
      multiple
      accept="image/*,video/*"
      @change="sheet = true"
    ></v-file-input>
    <!-- 上传列表 -->
    <v-dialog v-model="sheet" width="800">
      <div class="white py-3 d-flex justify-center align-center">
        <span class="text-h4 font-weight-bold">上传列表</span>
      </div>
      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="(item, index) of files"
            :key="item.name"
            color="orange darken-1"
          >
            <div
              class="file d-flex justify-space-between align-center"
              :style="{
                background: completed_file_name.includes(item.name)
                  ? 'linear-gradient(to right, #6aa0fc, #2962ff)'
                  : '',
              }"
            >
              <span>{{ index + 1 }}. {{ item.name }}</span>
              <v-icon @click="deleteItem(index)">mdi-close</v-icon>
            </div>
            <progress-linear
              :complated="percentage"
              :active="item.name == current_file.name ? true : false"
            ></progress-linear>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <div class="bottom d-flex justify-center align-center py-2">
        <template v-if="!uploading">
          <v-btn @click="files = []" class="mr-12" width="150" elevation="0"
            >取消</v-btn
          >
          <v-btn
            @click="upload"
            class="ml-12"
            width="150"
            color="orange"
            elevation="0"
            >开始上传</v-btn
          >
        </template>
        <template v-else>
          <v-btn @click="sheet = false" width="150" elevation="0"
            >后台运行</v-btn
          >
        </template>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { cutBlob, mkMini } from "@/utils/utils";
import SparkMD5 from "spark-md5";
export default {
  name: "Upload",
  data() {
    return {
      //需要上传的文件
      files: [],
      //控制上传列表对话框的显示
      sheet: false,
      //文件夹hash
      hash: SparkMD5.hash(this.$store.state.user.user_id),
      //已完成上传的文件数量
      completed_counter: 0,
      // 已成功上传的文件
      completed_files: [],
      // 已成功上传的文件的文件名
      completed_file_name: [],
      //开始上传
      uploading: false,
      // 当前正在上传的文件
      current_file: {},
      // 当前正在上传的文件已上传的大小
      current_file_loaded: 0,
      //上传百分比
      percentage: 0,
    };
  },
  watch: {
    // 监听files,当用户删除全部上传文件时，关闭组件
    files: function() {
      if (this.files.length === 0) {
        this.sheet = false;
      }
    },
  },
  methods: {
    //监听按钮点击，触发input的click事件
    btnClick() {
      if (this.uploading) {
        this.sheet = true;
        return;
      }
      document.getElementById("file").click();
    },
    //删除文件
    deleteItem(index) {
      this.files.splice(index, 1);
    },
    //上传
    async upload() {
      //开始上传
      this.uploading = true;
      // //上传
      for (let file of this.files) {
        this.current_file = file;
        //文件切片，返回object，包括chunkArr和fileInfo
        let file_chunk = await cutBlob(file);
        //遍历切片数组，上传每个切片
        let promise_arr = file_chunk.chunkArr.map((item, index) => {
          return new Promise(async (resolve, reject) => {
            //构建data，包括切片内容，切片索引和文件夹哈希值
            let data = new FormData();
            data.append("chunk", item);
            data.append("hash", this.hash);
            data.append("index", index);
            const config = {
              url: "/upload/upload",
              method: "post",
              data,
            };
            let last_loaded = 0;
            let result = await this.$http(config, (e) => {
              this.current_file_loaded += e.loaded - last_loaded;
              // 上传进度 因为是分片上传，进度百分比比较难计算，需要增加一个变量last_loaded，还需要判断e.loaded == e.total这种特殊情况
              this.percentage = Math.floor(
                (this.current_file_loaded / file.size) * 100
              );
              if (e.loaded == e.total) {
                last_loaded = 0;
              } else {
                last_loaded = e.loaded;
              }
            });
            if (result.data.code === 812) {
              resolve();
            } else {
              reject();
            }
          });
        });
        let result1 = await Promise.all(promise_arr)
          .then((res) => {
            return "success";
          })
          .catch((reason) => {
            return "fail";
          });
        if (result1 == "fail") {
          this.$store.commit("message", {
            color: "error",
            text: `${file_chunk.fileInfo.name}上传失败`,
          });
          continue;
        }
        //切片全部上传，通知服务器合并切片
        //制作迷你图
        let mini = await mkMini(file);
        const config = {
          url: "/upload/completed",
          method: "post",
          data: {
            hash: this.hash,
            chunkNum: file_chunk.fileInfo.total,
            file_name: file_chunk.fileInfo.name,
            file_size: file_chunk.fileInfo.size,
            file_type: file_chunk.fileInfo.type,
            file_mini: mini,
          },
        };
        let result2 = await this.$http(config);
        if (result2.data.code === 808) {
          this.completed_counter++;
          this.completed_files.push(result2.data.data);
          this.completed_file_name.push(result2.data.data.file_name);
          this.current_file_loaded = 0;
          this.percentage = 0;
        }
      }
      //关闭上传
      this.uploading = false;
      this.$store.commit("message", { color: "success", text: "上传完成" });
      //发布事件
      this.$bus.$emit("upload", this.completed_files);
      this.completed_counter = 0;
      this.files = [];
      this.current_file = {};
      this.completed_files = [];
      this.completed_file_name = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.upload {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10;
}
.bottom {
  background-color: #fff;
  border-top: 1px #cacaca solid;
}
.file {
  height: 90%;
  width: calc(100% - 32px);
  position: absolute;
  z-index: 1;
}
</style>
