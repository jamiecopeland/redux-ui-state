import bg from 'gulp-bg';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import shell from 'gulp-shell';
import webpack from 'webpack';
import runSequence from 'run-sequence';

import { BUILD_FOLDER_PATH } from './config/server';
import { DEVELOPMENT, PRODUCTION } from './src/shared/constants/buildMode';
import { createWebpackConfig } from './webpack/webpackUtils';

// --------------------------------------------------

export function buildPublicFolder(callback) {
  webpack(createWebpackConfig(PRODUCTION), (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      colors: true,
      version: false,
      hash: true,
      timings: false,
      chunks: false,
      chunkModules: false,
    }));

    const buildJSON = {
      hash: stats.hash,
    };

    fs.writeFile(
      path.join(BUILD_FOLDER_PATH, 'build.json'),
      JSON.stringify(buildJSON),
      (writeFileErr) => {
        callback(writeFileErr);
      }
    );
  });
}

// --------------------------------------------------
// Development tasks

gulp.task('startWebpackServer', bg('node', './webpack/webpackServerWrapper.js'));
gulp.task('startDevelopmentServer',
  shell.task(path.normalize(`NODE_ENV=${DEVELOPMENT} nodemon src/server/indexWrapper.js`)));
gulp.task('startDevelopment',
  callback => runSequence('deletePublicFolder', 'startWebpackServer', 'startDevelopmentServer', callback)); // eslint-disable-line

// --------------------------------------------------
// Production tasks

gulp.task('deletePublicFolder', () => del([BUILD_FOLDER_PATH]));
gulp.task('buildPublicFolder', buildPublicFolder);
gulp.task('build', (callback) => runSequence('deletePublicFolder', 'buildPublicFolder', callback));
gulp.task('startProductionServer',
  shell.task(path.normalize(`NODE_ENV=${PRODUCTION} node src/server/indexWrapper.js`)));
gulp.task('startProduction', (callback) => runSequence('build', 'startProductionServer', callback));
