const path = require('path');
const webpack = require('webpack');

const { PROTOCOL, HOST, PORT, } = require('./serverConfig');

module.exports = {
  devtool: 'eval',
  entry: [
    `webpack-dev-server/client?${PROTOCOL}://${HOST}:${PORT}`,
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loaders: ['ts-loader'],
      include: path.join(__dirname, 'src')
    }]
  }
};
