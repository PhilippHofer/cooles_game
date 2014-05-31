var xpos=50,ypos=0;
var bg;
var xlength = 40, ylength = 40;
var isPressed=false;
var playerHeight=40;

$(document).ready(function(){
	function getRandomBackground(){
		var bg2 = ["castle",
				   "city",
					"desert",
					"mars",
					"rainforest",
					"sea",
					"slum",
					"space",
					"blue_sea",
					"Landschaft",
					"Landschaft_blue",
					"Sunset"];
		bg = bg2[Math.floor(Math.random()*bg2.length)];
		return("background_"+bg+".png");
	}
	var randomBackground = getRandomBackground();
	var bg = '#000 url(images/bg/'+randomBackground+') no-repeat';
	document.body.style.background = bg;
	document.body.style.backgroundSize = "100%";


	$("body").keydown(function(e) {
		isPressed=true;
	});
	
	$('body').bind( "touchstart", function(e){
        isPressed=true;
	});
	
	$("body").keyup(function(e) {
		isPressed=false;
	});
	
	$('body').bind( "touchend", function(e){
        isPressed=false;
	});
	movePlayerDown();
	movePlayerUp();
	function movePlayerUp(){
		if(isPressed&&ypos>0 && playing){
			ypos-=3;
		}
		setTimeout(movePlayerUp,15);

	}
	function movePlayerDown(){
		if(!isPressed&&ypos<window.innerHeight-playerHeight && playing){
			ypos+=3;
		}
		setTimeout(movePlayerDown,15);
	}
});

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";



canvas = document.getElementById("myCanvas"),
        mouse = {};
canvas.width = window.innerWidth; //document.width is obsolete
canvas.height = window.innerHeight; //document.height is obsolete
var maxX = canvas.width;
var maxY = canvas.height;
var points= 0;
var actStage=1;
var showStage = false;
var playing = false;
var restart = false;
var enemy=new Image();

var player = new Image();
var life=new Image();
var timeRedScreen = new Date().getTime()-1; //nicht anzeigen

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);

collision = document.getElementById("collide");


// Start Button object
startBtn = {
    w: 100,
    h: 50,
    x: maxX/2 - 50,
    y: maxY/2 - 25,

    draw: function() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.strokeStyle = "white";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText("Start", maxX/2, maxY/2 );
    }
};

// Start Button object
restartBtn = {
    w: 100,
    h: 50,
    x: maxX/2 - 50,
    y: maxY-75,

    draw: function() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.strokeStyle = "white";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText("Restart", maxX/2, maxY-50);
    }
};

//Je nach Browser spezielle Methode
var requestAnimationFrame = window.requestAnimationFrame    ||
		window.mozRequestAnimationFrame    ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame     ||
		window.oRequestAnimationFrame      ||
		function(callback){ //Browser die kein HTML5 unterstützen
			return window.setTimeout(callback, 1000/60);
		};


// Track the position of mouse cursor
function trackPosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

// On button click (Restart and start)
function btnClick(e) {


    // Variables for storing mouse position on click
    var mx = e.pageX,
        my = e.pageY;

    // Click start button
    if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
        playing = true;
        updateScreen();

        // Delete the start button after clicking it
        startBtn = {};
    }else if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w && restart) {
        window.location.reload();

        // Delete the start button after clicking it
        restartBtn = {};
    }
}

$( "html" ).mouseup(function() {
    isPressed = false;
});
$( "html" ).mousedown(function() {
    isPressed = true;
});


//Enemys deklarieren und initialisieren
var enemys_length=50;
var enemys = new Array(enemys_length);
var enemySpeed=8;
var enemysVisible=new Array(enemys_length);
for(var i=0;i<enemys_length;i++){
	enemysVisible[i]=true;
}
//Leben deklarieren und initialisieren
var lifes_length=5;//immer gleich
var lifes=new Array(lifes_length);
var startLife = 3, lifeSpeed=5;
var lifesVisible=new Array(lifes_length);
for(var i=0;i<lifes_length;i++){
	lifesVisible[i]=true;
}
//Enemys array mit werten füllen
for(var i=0;i<enemys_length;i++){
	enemys[i]=new Array(2);
	var xStart=Math.round(Math.random()*10000)+1500;
	enemys[i][0]=xStart;
}
for(var i=0;i<enemys_length;i++){
	var eHeight=Math.round(Math.random()*(maxY-20));
	enemys[i][1]=eHeight;
}
//lifes array mit werten füllen
for(var i=0;i<lifes_length;i++){
	lifes[i]=new Array(2);
	var xStart=Math.round(Math.random()*10000)+1500;
	lifes[i][0]=xStart;
}
for(var i=0;i<lifes_length;i++){
	var lHeight=Math.round(Math.random()*(maxY-20));
	lifes[i][1]=lHeight;
}



player.onload = function() {
	ypos=maxY/2;
	ctx.drawImage(player, xpos, ypos);
};
player.src = 'images/player.png';
updateScreen();

function updateScreen(){
    if(playing){
        moveEnemys();
        moveLifes();
        ctx.clearRect(0,0,maxX,maxY);
        ctx.drawImage(player, xpos,ypos);
        drawEnemys();
        drawLifes();
        drawStage();
        drawRedScreen();

        if(lifesEmpty()){
            fillLifes();
        }
        if(enemysEmpty()){
            fillEnemys();
        }
        if(startLife>0)
            requestAnimationFrame(updateScreen);
        else
            gameOver();
    }else{
        startBtn.draw();
    }
}

function drawRedScreen(){
    if(timeRedScreen > new Date().getTime()){
        ctx.globalAlpha=0.5;
        ctx.fillStyle="#FF0000";
        ctx.fillRect(0,0,maxX,maxY);
        ctx.globalAlpha = 1;
    }
}

var levelUp=new Image();
levelUp.src = 'images/levelUp.png';
function drawStage(){
	if(showStage){
		ctx.drawImage(levelUp, 150, maxY/2-350/2);

        ctx.font="150px Impact bold";
        ctx.fillStyle = "#289a28";
        ctx.fillText("LEVEL "+actStage,390,maxY/2-350/2-50);
	}
}
//Prüfen ob Enemys leer
function enemysEmpty(){
	for(var i=0;i<enemys_length;i++){
		if(enemysVisible[i]){
			return false;
		}
	}
	return true;
}
//Enemys auffüllen
function fillEnemys(){
	enemys_length+=50;
	enemys = new Array(enemys_length);
	enemySpeed++;
	enemysVisible=new Array(enemys_length);
	for(var i=0;i<enemys_length;i++){
		enemysVisible[i]=true;
	}
	
	for(var i=0;i<enemys_length;i++){
		enemys[i]=new Array(2);
		var xStart=Math.round(Math.random()*10000)+1500;
		enemys[i][0]=xStart;
	}
	for(var i=0;i<enemys_length;i++){
		var eHeight=Math.round(Math.random()*(maxY-20));
		enemys[i][1]=eHeight;
	}
	calcStage();
}


function calcStage(){
	var levelUp=new Image();
	ctx.drawImage(levelUp, 100, 100); //Gameover.png -> 605*574px
	levelUp.src = 'images/levelUp.png';
	actStage++;
	showStage = true;
	setTimeout(stageFalse,1500);
}

function stageFalse(){
	showStage = false;
}


//lifes empty
function lifesEmpty(){
	for(var i=0;i<lifes_length;i++){
		if(lifesVisible[i]){
			return false;
		}
	}
	return true;
}
//lifes auffüllen
function fillLifes(){
	lifes=new Array(lifes_length);
	lifesVisible=new Array(lifes_length);
	for(var i=0;i<lifes_length;i++){
		lifesVisible[i]=true;
	}
	
	for(var i=0;i<lifes_length;i++){
		lifes[i]=new Array(2);
		var xStart=Math.round(Math.random()*10000)+1500;
		lifes[i][0]=xStart;
	}
	for(var i=0;i<lifes_length;i++){
		var lHeight=Math.round(Math.random()*(maxY-20));
		lifes[i][1]=lHeight;
	}
}
//Enemys bewegen
function moveEnemys(){
	for(var i=0;i<enemys_length;i++){
		enemys[i][0]-=enemySpeed;
	}
}
//Leben bewegen
function moveLifes(){
	for(var i=0;i<lifes_length;i++){
		points++;
		lifes[i][0]-=lifeSpeed;
	}
}

//Überprüft ob eine Kollision vorliegt
function checkCollision(lifeX,lifeY){ //Pos Leben
	//Check if Life auf da söbn y achse wie Person
	if(lifeY >= ypos-34 && lifeY <= ypos+ylength){
		//Söwe auf da x Achse
		if(lifeX >= xpos && lifeX <= xpos+xlength){
			return(true);
		}
		//return(false);
	}
	return(false);
}
//Zeichnet alle Enemys
function drawEnemys(){
	for(var i=0;i<enemys_length;i++){
		if(checkCollision(enemys[i][0],enemys[i][1])&&enemysVisible[i]){
			startLife--;
            timeRedScreen = new Date().getTime()+200;

			enemysVisible[i] = false;
		}
		if(enemys[i][0] < 0){
			enemysVisible[i] = false;
		}
		if(enemysVisible[i]){
			ctx.drawImage(enemy, enemys[i][0], enemys[i][1]);
		}

	}
	
	//life.src = 'images/lifes.png';
	enemy.src = 'images/enemy.png';
}
//Zeichnet alle Herzen
function drawLifes(){
	for(var i=0;i<lifes_length;i++){
		if(checkCollision(lifes[i][0],lifes[i][1])&&lifesVisible[i]){
			if(startLife < 5)
				startLife++;
			lifesVisible[i] = false;
		}
		if(lifes[i][0] < 0){
			lifesVisible[i] = false;
		}
		if(lifesVisible[i]){
			ctx.drawImage(life, lifes[i][0], lifes[i][1]);
		}

	}
	for(var i=0;i<startLife;i++){
		ctx.drawImage(life,maxX-i*45-60,20);
	}
	ctx.font="30px Verdana";
	ctx.strokeStyle = "red";

	ctx.strokeText(Math.round(points/500)+" Points!",100,50);
	
	//life.src = 'images/lifes.png
	life.src = 'images/life_small.png';
}

function gameOver(){
    restart = true;
    restartBtn.draw();
    playing = false;
	var gameOver=new Image();

	gameOver.onload = function() {
		ctx.drawImage(gameOver, (maxX-605)/2, (maxY-574)/2); //Gameover.png -> 605*574px

		var endpoints = Math.round(points/500);

		// Retrieve
		var oldHighscore = localStorage.getItem("highscore");
		var newHighscore;
		if(oldHighscore == "" || oldHighscore == null) newHighscore = endpoints;
		else newHighscore = oldHighscore + ";" + endpoints;



		var splitted = newHighscore.split(";");
		splitted.sort(sortNumber);
		splitted.reverse();
		var counter = 1;
		var lineheight = 30;
		ctx.font="30px Verdana";
		ctx.fillStyle = "green";
		ctx.fillText("Highscore",200,200-lineheight);
		var cuttedHighscore="";
		var marked = false;
		for(var i=0; i<splitted.length && counter <=10; i++){
			if(isNumber(splitted[i])){
				var count = (counter < 10 ? "0"+counter : counter);
				if(splitted[i] == endpoints && !marked){
					ctx.fillStyle = "red";
					marked = true;
				}else ctx.fillStyle = "green"
				ctx.fillText(count+". "+splitted[i], 200, 200 + (i*lineheight) );
				cuttedHighscore+=splitted[i]+";";
				counter++;
			}
		}
		if(!marked) {
			ctx.fillStyle = "red";
			ctx.fillText("Your score: "+endpoints, 200, 200 + (10*lineheight) );
		}

		// Store
		localStorage.setItem("highscore", cuttedHighscore);
	};

	function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
	function sortNumber(a,b) {
		return a - b;
	}







	gameOver.src = (Math.floor(Math.random()*2) == 0 ? 'images/gameover.png' : 'images/gameover2.png');
}