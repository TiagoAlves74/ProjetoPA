function angleLerp(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

function handleRobotInput(robot) {
  const moveSpeed = 2.8;
  const rotSpeed = 0.04;
  const jointSpeed = 0.035;
  const bodyTurnSmooth = 0.22;

  robot.isWalking = false;

  // rodar câmara tipo jogo
  if (keyIsDown(LEFT_ARROW)) {
    cameraYaw += rotSpeed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    cameraYaw -= rotSpeed;
  }

  let inputX = 0;
  let inputZ = 0;

  if (keyIsDown(87)) inputZ += 1; // W
  if (keyIsDown(83)) inputZ -= 1; // S
  if (keyIsDown(65)) inputX += 1; // A
  if (keyIsDown(68)) inputX -= 1; // D

  if (inputX !== 0 || inputZ !== 0) {
    let len = Math.hypot(inputX, inputZ);
    inputX /= len;
    inputZ /= len;

    let sinY = Math.sin(cameraYaw);
    let cosY = Math.cos(cameraYaw);

    // inputs corrigidos
    let worldX = inputX * cosY + inputZ * sinY;
    let worldZ = inputZ * cosY - inputX * sinY;

    robot.position[0] += worldX * moveSpeed;
    robot.position[2] += worldZ * moveSpeed;
    robot.isWalking = true;

    // corpo vira suavemente para a direção do movimento
    let targetYaw = Math.atan2(-worldX, -worldZ);
    robot.bodyYaw = angleLerp(robot.bodyYaw, targetYaw, bodyTurnSmooth);
  }

  if (keyIsDown(74)) { // J
    robot.headYaw -= rotSpeed;
  }

  if (keyIsDown(76)) { // L
    robot.headYaw += rotSpeed;
  }

  if (keyIsDown(73)) { // I
    robot.headPitch -= rotSpeed;
  }

  if (keyIsDown(75)) { // K
    robot.headPitch += rotSpeed;
  }

  if (keyIsDown(81)) { // Q
    robot.leftElbow += jointSpeed;
  }

  if (keyIsDown(69)) { // E
    robot.leftElbow -= jointSpeed;
  }

  if (keyIsDown(90)) { // Z
    robot.rightElbow -= jointSpeed;
  }

  if (keyIsDown(67)) { // C
    robot.rightElbow += jointSpeed;
  }

  robot.leftElbow = constrain(robot.leftElbow, -1.2, 1.2);
  robot.rightElbow = constrain(robot.rightElbow, -1.2, 1.2);
  robot.headYaw = constrain(robot.headYaw, -1.0, 1.0);
  robot.headPitch = constrain(robot.headPitch, -0.6, 0.6);
}