//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const {app, BrowserWindow, Tray, Menu, ipcMain} = require('electron')
// Module to control application life.
var path = require('path')

//Adds the main Menu to our app

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let secondWindow

function createWindow() {
    require('./app');

    // Create the browser window.
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        backgroundColor: '#312450',
        show: false,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    })

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    var appIcon = new Tray(path.join(__dirname, 'assets/icons/png/64x64.png'));
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
            mainWindow.show();
        }
        },
        {
            label: 'Quit', click: function () {
            app.isQuiting = true;
            app.quit();

        }
        }
    ])

    appIcon.setContextMenu(contextMenu);
    mainWindow.on('close', function (event) {
        if (app.quitting) {
            mainWindow = null
        } else {
            event.preventDefault()
            mainWindow.hide()
        }
    })
    mainWindow.on('minimize', function (event) {
        /*event.preventDefault()
         mainWindow.hide();*/
    })
    mainWindow.on('show', function () {
        appIcon.setHighlightMode('always')
    })


    // Show the mainwindow when it is loaded and ready to show
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    /*secondWindow = new BrowserWindow({frame: false,
     width: 800,
     height: 600,
     minWidth: 800,
     minHeight: 600,
     backgroundColor: '#312450',
     show: false,
     icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
     parent: mainWindow
     })

     secondWindow.loadURL(`file://${__dirname}/windows/ipcwindow.html`)*/

}

/*ipcMain.on('open-second-window', (event, arg)=> {
 secondWindow.show()
 })

 ipcMain.on('close-second-window', (event, arg)=> {
 secondWindow.hide()
 })*/

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
    } else {
        mainWindow.show();
    }
})

app.on('before-quit', function () {
    app.quitting = true
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
