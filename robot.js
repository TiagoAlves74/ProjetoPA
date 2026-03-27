class Robot {
  constructor() {
    this.position = [0, -30, 0];
    this.bodyYaw = 0;
    this.headYaw = 0;
    this.headPitch = 0;

    this.leftShoulder = 0;
    this.rightShoulder = 0;
    this.leftElbow = 0;
    this.rightElbow = 0;

    this.leftHip = 0;
    this.rightHip = 0;
    this.leftKnee = 0;
    this.rightKnee = 0;

    this.walkCycle = 0;
    this.isWalking = false;

    this.mesh = {
      torso: createBoxMesh(100, 140, 60),
      chestPanel: createBoxMesh(44, 34, 6),

      waist: createBoxMesh(42, 34, 34),
      thighCoverLeft: createBoxMesh(30, 60, 20),
      thighCoverRight: createBoxMesh(30, 60, 20),

      neck: createBoxMesh(18, 14, 18),
      head: createSphereMesh(35, 58, 58),
      visor: createTrapezoidPrismMesh(34, 26, 18, 6),
      eyePanel: createBoxMesh(28, 10, 4),

      shoulderPad: createTrapezoidPrismMesh(36, 26, 20, 34),
      upperArm: createBoxMesh(24, 72, 24),
      elbowJoint: createBoxMesh(22, 20, 22),
      forearm: createBoxMesh(20, 64, 20),

      handPalm: createBoxMesh(24, 16, 18),

      fingerProx: createBoxMesh(3.2, 12, 5),
      fingerMid: createBoxMesh(2.8, 10, 4),
      fingerDist: createBoxMesh(2.4, 8, 3.5),

      thumbProx: createBoxMesh(4.5, 10, 5),
      thumbDist: createBoxMesh(4, 8, 4.5),

      upperLeg: createBoxMesh(30, 84, 30),
      kneeJoint: createBoxMesh(32, 22, 32),
      lowerLeg: createBoxMesh(24, 76, 24),
      foot: createTrapezoidPrismMesh(34, 24, 18, 56),

      antenna: createBoxMesh(6, 28, 6),
      cable: createCableMesh(38, 6, 6)
    };
  }

  update() {
    if (this.isWalking) {
      this.walkCycle += 0.09;

      let s = Math.sin(this.walkCycle);
      let sOpp = Math.sin(this.walkCycle + Math.PI);

      let leftForward = Math.max(0, s);
      let rightForward = Math.max(0, sOpp);

      let leftBack = Math.max(0, -s);
      let rightBack = Math.max(0, -sOpp);

      this.leftHip = 0.75 * leftForward - 0.30 * leftBack;
      this.rightHip = 0.75 * rightForward - 0.30 * rightBack;

      this.leftShoulder = -this.rightHip * 0.9;
      this.rightShoulder = -this.leftHip * 0.9;

      this.leftKnee = 0.08 + 0.95 * leftForward * leftForward;
      this.rightKnee = 0.08 + 0.95 * rightForward * rightForward;

      this.leftElbow = 0.30 + 0.18 * Math.sin(this.walkCycle * 2 + Math.PI);
      this.rightElbow = 0.30 + 0.18 * Math.sin(this.walkCycle * 2);
    } else {
      this.leftHip *= 0.82;
      this.rightHip *= 0.82;
      this.leftShoulder *= 0.82;
      this.rightShoulder *= 0.82;
      this.leftKnee *= 0.75;
      this.rightKnee *= 0.75;
      this.leftElbow *= 0.8;
      this.rightElbow *= 0.8;
    }
  }

  draw(textures) {
    let root = combineMatrices(
      Mat4.translation(this.position[0], this.position[1], this.position[2]),
      Mat4.rotationY(Math.PI + this.bodyYaw),
      Mat4.scale(0.82, 0.82, 0.82)
    );

    this.drawTorso(root, textures);
    this.drawHead(root, textures);
    this.drawArm(root, textures, true);
    this.drawArm(root, textures, false);
    this.drawLeg(root, textures, true);
    this.drawLeg(root, textures, false);
    this.drawBackCables(root, textures);
  }

  drawTorso(root, textures) {
    let torsoM = root;
    drawMesh(this.mesh.torso, torsoM, textures.metal);

    let chestPanelM = combineMatrices(
      torsoM,
      Mat4.translation(0, -12, 33)
    );
    drawMesh(this.mesh.chestPanel, chestPanelM, textures.screen);

    let waistM = combineMatrices(
      torsoM,
      Mat4.translation(0, 92, 0)
    );
    drawMesh(this.mesh.waist, waistM, textures.plastic);
  }

  drawHead(root, textures) {
    let neckM = combineMatrices(
      root,
      Mat4.translation(0, -78, 0)
    );
    drawMesh(this.mesh.neck, neckM, textures.plastic);

    let headM = combineMatrices(
      neckM,
      Mat4.translation(0, -38, 0),
      Mat4.rotationY(this.headYaw),
      Mat4.rotationX(this.headPitch)
    );
    drawMesh(this.mesh.head, headM, textures.metal);

    let visorM = combineMatrices(
      headM,
      Mat4.translation(0, -4, 32)
    );
    drawMesh(this.mesh.visor, visorM, textures.plastic);

    let eyePanelM = combineMatrices(
      headM,
      Mat4.translation(0, -4, 36)
    );
    drawMesh(this.mesh.eyePanel, eyePanelM, textures.screen);

    let antennaBaseM = combineMatrices(
      headM,
      Mat4.translation(20, -40, 0)
    );
    drawMesh(this.mesh.antenna, antennaBaseM, textures.plastic);
  }

  drawArm(root, textures, left) {
    let side = left ? -1 : 1;
    let shoulderRot = left ? this.leftShoulder : this.rightShoulder;
    let elbowRot = left ? this.leftElbow : this.rightElbow;

    let shoulderBase = combineMatrices(
      root,
      Mat4.translation(68 * side, -46, 0)
    );
    drawMesh(this.mesh.shoulderPad, shoulderBase, textures.plastic);

    let upperArmM = combineMatrices(
      shoulderBase,
      Mat4.rotationX(-shoulderRot),
      Mat4.translation(0, 46, 0)
    );
    drawMesh(this.mesh.upperArm, upperArmM, textures.metal);

    let elbowM = combineMatrices(
      upperArmM,
      Mat4.translation(0, 48, 0)
    );
    drawMesh(this.mesh.elbowJoint, elbowM, textures.plastic);

    let forearmM = combineMatrices(
      elbowM,
      Mat4.rotationX(elbowRot),
      Mat4.translation(0, 42, 0)
    );
    drawMesh(this.mesh.forearm, forearmM, textures.plastic);

    this.drawHand(forearmM, textures, left);
  }

  drawHand(forearmM, textures, left) {
    let side = left ? -1 : 1;
  
    let palmM = combineMatrices(
      forearmM,
      Mat4.translation(0, 42, 0),
      Mat4.rotationY(-side * Math.PI / 4),
      Mat4.rotationZ(side * 0.10),
      Mat4.rotationX(0.15)
    );
    drawMesh(this.mesh.handPalm, palmM, textures.metal);
  
    let fingerBaseY = 9;
    let fingerBaseZ = [-7, -2.5, 2.5, 7];
  
    for (let i = 0; i < 4; i++) {
      let baseCurl = 0.12 + i * 0.01;
      let extraY = (i === 1 || i === 2) ? 0.5 : 0;
  
      this.drawFinger(
        palmM,
        textures,
        0,
        fingerBaseY + extraY,
        fingerBaseZ[i],
        baseCurl,
        side
      );
    }
  
    // polegar no lado de fora de cada mão
    let thumbBaseM = combineMatrices(
      palmM,
      Mat4.translation(-12 * side, 2.5, 0),
      Mat4.rotationZ(0.95 * side),
      Mat4.rotationY(0.25 * side),
      Mat4.rotationX(0.40)
    );
    
    let thumbProxM = combineMatrices(
      thumbBaseM,
      Mat4.rotationX(0.02),
      Mat4.translation(0, 4, 0)
    );
    drawMesh(this.mesh.thumbProx, thumbProxM, textures.plastic);
    
    let thumbDistM = combineMatrices(
      thumbProxM,
      Mat4.translation(0, 4.5, 0),
      Mat4.rotationX(-0.20),
      Mat4.rotationZ(0.08 * side),
      Mat4.translation(0, 2.8, 0)
    );
    drawMesh(this.mesh.thumbDist, thumbDistM, textures.plastic);
  }

  drawFinger(palmM, textures, x, y, z, baseCurl, side) {
    let curlSign = side;
  
    // falange proximal
    let proxM = combineMatrices(
      palmM,
      Mat4.translation(x, y, z),
      Mat4.rotationZ(curlSign * baseCurl),
      Mat4.translation(0, 6, 0)
    );
    drawMesh(this.mesh.fingerProx, proxM, textures.plastic);
  
    // falange média
    let midM = combineMatrices(
      proxM,
      Mat4.translation(0, 6, 0),
      Mat4.rotationZ(curlSign * baseCurl * 2.5),
      Mat4.translation(0, 5, 0)
    );
    drawMesh(this.mesh.fingerMid, midM, textures.plastic);
  
    // falange distal
    let distM = combineMatrices(
      midM,
      Mat4.translation(0, 5, 0),
      Mat4.rotationZ(curlSign * baseCurl * 2.5),
      Mat4.translation(0, 4, 0)
    );
    drawMesh(this.mesh.fingerDist, distM, textures.plastic);
  }

  drawLeg(root, textures, left) {
    let side = left ? -1 : 1;
    let hipRot = left ? this.leftHip : this.rightHip;
    let kneeRot = left ? this.leftKnee : this.rightKnee;

    let hipBase = combineMatrices(
      root,
      Mat4.translation(26 * side, 72, 0)
    );

    let upperLegM = combineMatrices(
      hipBase,
      Mat4.rotationX(hipRot),
      Mat4.translation(0, 38, 0)
    );

    let thighCoverM = combineMatrices(
      upperLegM,
      Mat4.translation(0, -24, 8)
    );
    drawMesh(
      left ? this.mesh.thighCoverLeft : this.mesh.thighCoverRight,
      thighCoverM,
      textures.plastic
    );

    drawMesh(this.mesh.upperLeg, upperLegM, textures.metal);

    let kneeM = combineMatrices(
      upperLegM,
      Mat4.translation(0, 46, 6)
    );
    drawMesh(this.mesh.kneeJoint, kneeM, textures.plastic);

    let lowerLegM = combineMatrices(
      kneeM,
      Mat4.rotationX(-kneeRot),
      Mat4.translation(0, 42, 0)
    );
    drawMesh(this.mesh.lowerLeg, lowerLegM, textures.plastic);

    let footM = combineMatrices(
      lowerLegM,
      Mat4.translation(0, 32, 18),
      Mat4.rotationX(-0.12)
    );
    drawMesh(this.mesh.foot, footM, textures.metal);
  }

  drawBackCables(root, textures) {
    let leftCableM = combineMatrices(
      root,
      Mat4.translation(-22, 20, -34)
    );
    drawMesh(this.mesh.cable, leftCableM, textures.plastic);

    let rightCableM = combineMatrices(
      root,
      Mat4.translation(22, 20, -34)
    );
    drawMesh(this.mesh.cable, rightCableM, textures.plastic);
  }
}
