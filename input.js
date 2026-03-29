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
  const cameraSpeed = 0.10;

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


  let targetYaw = map(mouseX, 0, width, -1.2, 1.2);
  let targetPitch = map(mouseY, 0, height, 0.6, -0.6);

  // Usar 'lerp' para suavizar o movimento (0.08 é a velocidade de reação)
  robot.headYaw = lerp(robot.headYaw, targetYaw, 0.08);
  robot.headPitch = lerp(robot.headPitch, targetPitch, 0.08);

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

  



  if (keyIsDown(81)) {
    

    let waveTime = millis() * 0.01; 
    

    let targetShoulder = Math.PI ; 
    
    // 3. O alvo do cotovelo oscila usando a onda do seno (entre -0.6 e 0.6)
    let targetElbow = Math.sin(waveTime) * 0.6; 
    let targetWrist = Math.sin(waveTime * 1.5) * 0.4;
    

    robot.leftShoulder = lerp(robot.leftShoulder, -targetShoulder, 0.08);

    robot.leftElbow = lerp(robot.leftElbow, targetElbow, 0.2);
    
    
  }


  


  robot.leftElbow = constrain(robot.leftElbow, -1.2, 1.2);
  robot.rightElbow = constrain(robot.rightElbow, -1.2, 1.2);
  robot.headYaw = constrain(robot.headYaw, -0.8, 0.8);
  robot.headPitch = constrain(robot.headPitch, -0.5, 0.5);
}