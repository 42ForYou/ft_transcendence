const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const DotenvWebpackPlugin = require("dotenv-webpack");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new DotenvWebpackPlugin({
      path: "./.env.prod",
    }),
  ],
});
