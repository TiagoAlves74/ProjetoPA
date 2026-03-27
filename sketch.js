let robot;
let groundMesh;
let textures = {};

function preload() {
  //textures.metal = loadImage("assets/metal.png");
  textures.plastic = loadImage("assets/plastic.png");
  textures.screen = loadImage("assets/screen.png");
  textures.head = loadImage("assets/head.png");
  textures.groud = loadImage("assets/ground.png");
  textures.wall = loadImage("assets/oilRig.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);

  robot = new Robot();
  groundMesh = createGroundMesh(2000, 12);
  wallMesh = createBoxMesh(2000, 1000, 12);
}

function drawGround() {
  let groundM = combineMatrices(
    Mat4.translation(0, 220, 0)
  );
  drawMesh(groundMesh, groundM, textures.groud);
}


function drawWalls() {
  // Ajusta a altura da parede (y) e a distância do centro (z ou x)
  let yPos = -100; // Levanta a parede para assentar no chão (ajusta se necessário)
  let dist = 1000;  // Metade da largura do chão (1400 / 2)

  // Parede Frente
  let wallFront = combineMatrices(
    Mat4.translation(0, yPos, -dist),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallFront, textures.wall);

  // Parede Trás
  let wallBack = combineMatrices(
    Mat4.translation(0, yPos, dist),
    Mat4.rotationY(Math.PI),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallBack, textures.wall);

  // Parede Esquerda (rodada 90 graus no eixo Y)
  let wallLeft = combineMatrices(
    Mat4.translation(-dist, yPos, 0),
    Mat4.rotationY(Math.PI / 2),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallLeft, textures.wall);

  // Parede Direita (rodada 90 graus no eixo Y)
  let wallRight = combineMatrices(
    Mat4.translation(dist, yPos, 0),
    Mat4.rotationY(-Math.PI / 2),
    Mat4.rotationZ(Math.PI)
  );
  drawMesh(wallMesh, wallRight, textures.wall);
}


function drawSceneLights() {
  ambientLight(55, 55, 60);

  directionalLight(
    210, 210, 230,
    -0.5, 0.8, -0.4
  );

  let spotX = robot.position[0];
  let spotY = -180;
  let spotZ = robot.position[2] + 240;

  let dirX = 0;
  let dirY = 0.35;
  let dirZ = -1;

  spotLight(
    255, 245, 230,
    spotX, spotY, spotZ,
    dirX, dirY, dirZ,
    Math.PI / 7,
    70
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

  let camX = robot.position[0] - Math.sin(robot.bodyYaw) * 360;
  let camY = -70;
  let camZ = robot.position[2] - Math.cos(robot.bodyYaw) * 360;

  camera(
    camX, camY, camZ,
    robot.position[0], robot.position[1] + 20, robot.position[2],
    0, 1, 0
  );

  drawSceneLights();

  noStroke();
  specularMaterial(220);
  shininess(24);

  drawGround();
  drawWalls();
  robot.draw(textures);

  drawHUD();
}

function drawHUD() {
  resetMatrix();
  camera();
  noLights();

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("W/S mover | A/D rodar corpo | Setas cabeça | Q/E cotovelo esq. | Z/C cotovelo dir.", 20 - width / 2, 20 - height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
