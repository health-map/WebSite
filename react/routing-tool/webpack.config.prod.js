/**
 * @file webpack.config.prod.js
 * @description Webpack configuration file for production
 *
 */

const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const VERSION = require('./version');

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "dist")
}

module.exports = {
  context: PATHS.app,
  bail: true,
  entry: [
    'babel-polyfill',
    path.join(PATHS.app, "polyfills/decimal-rounding"),
    path.join(PATHS.app, "index.js")
  ],
  output: {
    path: PATHS.build,
    library: 'Routing',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: `routing-tool.${VERSION}.js`,
  },
  module: {
    rules: [
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
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
        uglifyOptions: {
          ie8: false,
          compress: true,
          mangle: false
        },
        exclude: [/\.min\.js$/gi]
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join(`routing-tool.${VERSION}.css`)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin()
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  stats: {
    children: false
  }
};
