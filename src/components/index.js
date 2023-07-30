// 导入组件
import ContextMenu from "./ContextMenu/index"
import FileShow from "./FileShow/index"
import Upload from "./Upload/index"
import FolderShow from "./FolderShow/index"
import FileTable from "./FileTable/index"
import LoginBox from "./LoginBox/index"
import SigninBox from "./SigninBox/index"
import ResetBox from "./ResetBox/index"
import ProgressLinear from "./ProgressLinear/index"
// 组件列表
const components = [ContextMenu, FileShow, Upload, FolderShow, FileTable, LoginBox, SigninBox, ResetBox, ProgressLinear]

// 定义install方法，接受vue为参数，如果使用use注册组件，则所有组件都将被注册
const install = function(Vue) {
  // 判断是否安装
  if (install.installed) {
    return
  }
  //遍历注册所有组件
  components.forEach(item => {
    Vue.component(item.name, item)
  })
}

export default {
  //导出install方法，Vue.use()方法安装
  install
}
