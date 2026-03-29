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
      upperTorso: createTrapezoidPrismMesh(70, 95, 140, 50), 
      // Prisma retangular para a zona abdominal
      lowerTorso: createBoxMesh(80, 60, 50),
      chestPanel: createBoxMesh(44, 34, 6),

      waist: createBoxMesh(42, 34, 34),
      thighCoverLeft: createBoxMesh(30, 60, 20),
      thighCoverRight: createBoxMesh(30, 60, 20),

      neck: createCylinderMesh(16,14,14),
      head: createEllipsoidMesh(30, 35.5, 28, 32, 32),
      faceMask: createHalfSphereMesh(35, 32, 32),
      visor: createTrapezoidPrismMesh(34, 26, 18, 6),
      eyePanel: createBoxMesh(28, 10, 4),

      shoulderPad: createTrapezoidPrismMesh(36, 26, 20, 34),
      shoulderJoint: createSphereMesh(14, 16, 16), // Rótula do ombro

      upperArm: createCylinderMesh(10, 12, 72), 
      elbowJoint: createSphereMesh(10, 16, 16), // Rótula do cotovelo
      forearm: createCylinderMesh(8, 10, 64),

      handPalm: createBoxMesh(10, 16, 18),

      fingerProx: createBoxMesh(3.2, 12, 5),
      fingerMid: createBoxMesh(2.8, 10, 4),
      fingerDist: createBoxMesh(2.4, 8, 3.5),

      thumbProx: createBoxMesh(4.5, 10, 5),
      thumbDist: createBoxMesh(4, 8, 4.5),

      hipJoint: createSphereMesh(18, 16, 16), // Rótula da anca

      upperLeg: createCylinderMesh(14, 11, 100), 
      kneeJoint: createSphereMesh(10, 16, 16), // Rótula do joelho

      lowerLeg: createCylinderMesh(14, 9, 110),
      foot: createTrapezoidPrismMesh(34, 24, 18, 56),


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
    push();
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
    //this.drawBackCables(root, textures);
    pop();
  }

  drawTorso(root, textures) {


    setScreenMaterial();
    let upperTorsoM = combineMatrices(
      root,
      Mat4.translation(0, 0, 0) // Sobe para encaixar no pescoço
    );
    // Nota: Usa textures.body se tiveres a textura da bandeira aplicada
    drawMesh(this.mesh.upperTorso, upperTorsoM, textures.american);

    
    

    setMetalMaterial();
    let waistM = combineMatrices(
      root,
      Mat4.translation(0, 92, 0)
    );
    drawMesh(this.mesh.waist, waistM, textures.americanLegs);

  }

  drawHead(root, textures) {

    setPlasticMaterial();
    let neckM = combineMatrices(
      root,
      Mat4.translation(0, -78, 0)
    );
    drawMesh(this.mesh.neck, neckM, textures.skin);


    let headBaseM = combineMatrices(
      neckM,
      Mat4.translation(0, -38, 0),
      Mat4.rotationY(this.headYaw),
      Mat4.rotationX(this.headPitch),
      
    );


    drawMesh(this.mesh.head, headBaseM, textures.skin); 


    let faceM = combineMatrices(
      headBaseM,
      Mat4.translation(0, 0, -2),
      Mat4.rotationX(Math.PI), 
      Mat4.rotationX(-0.20),    
      Mat4.rotationY(-Math.PI)     
    );

    drawMesh(this.mesh.faceMask, faceM, textures.head);

  

    


  }

  drawArm(root, textures, left) {

    setMetalMaterial();
    let side = left ? -1 : 1;
    let shoulderRot = left ? this.leftShoulder : this.rightShoulder;
    let elbowRot = left ? this.leftElbow : this.rightElbow;

    // 1. Base do ombro (Alinhada com o pescoço e semi-embutida no torso)
    let shoulderBase = combineMatrices(
      root,
      Mat4.translation(58 * side, -60, 0) // Movido para cima e para dentro
    );

    // Ombreira (Subida ligeiramente para cobrir o topo da junta de forma natural)
    /*let shoulderPadM = combineMatrices(
      shoulderBase,
      Mat4.translation(0, -16, 0)
    );
    drawMesh(this.mesh.shoulderPad, shoulderPadM, textures.plastic);*/


    let shoulderJointM = combineMatrices(
      shoulderBase,
      Mat4.rotationX(-shoulderRot)
    );
    drawMesh(this.mesh.shoulderJoint, shoulderJointM, textures.americanArms);


    let upperArmM = combineMatrices(
      shoulderJointM,
      Mat4.translation(0, 46, 0)
    );
    drawMesh(this.mesh.upperArm, upperArmM, textures.americanArms);

    // 4. Esfera da junta do cotovelo
    let elbowM = combineMatrices(
      upperArmM,
      Mat4.translation(0, 36, 0) 
    );
    drawMesh(this.mesh.elbowJoint, elbowM, textures.americanArms);


    let forearmM = combineMatrices(
      elbowM,
      Mat4.rotationX(elbowRot),
      Mat4.translation(0, 32, 0) 
    );
    drawMesh(this.mesh.forearm, forearmM, textures.americanArms);


    this.drawHand(forearmM, textures, left);

  }

  drawHand(forearmM, textures, left) {

    setPlasticMaterial();
    let side = left ? -1 : 1;
  
    let palmM = combineMatrices(
      forearmM,
      Mat4.translation(0, 42, 0),
      Mat4.rotationY(-side * Math.PI / 4),
      Mat4.rotationZ(side * 0.10),
      Mat4.rotationX(0.15)
    );
    drawMesh(this.mesh.handPalm, palmM, textures.skin);
  
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
    drawMesh(this.mesh.thumbProx, thumbProxM, textures.skin);
    
    let thumbDistM = combineMatrices(
      thumbProxM,
      Mat4.translation(0, 4.5, 0),
      Mat4.rotationX(-0.20),
      Mat4.rotationZ(0.08 * side),
      Mat4.translation(0, 2.8, 0)
    );
    drawMesh(this.mesh.thumbDist, thumbDistM, textures.skin);

  }

  drawFinger(palmM, textures, x, y, z, baseCurl, side) {

    setPlasticMaterial();
    let curlSign = side;
  
    // falange proximal
    let proxM = combineMatrices(
      palmM,
      Mat4.translation(x, y, z),
      Mat4.rotationZ(curlSign * baseCurl),
      Mat4.translation(0, 6, 0)
    );
    drawMesh(this.mesh.fingerProx, proxM, textures.skin);
  
    // falange média
    let midM = combineMatrices(
      proxM,
      Mat4.translation(0, 6, 0),
      Mat4.rotationZ(curlSign * baseCurl * 2.5),
      Mat4.translation(0, 5, 0)
    );
    drawMesh(this.mesh.fingerMid, midM, textures.skin);
  
    // falange distal
    let distM = combineMatrices(
      midM,
      Mat4.translation(0, 5, 0),
      Mat4.rotationZ(curlSign * baseCurl * 2.5),
      Mat4.translation(0, 4, 0)
    );
    drawMesh(this.mesh.fingerDist, distM, textures.skin);

  }

  drawLeg(root, textures, left) {

    setMetalMaterial();
    let side = left ? -1 : 1;
    let hipRot = left ? this.leftHip : this.rightHip;
    let kneeRot = left ? this.leftKnee : this.rightKnee;

    // 1. Base da anca
    let hipBase = combineMatrices(
      root,
      Mat4.translation(26 * side, 72, 0)
    );

    // 2. Esfera da junta da anca (Roda com a perna)
    let hipJointM = combineMatrices(
      hipBase,
      Mat4.rotationX(hipRot)
    );
    drawMesh(this.mesh.hipJoint, hipJointM, textures.americanLegs);

    // 3. Cilindro da Coxa
    let upperLegM = combineMatrices(
      hipJointM,
      Mat4.translation(0, 60, 0) // Metade da altura da coxa (84/2)
    );
    drawMesh(this.mesh.upperLeg, upperLegM, textures.americanLegs);

    // 4. Esfera do Joelho
    let kneeM = combineMatrices(
      upperLegM,
      Mat4.translation(0, 60, 0)
    );
    drawMesh(this.mesh.kneeJoint, kneeM, textures.americanLegs);

    // 5. Cilindro da Canela (Roda a partir do joelho)
    let lowerLegM = combineMatrices(
      kneeM,
      Mat4.rotationX(-kneeRot),
      Mat4.translation(0, 55, 0) // Metade da altura da canela (76/2)
    );
    drawMesh(this.mesh.lowerLeg, lowerLegM, textures.americanLegs);

    // 6. Pé
    let footM = combineMatrices(
      lowerLegM,
      Mat4.translation(0, 38, 18),
      Mat4.rotationX(-0.12)
    );
    drawMesh(this.mesh.foot, footM, textures.plastic);

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