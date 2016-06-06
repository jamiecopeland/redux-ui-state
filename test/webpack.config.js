import path from 'path';
import webpack from 'webpack';

const ROOT_FOLDER_PATH = path.join(__dirname, '../');
const SRC_FOLDER_PATH = path.join(ROOT_FOLDER_PATH, 'src');

export default {
  devtool: 'inline-source-map',
  module: {
    noParse: [
      /node_modules\/sinon/,
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, '../'),
      },
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
  resolve: {
    extensions: ['', '.js', '.json'],
    fallback: path.join(ROOT_FOLDER_PATH, 'node_modules'),
    modulesDirectories: [SRC_FOLDER_PATH, 'node_modules'],
    root: ROOT_FOLDER_PATH,
    alias: {
      // TODO Remove this once Sinon 2 is released
      sinon: 'node_modules/sinon/pkg/sinon-2.0.0-pre',
    },
  },
};
