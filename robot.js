class Robot {
    constructor() {
      this.position = [0, 70, 0];
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
        waist: createBoxMesh(70, 26, 42),
  
        neck: createBoxMesh(18, 14, 18),
        head: createBoxMesh(62, 58, 58),
        visor: createTrapezoidPrismMesh(34, 26, 18, 6),
        eyePanel: createBoxMesh(28, 10, 4),
  
        shoulderPad: createTrapezoidPrismMesh(36, 26, 20, 34),
        upperArm: createBoxMesh(24, 72, 24),
        elbowJoint: createBoxMesh(22, 20, 22),
        forearm: createBoxMesh(20, 64, 20),
        hand: createBoxMesh(22, 18, 20),
  
        upperLeg: createBoxMesh(30, 84, 30),
        kneeJoint: createBoxMesh(26, 18, 26),
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
        let s2 = Math.sin(this.walkCycle + Math.PI);
  
        this.leftHip = 0.55 * s;
        this.rightHip = 0.55 * s2;
  
        this.leftShoulder = -0.45 * s;
        this.rightShoulder = -0.45 * s2;
  
        this.leftKnee = Math.max(0, -0.55 * s);
        this.rightKnee = Math.max(0, -0.55 * s2);
      } else {
        this.leftHip *= 0.85;
        this.rightHip *= 0.85;
        this.leftShoulder *= 0.85;
        this.rightShoulder *= 0.85;
        this.leftKnee *= 0.8;
        this.rightKnee *= 0.8;
      }
    }
  
    draw(textures) {
      let root = M(
        Mat4.translation(this.position[0], this.position[1], this.position[2]),
        Mat4.rotationY(this.bodyYaw)
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
  
      let chestPanelM = M(
        torsoM,
        Mat4.translation(0, -12, 33)
      );
      drawMesh(this.mesh.chestPanel, chestPanelM, textures.screen);
  
      let waistM = M(
        torsoM,
        Mat4.translation(0, 84, 0)
      );
      drawMesh(this.mesh.waist, waistM, textures.plastic);
    }
  
    drawHead(root, textures) {
      let neckM = M(
        root,
        Mat4.translation(0, -78, 0)
      );
      drawMesh(this.mesh.neck, neckM, textures.plastic);
  
      let headM = M(
        neckM,
        Mat4.translation(0, -38, 0),
        Mat4.rotationY(this.headYaw),
        Mat4.rotationX(this.headPitch)
      );
      drawMesh(this.mesh.head, headM, textures.metal);
  
      let visorM = M(
        headM,
        Mat4.translation(0, -4, 32)
      );
      drawMesh(this.mesh.visor, visorM, textures.plastic);
  
      let eyePanelM = M(
        headM,
        Mat4.translation(0, -4, 36)
      );
      drawMesh(this.mesh.eyePanel, eyePanelM, textures.screen);
  
      let antennaBaseM = M(
        headM,
        Mat4.translation(20, -40, 0)
      );
      drawMesh(this.mesh.antenna, antennaBaseM, textures.plastic);
    }
  
    drawArm(root, textures, left) {
      let side = left ? -1 : 1;
      let shoulderRot = left ? this.leftShoulder : this.rightShoulder;
      let elbowRot = left ? this.leftElbow : this.rightElbow;
  
      let shoulderBase = M(
        root,
        Mat4.translation(68 * side, -46, 0)
      );
      drawMesh(this.mesh.shoulderPad, shoulderBase, textures.plastic);
  
      let upperArmM = M(
        shoulderBase,
        Mat4.rotationZ(shoulderRot * side),
        Mat4.translation(0, 46, 0)
      );
      drawMesh(this.mesh.upperArm, upperArmM, textures.metal);
  
      let elbowM = M(
        upperArmM,
        Mat4.translation(0, 48, 0)
      );
      drawMesh(this.mesh.elbowJoint, elbowM, textures.plastic);
  
      let forearmM = M(
        elbowM,
        Mat4.rotationZ(elbowRot * side),
        Mat4.translation(0, 42, 0)
      );
      drawMesh(this.mesh.forearm, forearmM, textures.plastic);
  
      let handM = M(
        forearmM,
        Mat4.translation(0, 42, 0)
      );
      drawMesh(this.mesh.hand, handM, textures.metal);
    }
  
    drawLeg(root, textures, left) {
      let side = left ? -1 : 1;
      let hipRot = left ? this.leftHip : this.rightHip;
      let kneeRot = left ? this.leftKnee : this.rightKnee;
  
      let upperLegM = M(
        root,
        Mat4.translation(26 * side, 100, 0),
        Mat4.rotationZ(hipRot * side),
        Mat4.translation(0, 42, 0)
      );
      drawMesh(this.mesh.upperLeg, upperLegM, textures.metal);
  
      let kneeM = M(
        upperLegM,
        Mat4.translation(0, 52, 0)
      );
      drawMesh(this.mesh.kneeJoint, kneeM, textures.plastic);
  
      let lowerLegM = M(
        kneeM,
        Mat4.rotationZ(kneeRot * side),
        Mat4.translation(0, 46, 0)
      );
      drawMesh(this.mesh.lowerLeg, lowerLegM, textures.plastic);
  
      let footM = M(
        lowerLegM,
        Mat4.translation(0, 50, 14)
      );
      drawMesh(this.mesh.foot, footM, textures.metal);
    }
  
    drawBackCables(root, textures) {
      let leftCableM = M(
        root,
        Mat4.translation(-22, 20, -34)
      );
      drawMesh(this.mesh.cable, leftCableM, textures.plastic);
  
      let rightCableM = M(
        root,
        Mat4.translation(22, 20, -34)
      );
      drawMesh(this.mesh.cable, rightCableM, textures.plastic);
    }
  }