<template>
  <div class="login d-flex justify-center align-center">
    <!-- 顶部信息栏  -->
    <v-sheet class="bar d-flex justify-end align-center" height="45" color="#0808084d">
      <div class="pt-2 d-flex align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <a v-bind="attrs" v-on="on" href="https://gitee.com/onlypluto/image-cloud-disk"><img src="@/assets/img/github.png"/></a>
          </template>
          <span>代码仓库</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <a v-bind="attrs" v-on="on"><img src="@/assets/img/weixin.png"/></a>
          </template>
          <span>联系维护者</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <a v-bind="attrs" v-on="on" href="https://www.alonepluto.info/free"><img src="@/assets/img/find.png"/></a>
          </template>
          <span>发现更多</span>
        </v-tooltip>
      </div>
    </v-sheet>
    <!-- 对话框 -->
    <login-box v-if="box_type == 'login'" :type.sync="box_type"></login-box>
    <reset-box v-else-if="box_type == 'reset'" @cancel="box_type = 'login'"></reset-box>
    <signin-box v-else @cancel="box_type = 'login'"></signin-box>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      //控制对话框的切换
      box_type: "login"
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background-image: url("../assets/img/bg.jpg");
  background-size: cover;
}
//顶部信息栏
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  img {
    margin: 0px 15px;
    height: 28px;
    width: 28px;
  }
}
</style>
