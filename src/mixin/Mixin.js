export const Mixin = {
  data() {
    return {
      list: [],
      headers: [
        { text: "文件", value: "file_mini" },
        { text: "名称", value: "file_name" },
        { text: "大小", value: "file_size" },
        { text: "上传时间", value: "file_time" },
        { text: "收藏夹", value: "file_folder" },
        { text: "操作", value: "handle" },
      ],
    };
  },
  mounted() {
    this.init();
    // 监听文件操作
    this.$bus.$on("fileHandle", this.fileHandle);
    this.$bus.$on("upload", this.fileUpload);
  },
  methods: {
    async init() {
      let config;
      if (/image/.test(this.$route.fullPath)) {
        config = {
          url: "/data/getImageData",
          method: "get",
        };
      } else {
        config = {
          url: "/data/getVideoData",
          method: "get",
        };
      }
      const result = await this.$http(config);
      if (result.data.code === 800) {
        this.list = result.data.data;
      } else if (result.data.code === 813) {
        this.$store.commit("message", { color: "primary", text: "数据为空" });
      } else {
        this.$store.commit("message", { color: "error", text: "数据加载失败" });
      }
    },
    //监听删除文件、删除收藏夹、变更收藏夹的文件操作
    fileHandle(params) {
      const { type, file_id, file_memo, file_folder, folder_name } = params;
      switch (type) {
        case "delete":
          for (let index in this.list) {
            if (this.list[index].file_id == file_id) {
              this.list.splice(index, 1);
              break;
            }
          }
          break;
        case "deleteFolder":
          for (let index in this.list) {
            if (this.list[index].file_folder == folder_name) {
              this.list[index].file_folder = "";
              break;
            }
          }
          break;
        case "editMemo":
          for (let index in this.list) {
            if (this.list[index].file_id == file_id) {
              this.list[index].file_memo = file_memo;
              break;
            }
          }
          break;
        case "addFolder":
          for (let index in this.list) {
            if (this.list[index].file_id == file_id) {
              this.list[index].file_folder = file_folder;
              break;
            }
          }
          break;
        default:
          break;
      }
    },
    //监听文件上传的回调
    fileUpload(files) {
      // 遍历上传成功的文件，压入list
      for (let item of files) {
        if (new RegExp(this.type).test(item.file_type)) {
          this.list.unshift(item);
        }
      }
    },
  },
};
