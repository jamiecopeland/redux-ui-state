import path from 'path';
import ip from 'ip';

// The constants below specify paths and names used in the creation of the public folder
export const BUILD_FOLDER_PATH = path.join(__dirname, '../', 'public');
export const ASSETS_FOLDER_NAME = 'assets';
export const CSS_FOLDER_NAME = 'css';
export const CSS_MAIN_FILE_NAME = 'index';
export const JS_FOLDER_NAME = 'js';
export const JS_MAIN_FILE_NAME = 'index';
export const HASH_SEPARATOR = '-';

export const APP_SERVER_HOST = ip.address();
export const APP_SERVER_PORT = 3000;
export const WEBPACK_SERVER_HOST = ip.address();
export const WEBPACK_SERVER_PORT = '3001';
