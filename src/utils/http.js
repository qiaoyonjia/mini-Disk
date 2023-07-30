import axios from "axios";
import store from "../store/index";
import router from "../router/index";

export function http(config, onUpload = () => {}) {
  const instance = axios.create({
    // baseURL: process.env.VUE_APP_BASE_URL,
    baseURL: "http://127.0.0.1:3002/",
    timeout: 60000,
    onUploadProgress: onUpload,
  });
  //请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // test接口用于前后端通信测试，无实际意义
      if (config.url === "/test") {
        return config;
      }
      config.headers.SecretKey = process.env.VUE_APP_SECRET_KEY;
      if (/login/.test(config.url)) {
        //如果请求的是login接口，不添加token
        return config;
      } else {
        //其他接口需要在请求头添加Authorization
        // config.headers.Authorization = store.state.token;
        config.headers.Authorization = localStorage.getItem("token");
        return config;
      }
    },
    (err) => {
      console.log(err);
    }
  );
  //响应拦截器
  instance.interceptors.response.use(
    (res) => {
      if ([805, 806, 822, 823].includes(res.data.code)) {
        // 无法验证token，跳转到登录页
        store.commit("message", { color: "error", text: res.data.message });
        router.replace("/login");
      }
      return res;
    },
    (err) => {
      console.log(err);
    }
  );
  //返回实例
  return instance(config);
}
