<template>
  <div>
    <file-show v-if="file" :file.sync="file"></file-show>
    <v-card>
      <v-card-title>
        <h1>数据列表</h1>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" color="orange darken-1" append-icon="mdi-magnify" label="表内查询" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="file_list_computed"
        :items-per-page="5"
        class="elevation-1"
        show-select
        :search="search"
        checkbox-color="orange darken-1"
      >
        <template v-slot:item.file_size="{ item }">
          <div>
            <span>{{ item.file_size | formatSize }}MB</span>
          </div>
        </template>
        <template v-slot:item.file_mini="{ item }">
          <div
            class="ma-1 d-flex justify-center align-center"
            :style="{
              height: '80px',
              width: '80px',
              backgroundImage: `url(${item.file_mini})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }"
          >
            <v-icon v-if="/video/.test(item.file_type)" color="orange">mdi-play-circle-outline</v-icon>
          </div>
        </template>
        <template v-slot:item.handle="{ item }">
          <div class="d-flex justify-start align-center">
            <v-btn fab small elevation="0" class="mr-5" @click="file = item">
              <v-icon color="blue accent-4">mdi-folder-open</v-icon>
            </v-btn>
            <v-btn fab small elevation="0" @click="deleteFile(item.file_id)">
              <v-icon color="red">mdi-delete-forever</v-icon>
            </v-btn>
          </div>
        </template>
        <template v-slot:body.append v-if="selected.length !== 0">
          <v-btn @click="bulkDelete" class="mt-3 mb-3 ml-4" color="orange darken-1">批量删除</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "FileTable",
  data() {
    return {
      // 打开的文件
      file: null,
      //被选中的文件
      selected: [],
      //过滤
      search: ""
    }
  },
  props: {
    file_list: Array,
    headers: Array
  },
  computed: {
    file_list_computed: function() {
      return this.file_list
    }
  },
  methods: {
    async deleteFile(file_id) {
      const config = {
        url: "/data/deleteFile",
        method: "delete",
        data: {
          file_id
        }
      }
      const result = await this.$http(config)
      if (result.data.code === 808) {
        this.$store.commit("message", { color: "success", text: "删除成功" })
        //将删除操作发布到事件总线
        this.$bus.$emit("fileHandle", { type: "delete", file_id })
        //删除表格中的文件
        for (let index in this.file_list_computed) {
          if (this.file_list_computed[index].file_id == file_id) {
            this.file_list_computed.splice(index, 1)
          }
        }
      } else {
        //删除失败
        this.$store.commit("message", { color: "error", text: "删除失败" })
      }
    },
    //批量删除
    async bulkDelete() {
      let file_list = []
      for (let item of this.selected) {
        file_list.push(item.file_id)
      }
      const config = {
        url: "/data/bulkDelete",
        method: "delete",
        data: {
          file_list
        }
      }
      const result = await this.$http(config)
      this.$store.commit("message", { color: "success", text: "删除成功" })
      for (let item of result.data.data) {
        //将删除操作发布到事件总线
        this.$bus.$emit("fileHandle", { type: "delete", file_id: item })
        //删除表格中的文件
        for (let index in this.file_list_computed) {
          if (this.file_list_computed[index].file_id == item) {
            this.file_list_computed.splice(index, 1)
          }
        }
      }
      //重置选择列表
      this.selected = []
    }
  }
}
</script>
