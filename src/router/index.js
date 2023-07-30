import Vue from "vue"
import VueRouter from "vue-router"
//引入状态管理
import Store from "../store/index"

//懒加载
const Login = () => import("../pages/Login.vue")
const Home = () => import("../pages/Home.vue")

const Timeline = () => import("../views/Timeline/Timeline.vue")
const Folder = () => import("../views/Folder/Folder.vue")
const Image = () => import("../views/Image/Image.vue")
const Video = () => import("../views/Video/Video.vue")
const Profile = () => import("../views/Profile/Profile.vue")

Vue.use(VueRouter)

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    redirect: "/home/timeline"
  },
  {
    path: "/home",
    component: Home,
    children: [
      {
        path: "timeline",
        component: Timeline
      },
      {
        path: "image",
        component: Image
      },
      {
        path: "video",
        component: Video
      },
      {
        path: "folder",
        component: Folder
      },
      {
        path: "profile",
        component: Profile
      }
    ]
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})
router.beforeEach((to, from, next) => {
  if (Store.state.lock_status == "close") {
    //允许跳转
    next()
  } else {
    //强制浏览器停留在当前URL
    next(false)
  }
})
export default router
