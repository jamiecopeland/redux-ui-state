const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');
const { PROTOCOL, HOST, PORT, } = require('./serverConfig');

new WebpackDevServer(
  webpack(config),
  {
    publicPath: config.output.publicPath,
    hot: false,
    historyApiFallback: true
  }
).listen(PORT, HOST, err => err
  ? console.error(err)
  : console.log(`Listening at ${PROTOCOL}://${HOST}:${PORT}`)
);
