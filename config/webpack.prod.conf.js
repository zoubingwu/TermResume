var path = require('path')
var webpackConfig = require('./webpack.dev.conf')

module.exports = Object.assign({}, webpackConfig, {
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'js/[name].[hash:8].js',
    publicPath: '/resume/'
  }
})