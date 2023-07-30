<template>
  <div @click.right.prevent="">
    <v-overlay opacity="0">
      <div
        v-click-outside="outClick"
        :style="{
          zIndex: 100,
          position: 'fixed',
          top: `${y}px`,
          left: `${x}px`
        }"
      >
        <v-list min-width="165" elevation="2" light>
          <v-list-item-group>
            <v-list-item dense v-for="(item, index) of menuList" @click="handle(item.fn)" :key="index" color="orange darken-1">
              <v-list-item-icon>
                <v-icon v-text="item.icon" :color="item.color"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ item.title }}</v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </v-overlay>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  data() {
    return {
      client_width: "",
      client_height: "",
      menuList: [
        { icon: "mdi-folder-open", title: "打开", color: "blue accent-4", fn: "open" },
        { icon: "mdi-rename-box", title: "重命名", color: "orange darken-1", fn: "rename" },
        { icon: "mdi-delete-forever", title: "删除", color: "red darken-3", fn: "delete" },
        { icon: "mdi-cloud-download", title: "下载", color: "green darken-3", fn: "download" }
      ]
    }
  },
  props: {
    offset: Object,
    file: Object
  },
  computed: {
    x: function() {
      if (this.client_width - this.offset.x > 170) {
        return this.offset.x
      } else {
        return this.offset.x - 166
      }
    },
    y: function() {
      if (this.client_height - this.offset.y > 175) {
        return this.offset.y
      } else {
        return this.offset.y - 175
      }
    }
  },
  mounted() {
    // 获取浏览器可视区宽高
    this.client_width = document.documentElement.clientWidth
    this.client_height = document.documentElement.clientHeight
    window.addEventListener("scroll", this.listenerScroll)
  },
  methods: {
    handle(fn) {
      // 提交事件到父组件
      this.$emit("file:action", fn)
    },
    //点击菜单外部，关闭菜单
    outClick() {
      this.$emit("file:action", "close")
      // 移除滚动监听事件
      window.removeEventListener("scroll", this.listenerScroll)
    },
    //监听页面滚动
    listenerScroll() {
      // 关闭菜单
      this.outClick()
    }
  }
}
</script>
