/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart, win;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.jpg");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/GameO.png");
  restartImg = loadImage("assets/restart.png");
  winImg= loadImage("./assets/win.png");
  jumpSound = loadSound("assets/jump.wav");
  eatSound= loadSound("./assets/eat.wav");
  collidedSound = loadSound("assets/collided.wav");
  winSound= loadSound("./assets/win.wav");
}

function setup() {
  createCanvas(windowWidth-20, windowHeight-20);

  jungle = createSprite(width/2,height/8,width,height);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=2

  kangaroo = createSprite(width,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.25;
  kangaroo.setCollider("circle",0,0,320);
  //kangaroo.debug= true;
  frameRate(30);
    
  invisibleGround = createSprite(width/2,height-100,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(width/2,height/3);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.06;
  restart.scale = 0.01;

  win= createSprite(width/2, height/2);
  win.addImage(winImg);
  win.scale = 0.04;

  gameOver.visible = false;
  restart.visible = false;
  win.visible = false;
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  kangaroo.x=camera.position.x-400;
   
  if (gameState===PLAY){

    jungle.velocityX=-(6 + 3*score/100)

    if(jungle.x<100)
    {
       jungle.x=400
    }
   //console.log(kangaroo.y)
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
    eatSound.play();
      score = score + 1;
      shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    win.visible=true;
   // kangaroo.changeAnimation("collided",kangaroo_collided);
    kangaroo.visible = false;
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    shrubsGroup.destroyEach();
    obstaclesGroup.destroyEach();

    if (!winSound.isPlaying()) {
      winSound.play();
    }
  }
  
  
  drawSprites();

  textSize(40);
  fill("blue");
  textAlign(CENTER);
  textFont("'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif");
  stroke(20);
  text("SCORE: "+ score, width/2,50);
  
  if(score >= 5){
    gameState = WIN;
  }
}

function spawnShrubs() {
 
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,height-120,40,10);

    shrub.velocityX = -(6 + 3*score/100)
    //shrub.scale = 1.5;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
       
    shrub.scale =0.1;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,height-120,40,40);
    obstacle.setCollider("rectangle",0,0,200,200);
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  kangaroo.changeAnimation("running",
               kangaroo_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  score = 0;

}
