const electron = require('electron');

const {app, BrowserWindow } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: { backgroundThrottling: false}
    });
    mainWindow.loadURL(`file:\\${__dirname}\\src\\index.html`);
})