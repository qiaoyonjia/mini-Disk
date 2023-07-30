import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: {},
    folders: [],
    token: null,
    snackbar: false,
    snackbar_timeout: 3000,
    snackbar_color: "",
    snackbar_text: "",
    lock_status: "close",
  },
  mutations: {
    //登录
    login(state, payload) {
      state.user = payload.user;
      state.token = payload.token;
      state.folders = payload.folders;
    },
    // 通知
    message(state, payload) {
      state.snackbar = true;
      state.snackbar_color = payload.color;
      state.snackbar_text = payload.text;
    },
    // 退出
    quit(state) {
      state.user = null;
      // state.token = null
      localStorage.removeItem("token");
    },
    //更新用户文件夹列表
    updateFolder(state, payload) {
      state.folders.push(payload);
    },
    //删除收藏夹
    deleteFolder(state, payload) {
      state.folders.splice(state.folders.indexOf(payload), 1);
    },
    //修改密保
    changeQuestion(state, payload) {
      state.user.user_question = payload.question;
      state.user.user_answer = payload.answer;
    },
    //修改密码
    changePassword(state, payload) {
      state.user.user_password = payload;
    },
    //更新头像
    changeAvatar(state, payload) {
      state.user.user_avatar = payload;
    },
    //修改锁屏功能的状态
    changeLock(state, payload) {
      state.lock_status = payload;
    },
  },
  actions: {},
  modules: {},
});
