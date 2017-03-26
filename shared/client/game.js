
//создание глобальных переменных
var game = {},
    keys = {};
//const
//генератор случайных чисел
function getRnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
var physics = {
        calc:function(){
        }
    },
    create = {

    },
    set = {
        bgr:function(url) {
            bgr.img.src = url;
        },
        mode:function(mode){
            game.mode = mode;
        }
    },
    temp,main,bgr,player,gui;
//управление
window.addEventListener("keydown",
    function(e){
        if (!(e.keyCode in keys)) {
            keys[e.keyCode]=true;
        }
    },
    true);
window.addEventListener('keyup',
    function(e){
        if (e.keyCode in keys) {
            delete keys[e.keyCode];
        }
    },
    true);
// псевдо-константы
constant = {
    fps:60
};
//создание главного объекта
window.addEventListener("load",function(){
    temp = document.getElementById("hidden");
    bgr = {
        canvas:document.getElementById("background"),
        ctx:document.getElementById("background").getContext('2d'),
        img:new Image(),
        draw:function(){
            bgr.ctx.clearRect(0,0,800,600);
            //there should be offset
            bgr.ctx.drawImage(bgr.img,0,0);
        }
    };
    main = {
        canvas:document.getElementById("main"),
        ctx:document.getElementById("main").getContext('2d'),
        blocks:[],
        height:0,
        width:0,
        textures:[],
        draw:function(){
            temp.ctx.clearRect(0,0,800,600);
            if(game.mode === "debug"){
                for(var x = 0;x*25<800;x++){
                    for(var y = 0;y*25<600;y++) {
                        temp.ctx.strokeStyle = "#0000FF";
                        temp.ctx.strokeRect(x*25,y*25,25,25);
                    }
                }
            }
            main.ctx.clearRect(0,0,800,600);
            main.ctx.drawImage(temp,0,0)
        }
    };
    player = {
        canvas:document.getElementById("player"),
        ctx:document.getElementById("player").getContext('2d'),
        x:0,
        y:0,
        sprite:new Image(),
        draw:function(){

        }
    };
    gui = {
        canvas:document.getElementById("gui"),
        ctx:document.getElementById("gui").getContext('2d'),
        objs:[],
        draw:function(){

        }
    };
    temp.ctx = temp.getContext('2d');
    window.game = {
        //mode:"debug",
        mode:"production",
        start:function(){
            document.getElementById('connect').classList.add('hide');
            document.getElementById('game').classList.remove('hide');
            game.interval = setInterval(game.reDraw,1000/game.fps)
        },
        stop:function(){
            clearInterval(game.interval);
            game.interval = null;
        },
        pause:function() {
            if (game.interval) {
                game.stop()
            }
            else game.start();
        },
        reDraw:function(){
            physics.calc();
            bgr.draw();
            main.draw();
            player.draw();
            gui.draw();
        }};
});
//TODO Graphics

function getMaps() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            window.map = JSON.parse(httpRequest.responseText);
            loadFloor(0);
        }
    };
    httpRequest.open('GET','http://'+window.ip+':'+ window.port +'/map/index.json', true);
    httpRequest.send(null);
}
function loadFloor(n) {
    window.floorName = window.map.floors[n];
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            window.currentFloor = JSON.parse(httpRequest.responseText);
            getSprites();
            getRooms();
        }
    };
    httpRequest.open('GET','http://'+window.ip+':'+window.port +'/map/'+floorName + '/index.json', true);
    httpRequest.send(null);
}
function getSprites() {
    window.sprites=new Array(currentFloor.textures.list.length);
    currentFloor.textures.list.forEach(getSprite);
    putSprites();
    setRoom(0);
}
function getRooms() {
    currentFloor.rooms = new Array(currentFloor.roomCount);
    for(var i = 0; i < currentFloor.roomCount;i++){
        getRoom(i);
    }
    game.start();
}
function setRoom(n) {
    main.blocks = currentFloor.rooms[n].map;
    main.width = rooms[n].width;
    main.height = rooms[n].height;
    mapBlocks(n);
}
function mapBlocks(n) {
    main.blocks = currentFloor.rooms[n].blocks;
}
function getRoom(n) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            currentFloor.rooms[n] = JSON.parse(httpRequest.responseText);
        }
    };
    httpRequest.open('GET','http://'+window.ip+':'+window.port +'/map/'+floorName + '/rooms/'+ (n+1) +'.json', true);
    httpRequest.send(null);
}
function putSprites() {
    bgr.img = sprites[currentFloor.textures.background];
    
}
function getSprite(item,index) {
    window.sprites[index]=new Image();
    window.sprites[index].src = 'http://'+window.ip+':'+window.port +'/map/'+window.floorName + '/textures/'+item;
}
function getTests() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            window.testList = JSON.parse(httpRequest.responseText);
        }
    };
    httpRequest.open('GET','http://'+window.ip+':'+window.port +'/tst/index.json', true);
    httpRequest.send(null);
}