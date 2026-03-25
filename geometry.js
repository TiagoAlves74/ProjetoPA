/**
 * 
 * Function to subtract two vectors
 * With the result of a - b we can have the direction from b to a, which is useful for calculating normals and other vector operations.
 * @param {*} a vector 
 * @param {*} b vector 
 * @returns the result of a - b, which is the vector pointing from b to a
 * 
 */
function vecSub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }
  
/**

 * @param {*} a vector 
 * @param {*} b vector 
 * @returns a vector that is perpendicular to both a and b.
 */

  function vecCross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
  
  /**
   * 
   * @param {*} v vector
   * @return the length of the vector v, which is calculated using the Pythagorean theorem in three-dimensional space.
  */

  function vecLength(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
  /**
   * 
   * @param {*} v 
   * @returns the normalized version of the vector v, which is a vector that has the same direction as v but a length of 1. 
   */
  function vecNormalize(v) {
    let len = vecLength(v);
    if (len < 0.000001) return [0, 1, 0];
    return [v[0] / len, v[1] / len, v[2] / len];
  }
  

  /**
   * 
   * @param  {...any} matrices seprated by comma
   * @returns the result of multiplying all the given matrices together in the order they were provided. Its useful for combining muultiple transformations, for eg
   */
  function combineMatrices(...matrices) {
    let result = Mat4.identity();
    for (let mat of matrices) {
      result = Mat4.multiply(result, mat);
    }
    return result;
  }

  
  function createEmptyMesh() {
    return { tris: [] };
  }
  
  
  /**
   * 
   * @param {*} mesh 
   * @param {*} a 
   * @param {*} b 
   * @param {*} c 
   * @param {*} uva 
   * @param {*} uvb 
   * @param {*} uvc 
   * 
   * This function adds a triangle to the mesh by taking three vertices (a, b, c) and their corresponding UV coordinates (uva, uvb, uvc).
   */
  function addTriangle(mesh, a, b, c, uva = [0, 0], uvb = [1, 0], uvc = [0, 1]) {
    mesh.tris.push({
      positions: [a, b, c],
      uvs: [uva, uvb, uvc]
    });
  }
  

  function addQuad(mesh, a, b, c, d, uv00 = [0, 1], uv10 = [1, 1], uv11 = [1, 0], uv01 = [0, 0]) {
    addTriangle(mesh, a, b, c, uv00, uv10, uv11);
    addTriangle(mesh, a, c, d, uv00, uv11, uv01);
  }
  
  function createBoxMesh(w = 1, h = 1, d = 1) {
    let mesh = createEmptyMesh();
  
    let x = w / 2;
    let y = h / 2;
    let z = d / 2;
  
    let p000 = [-x, -y, -z];
    let p100 = [ x, -y, -z];
    let p110 = [ x,  y, -z];
    let p010 = [-x,  y, -z];
  
    let p001 = [-x, -y,  z];
    let p101 = [ x, -y,  z];
    let p111 = [ x,  y,  z];
    let p011 = [-x,  y,  z];
  
    addQuad(mesh, p001, p101, p111, p011); // frente
    addQuad(mesh, p100, p000, p010, p110); // trás
    addQuad(mesh, p000, p001, p011, p010); // esquerda
    addQuad(mesh, p101, p100, p110, p111); // direita
    addQuad(mesh, p011, p111, p110, p010); // cima
    addQuad(mesh, p000, p100, p101, p001); // baixo
  
    return mesh;
  }
  
  function createTrapezoidPrismMesh(wBottom, wTop, h, d) {
    let mesh = createEmptyMesh();
  
    let xb = wBottom / 2;
    let xt = wTop / 2;
    let y = h / 2;
    let z = d / 2;
  
    let fbl = [-xb,  y,  z];
    let fbr = [ xb,  y,  z];
    let ftl = [-xt, -y,  z];
    let ftr = [ xt, -y,  z];
  
    let bbl = [-xb,  y, -z];
    let bbr = [ xb,  y, -z];
    let btl = [-xt, -y, -z];
    let btr = [ xt, -y, -z];
  
    addQuad(mesh, fbl, fbr, ftr, ftl); // frente
    addQuad(mesh, bbr, bbl, btl, btr); // trás
    addQuad(mesh, bbl, fbl, ftl, btl); // esquerda
    addQuad(mesh, fbr, bbr, btr, ftr); // direita
    addQuad(mesh, ftl, ftr, btr, btl); // topo
    addQuad(mesh, bbl, bbr, fbr, fbl); // base
  
    return mesh;
  }



/**
 * Creates a sphere with mesh triangles
 * 
 * @param {number} radius 
 * @param {number} latBands number of subdivisions vertically (latitude)
 * @param {number} lonBands number of subdivisions horizontally (longitude)
 * @returns mesh with all the triangles of the splere
 */
function createSphereMesh(radius = 1, latBands = 16, lonBands = 16) {
  let mesh = createEmptyMesh();

  for (let latNumber = 0; latNumber < latBands; latNumber++) {
    for (let lonNumber = 0; lonNumber < lonBands; lonNumber++) {
      
      let theta1 = (latNumber * Math.PI) / latBands;
      let theta2 = ((latNumber + 1) * Math.PI) / latBands;

      let phi1 = (lonNumber * 2 * Math.PI) / lonBands;
      let phi2 = ((lonNumber + 1) * 2 * Math.PI) / lonBands;


      let getVertex = (theta, phi, lat, lon) => {
        let x = radius * Math.sin(theta) * Math.cos(phi);
        let y = radius * Math.cos(theta);
        let z = radius * Math.sin(theta) * Math.sin(phi);
        let u = 1 - (lon / lonBands); 
        let v = lat / latBands;
        return { pos: [x, y, z], uv: [u, v] };
      };

      let p1 = getVertex(theta1, phi1, latNumber, lonNumber);         // Cima Esquerda
      let p2 = getVertex(theta1, phi2, latNumber, lonNumber + 1);     // Cima Direita
      let p3 = getVertex(theta2, phi1, latNumber + 1, lonNumber);     // Baixo Esquerda
      let p4 = getVertex(theta2, phi2, latNumber + 1, lonNumber + 1); // Baixo Direita

      // Construir os quads usando a tua função addTriangle (2 triângulos por segmento)
      // Triângulo 1 (Cima Esquerda, Baixo Esquerda, Cima Direita)
      addTriangle(mesh, p1.pos, p3.pos, p2.pos, p1.uv, p3.uv, p2.uv);
      
      // Triângulo 2 (Cima Direita, Baixo Esquerda, Baixo Direita)
      addTriangle(mesh, p2.pos, p3.pos, p4.pos, p2.uv, p3.uv, p4.uv);
    }
  }

  return mesh;
}


  
  function createCableMesh(length = 40, thickness = 6, depth = 6) {
    return createBoxMesh(thickness, length, depth);
  }
  
  function createGroundMesh(size = 1200, thickness = 12) {
    return createBoxMesh(size, thickness, size);
  }


  
  function drawMesh(mesh, modelMatrix, tex = null) {
    if (tex) {
      texture(tex);
    }
  
    beginShape(TRIANGLES);
  
    for (let tri of mesh.tris) {
      let tp = [];
      for (let i = 0; i < 3; i++) {
        tp.push(Mat4.transformPoint(modelMatrix, tri.positions[i]));
      }
  
      let e1 = vecSub(tp[1], tp[0]);
      let e2 = vecSub(tp[2], tp[0]);
      let n = vecNormalize(vecCross(e1, e2));
  
      for (let i = 0; i < 3; i++) {
        let p = tp[i];
        let uv = tri.uvs[i];
        normal(n[0], n[1], n[2]);
        vertex(p[0], p[1], p[2], uv[0], uv[1]);
      }
    }
  
    endShape();
  }
