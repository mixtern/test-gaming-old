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
proto = {
	/*level:{
	height:,
	width:,
	sprites:{},
	map:Array
	},*/
	block:function(x,y,img){
		var obj={
		sprite:new Image(),
		type:"block",
		collision:false,
		draw:function(x,y){
			temp.ctx.drawImage(this.sprite,x*32,y*24);
		}};
		obj.sprite.src = img;
		return obj;
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
false);
window.addEventListener('keyup',
    function(e){
        if (e.keyCode in keys) {
    	delete keys[e.keyCode];
	}
    },
false);
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
	draw:function(){
		temp.ctx.clearRect(0,0,800,600);
		if(game.mode == "debug"){
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
		mode:"debug",
		start:function(){
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
		game.start();
	});