const path = require("path");
const webpack = require("webpack");
const nodeModulesPath = path.resolve(__dirname, "node_modules");
const buildPath = path.resolve(__dirname, "public", "build");

module.exports = {
  entry: {
    home: [
      "webpack/hot/dev-server",
      "webpack-dev-server/client?http://localhost:8080",
      "./static/jsx/homePageAnchor.jsx"
    ]
  },
  output: {
    path: buildPath,
    filename: "[name].js",
    publicPath: "/build/"
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: "babel-loader",
      exclude: [nodeModulesPath],
      query: {
        presets: ["es2015", "stage-0", "react"]
      }
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};