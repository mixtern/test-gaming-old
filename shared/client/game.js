//создание глобальных переменных
var game = {},
    keys = {};
//управление
var stats = {floor:0,level:0}
function keyPressed(n){
    return (n in keys);
}
window.addEventListener("keydown", function(e){
    if (!(e.keyCode in keys)) {
            keys[e.keyCode]=true;
        }
    }, true);
window.addEventListener('keyup',function(e){
        if (e.keyCode in keys) {
            delete keys[e.keyCode];
        }
    },true);
//генератор случайных чисел
function getRnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
//Последовательность чисел
function range(start,end) {
    if (start > end){
        [start,end]=[end,start];
    }
    var res = [];
    for(var x = start;x<=end;x++){
        res.push(x);
    }
    return res;
}
//
function isBlock(x,y) {
    return !(isNaN(main.blocks[x][y]) || main.blocks[x][y]==='0');
}
//
var physics = {
        const:{g:10,
            jumpForce:6,
            maxSpeed:5,
            boost:1
        },
        facingWall:function () {
            var x = player.x;
            var y = player.y;
            var height = player.sprite.naturalHeight;
            var width = player.sprite.naturalWidth;
            var res = false;
            var xx = 0;
            if (player.speed > 0){
                xx = Math.floor((x+width+player.speed)/25);
                    range(Math.floor(y/25),Math.floor((y+height)/25)).forEach(function (yy){
                        if (isBlock(xx,yy))res = true;
                })
            } else if(player.speed < 0){
                xx = Math.floor((x+player.speed)/25);
                    range(Math.floor(y/25),Math.floor((y+height)/25)).forEach(function (yy){
                        if (isBlock(xx,yy)) res = true;
                    })
            }
            return res;
        },
        calc:function(){
            physics.jump();
            physics.gravity();
            physics.movement();
            var res = physics.doorCollision();
            if(res){
                sendAnswer(res);
            }
        },
        gravity:function () {
            player.g-=physics.const.g/60;
            var bx1 = Math.floor((player.x+1)/25);
            var bx2 = Math.floor((player.x + player.sprite.naturalWidth-1)/25);
            var by1 = Math.floor((player.y + player.sprite.naturalHeight-player.g)/25);
            var by2 = Math.floor((player.y - player.g)/25);
            if (isBlock(bx1,by1)||isBlock(bx2,by1)){
                player.g = 0;
                player.inAir=false;
            }
            else {
                if(isBlock(bx1,by2)||isBlock(bx2,by2)){
                    player.g=-Math.abs(player.g)
                }
                player.y -= player.g;
                player.inAir=true;
            }

            return player.inAir;
        },
        movement:function () {
            var dir = 0;
            if (keyPressed(37)) dir-=1;
            if (keyPressed(39)) dir+=1;
            if (dir === 0) {
            player.speed-=Math.sign(player.speed)*physics.const.boost;
            }
            else{
                player.speed += physics.const.boost * dir;
                player.speed = Math.abs(player.speed) > physics.const.maxSpeed ? Math.sign(player.speed) * physics.const.maxSpeed : player.speed;
            }
            if(physics.facingWall()){
                player.speed = 0;
            }
            else player.x += player.speed;
        },
        jump:function () {
            if((keyPressed(32)||keyPressed(38))&&!player.inAir){
                player.g=physics.const.jumpForce;
            }
        },
        doorCollision:function () {
            var res;
            main.doors.forEach(function (door,n) {
                if(
                    (player.x>door.x*25)&&
                    ((player.x+player.sprite.naturalWidth)<(door.x*25+main.doorTextures[n].naturalWidth))&&
                    (player.y>door.y*25)&&
                    ((player.y+player.sprite.naturalHeight)<(door.y*25+main.doorTextures[n].naturalHeight))
                ){
                    res = n;
                }
                else res = false;
            });
            console.log(res);
            return res;
        }
    },
    set = {
        mode:function(mode){
            game.mode = mode;
        }
    },
    temp,main,bgr,player,gui;
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
            //TODO OFFSET
            bgr.ctx.drawImage(bgr.img,0,0);
        }
    };
    main = {
        canvas:document.getElementById("main"),
        ctx:document.getElementById("main").getContext('2d'),
        blocks:[],
        doors:new Array(4).fill({}),
        height:0,
        width:0,
        textures:[],
        doorTextures:[],
        draw:function() {
            temp.ctx.clearRect(0, 0, 800, 600);
            if (game.mode === "debug") {
                var x,y;
                for (x = 0; x * 25 < 800; x++) {
                    for (y = 0; y * 25 < 600; y++) {
                        temp.ctx.strokeStyle = "#0000FF";
                        temp.ctx.strokeRect(x * 25, y * 25, 25, 25);
                    }
                }
            }
            for (x = 0; x < main.width; x++) {
                for (y = 0; y < main.height; y++) {
                    if(main.blocks[x][y]>0 && !isNaN(main.blocks[x][y])){
                        temp.ctx.drawImage(main.textures[main.blocks[x][y]-1],x*25,y*25);
                   }
                   else {
                        if (main.blocks[x][y] ==='p' && !((~-player.x || ~-player.y)>0)){
                            player.x = x*25;
                            player.y= y*25
                        }
                        if (main.blocks[x][y][0] === 'd'){
                            main.doors[main.blocks[x][y][1]-1]={x:x,y:y};
                        }
                    }
                }
            }
            main.drawDoors();
            main.ctx.clearRect(0, 0, 800, 600);
            //TODO OFFSET
            main.ctx.drawImage(temp, 0, 0)
        },
        drawDoors:function(){
            for(var i = 0;i<4;i++){
                temp.ctx.drawImage(main.doorTextures[i],main.doors[i].x*25,main.doors[i].y*25+25-main.doorTextures[i].naturalHeight);
            }
        }
    };
    player = {
        speed:0,
        canvas:document.getElementById("player"),
        ctx:document.getElementById("player").getContext('2d'),
        x:-1,
        y:-1,
        g:0,
        sprite:new Image(),
        draw:function(){
            temp.ctx.clearRect(0, 0, 800, 600);
            temp.ctx.drawImage(player.sprite,player.x,player.y);
            player.ctx.clearRect(0, 0, 800, 600);
            player.ctx.drawImage(temp, 0, 0)
        }
    };
    gui = {
        //TODO QUESTIONS
        canvas:document.getElementById("gui"),
        ctx:document.getElementById("gui").getContext('2d'),
        draw:function(){
            temp.ctx.clearRect(0, 0, 800, 600);
            var x = 300;
            var startY = 400;
            for(var y = startY,i=0;i<5;y+=30,i++){
                temp.ctx.font = '20px Open Sans';
                if (i===0){
                    temp.ctx.fillText(testList.questions[0],x,y,400);
                }
                else{
                    temp.ctx.fillText((i).toString()+"."+testList.answers[0][i-1],x,y,400);
                }
                gui.ctx.clearRect(0, 0, 800, 600);
                gui.ctx.drawImage(temp, 0, 0);
            }
        }
    };
    temp.ctx = temp.getContext('2d');
    window.game = {
        //TODO REMOVE mode:"debug",
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
            bgr.draw();
            main.draw();
            player.draw();
            gui.draw();
            physics.calc();
        }};
});
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
        }
    };
    httpRequest.open('GET','http://'+window.ip+':'+window.port +'/map/'+floorName + '/index.json', true);
    httpRequest.send(null);
}
function nextFloor() {
    stats.floor++;
    loadFloor(stats.floor % map.floors.length);
}
function getSprites() {
    window.sprites=new Array(currentFloor.textures.list.length);
    currentFloor.textures.list.forEach(getSprite);
    window.spritesLeft = currentFloor.textures.list.length;
}
function getSprite(item,index) {
    window.sprites[index]=new Image();
    sprites[index].addEventListener('load', function () {
        spritesLeft--;
        if(!spritesLeft){
            setTimeout(function () {
                putSprites();
                getRooms();
            },1000);
        }
    });
    sprites[index].src = 'http://'+window.ip+':'+window.port +'/map/'+window.floorName + '/textures/'+item;
}
function getRooms() {
    currentFloor.rooms = new Array(currentFloor.roomCount);
    window.roomsLeft = currentFloor.roomCount;
    for(var i = 0; i < currentFloor.roomCount;i++){
        getRoom(i);
    }
}
function setRoom(n) {
    main.blocks = currentFloor.rooms[n].map;
    main.width = currentFloor.rooms[n].width;
    main.height = currentFloor.rooms[n].height;
    mapBlocks();
}
function nextRoom() {
    stats.level++;
    if(stats.level<currentFloor.roomCount){
        stats.level=0;
        nextFloor();
    }
    setRoom()
}
function mapBlocks() {
    for(var i = 0;i < currentFloor.textures.blocks.length;i++){
        main.textures[i] = sprites[currentFloor.textures.blocks[i]];
    }
    for(var i = 0;i < currentFloor.textures.doors.length;i++){
        main.doorTextures[i] = sprites[currentFloor.textures.doors[i]];
    }
}
function getRoom(n) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            currentFloor.rooms[n] = JSON.parse(httpRequest.responseText);
            roomsLeft--;
            if (!roomsLeft){
                setRoom(0);
                game.start();
            }
        }
    };
    httpRequest.open('GET','http://'+window.ip+':'+window.port +'/map/'+floorName + '/rooms/'+ (n+1) +'.json', true);
    httpRequest.send(null);
}
function putSprites() {
    bgr.img = sprites[currentFloor.textures.background];
    player.sprite = sprites[currentFloor.textures.player];
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
function sendAnswer(number) {
    //TODO SENDING ANSWER TO SERVER
    console.log(number);
    nextRoom();
}