// electron main
const electron = require('electron');
const http = require('http');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs');

var server = new http.createServer();

server.on('request',function(req,res){
    sendFile(req.url,res);
});

function start_srv(post,req,res){
    window.game_srv = new http.createServer();
    game_srv.on("request",function (req,res){

    })
}
function connect(post,req,res) {

}


function sendFile(path,res) {
    var Path = require("path");
    fs.exists(Path.join('./shared',path),function (exist){
        if (!exist) {
            res.writeHead(404);
            res.end('Page not found');
            return;
        }
        fs.stat(Path.join('./shared',path),function (err,stats){
            if (err) {
                throw err;
            }
            var  file;
            if (stats.isDirectory()){
                file = fs.createReadStream(Path.join('./shared',path,'index.html'));
                file.pipe(res);
            }
            else if (stats.isFile()){
                file = fs.createReadStream(Path.join('./shared',path));
                file.pipe(res);
            }})})}
var window;
app.on("ready", function () {
    window = new BrowserWindow(
        {
            frame:false,
            width:800,
            height:634,
            resizable:false,
            maximizable:false,
            backgroundColor:"transparent"
        });
    server.listen(15189,function(){
        window.loadURL("http://localhost:15189/");
    });
});