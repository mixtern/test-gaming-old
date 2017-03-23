function sendFile(path,res) {
    fs.exists(pathmod.join('./shared',path),function (exist){
        if (!exist) {
            res.writeHead(404);
            res.end('Page not found');
            return;
        };
        fs.stat(pathmod.join('./shared',path),function (err,stats){
            if (err) {
                throw err;
            };
            var  file;
            if (stats.isDirectory()){
                file = fs.createReadStream(pathmod.join('./shared',path,'index.html'));
                file.pipe(res);
            }
            else if (stats.isFile()){
                file = fs.createReadStream(pathmod.join('./shared',path));
                file.pipe(res);
            }
        })})}

function handler(req,res){
    sendFile(req.url());
}
var containers;
window.addEventListener("load", function() {
    containers =  document.getElementsByClassName("container");
});

function startSrv(){
    var create = document.getElementById('create');
    create.classList.add('hide');
    var hold = document.getElementById('hold');
    hold.classList.remove('hide');
    var http = require("http");
    var server = new http.createServer();
    server.on("request",handler);
    var serverName = document.getElementById('name');
    var port = document.getElementById("port").value;
    server.listen(port<1024?1337:port, function(err) {
        classList.remove("hide");
        w8(false);
        getIP(port<1024?1337:port);
    });
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