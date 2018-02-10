import { app, BrowserWindow, ipcMain } from 'electron'; // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/#'
  : `file://${__dirname}/index.html#`;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1100,
    backgroundColor: '#fff',
    titleBarStyle: 'hidden'
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

ipcMain.on('new-window', (event, arg) => {
  if (arg.action === 'open') {
    const { url, app } = arg;
    let newWindow = new BrowserWindow({
      height: 700,
      width: 900,
      show: false,
      backgroundColor: '#fff',
      titleBarStyle: 'hidden'
    });
    newWindow.on('closed', () => {
      newWindow = undefined;
    });
    newWindow.setMenu(null);
    newWindow.loadURL(`${winURL}${url}`);
    newWindow.once('ready-to-show', () => {
      newWindow.show();
      setTimeout(() => {
        newWindow.webContents.send('app-detail', app);
      }, 200);
    });
  }
  // if (arg.action === 'close') {
  //   newWindow.close();
  //   newWindow = undefined;
  // }
});


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
