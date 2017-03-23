// electron main
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
var window;
app.on("ready", function () {
    window = new BrowserWindow(
        {
            center:true,
            frame:false,
            width:800,
            height:634,
            //resizable:false,
            maximizable:false,
            fullscreenable:false,
            nodeIntegration:"all"
        });
    window.on('maximize', function() {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow.isMaximized()) {
            focusedWindow.unmaximize();
        } else {
            focusedWindow.maximize();
        }
    });

    window.loadURL("file://"+path.join(__dirname+"/index.html"));

});