var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: {
    index: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:8].js'
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({ 
          fallback: 'style-loader', 
          use: [
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        })
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'resume',
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: 'favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './../dist'),
    compress: true,
    port: 9000
  }
}