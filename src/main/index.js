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

// 创建新窗口
const createNewWindow = (url, option) => {
  const defaultOption = {
    height: 700,
    width: 960,
    show: false,
    title: 'LiteReader',
    center: true,
    backgroundColor: '#fff',
    titleBarStyle: 'hiddenInset',
    parent: mainWindow
  };
  const options = Object.assign(defaultOption, option);
  let newWindow = new BrowserWindow(options);
  newWindow.on('closed', () => {
    newWindow = null;
  });
  newWindow.setMenu(menu);
  newWindow.loadURL(`${winURL}${url}`);
  return newWindow;
};

// 创建菜单
const createMenu = () => {
  const template = [
    {
      label: 'LiteReader',
      submenu: [
        { label: '关于 LiteReader', role: 'about' },
        {
          label: '账户与设置',
          click() {
            const newWindow = createNewWindow('manage', {
              width: 810,
              height: 630
            });
            newWindow.once('ready-to-show', () => {
              newWindow.show();
            });
          }
        },
        {
          label: '意见反馈',
          click() {
            const newWindow = createNewWindow('/feedback', {
              width: 810,
              height: 630
            });
            newWindow.once('ready-to-show', () => {
              newWindow.show();
            });
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
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
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
    height: 720,
    width: 1080,
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
    const newWindow = createNewWindow(url);
    newWindow.once('ready-to-show', () => {
      newWindow.show();
      setTimeout(() => {
        newWindow.webContents.send('app-detail', app);
      }, 200);
    });
  }
});

// 向主窗口同步数据
ipcMain.on('synchronous-data-main', (event, arg) => {
  const { action, data } = arg;
  mainWindow.webContents.send('synchronous-data-main', { action, data });
});

ipcMain.on('follow-action', (event, arg) => {
  const { apps } = arg;
  mainWindow.webContents.send('follow-apps', { apps });
});

// 重启应用
ipcMain.on('relaunch-app', () => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  app.exit(0);
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
