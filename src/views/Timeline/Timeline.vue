<template>
  <div>
    <!-- 右击弹出快捷菜单 -->
    <context-menu
      v-if="rightClick_file"
      :offset="offset"
      @file:action="action"
    ></context-menu>
    <!-- 利用.sync修饰符，子组件直接修改父组件数据 -->
    <!-- 点击文件，操作文件 -->
    <file-show v-if="current" :file.sync="current"></file-show>
    <v-timeline dense align-top v-if="files.length">
      <v-timeline-item
        v-for="(items, index) of files"
        :key="index"
        fill-dot
        small
        color="orange darken-1"
      >
        <v-card class="elevation-2">
          <v-card-title class="headline mb-n5">
            {{ items[0].file_time }}
          </v-card-title>
          <v-card-text class="d-flex justify-start align-center flex-wrap">
            <v-card
              v-for="item of items"
              :key="item.file_id"
              hover
              class="rounded-0 mt-5 mr-5"
              @click.right.prevent="rightClick(item)"
              @click="current = item"
            >
              <div
                class="box"
                v-loading="{ src: item.file_mini, type: item.file_type }"
              >
                <img class="img" src="/logo.png" />
                <v-icon class="icon icon-hidden" color="orange darken-1" x-large
                  >mdi-play-circle-outline</v-icon
                >
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  data() {
    return {
      //右键点击的文件
      rightClick_file: null,
      //当前正在展示的文件
      current: null,
      files: [],
      offset: {
        x: "",
        y: "",
      },
      //文档高度
      scroll_height: 0,
      // 可视区域高度
      client_height: 0,
      page: 0,
      //已请求后台全部数据
      isAll: false,
    };
  },
  directives: {
    //图片加载缓慢时先显示占位图，加载完毕后再显示原图
    loading: {
      inserted: (el, binding) => {
        // 原图地址
        const { src, type } = binding.value;
        const img = new Image();
        //监听图片加载完毕
        img.onload = () => {
          el.childNodes[0].src = src;
          //如果是视频类型，显示播放图标
          if (/video/.test(type)) {
            el.childNodes[1].classList.remove("icon-hidden");
          }
        };
        img.src = src;
      },
    },
  },
  async created() {
    // 数据初始化
    this.files = await this.getData();
    //获取文档高度和可视区域高度
    this.$nextTick(() => {
      this.scroll_height = document.documentElement.scrollHeight;
      this.client_height = document.documentElement.clientHeight;
    });
  },
  mounted() {
    // 监听文件操作
    this.$bus.$on("fileHandle", this.fileHandle);
    this.$bus.$on("upload", this.fileUpload);
    window.addEventListener("scroll", this.scroll);
  },
  methods: {
    // 请求数据
    async getData() {
      const config = {
        url: "/data/getTimelineDataLimit",
        method: "get",
        params: {
          page: this.page,
          limit: 5,
        },
      };
      const result = await this.$http(config);
      this.page++;
      return result.data.data;
    },
    //监听鼠标右击事件
    rightClick(item) {
      //获取鼠标点击坐标
      this.offset.x = event.clientX;
      this.offset.y = event.clientY;
      this.rightClick_file = item;
    },
    //文件操作
    fileHandle(params) {
      const { type, file_id, file_memo, file_folder, folder_name } = params;
      switch (type) {
        case "delete":
          // 双循环
          for (let index in this.files) {
            for (let i in this.files[index]) {
              if (this.files[index][i].file_id == file_id) {
                this.files[index].splice(i, 1);
                //如果删除的是当日的最后一个文件，则将整个数组从this.files移除
                if (this.files[index].length == 0) {
                  this.files.splice(index, 1);
                }
                break;
              }
            }
          }
          break;
        case "editMemo":
          for (let index in this.files) {
            for (let i in this.files[index]) {
              if (this.files[index][i].file_id == file_id) {
                this.files[index][i].file_memo = file_memo;
                break;
              }
            }
          }
          break;
        case "deleteFolder":
          for (let index in this.files) {
            for (let i in this.files[index]) {
              if (this.files[index][i].file_folder == folder_name) {
                this.files[index][i].file_folder = "";
                break;
              }
            }
          }
          break;
        case "addFolder":
          for (let index in this.files) {
            for (let i in this.files[index]) {
              if (this.files[index][i].file_id == file_id) {
                this.files[index][i].file_folder = file_folder;
                break;
              }
            }
          }
        default:
          break;
      }
    },
    //监听快捷菜单的操作
    async action(type) {
      switch (type) {
        case "open":
          this.current = this.rightClick_file;
          break;
        case "delete":
          const config = {
            url: "/data/deleteFile",
            method: "delete",
            data: {
              file_id: this.rightClick_file.file_id,
            },
          };
          const result = await this.$http(config);
          if (result.data.code === 808) {
            //将文件操作发布到事件总线
            this.$bus.$emit("fileHandle", {
              type: "delete",
              file_id: this.rightClick_file.file_id,
            });
            this.$store.commit("message", {
              color: "success",
              text: "删除成功",
            });
          } else {
            //删除失败
            this.$store.commit("message", { color: "error", text: "删除失败" });
          }
          break;
        case "download":
          const a = document.createElement("a");
          a.setAttribute("href", this.rightClick_file.file_src);
          a.click(); // 自执行点击事件
          this.$store.commit("message", {
            color: "success",
            text: "已开始下载",
          });
          break;
        case "rename":
          //懒得写了
          break;
        default:
          break;
      }
      //关闭快捷菜单
      this.rightClick_file = null;
    },
    //监听文件上传的回调函数
    fileUpload(params) {
      //当日第一次上传文件
      if (
        this.files.length == 0 ||
        this.files[0][0].file_time !== params[0].file_time
      ) {
        this.files.unshift(params.reverse());
      } else {
        // 当日已经上传过
        this.files[0].unshift(...params.reverse());
      }
    },
    //监听页面滚动的回调函数
    async scroll() {
      if (
        document.documentElement.scrollTop ==
          this.scroll_height - this.client_height &&
        !this.isAll
      ) {
        const result = await this.getData();
        if (result.length == 0) {
          this.isAll = true;
          return;
        }
        for (let item of result) {
          this.files.push(item);
        }
        //获取文档高度和可视区域高度
        this.$nextTick(() => {
          this.scroll_height = document.documentElement.scrollHeight;
          this.client_height = document.documentElement.clientHeight;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 150px;
  width: 150px;
  position: relative;
}
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.icon {
  position: absolute;
  // 播放图标的大小是40px
  top: calc(50% - 20px);
  left: calc(50% - 20px);
}
.icon-hidden {
  display: none !important;
}
</style>
