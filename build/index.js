var path = require('path')
var ora = require('ora')
var rm = require('rimraf')
var webpack = require('webpack')
var webpackDevConfig = require('../config/webpack.dev.conf')
var webpackProdConfig = require('../config/webpack.prod.conf')
var spinner = ora('building for production...')

var webpackConfig = webpackDevConfig

var args = process.argv[2]
var dist = path.resolve(__dirname, '../dist')

if (args === '--deploy') {
  webpackConfig = webpackProdConfig
  dist = path.resolve(__dirname, '../docs')
}

spinner.start()
rm(dist, err => {
  if (err) throw err
  webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log('Build complete.\n')
  })
})