import { app, BrowserWindow, ipcMain, Menu } from 'electron';
// import db from '../dataStore';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
let menu;
// 主窗口
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/#'
  : `file://${__dirname}/index.html#`;
// 设置界面
const settingWinURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/#manage'
  : `file://${__dirname}/index.html#manage`;

// 创建设置窗口
const createSettingWindow = () => {
  const options = {
    height: 600,
    width: 800,
    center: true,
    // resizable: false,
    title: 'LiteReader',
    titleBarStyle: 'hiddenInset',
    parent: mainWindow
  };
  let settingWindow = new BrowserWindow(options);
  settingWindow.loadURL(settingWinURL);
  settingWindow.on('closed', () => {
    settingWindow = null;
  });
};

// 创建菜单
const createMenu = () => {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { label: '关于 LiteReader', role: 'about' },
        {
          label: '设置',
          click() {
            createSettingWindow();
          }
        },
        {
          label: '退出 LiteReader',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: '窗口',
      role: 'window',
      submenu: [
        { label: '最小化', role: 'minimize' },
        { label: '关闭', role: 'close' }
      ]
    }
  ];
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// 创建主窗口
const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 700,
    width: 1100,
    title: 'LiteReader',
    useContentSize: true,
    backgroundColor: '#fff',
    titleBarStyle: 'hiddenInset'
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  createMenu();
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
      newWindow = null;
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
