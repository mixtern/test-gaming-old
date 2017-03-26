function connect(ip,port){
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if(httpRequest.responseText === 'OK'){
                window.ip= ip;
                window.port = port;
                getMaps();
                getRooms();
                getTests();
                console.log('OK');
            }
        }
    };
    httpRequest.open('GET','http://'+ip+':'+port, true);
    httpRequest.send(null);
}
var favourite ={
    list:[],
    refresh:function(){
        var path = require('path');
        var fs = require('fs');
        favourite.list = JSON.parse(fs.readFileSync(path.join(__dirname,'../../config','favourites.json')));
        var out = '<tr><th>Имя</th><th>IP</th><th>Порт</th><th>Подключиться</th></tr>';
        favourite.list.forEach(function(fav){
            out += '<tr><td>'+fav.name+'</td><td>'+ fav.ip +'</td><td>'+ fav.port +'</td><td><button onclick="connect(\''+fav.ip +'\',\''+ fav.port+'\')">Подключится</button></td>';
        });
        document.getElementById("tlist").innerHTML = out;
    },
    add:function(){
        var fs = require('fs');
        var path = require('path');
        var name = document.getElementById("name").value,
            ip = document.getElementById("ip").value,
            port = document.getElementById("port").value;
            document.getElementById("name").value = "";
            document.getElementById("ip").value = "";
            document.getElementById("port").value = "";
        favourite.list.push({"name":name,"port":port,"ip":ip});
        fs.writeFileSync(path.join(__dirname,'../../config','favourites.json'),JSON.stringify(favourite.list));
        favourite.refresh();
    },
    remove:function(){
        //TODO removing favourite

    }
};