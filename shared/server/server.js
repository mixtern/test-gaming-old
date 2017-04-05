function parsePost(req,res,callback){
    const qs = require('querystring');
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
		else newAnswer(post);
    });
}
function newAnswer(data){
	//TODO
}
function sendFile(path,res) {
    var fs = require('fs');
    fs.exists(path,function (exist){
        if (!exist) {
            res.writeHead(404);
            res.end('Page not found');
            return;
        }
        fs.stat(path,function (err,stats){
            if (err) {
                throw err;
            }
            if (stats.isFile()&&path.slice(path.lastIndexOf('/')) != 'rightAnswers.json'){
                var file = fs.createReadStream(path);
                file.pipe(res);
            }
            else {
                res.writeHead(404);
                res.end('Page not found');
            }
        })})}
var stats ={};
function handler(req,res){
    asdf.log('send',req.url);
    var path = require('path');
    switch(req.url.slice(1,4)){
        case 'map':
            sendFile(path.join(__dirname,'../../maps',stats.map,req.url.slice(4)),res);
            break;
        case 'tst':
            sendFile(path.join(__dirname,'../../tests',stats.test,req.url.slice(4)),res);

            break;
        case '':
            res.end('OK');
            break;
    }
}
function startSrv(){
    var http = require("http");
    var server = new http.createServer();
    server.on("request",handler);
    server.listen(stats.port<1024?1337:stats.port, function(err) {
        if(err) throw err;
        getIP(stats.port<1024?1337:stats.port);
    });
}
function host(){
    var create = document.getElementById('create');
    create.classList.add('hide');
    var hold = document.getElementById('hold');
    hold.classList.remove('hide');

    stats.serverName = document.getElementById('name');
    stats.port = document.getElementById("port").value;
    stats.map = document.getElementById("level").value;
    stats.test = document.getElementById("test").value;
    startSrv();
}
function getIP(port) {
    var list= [];
    var os = require('os');
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) return;
            list.push(iface.address)
        })});

    var content = "<li>ips:</li>";
    for(var i=0;i<list.length;i++){
        content+="<li>"+list[i]+":"+port+"</li>";
    }
    var ips = document.getElementById("ips");
    ips.innerHTML = content;
}
asdf={
  log:function () {
      var str = Array().join.apply(arguments,[' '])
      document.getElementById('output').innerHTML+=str+'<br/>';
  }
};