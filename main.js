// electron main
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
var window;
app.on("ready", function () {
    window = new BrowserWindow(
        {
            frame:false,
            width:800,
            height:634,
            resizable:false,
            maximizable:false
        });
    window.loadURL("file://"+path.join(__dirname+"/index.html"));
});
