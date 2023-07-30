// 大文件切割
export function cutBlob(file) {
  // 浏览器兼容
  const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  //切片大小
  const chunkSize = 2 * 1024 * 1024;
  // 切片总数
  const chunkNums = Math.ceil(file.size / chunkSize);
  //切片数组
  let chunkArr = [];

  let startIndex = "";
  let endIndex = "";
  let content = "";

  // 文件切割
  return new Promise((resolve, reject) => {
    for (let i = 0; i < chunkNums; i++) {
      startIndex = i * chunkSize;
      endIndex = startIndex + chunkSize;
      endIndex > file.size && (endIndex = file.size);

      content = blobSlice.call(file, startIndex, endIndex);

      chunkArr.push(content);
    }
    resolve({
      chunkArr,
      fileInfo: {
        total: chunkNums,
        name: file.name,
        size: file.size,
        type: file.type,
        expandedName: file.name.split(".")[1],
      },
    });
  });
}
//生成迷你图
export async function mkMini(file) {
  // 生成文件连接
  const url = URL.createObjectURL(file);
  if (/image/.test(file.type)) {
    //制作图片迷你图
    function foo() {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          //获取图片真实宽高
          const width = img.width;
          const height = img.height;
          // 生成画布
          const canvas = document.createElement("canvas");
          canvas.width = 200;
          canvas.height = 200 * (height / width);
          // 等比缩放
          canvas
            .getContext("2d")
            .drawImage(img, 0, 0, canvas.width, canvas.height);
          //生成base64格式图片
          let base64 = canvas.toDataURL("image/png");
          resolve(base64);
        };
      });
    }
    let result = await foo();
    return result;
  } else {
    //制作视频迷你图
    function foo() {
      return new Promise((resolve, reject) => {
        // 生成video标签
        const video = document.createElement("video");
        video.src = url;
        //监听视频资源首帧加载完毕，可以截屏
        video.onloadeddata = () => {
          //获取视频真实宽高
          const width = video.videoWidth;
          const height = video.videoHeight;
          const canvas = document.createElement("canvas");
          canvas.width = 200;
          canvas.height = 200 * (height / width);
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);
          let base64 = canvas.toDataURL("image/png");
          resolve(base64);
        };
      });
    }
    let result = await foo();
    return result;
  }
}
//文件大小数据格式化
export function formateNum(value) {
  const num = Number(value);
  const size = 1024 * 1024;
  //数字结果
  const a = num / size;
  //字符串结果
  const b = a + "";
  if (b.indexOf(".") === -1) {
    //整数
    return a;
  } else if (b.indexOf(".") === b.length - 2) {
    // 一位小数
    return a;
  } else {
    //截取小数点后三位
    const c = a.toFixed(3);
    const d = c + "";
    //最后一位
    const e = d[d.length - 1];
    if (Number(e) > 4) {
      return Number(Number(c) + 0.01).toFixed(2);
    } else {
      return Number(c).toFixed(2);
    }
  }
}
