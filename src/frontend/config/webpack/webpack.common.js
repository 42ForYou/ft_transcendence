const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Production",
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/favicon.ico", to: "" },
        { from: "public/assets", to: "assets" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          "style-loader", // 3. Inject styles into DOM
          "css-loader", // 2. Turns css into commonjs
          "sass-loader", // 1. Turns sass into css
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "/",
    path: path.resolve(__dirname, "../../dist"),
    clean: true,
  },
};
