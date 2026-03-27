let robot;
let groundMesh;
let textures = {};
let cameraYaw = 0;

function preload() {
  textures.metal = loadImage("assets/metal.png");
  textures.plastic = loadImage("assets/plastic.png");
  textures.screen = loadImage("assets/screen.png");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);

  cnv.mousePressed(() => {
    requestPointerLock();
  });

  robot = new Robot();
  groundMesh = createGroundMesh(1400, 12);
}

function drawGround() {
  let groundM = combineMatrices(
    Mat4.translation(0, 220, 0)
  );
  drawMesh(groundMesh, groundM, textures.plastic);
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
  specularMaterial(220);
  shininess(24);

  drawGround();
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
  text("WASD mover | Setas rodar câmara | J/L cabeça esq./dir. | I/K cabeça cima/baixo | Q/E cotovelo esq. | Z/C cotovelo dir.", 20 - width / 2, 20 - height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
