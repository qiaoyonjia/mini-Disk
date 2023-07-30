<template>
  <div>
    <v-card class="d-flex flex-column align-center py-5" height="600" width="500" color="#00000060">
      <span class="text-h2 font-weight-medium orange--text darken-2 mb-10">注册</span>
      <div style="width:100%">
        <v-container>
          <v-row justify="center" class="mb-n8">
            <v-col cols="10">
              <v-text-field
                class="input"
                placeholder="请设置用户名"
                v-model="set_username"
                dense
                rounded
                filled
                clearable
                color="black"
                @blur="checkName"
                hint="用户名长度为5至15位"
                background-color="#fafafa7c"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class="mb-n8">
            <v-col cols="10">
              <v-text-field
                class="input"
                color="black"
                placeholder="请输入密码"
                v-model="set_password"
                type="password"
                dense
                rounded
                filled
                clearable
                hint="密码长度为6至18位"
                background-color="#fafafa7c"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class="mb-n8">
            <v-col cols="10">
              <v-text-field
                class="input"
                color="black"
                placeholder="请再次输入密码"
                v-model="set_password_again"
                type="password"
                dense
                rounded
                filled
                clearable
                background-color="#fafafa7c"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center" class="mb-n8">
            <v-col cols="10">
              <v-select class="input" :items="items" color="orange darken-1" label="请选择密保问题" v-model="question" dense></v-select>
            </v-col>
          </v-row>
          <v-row justify="center" class="mb-n8">
            <v-col cols="10">
              <v-text-field
                class="input"
                color="black"
                placeholder="密保答案"
                v-model="answer"
                dense
                rounded
                filled
                clearable
                hint="答案最多20字"
                background-color="#fafafa7c"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="d-flex justify-space-around mt-10">
        <v-btn @click="cancel" width="150" rounded color="blue-grey lighten-4 mr-5">取消</v-btn>
        <v-btn @click="signin" width="150" rounded color="orange darken-1 ml-5">注册</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5"

export default {
  name: "SigninBox",
  data() {
    return {
      //用户设置的用户名
      set_username: "",
      // 用户设置的密码
      set_password: "",
      set_password_again: "",
      // 密保问题列表，用于注册
      items: [],
      // 用户名选择的密保问题
      question: "",
      //密保问题的答案
      answer: ""
    }
  },
  mounted() {
    this.getquestions()
  },
  methods: {
    //请求密保问题列表
    async getquestions() {
      const config = {
        url: "/login/getquestions",
        method: "get"
      }
      const result = await this.$http(config)
      this.items = result.data.data
    },
    //检测用户名
    async checkName() {
      if (/[^1-9A-Za-z]/.test(this.set_username)) {
        this.$store.commit("message", {
          color: "error",
          text: "用户名包含非法字符"
        })
        return
      }
      if (this.set_username.length < 5 || this.set_username > 15) {
        this.$store.commit("message", {
          color: "error",
          text: "用户名长度错误"
        })
        return
      }
      const config = {
        url: "/login/checkname",
        method: "post",
        data: {
          user_name: this.set_username
        }
      }
      const result = await this.$http(config)
      if (result.data.code === 809) {
        this.$store.commit("message", { color: "error", text: "用户名已存在" })
        this.set_username = ""
      }
    },
    //取消注册,关闭注册框
    cancel() {
      this.$emit("cancel")
    },
    //注册
    async signin() {
      if (this.set_username.length < 5 || this.set_username > 15) {
        this.$store.commit("message", {
          color: "error",
          text: "用户名长度错误"
        })
        return
      }
      if (this.set_password !== this.set_password_again) {
        this.$store.commit("message", {
          color: "error",
          text: "两次输入的密码不一致"
        })
        return
      }
      if (this.question == "" || this.answer == "") {
        this.$store.commit("message", {
          color: "error",
          text: "请设置密保问题"
        })
        return
      }
      if (this.answer.length > 20) {
        this.$store.commit("message", {
          color: "error",
          text: "密保答案不可超过20字"
        })
        return
      }
      const config = {
        url: "/login/signin",
        method: "post",
        data: {
          user_name: this.set_username,
          user_password: SparkMD5.hash(this.set_password),
          user_question: this.question,
          user_answer: this.answer,
          mock: "mock"
        }
      }
      const result = await this.$http(config)
      if (result.data.code === 820) {
        //注册成功
        this.cancel()
        this.$store.commit("message", { color: "success", text: "注册成功" })
      } else {
        this.$store.commit("message", {
          color: "error",
          text: result.data.message
        })
      }
    }
  }
}
</script>
