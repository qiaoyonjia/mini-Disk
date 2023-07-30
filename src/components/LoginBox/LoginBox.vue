<template>
  <div>
    <v-card
      class="d-flex flex-column justify-space-around align-center"
      height="600"
      width="500"
      color="#00000060"
    >
      <v-container fluid>
        <v-row class="mb-12">
          <v-col><img src="@/assets/img/name.png" width="450px"/></v-col>
        </v-row>
        <v-row justify="center" class="mb-n8">
          <v-col cols="8">
            <v-text-field
              placeholder="请输入用户名"
              dense
              v-model="username"
              filled
              rounded
              background-color="#fafafa7c"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="8">
            <v-text-field
              placeholder="请输入密码"
              type="password"
              dense
              filled
              rounded
              background-color="#fafafa7c"
              v-model="password"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" class="d-flex justify-center">
            <v-btn @click="login" width="150" rounded color="orange darken-1"
              >登录</v-btn
            >
          </v-col>
        </v-row>
        <v-row class="mt-10">
          <v-col class="d-flex justify-center">
            <a @click="tosignin">注册</a>
          </v-col>
          <v-col class="d-flex justify-center">
            <a @click="toreset">忘记密码</a>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";

export default {
  name: "LoginBox",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  props: {
    type: String,
  },
  methods: {
    // 跳转至登录页
    tosignin() {
      this.$emit("update:type", "signin");
    },
    // 跳转至重置密码页
    toreset() {
      this.$emit("update:type", "reset");
    },
    //登录
    async login() {
      if (this.username === "" || this.password === "") {
        this.$store.commit("message", {
          color: "error",
          text: "用户名或密码不能为空",
        });
        return;
      }
      const config = {
        url: "/login/login",
        method: "post",
        data: {
          user_name: this.username,
          user_password: SparkMD5.hash(this.password),
        },
      };
      //发送网络请求
      const result = await this.$http(config);
      switch (result.data.code) {
        case 802:
          //登录成功
          this.$store.commit("login", {
            user: result.data.data.user,
            token: result.data.data.token,
            folders: result.data.data.folders,
          });
          localStorage.setItem("token", result.data.data.token);
          //跳转到home页
          this.$router.push("/home/timeline");
          this.$store.commit("message", {
            color: "success",
            text: "欢迎来到miss云盘",
          });
          break;
        case 803:
          //无此用户
          this.$store.commit("message", {
            color: "error",
            text: "用户不存在，请前往注册页",
          });
          break;
        case 804:
          // 密码错误
          this.$store.commit("message", { color: "error", text: "密码错误" });
          break;
        default:
          break;
      }
    },
  },
};
</script>
