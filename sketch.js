let fireOrbs = []
let players = []
let spawnDelay = 750;
let spawnTimer = 0;
let gameTimer = 0;
let pauseDelay = 0;
let gameTimerDelay = 0;
let paused = false;
let distanceTraveled = 0;
let jumps = 0;
let width = 0
let height = 0;

function setup(){
    width = windowWidth * 0.9
    height = windowHeight * 0.9
    makePlayer(width/2,height-(15/2),0,-3,15)

    createCanvas(windowWidth * 0.9,windowHeight * 0.9);
    textAlign(CENTER);
}

let downkey = []

function showInstructions(){
    fill(0,0,0);
    text("A to glide left, D to glide right",width/2,140);  
    text("W to slow your decent and jump when attatched to a red sphere",width/2 + 20,160); 
    text("S to speed up your fall",width/2,180);
    text("Stay on screen!",width/2,200);
    text("Travel as far as you can!",width/2,220);
}

function mobileControls(){
    if(players[0].standing){
        jumps += 1;
        players[0].xvel = 0;
        players[0].yvel = -2.75;
        players[0].standing = false;
        if(spawnDelay > 125){
          spawnDelay -= 6;
        }
    } else {
        if(mouseY <= players[0].x){
            if(players[0].yvel > 2){
                players[0].yvel -= 0.01;
            }
        }
    } 
    if(mouseX <= players[0].x){
        players[0].xvel += -0.1;
    } else {
        players[0].xvel -= -0.1;
    }
    if (mouseY >= players[0].y) {
        players[0].yvel += .05;
     } 
}

function draw(){
    noStroke();
    background(90); 
    if(jumps < 5){
        showInstructions();
    } else {
        fill(0,0,0);
        text("If needed press P to pause and unpause.",width/2 + 5,height - 20);
    }
    for (let i = 0; i < fireOrbs.length; i++) {
        fireOrbs[i].run()       
    }
    for (let i = 0; i < players.length; i++) {
        players[i].run()     
    }
    fill(0,0,0);
    text("Distance Travled",width/4,40);
    text(Math.floor(distanceTraveled * -1),width/4,80);
    text("Jumps",width/4 * 3,40);
    text(jumps,width/4 * 3,80);
    gameTimer = millis() - gameTimerDelay;
    spawnFireOrbs();
    if(mouseIsPressed){
        mobileControls();
    }
    
}

function Pause() { 
    if (!paused) {
      paused = true;
    } else if (paused) {
      gameTimerDelay = millis() - gameTimer; 
      paused = false;
    }
}

function makeFireOrb(x,y,xvel,yvel,size){
    let fireOrb = {}
    fireOrb.x = x
    fireOrb.y = y
    fireOrb.xvel = xvel
    fireOrb.yvel = yvel
    fireOrb.size = size
    fireOrb.render = function(){
        fill(255,0,0);
        ellipse(fireOrb.x,fireOrb.y,fireOrb.size,fireOrb.size)
    }
    fireOrb.move = function(){
        fireOrb.yvel += 0.06;
        fireOrb.x += fireOrb.xvel;
        fireOrb.y += fireOrb.yvel;
        if(players[0].yvel < 0){
            fireOrb.y -= players[0].yvel; 
        }
    }
    fireOrb.collide = function(){
        let walls = fireOrb.x - fireOrb.size * 2 > width || fireOrb.x + fireOrb.size * 2 < 0;
        if(walls){
          fireOrbs.splice(fireOrbs.indexOf(fireOrb),1);
        }
        for(let i = 0; i<players.length; i++){
          let Player = players[i];
          let above = Player.y + Player.size/2 > fireOrb.y - size/2;
          let withinX = Player.x - Player.size/2 < fireOrb.x + fireOrb.size/2 && Player.x + Player.size/2 > fireOrb.x - fireOrb.size/2;
          let withinY = Player.y - Player.size/2 < fireOrb.y + fireOrb.size/2 && Player.y + Player.size/2 > fireOrb.y - fireOrb.size/2;
          if(above && withinX && withinY && !Player.standing){
            players[i].standingOn = this;
            players[i].standing = true;
            fireOrb.xvel += players[i].xvel/2; 
            players[i].xvel = 0;
            players[i].yvel = 0;
          }
        }
      }

    fireOrb.end = function(){
        if(fireOrb.y - fireOrb.size * 2 > height){
            fireOrbs.splice(fireOrbs.indexOf(fireOrb),1);
        }
    }
    fireOrb.run = function(){
        if(!paused){
            fireOrb.move()
            fireOrb.collide()
            fireOrb.end()
        }
        fireOrb.render()
    }
    fireOrbs.push(fireOrb)
}

function makePlayer(x,y,xvel,yvel,size){
    let player = {}
    player.x = x
    player.y = y
    player.xvel = xvel
    player.yvel = yvel
    player.size = size
    player.standing = false
    player.standingOn = undefined;
    player.render = function(){
        fill(255,255,0);
        ellipse(player.x,player.y,player.size,player.size)
    }
    player.move = function(){
        if(player.yvel < 0){
            distanceTraveled += player.yvel; 
        }
        if(!player.standing){
            player.yvel += 0.02;
            player.x += player.xvel;
            player.y += player.yvel;
        } else {
            player.x = player.standingOn.x;
            player.y = player.standingOn.y - player.standingOn.size/2 - player.size/2;
        }
    }
    player.control = function(){
        if (keyIsDown(80) == true && pauseDelay < millis()) {
          pauseDelay = millis() + 1000;
          Pause();
        }
        if (keyIsDown(65) == true) { 
          player.xvel += -0.1;
        }
        if (keyIsDown(68) == true) {
          player.xvel += 0.1;
        }
        if (keyIsDown(87) == true) {   
          if(player.standing){
            jumps += 1;
            player.xvel = 0;
            player.yvel = -2.75;
            player.standing = false;
            if(spawnDelay > 125){
              spawnDelay -= 6;
            }
          } else {
            if(player.yvel > 2){
              player.yvel -= 0.01;
            }
          } 
        } 
        if (keyIsDown(83) == true) {
           player.yvel += .05;
        } 
    }
    player.collide = function(){
       let walls = player.x + player.size/2 > width || player.x - player.size/2 < 0;
       let floor = player.y + player.size/2 > height || player.y - player.size/2 < 0;
        if(walls || floor){
          player.end();
        } 
    }
    player.end = function(){
        player.y = height-player.size;
        player.x = width/2
        player.standing = false;
        player.yvel = -3;
        player.xvel = 0;
        distanceTraveled = 0;
        jumps = 0;
        spawnDelay = 750;
    }
    player.run = function(){
        if(!paused){
            player.move()
            player.collide()
        }  
        player.control()
        player.render()
    }
    players.push(player)
}

function spawnFireOrbs(){
    if (!paused) {
        if(gameTimer - gameTimerDelay > spawnTimer){
            makeFireOrb(random(width/4,(width/4)*3),0.0,random(-1,1),distanceTraveled/1050 * -3,40);
            spawnTimer = spawnDelay + gameTimer;
        }
    }
}