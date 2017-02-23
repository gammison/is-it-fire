const webpack = require("webpack");
const path = require("path");
const nodeModulesPath = path.resolve(__dirname, "node_modules");
const buildPath = path.resolve(__dirname, "static", "build");

module.exports = {
  // We change to normal source mapping
  devtool: "source-map",
  entry: {
    home: "./static/jsx/homePageAnchor.jsx"
  },
  output: {
    path: buildPath,
    filename: "[name].js"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: "babel-loader",
      exclude: [nodeModulesPath],
      query: {presets: ["es2015", "stage-0", "react"] }
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  },
};