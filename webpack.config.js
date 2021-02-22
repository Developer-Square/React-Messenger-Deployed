const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const AppManifestWebpackPlugin = require('app-manifest-webpack-plugin')
const workboxPlugin = require('workbox-webpack-plugin')
const path = require("path");
const includePath = path.resolve(__dirname, "..");

module.exports = {
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
  entry: {
    path: path.resolve(__dirname, './src/index.js')
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
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
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|webp|png|svg|jpg|jpeg|)$/,
        include: includePath,
        use: "url-loader",
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
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
      template: "./public/index.html"
    }),
    new workboxPlugin.InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js'
    }),
    // new AppManifestWebpackPlugin({
    //   logo: './src/images/Messenger_app_logo_200x200.png',
    //   persistentCache: true,
    //   config: {
    //     appName: "Ryan's Modern Portfolio",
    //     appDescription: "Modern Portfolio",
    //     developerName: 'Ryan Njoroge',
    //     background: "#FFE9D2",
    //     theme_color: "#FFE1C4",
    //     display: "standalone",
    //     orientation: "portrait-primary",
    //     start_url: "/index.html",
    //     icons: {
    //       appleStartup: false,
    //       coast: false,
    //       firefox: false,
    //       windows: false,
    //       yandex: false,
    //     }
    //   }
    // })
  ],
};
