function connect(){

}
var favourite ={
    list:[],
    refresh:function(){
        var path = require('path');
        var fs = require('fs');
        favourite.list = JSON.parse(fs.readFileSync(path.join(__dirname,'../../config','favourites.json')));
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
        //TODO
    }
}
window.addEventListener("load",setTimeout(1000,favourite.refresh()))