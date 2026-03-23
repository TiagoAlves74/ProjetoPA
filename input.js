function handleRobotInput(robot) {
    const moveSpeed = 2.8;
    const rotSpeed = 0.04;
    const jointSpeed = 0.035;
  
    robot.isWalking = false;
  
    if (keyIsDown(87)) { // W
      robot.position[0] += Math.sin(robot.bodyYaw) * moveSpeed;
      robot.position[2] += Math.cos(robot.bodyYaw) * moveSpeed;
      robot.isWalking = true;
    }
  
    if (keyIsDown(83)) { // S
      robot.position[0] -= Math.sin(robot.bodyYaw) * moveSpeed;
      robot.position[2] -= Math.cos(robot.bodyYaw) * moveSpeed;
      robot.isWalking = true;
    }
  
    if (keyIsDown(65)) { // A
      robot.bodyYaw += rotSpeed;
    }
  
    if (keyIsDown(68)) { // D
      robot.bodyYaw -= rotSpeed;
    }
  
    if (keyIsDown(LEFT_ARROW)) {
      robot.headYaw += rotSpeed;
    }
  
    if (keyIsDown(RIGHT_ARROW)) {
      robot.headYaw -= rotSpeed;
    }
  
    if (keyIsDown(UP_ARROW)) {
      robot.headPitch -= rotSpeed;
    }
  
    if (keyIsDown(DOWN_ARROW)) {
      robot.headPitch += rotSpeed;
    }
  
    if (keyIsDown(81)) { // Q
      robot.leftElbow -= jointSpeed;
    }
  
    if (keyIsDown(69)) { // E
      robot.leftElbow += jointSpeed;
    }
  
    if (keyIsDown(90)) { // Z
      robot.rightElbow += jointSpeed;
    }
  
    if (keyIsDown(67)) { // C
      robot.rightElbow -= jointSpeed;
    }
  
    robot.leftElbow = constrain(robot.leftElbow, -1.2, 1.2);
    robot.rightElbow = constrain(robot.rightElbow, -1.2, 1.2);
    robot.headYaw = constrain(robot.headYaw, -1.0, 1.0);
    robot.headPitch = constrain(robot.headPitch, -0.6, 0.6);
  }