import Express from 'express';

import {
  APP_SERVER_HOST,
  APP_SERVER_PORT,
  BUILD_FOLDER_PATH,
} from '../../config/server';
import { createIndexFile } from './utils/indexFileUtils';

const app = new Express();

app.use(Express.static(BUILD_FOLDER_PATH));

app.get('*', (req, res) => {
  createIndexFile('React Express Boilerplate')
    .then((fileString) => {
      res.send(fileString);
    })
    .catch((err) => {
      res.send('Error creating index file', err);
    });
});

app.listen(APP_SERVER_PORT, (error) => {
  if (error) {
    console.error(error); // eslint-disable-line
  } else {
    console.log('\nApp server running at:'); // eslint-disable-line
    console.info(`http://${APP_SERVER_HOST}:${APP_SERVER_PORT}`); // eslint-disable-line
    console.log('🚀  🚀  🚀  🚀  🚀  🚀  🚀  🚀\n'); // eslint-disable-line
  }
});
