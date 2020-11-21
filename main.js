const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// env

process.env.NODE_ENV = 'production';

//Listen for app to be ready

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //load the html file on the window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './mainwindow.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  //Close the entire app
  mainWindow.on('close', function () {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //INSERT THE MENU
  Menu.setApplicationMenu(mainMenu);
});

//handle create addWindow
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './addwindow.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  //garbage collector

  addWindow.on('close', function () {
    addWindow = null;
  });
}

// Catch item add
ipcMain.on('item:add', function (e, item) {
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

// create menu template

let mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          createAddWindow();
        },
      },
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('item:clear');
        },
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        },
      },
    ],
  },
];

// Add developer tools

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: 'reload',
      },
    ],
  });
}
