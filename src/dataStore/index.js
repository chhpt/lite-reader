import DataStore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
// import fs from 'fs-extra';
import { remote, app } from 'electron';

const APP = process.type === 'renderer' ? remote.app : app;
const STORE_PATH = APP.getPath('userData');

// if (process.type !== 'renderer') {
//   if (!fs.pathExistsSync(STORE_PATH)) {
//     fs.mkdirpSync(STORE_PATH);
//   }
// }

const adapter = new FileSync(path.join(STORE_PATH, '/data.json'));
const db = DataStore(adapter);

if (!db.has('app').value()) {
  db.set('app', {}).write();
}

if (!db.has('user.themeColor').value()) {
  db.set('user.themeColor', 'gray').write();
}

if (!db.has('user.follows').value()) {
  db.set('user.follows', []).write();
}

export default db;
