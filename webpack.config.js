const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { InjectManifest } = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "https://sosmed-dev.vercel.app/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3006,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "social",
      filename: "remoteEntry.js",
      remotes: {
        // mainapp: "mainapp@https://dahboard-dev.vercel.app/remoteEntry.js",
        social: "social@https://sosmed-dev.vercel.app/remoteEntry.js",
      },
      exposes: {
        "./Home": "./src/pages/home/Home.js",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new InjectManifest({
      swSrc: "./src/src-sw.js",
      swDest: "sw.js",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/favicon.ico", to: "" },
        { from: "./src/manifest.json", to: "" },
        { from: "./src/diarium192.png", to: "" },
        { from: "./src/diarium512.png", to: "" },
        { from: "./src/apple-touch-icon.png", to: "" },
      ],
    }),
  ],
};
