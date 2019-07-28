/**
 * @file webpack.config.dev.js
 * @description Webpack configuration file for development
 *
 */

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const VERSION = require('./version');

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "dist")
}

module.exports = {
  watchOptions: {
    poll: true,
    ignored: '/node_modules/'
  },
  context: PATHS.app,
  entry: [
    'babel-polyfill',
    path.join(PATHS.app, "polyfills/decimal-rounding"),
    path.join(PATHS.app, "index.js")
  ],
  output: {
    path: PATHS.build,
    library: 'HealthMap',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: `health-map.${VERSION}.js`,
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          failOnError: true,
          fix: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, 'postcss.config.js')
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        exclude: PATHS.app,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25000,
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join(`health-map.${VERSION}.css`)
    })
  ],
  stats: {
    children: false
  }
};
