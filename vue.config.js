// const url = process.env.NODE_ENV === "development" ? "https://alonepluto.info/api/cloud/v1" : "http://127.0.0.1:3002"
// const url = process.env.NODE_ENV === "http://127.0.0.1:3002";
// module.exports = {
//   transpileDependencies: ["vuetify"],
//   // 开发环境代理服务器
//   devServer: {
//     proxy: {
//       "/api": {
//         target: url,
//         changeOrigin: true,
//         pathRewrite: {
//           "^/api": "",
//         },
//       },
//     },
//   },
// };
const url =
  process.env.NODE_ENV === "development"
    ? "https://alonepluto.info/api/cloud/v1"
    : "http://127.0.0.1:3002";
module.exports = {
  transpileDependencies: ["vuetify"],
  // 开发环境代理服务器
  devServer: {
    proxy: {
      "/api": {
        target: url,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
