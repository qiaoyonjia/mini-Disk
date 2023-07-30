<template>
  <div>
    <v-card class="pa-5" height="600" width="500" color="#00000060">
      <v-container>
        <v-row>
          <v-col class="d-flex justify-center">
            <span class=" text-h2 font-weight-medium orange--text darken-2"
              >重置密码</span
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-stepper v-model="el" width="100%" style="background-color:#0000">
              <v-stepper-header class="header">
                <v-stepper-step
                  :complete="el > 1"
                  step="1"
                  color="orange darken-1"
                >
                  用户名
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step
                  :complete="el > 2"
                  step="2"
                  color="orange darken-1"
                >
                  密保问题
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3" color="orange darken-1">
                  重置密码
                </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-sheet
                    color="#0000"
                    width="90%"
                    height="300"
                    class="mx-auto d-flex flex-column justify-space-around align-center"
                  >
                    <div>
                      <v-text-field
                        placeholder="请输入用户名"
                        v-model="username"
                        dense
                        clearable
                        filled
                        rounded
                        background-color="#fafafa7c"
                      ></v-text-field>
                    </div>
                    <div>
                      <v-btn
                        @click="cancel"
                        width="150"
                        rounded
                        color="blue-grey lighten-4"
                        class="mr-2"
                        >取消</v-btn
                      >
                      <v-btn
                        @click="completeOne"
                        width="150"
                        rounded
                        color="orange darken-1"
                        >下一步</v-btn
                      >
                    </div>
                  </v-sheet>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-sheet
                    color="#0000"
                    width="90%"
                    height="300"
                    class="mx-auto d-flex flex-column justify-space-around align-center"
                  >
                    <span class="text-h4">{{ question }}？</span>
                    <div>
                      <v-text-field
                        placeholder="请输入答案"
                        v-model="resetpassword_answer"
                        dense
                        filled
                        rounded
                        clearable
                        background-color="#fafafa7c"
                      ></v-text-field>
                    </div>
                    <div>
                      <v-btn
                        @click="cancel"
                        width="150"
                        rounded
                        color="blue-grey lighten-4"
                        class="mr-2"
                        >取消</v-btn
                      >
                      <v-btn
                        @click="completetwo"
                        width="150"
                        rounded
                        color="orange darken-1"
                        >下一步</v-btn
                      >
                    </div>
                  </v-sheet>
                </v-stepper-content>
                <v-stepper-content step="3">
                  <v-sheet
                    color="#0000"
                    width="90%"
                    height="300"
                    class="mx-auto d-flex flex-column justify-space-around align-center"
                  >
                    <div>
                      <v-text-field
                        placeholder="请输入密码"
                        v-model="set_password"
                        type="password"
                        dense
                        color="black"
                        filled
                        rounded
                        clearable
                        background-color="#fafafa7c"
                        hint="密码长度为6至18位"
                      ></v-text-field>
                      <v-text-field
                        placeholder="请再次输入密码"
                        v-model="set_password_again"
                        type="password"
                        dense
                        color="black"
                        filled
                        rounded
                        clearable
                        background-color="#fafafa7c"
                      ></v-text-field>
                    </div>
                    <div class=" d-flex justify-space-around">
                      <v-btn
                        @click="cancel"
                        width="130"
                        rounded
                        color="blue-grey lighten-4"
                        class="mr-2"
                        >取消</v-btn
                      >
                      <v-btn
                        @click="reset"
                        width="130"
                        rounded
                        color="orange darken-1"
                        >重置</v-btn
                      >
                    </div>
                  </v-sheet>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";

export default {
  name: "ResetBox",
  data() {
    return {
      el: 1,
      username: "",
      question: "",
      answer: "",
      // 用户输入的答案
      resetpassword_answer: "",
      set_password: "",
      set_password_again: "",
    };
  },
  methods: {
    //取消重置密码,关闭重置密码框
    cancel() {
      this.$emit("cancel");
    },
    //第一步，根据用户输入的用户名，请求密保问题和答案
    async completeOne() {
      if (this.username === "") {
        this.$store.commit("message", {
          color: "error",
          text: "用户名不能为空",
        });
        return;
      }
      const config = {
        url: "/login/getuserquestion",
        method: "get",
        params: {
          user_name: this.username,
        },
      };
      const result = await this.$http(config);
      if (result.data.code === 800) {
        this.question = result.data.data.user_question;
        this.answer = result.data.data.user_answer;
        this.el = 2;
      } else {
        this.$store.commit("message", {
          color: "error",
          text: result.data.message,
        });
      }
    },
    //第二步，验证用户密保问题
    async completetwo() {
      // if (this.answer !== SparkMD5.hash(this.resetpassword_answer)) {
      if (this.answer !== this.resetpassword_answer) {
        this.$store.commit("message", { color: "error", text: "密保答案错误" });
        return;
      }
      this.el = 3;
    },
    //重置密码
    async reset() {
      if (this.set_password !== this.set_password_again) {
        this.$store.commit("message", {
          color: "error",
          text: "两次输入的密码不一致",
        });
        return;
      }
      const config = {
        url: "/login/resetpassword",
        method: "post",
        data: {
          user_name: this.username,
          user_password: SparkMD5.hash(this.set_password),
        },
      };
      const result = await this.$http(config);
      if (result.data.code === 808) {
        //修改成功
        this.type = "login";
        this.reset_type = 1;
        this.resetpassword_answer = "";
        this.set_password = this.set_password_again = "";
        this.$store.commit("message", {
          color: "success",
          text: "密码重置成功",
        });
      } else {
        //修改失败
        this.$store.commit("message", { color: "error", text: "重置密码失败" });
        return;
      }
    },
  },
};
</script>
