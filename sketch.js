let robot;
let groundMesh;
let textures = {};
let cameraYaw = 0;
let camPosX = 0;

function preload() {
  //textures.metal = loadImage("assets/metal.png");
  textures.plastic = loadImage("assets/plastic.png");
  textures.screen = loadImage("assets/screen.png");
  textures.head = loadImage("assets/head.png");
  textures.groud = loadImage("assets/ground.png");
  textures.wall = loadImage("assets/oilRig.png");
  textures.american = loadImage("assets/american.png");
  textures.skin = loadImage("assets/skin.png");
  textures.americanArms = loadImage("assets/americanArms.png");
  textures.americanLegs = loadImage("assets/americanLegs.png");
  textures.russia = loadImage("assets/russia.png");
  textures.kimFofo = loadImage("assets/kimFofo.jpg");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);

  cnv.mousePressed(() => {
    requestPointerLock();
  });

  robot = new Robot();
  groundMesh = createGroundMesh(2000, 12);
  wallMesh = createBoxMesh(2000, 1000, 12);
}

function drawGround() {
  push();
  setPlasticMaterial();
  let groundM = combineMatrices(
    Mat4.translation(0, 220, 0)
  );
  drawMesh(groundMesh, groundM, textures.groud);
  pop();
}


function drawWalls() {
  // Ajusta a altura da parede (y) e a distância do centro (z ou x)
  push();
  let yPos = -280; // Levanta a parede para assentar no chão 
  let dist = 1000;  // Metade da largura do chão (1400 / 2)
  
  setMetalMaterial();


  // Parede Frentewd

  let wallFront = combineMatrices(
    Mat4.translation(0, yPos, -dist),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallFront, textures.russia);

  // Parede Trás
  let wallBack = combineMatrices(
    Mat4.translation(0, yPos, dist),
    Mat4.rotationY(Math.PI),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallBack, textures.russia);

  // Parede Esquerda (rodada 90 graus no eixo Y)
  let wallLeft = combineMatrices(
    Mat4.translation(-dist, yPos, 0),
    Mat4.rotationY(Math.PI / 2),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallLeft, textures.russia);

  // Parede Direita (rodada 90 graus no eixo Y)
  let wallRight = combineMatrices(
    Mat4.translation(dist, yPos, 0),
    Mat4.rotationY(-Math.PI / 2),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallRight, textures.russia);
  pop();
}


function drawSceneLights() {
  ambientLight(40, 40, 55);

  directionalLight(
    210, 210, 230,
    -0.5, 0.8, -0.4
  );
  // para acompanhar o robot wa
  let spotX = robot.position[0];
  let spotY = robot.position[1]-700;
  let spotZ = robot.position[2]; 

  let dirX = 0;
  let dirY = 1;
  let dirZ = 0;

  spotLight(
    25, 15, 255,
    spotX, spotY, spotZ,
    dirX, dirY, dirZ,
    Math.PI ,
    100
  );


}

function drawBackgroundHelpers() {
  push();
  noStroke();
  fill(18, 20, 26);
  rectMode(CENTER);
  pop();
}

function draw() {
  background(18, 20, 26);

  handleRobotInput(robot);
  robot.update();

  let camDistance = 360;
  let camHeight = -70;
  let lookDistance = 120;


  let camX = robot.position[0] - Math.sin(cameraYaw) * camDistance;
  let camY = camHeight;
  let camZ = robot.position[2] - Math.cos(cameraYaw) * camDistance;

  let lookX = robot.position[0] - Math.sin(cameraYaw) * lookDistance;
  let lookY = robot.position[1] + 20;
  let lookZ = robot.position[2] - Math.cos(cameraYaw) * lookDistance;

  camera(
    camX, camY, camZ,
    lookX, lookY, lookZ,
    0, 1, 0
  );

  drawSceneLights();

  noStroke();
  //specularMaterial(220);
  //shininess(24);

  drawGround();
  drawWalls();
  robot.draw(textures);

  drawHUD();
}


function setMetalMaterial() {


  specularMaterial(255, 255, 255); 

  shininess(100);                   

  emissiveMaterial(0, 0, 0);       
}

function setPlasticMaterial() {


  specularMaterial(50, 50, 50);    

  shininess(5);                    

  emissiveMaterial(0, 0, 0);       
}

function setScreenMaterial() {

  specularMaterial(255, 255, 255); 
  shininess(100);                  
  
  emissiveMaterial(150, 0, 10);  
}



function setEnvironmentMaterial() {
  specularMaterial(220);
  shininess(24);
}

function drawHUD() {
  resetMatrix();
  camera();
  noLights();

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("WASD mover | Setas rodar câmara | J/L cabeça esq./dir. | I/K cabeça cima/baixo | Q/E cotovelo esq. | Z/C cotovelo dir.", 20 - width / 2, 20 - height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
