import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

import {
  BUILD_FOLDER_PATH,
  CSS_FOLDER_NAME,
  CSS_MAIN_FILE_NAME,
  JS_FOLDER_NAME,
  JS_MAIN_FILE_NAME,
  HASH_SEPARATOR,
  WEBPACK_SERVER_HOST,
  WEBPACK_SERVER_PORT,
} from '../../../config/server';
import {
  PRODUCTION,
  DEVELOPMENT,
} from '../../shared/constants/buildMode';
import Index from '../components/index/Index';

const DOC_TYPE = '<!DOCTYPE html>';

function loadBuildFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(`${BUILD_FOLDER_PATH}/build.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data ? JSON.parse(data) : {});
      }
    });
  });
}

function createDevelopmentVersion(title) {
  return new Promise((resolve) => {
    // const jsPaths = [`/${JS_FOLDER_NAME}/${JS_MAIN_FILE_NAME}.js`];
    const jsPaths = [`http://${WEBPACK_SERVER_HOST}:${WEBPACK_SERVER_PORT}/${JS_FOLDER_NAME}/${JS_MAIN_FILE_NAME}.js`]
    const indexFileString = ReactDOMServer.renderToStaticMarkup(
      <Index
        title={title}
        jsPaths={jsPaths}
      />
    );
    resolve(`${DOC_TYPE}${indexFileString}`);
  });
}

function createProductionVersion(title) {
  return new Promise((resolve, reject) => {
    loadBuildFile()
      .then(({ hash }) => {
        const jsPaths = [`${JS_FOLDER_NAME}/${JS_MAIN_FILE_NAME}${HASH_SEPARATOR}${hash}.js`];
        const cssPaths = [`${CSS_FOLDER_NAME}/${CSS_MAIN_FILE_NAME}${HASH_SEPARATOR}${hash}.css`];
        const indexFileString = ReactDOMServer.renderToStaticMarkup(
          <Index
            title={title}
            jsPaths={jsPaths}
            cssPaths={cssPaths}
          />
        );

        resolve(`${DOC_TYPE}${indexFileString}`);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function createIndexFile(title) {
  let promise;

  switch (process.env.NODE_ENV) {
    case PRODUCTION:
      promise = createProductionVersion(title);
      break;
    case DEVELOPMENT:
      promise = createDevelopmentVersion(title);
      break;
    default:
  }

  return promise;
}
