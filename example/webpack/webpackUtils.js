import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import {
  BUILD_FOLDER_PATH,
  ASSETS_FOLDER_NAME,
  CSS_FOLDER_NAME,
  CSS_MAIN_FILE_NAME,
  JS_FOLDER_NAME,
  JS_MAIN_FILE_NAME,
  HASH_SEPARATOR,
  WEBPACK_SERVER_HOST,
  WEBPACK_SERVER_PORT,
} from '../config/server';
import { DEVELOPMENT, PRODUCTION, TEST } from '../src/shared/constants/buildMode';

const ROOT_FOLDER_PATH = path.join(__dirname, '../');
const SRC_FOLDER_PATH = path.join(ROOT_FOLDER_PATH, 'src');
const MAIN_JS_FILE_NAME = 'index';
const MAIN_JS_FILE_PATH = path.join(SRC_FOLDER_PATH, 'client', MAIN_JS_FILE_NAME);

const styleLoader = {
  test: /\.css$/,
  loaders: [
    'style-loader',
    'css-loader',
    'postcss-loader',
  ],
};

const jsLoader = {
  test: /\.js$/,
  loaders: ['babel'],
  exclude: /node_modules/,
  include: path.join(__dirname, '../'),
};

const baseConfig = {
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: SRC_FOLDER_PATH,
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff)$/,
        loader: `url-loader?limit=8192&name=${ASSETS_FOLDER_NAME}/[path][name]--[hash].[ext]`,
      },
    ],
  },
  postcss: [
    autoprefixer, precss,
  ],
  resolve: {
    extensions: ['', '.js', '.json'],
    fallback: path.join(ROOT_FOLDER_PATH, 'node_modules'),
    modulesDirectories: [SRC_FOLDER_PATH, ASSETS_FOLDER_NAME, 'node_modules'],
    root: ROOT_FOLDER_PATH,
  },
};

export function createWebpackConfig(mode) {
  let config;

  switch (mode) {

    case TEST:
      config = {
        ...baseConfig,
        devtool: 'inline-source-map',
        module: {
          noParse: [
            /node_modules\/sinon/,
          ],
          loaders: [
            ...baseConfig.module.loaders,
            jsLoader,
            styleLoader,
          ],
        },
        plugins: [
          new webpack.IgnorePlugin(/ReactContext/), // This is a fix for skin-deep. See Troubleshooting section at https://github.com/glenjamin/skin-deep
          new webpack.NoErrorsPlugin(),
        ],
        externals: {
          cheerio: 'window',
          jsdom: 'window',
          'react/addons': true,
          'react/lib/ExecutionEnvironment': true,
          'react/lib/ReactContext': true,
        },
      };
      break;

    case DEVELOPMENT:
      config = {
        ...baseConfig,
        devtool: 'cheap-module-eval-source-map',
        entry: [
          `webpack-hot-middleware/client?path=http://${WEBPACK_SERVER_HOST}:${WEBPACK_SERVER_PORT}/__webpack_hmr`,
          MAIN_JS_FILE_PATH,
        ],
        output: {
          path: BUILD_FOLDER_PATH,
          filename: `${JS_MAIN_FILE_NAME}.js`,
          publicPath: `http://${WEBPACK_SERVER_HOST}:${WEBPACK_SERVER_PORT}/${JS_FOLDER_NAME}/`,
        },
        plugins: [
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin(),
        ],
        module: {
          ...baseConfig.module,
          loaders: [
            ...baseConfig.module.loaders,
            jsLoader,
            styleLoader,
          ],
        },
        eslint: {
          failOnError: false,
          emitWarning: true,
        },
      };

      break;

    case PRODUCTION:
      config = {
        ...baseConfig,
        entry: {
          [MAIN_JS_FILE_NAME]: MAIN_JS_FILE_PATH,
        },
        output: {
          path: BUILD_FOLDER_PATH,
          filename: `${JS_FOLDER_NAME}/[name]${HASH_SEPARATOR}[hash].js`,
        },
        module: {
          ...baseConfig.module,
          loaders: [
            ...baseConfig.module.loaders,
            jsLoader,
            {
              test: styleLoader.test,
              loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader'),
            },
          ],
        },
        plugins: [
          new ExtractTextPlugin(`${CSS_FOLDER_NAME}/${CSS_MAIN_FILE_NAME}${HASH_SEPARATOR}[hash].css`),
          new webpack.optimize.UglifyJsPlugin({
            minimize: true,
          }),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
          }),
        ],
      };
      break;

    default:
  }

  return config;
}
