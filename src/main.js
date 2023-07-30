import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import { formateNum } from "./utils/utils"
import { http } from "./utils/http"
import "@/assets/style/base.scss"

// 全局注册公共组件
import components from "@/components/index"
Vue.use(components)

//注册一个事件总线方法
Vue.prototype.$bus = new Vue()
//注册一个网络请求方法
Vue.prototype.$http = http
//注册一个全局过滤器
Vue.filter("formatSize", formateNum)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app")
