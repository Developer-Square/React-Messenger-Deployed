const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  output: {
    path: path.resolve(__dirname, "./dist"),
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
    contentBase: path.resolve(__dirname, "./src"),
    historyApiFallback: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "chat",
      library: { type: "var", name: "chat" },
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Chat": "./src/Chat",
      },
      shared: require("./package.json").dependencies,
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: true,
    }),
  ],
};
