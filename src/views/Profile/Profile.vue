<template>
  <div class="profile d-flex justify-center">
    <v-card
      v-if="type == 'info_box'"
      class="mt12 pt-12 pl-12 pr-12 d-flex flex-column align-center"
      width="500"
      height="600"
      color="orange darken-1"
    >
      <!-- 头像 -->
      <div class="avatar">
        <div
          v-if="$store.state.user.user_avatar"
          class="avatar"
          :style="{
            backgroundImage: `url(${user_avatar})`,
          }"
        ></div>
        <v-icon v-else size="100" color="grey darken-4"
          >mdi-account-circle</v-icon
        >
        <v-file-input
          v-model="avatar_file"
          style="display:none"
          id="avatar-input"
          accept="image/*"
          @change="toUpload"
        ></v-file-input>
      </div>
      <!-- 用户信息 -->
      <div class="profile-info d-flex flex-column  mt-12 mb-12 pl-10">
        <span
          >用户名：<span>{{ $store.state.user.user_name }}</span></span
        >
        <span
          >注册时间：<span>{{ $store.state.user.register_time }}</span></span
        >
        <span
          >密保问题：<span>{{ $store.state.user.user_question }}</span></span
        >
        <span
          >密保答案：<span>{{ $store.state.user.user_answer }}</span></span
        >
      </div>
      <!-- 操作 -->
      <div class="d-flex justify-space-around mt-12" style="width:100%">
        <v-btn key="k1" @click="uploadAvatar">上传头像</v-btn>
        <v-btn key="k2" @click="type = 'password_box'">修改密码</v-btn>
        <v-btn key="k3" @click="toEdit">编辑密保问题</v-btn>
      </div>
    </v-card>
    <!-- 修改密码 -->
    <v-card
      v-else-if="type == 'password_box'"
      width="500"
      height="600"
      class="d-flex flex-column justify-start align-center"
      color="white"
    >
      <h1 class="mt-12 mb-12">修改密码</h1>
      <div style="width:80%" class="mt-12">
        <v-text-field
          color="black"
          placeholder="请输入原密码"
          v-model="old_password"
          type="password"
          dense
          rounded
          filled
          clearable
          hint="密码长度为6至18位"
          background-color="grey lighten-3"
        ></v-text-field>
        <v-text-field
          color="black"
          placeholder="请输入新密码"
          v-model="new_password"
          type="password"
          dense
          rounded
          filled
          clearable
          hint="密码长度为6至18位"
          background-color="grey lighten-3"
        ></v-text-field>
        <v-text-field
          color="black"
          placeholder="请再次输入新密码"
          v-model="new_password_again"
          type="password"
          dense
          rounded
          filled
          clearable
          hint="密码长度为6至18位"
          background-color="grey lighten-3"
        ></v-text-field>
      </div>
      <div class="d-flex justify-center mt-12">
        <v-btn
          key="k4"
          @click="cancel1"
          width="130"
          rounded
          color="blue-grey lighten-4 mr-10"
          >取消</v-btn
        >
        <v-btn
          key="k5"
          @click="changePassword"
          width="130"
          rounded
          color="orange darken-1 ml-10"
          >修改密码</v-btn
        >
      </div>
    </v-card>
    <!-- 编辑密保问题 -->
    <v-card
      v-else
      width="500"
      height="600"
      class=" d-flex flex-column justify-start align-center"
      color="white"
    >
      <h1 class="mt-12 mb-12">编辑密保问题</h1>
      <div style="width:400px">
        <v-select
          :items="items"
          color="orange darken-1"
          label="请选择密保问题"
          v-model="new_question"
          dense
        ></v-select>
        <v-text-field
          color="black"
          placeholder="密保答案"
          v-model="new_answer"
          dense
          rounded
          filled
          clearable
          hint="答案最多20字"
          background-color="grey lighten-3"
        ></v-text-field>
      </div>
      <div class="d-flex justify-center mt-12">
        <v-btn
          key="k6"
          @click="cancel2"
          width="130"
          rounded
          color="blue-grey lighten-4 mr-10"
          >取消</v-btn
        >
        <v-btn
          key="k7"
          @click="editQuestion"
          width="130"
          rounded
          color="orange darken-1 ml-10"
          >提交修改</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
export default {
  name: "Profile",
  data() {
    return {
      avatar_file: null,
      user_avatar: this.$store.state.user.user_avatar,
      type: "info_box",
      //旧密码
      old_password: "",
      new_password: "",
      new_password_again: "",
      //密保
      user_question: this.$store.state.user.user_question,
      user_answer: this.$store.state.user.user_answer,
      new_question: "",
      new_answer: "",
      items: [],
    };
  },
  methods: {
    //上传头像
    async uploadAvatar() {
      const el = document.getElementById("avatar-input");
      el.click();
    },
    //上传到服务器
    async toUpload() {
      const data = new FormData();
      data.append("user_avatar", this.avatar_file);
      const config = {
        url: "/user/uploadAvatar",
        method: "post",
        data,
      };
      const result = await this.$http(config);
      if (result.data.code === 812) {
        this.user_avatar = result.data.user_avatar;
        this.$store.commit("changeAvatar", this.user_avatar);
        this.$store.commit("message", {
          color: "success",
          text: "上传头像成功",
        });
      } else {
        this.$store.commit("message", { color: "error", text: "上传头像失败" });
      }
    },
    //修改密码
    async changePassword() {
      if (
        SparkMD5.hash(this.old_password) !==
        this.$store.state.user.user_password
      ) {
        this.$store.commit("message", { color: "error", text: "原密码错误" });
        return;
      }
      if (this.new_password !== this.new_password_again) {
        this.$store.commit("message", {
          color: "error",
          text: "两次密码输入不一致",
        });
        return;
      }
      const config = {
        url: "/user/changePassword",
        method: "put",
        data: {
          user_password: SparkMD5.hash(this.new_password),
        },
      };
      const result = await this.$http(config);
      if (result.data.code === 808) {
        this.$store.commit("message", { color: "success", text: "修改成功" });
        this.$store.commit("changePassword", SparkMD5.hash(this.new_password));
        this.cancel1();
      } else {
        this.$store.commit("message", { color: "error", text: "修改失败" });
      }
    },
    // 打开编辑密保问题对话框
    async toEdit() {
      this.type = "question_box";
      const config = {
        url: "/login/getquestions",
        method: "get",
      };
      const result = await this.$http(config);
      this.items = result.data.data;
    },
    //编辑密保问题
    async editQuestion() {
      if (
        this.new_question == this.user_question &&
        this.new_answer == this.user_answer
      ) {
        this.$store.commit("message", {
          color: "error",
          text: "未做出任何修改",
        });
        return;
      }
      const config = {
        url: "/user/editQuestion",
        method: "put",
        data: {
          user_question: this.new_question,
          user_answer: this.new_answer,
        },
      };
      const result = await this.$http(config);
      if (result.data.code === 808) {
        this.$store.commit("message", { color: "success", text: "修改成功" });
        this.$store.commit("changeQuestion", {
          question: this.new_question,
          answer: this.new_answer,
        });
        this.cancel2();
      } else {
        this.$store.commit("message", { color: "error", text: "修改失败" });
      }
    },
    cancel1() {
      this.old_password = "";
      this.new_password = "";
      this.new_password_again = "";
      this.type = "info_box";
    },
    cancel2() {
      this.new_question = "";
      this.new_answer = "";
      this.type = "info_box";
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  width: 100%;
  height: 400px;
}
.avatar {
  height: 100px;
  width: 100px;
  border-radius: 50% !important;
  background-position: center;
  background-size: contain;
}
.profile-info {
  width: 100%;
  span {
    font-size: 21px;
    span {
      font-size: 21px;
      color: white;
    }
  }
}
</style>
