// electron main
const electron = require('electron');
const http = require('http');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs');
const qs = require('querystring');
const pathModule = require('path');

var server = new http.createServer();

server.on('request',function(req,res){
    switch(req.url)
    {
        case '/host':
            parsePost(req,res,start_srv);
            return;
        case '/connect':
            parsePost(req,res,connect);
            return;
    }
    sendFile(req.url,res);
});

function start_srv(post,req,res){
    window.game_srv = new http.createServer();
    game_srv.on("request",function (req,res){

    })
}
function connect(post,req,res) {

}

function parsePost(req,res,callback){
    var post={},body = '';
    req.on('data',function(data){
        body += data;
        if (body.length >1e6) {
            req.disconnect()
        }});
    req.on('end',function(){
        post = qs.parse(body);
        if (post==undefined) {
            setTimeout(function () {
                req.emit('end');
            }, 50);
        }
        callback(post,req,res)
    });
}
function sendFile(path,res) {
    fs.exists(pathModule.join('./shared',path),function (exist){
        if (!exist) {
            res.writeHead(404);
            res.end('Page not found');
            return;
        }
        fs.stat(pathModule.join('./shared',path),function (err,stats){
            if (err) {
                throw err;
            }
            var  file;
            if (stats.isDirectory()){
                file = fs.createReadStream(pathModule.join('./shared',path,'index.html'));
                file.pipe(res);
            }
            else if (stats.isFile()){
                file = fs.createReadStream(pathModule.join('./shared',path));
                file.pipe(res);
            }})})}
function getIP() {
    var list= [];
    var os = require('os');
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) return;
            list.push(iface.address)
        })});
    return list;
}

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