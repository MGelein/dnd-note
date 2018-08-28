const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

/**
 * Creates the window, this is the main process for the electron app
 */
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 1920, height: 1080, minWidth: 1024, minHeight: 576 });
    win.maximize();

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Remove the top menu bar
    //win.setMenu(null);
    //Set maximized
}

app.on('ready', createWindow)