import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import express from 'express';

import { createWebpackConfig } from './webpackUtils';
import { WEBPACK_SERVER_PORT } from '../config/server';
import { DEVELOPMENT } from '../src/shared/constants/buildMode';

const app = express();
const config = createWebpackConfig(DEVELOPMENT);
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));

app.listen(WEBPACK_SERVER_PORT, () => {
  console.log(`Webpack server started on ${WEBPACK_SERVER_PORT}`); // eslint-disable-line
});
