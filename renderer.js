var containers;
window.onload = function() {
    containers =  document.getElementsByClassName("container");
};
function getIP(port) {
    var list= [];
    var os = require('os');
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) return;
            list.push(iface.address)
        })});

    var content = "";
    for(var i=0;i<list.length;i++){
        content+="<li>"+list[i]+":"+port+"</li>";

    }
    var ips = document.getElementById("ips");
    ips.innerHTML = content;
}
function handler(req,res){

    res.end('Hello world');
}

function w8(bool){
    var elem = document.getElementById("w8");
    if (bool){
        elem.classList.remove("hide");
    }
    else{
        elem.classList.add("hide");
    }
}
function connect(){


}
function startSrv(){
    var form = document.getElementById("server");
    containers[0].classList.add("hide");
    w8(true);
    var http = require("http");
    var server = new http.createServer();
    server.on("request",handler);
    var port = document.getElementById("srvPort").value;
    server.listen(port<1024?1337:port, function(err) {
        containers[2].classList.remove("hide");
        w8(false);
        getIP(port<1024?1337:port);
    });
}