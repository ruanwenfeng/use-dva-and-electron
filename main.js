const electron = require('electron')
const fs = require('fs');
// Module to control application life.
const app = electron.app;
const exec = require('child_process').exec; 
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const path = require('path')
const url = require('url')
const lineReader = require('line-reader');
const bug = {}
const bug_data = []
// read all lines:
lineReader.eachLine('items.json', function(line) {
  const _ =JSON.parse(line)
  bug[_['id']] = _;
  bug_data.push(_)
});
let jsonIndex;
fs.readFile('index.json', (err, data)=>{
  if(err) throw err;
  else jsonIndex = JSON.parse(data);
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let pics = []
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200, 
    height: 600,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: false, // 不集成 Nodejs
      webSecurity: false,
      preload: path.join(__dirname, 'render.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })
  mainWindow.setMenuBarVisibility(false)
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'static', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // mainWindow.loadURL('http://localhost:8000/')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })


}
ipcMain.on('click', (event, arg)=>{
  if(arg['id'])
    event.sender.send('bug-data', [bug[arg['id']]])
  else
    event.sender.send('bug-data', bug_data)
})

ipcMain.on('bug-data', (event, arg) => {
  event.sender.send('bug-data', bug_data)
})

ipcMain.on('show-png', (event, arg) => {
  var cmdStr = '"C:\\Program Files (x86)\\Graphviz2.38\\bin\\dot.exe" -T png -O '+path.join(__dirname, 'graph', 'graph_'+jsonIndex[arg['id']]);
  console.log(cmdStr);
  exec(cmdStr, (err,stdout)=>{
    if(err) {
      event.sender.send('show-png-reply', false)
    }
    else{
      // fs.readFile(path.join(__dirname, 'graph', 'graph_'+jsonIndex[arg['id']]+'.png'), 'binary', (err,data)=>{
      //   if(!err)
      //     event.sender.send('show-png-reply', data)
      // })
      pic = new BrowserWindow({
        width: 800, 
        height: 600,
        webPreferences: {
          webSecurity: false,
          preload: path.join(__dirname, 'pic.js'),
        }
      });
     // pic.setMenuBarVisibility(false);
      pic.loadURL(url.format({
        pathname: path.join(__dirname, 'pic.html'),
        protocol: 'file:',
        slashes: true
      }))
      pic.on('closed', function () {
        pic = null
      })
      pics.push(pic);
      pic.webContents.on('did-finish-load',()=>{
        console.log('finish');
        pic.webContents.send('src-change', path.join('.', 'graph', 'graph_'+jsonIndex[arg['id']]+'.png'));
      });
    }
  })
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
