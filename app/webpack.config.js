const path = require("path");
const webpack = require("webpack");

module.exports = {
  devServer: {
    contentBase: "./public",
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  plugins: [new webpack.EnvironmentPlugin(["API_ENV"])],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
