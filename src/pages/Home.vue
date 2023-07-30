<template>
  <div class="home">
    <!-- 蒙版 -->
    <v-dialog v-model="lock_mask" persistent overlay-opacity="0.8" width="800">
      <v-card
        class="pa-10 d-flex flex-column align-center justify-space-around"
        width="800"
        height="450"
        color="rgba(55, 55, 55, 0.5)"
      >
        <img src="@/assets/img/name.png" width="750" />
        <v-text-field
          placeholder="请输入密码"
          type="password"
          color="orange darken-1"
          v-model="password"
        ></v-text-field>
        <v-btn width="150" rounded color="orange darken-1" @click="unlock"
          >解锁</v-btn
        >
      </v-card>
    </v-dialog>
    <!-- 应用栏 -->
    <v-app-bar class="orange darken-1" app clipped-left>
      <v-toolbar-title>
        <h2 style="color:white">mini云盘</h2>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div
        class="app-bar-avatar d-flex justify-center align-center"
        :style="{
          backgroundImage: `url(${$store.state.user.user_avatar})`,
        }"
      >
        <v-icon v-if="!$store.state.user.user_avatar" size="30" color="white"
          >mdi-account-circle</v-icon
        >
      </div>
      <v-btn icon @click="lock">
        <v-icon large color="white">mdi-lock</v-icon>
      </v-btn>
      <v-btn icon @click="quit">
        <v-icon large color="white">mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- 导航栏 -->
    <v-navigation-drawer app clipped width="200" permanent>
      <v-list nav>
        <v-list-item
          v-for="(item, index) of menu"
          :key="index"
          color="orange darken-1"
          link
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- 内容区 -->
    <v-main>
      <v-container fluid>
        <upload></upload>
        <transition name="slide-fade" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "Home",
  data() {
    return {
      //锁屏遮罩
      lock_mask: false,
      //锁屏密码
      password: "",
      //导航菜单
      menu: [
        { icon: "mdi-timeline-text", title: "时光轴", link: "/home/timeline" },
        { icon: "mdi-image", title: "照片管理", link: "/home/image" },
        { icon: "mdi-video", title: "视频管理", link: "/home/video" },
        { icon: "mdi-folder", title: "收藏夹", link: "/home/folder" },
        { icon: "mdi-account-cog", title: "个人设置", link: "/home/profile" },
      ],
    };
  },
  methods: {
    // 退出系统
    quit() {
      this.$store.commit("quit");
      this.$router.push("/login");
    },
    //锁屏
    lock() {
      this.lock_mask = true;
      this.$store.commit("changeLock", "open");
    },
    //解锁
    unlock() {
      if (
        SparkMD5.hash(this.password) !== this.$store.state.user.user_password
      ) {
        this.$store.commit("message", { color: "error", text: "密码错误" });
        this.password = "";
        return;
      } else {
        //关闭锁屏遮罩
        this.lock_mask = false;
        this.password = "";
        //更新状态管理
        this.$store.commit("changeLock", "close");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-bar-avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}
</style>
