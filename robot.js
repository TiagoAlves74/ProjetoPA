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
  
      // Tornar o robot mais humano:
      // 1. Torso com forma de "V" (Trapezóide) em vez de caixa reta.
      // 2. Articulações e mãos esféricas para suavizar o visual "quadrado".
      this.mesh = {
        torso: createTrapezoidPrismMesh(110, 85, 140, 60), // (topW, botW, height, depth) - ombros largos
        chestPanel: createBoxMesh(44, 34, 6),
        waist: createBoxMesh(70, 26, 42),
  
        neck: createBoxMesh(18, 14, 18),
        head: createSphereMesh(40, 58, 58),
       //visor: createTrapezoidPrismMesh(34, 26, 18, 6),
        //eyePanel: createBoxMesh(28, 10, 4),
  
        shoulderPad: createTrapezoidPrismMesh(36, 26, 20, 34),
        upperArm: createBoxMesh(24, 72, 24),
        elbowJoint: createSphereMesh(15, 32, 32), // Esfera em vez de Box
        forearm: createBoxMesh(20, 64, 20),
        hand: createSphereMesh(13, 32, 32),       // Esfera (punho) em vez de Box
  
        upperLeg: createBoxMesh(30, 84, 30),
        kneeJoint: createSphereMesh(20, 32, 32),  // Esfera em vez de Box
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
    
        // coxa: sobe mais à frente, recua menos atrás
        this.leftHip = 0.90 * leftForward - 0.35 * leftBack;
        this.rightHip = 0.90 * rightForward - 0.35 * rightBack;
    
        // braços em oposição
        this.leftShoulder = -0.55 * sOpp;
        this.rightShoulder = -0.55 * s;
    
        // joelhos
        this.leftKnee = 0.08 + 0.70 * leftBack * leftBack + 0.12 * leftForward;
        this.rightKnee = 0.08 + 0.70 * rightBack * rightBack + 0.12 * rightForward;
    
        // antebraços
        this.leftElbow = 0.35 + 0.20 * Math.sin(this.walkCycle * 2);
        this.rightElbow = 0.35 + 0.20 * Math.sin(this.walkCycle * 2 + Math.PI);
    
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
        Mat4.translation(0, 84, 0)
      );
      drawMesh(this.mesh.waist, waistM, textures.plastic);
    }
  
    drawHead(root, textures) {
      let neckM = combineMatrices(
        root,
        Mat4.translation(0, -78, 0)
      );
      drawMesh(this.mesh.neck, neckM, textures.metal);
  
      let headM = combineMatrices(
        neckM,
        Mat4.translation(0, -45, 0),
        Mat4.rotationY(this.headYaw),
        Mat4.rotationX(this.headPitch),
        Mat4.rotationY(Math.PI / 2 ), 
        Mat4.rotationX(-Math.PI  ),
        Mat4.rotationZ(0.5),
        Mat4.scale(0.85, 1.0, 1.0) 
      );
      drawMesh(this.mesh.head, headM, textures.head);
  
     /* let visorM = combineMatrices(
        headM,
        Mat4.translation(0, -4, 32)
      );
      drawMesh(this.mesh.visor, visorM, textures.plastic);
  
      let eyePanelM = combineMatrices(
        headM,
        Mat4.translation(0, -4, 36)
      );
      drawMesh(this.mesh.eyePanel, eyePanelM, textures.screen);*/
  
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
        Mat4.rotationX(shoulderRot),
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
    
      let handM = combineMatrices(
        forearmM,
        Mat4.translation(0, 42, 0)
      );
      drawMesh(this.mesh.hand, handM, textures.metal);
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