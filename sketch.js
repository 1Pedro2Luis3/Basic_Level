//cria as variáveis para armazenar os objetos
var trex, trex_correndo, trex_morrendo;
var terreno1, terreno2, solo;
var Nuvem, cloud;
var Obstaculos, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;
var Perdeu, Acabou;
var Reiniciar, Reset;
var SomPulo, SomMorte, SomCheckPoint;
var Pontuaçao = 0;
var EstadoJogo = "Inicio";

//carrega as imagens que serão usadas
function preload(){
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_morrendo = loadAnimation("trex_collided.png");
  solo = loadAnimation("ground2.png");
  cloud = loadAnimation("cloud.png");
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");
  Acabou = loadImage("gameOver.png");
  Reset = loadImage("restart.png");
  SomPulo = loadSound("jump.mp3");
  SomMorte = loadSound("die.mp3");
  SomCheckPoint = loadSound("checkPoint.mp3");
}

//configura o programa
function setup(){
  //cria a tela
  createCanvas(600,200);
  
  //cria e anima o sprite do trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("correndo",trex_correndo);
  trex.addAnimation("bateu", trex_morrendo);
  trex.scale = 0.45;
  
  //cria e anima o sprite do terreno 1
  terreno1 = createSprite(300,170,600,10);
  terreno1.addAnimation("chão", solo);
  terreno1.x = terreno1.width/2;
  
  //cria e anima o sprite do terreno 2
  terreno2 = createSprite(300,175,600,10);
  terreno2.visible = 0;
  
  //cria as bordas da tela 
  borda = createEdgeSprites(); 
  //console.log("Olá Pedro " + numero);
  
  Perdeu = createSprite(300,80,50,50);
  Perdeu.addImage("lose", Acabou);
  Perdeu.scale = 0.8;
  Perdeu.visible = 0;
  
  Reiniciar = createSprite(300,130,50,50);
  Reiniciar.addImage("resetar", Reset);
  Reiniciar.scale = 0.5;
  Reiniciar.visible = 0;
  
  //cria um grupo de obstáculos e nuvens
  grupoObstaculo = new Group();
  grupoNuvens = new Group();
  
  //testes raio de colisão
  trex.setCollider("circle",0,0,45);
  trex.debug = 0;
}

function draw(){
  //define cor de fundo
  background("white");
  
  //usando console log para exibir informações no console
  //console.log(trex.y);
  //console.log(terreno1.x);
  
  if(EstadoJogo === "Inicio" && keyDown("space")){
    terreno1.velocityX = 0;
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculo.setVelocityXEach(0);
    EstadoJogo = "jogando";
  }
  
  if(EstadoJogo === "jogando"){
    GerarNuvens();
    CriarCactaceae();
    
  //Dá a sensação de tela infinita
  if(terreno1.x < 0){
    terreno1.x = terreno1.width/2;
  }  
    terreno1.velocityX = -4 - Pontuaçao/500;

    
  //Faz o trex pular ao pressionar a tecla espaço
  if(keyDown("UP_ARROW") && trex.y > 146){
    trex.velocityY = -11;
    
    SomPulo.play();
  } 
    
  //Dá sensação de gravidade ao trex e faz ele colidir com o solo
  trex.velocityY = trex.velocityY + 0.7;
    
  //Contabiliza a pontuação
  Pontuaçao += Math.round(frameCount/80);
  
  if(Pontuaçao%500 === 0 && Pontuaçao > 0){
    SomCheckPoint.play();
  }
  
  
  if(trex.isTouching(grupoObstaculo)){
    EstadoJogo = "fim";
    trex.velocityY = 0;
    
    SomMorte.play();
  }
}
  else if (EstadoJogo === "fim"){
    terreno1.velocityX = 0;
    grupoNuvens.setVelocityXEach(0);
    grupoNuvens.setLifetimeEach(-1);
    grupoObstaculo.setVelocityXEach(0);
    grupoObstaculo.setLifetimeEach(-1);
    
    trex.changeAnimation("bateu", trex_morrendo);
    
    Perdeu.visible = 1;
    Reiniciar.visible = 1;
    
    if(mousePressedOver(Reiniciar)){
      Reinicio();
    }
  }
  
  //Não deixa o trex cair do cenário 
  trex.collide(terreno2);
  
  //desenha os sprites
  drawSprites();
  
  //Exibe a pontuação
  textSize(13);
  text("Pontos: "+ Pontuaçao, 400, 30);
  fill("black");
}

function GerarNuvens(){
  
  
  if(frameCount%90 == 0){
    Nuvem = createSprite(525,45,10,10);
    Nuvem.addAnimation("Nuvens", cloud);
    Nuvem.scale = 1.5;
    Nuvem.velocityX = -6 - Pontuaçao/750;
    
    //adicionar o sprite ao grupo
    grupoNuvens.add(Nuvem);
    
    //atribuir tempo de vida para a variável
    Nuvem.lifetime = 100;
    
    Nuvem.y = Math.round(random(20,75));
    
    Nuvem.depth = 1;
    trex.depth = 1;
    trex.depth = Nuvem.depth + 1;
    
    //console.log(Nuvem.depth);
    
    //console.log(trex.depth);
  }
}

function CriarCactaceae(){
  
  if(frameCount%60 == 0){
    Obstaculos = createSprite(580,155,10,10);
    Obstaculos.scale = 0.42;
    Obstaculos.velocityX = -4 - Pontuaçao/1000;
    Obstaculos.lifetime = 150;
    
    //adicionar ao grupo de obstáculos
    grupoObstaculo.add(Obstaculos);
    
    var grupodecactos = Math.round(random(1,6));
     switch(grupodecactos){
       case 1: Obstaculos.addImage(cacto1);
         break;
       case 2: Obstaculos.addImage(cacto2);
         break;
       case 3: Obstaculos.addImage(cacto3);
         break;
       case 4: Obstaculos.addImage(cacto4);
         break;
       case 5: Obstaculos.addImage(cacto5);
         break;
       case 6: Obstaculos.addImage(cacto6);
         break;
     default: break;
    }
  }
}

function Reinicio(){
  grupoNuvens.destroyEach();
  grupoObstaculo.destroyEach();
  Pontuaçao = 0;
  EstadoJogo = "Inicio";
  Perdeu.visible = 0;
  Reiniciar.visible = 0;
  
  trex.changeAnimation("correndo", trex_correndo);
}
