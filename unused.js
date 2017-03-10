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
        callback(post,req,res)
    });
}

switch(req.url)
{
    case '/host':
        parsePost(req,res,start_srv);
        return;
    case '/connect':
        parsePost(req,res,connect);
        return;
}