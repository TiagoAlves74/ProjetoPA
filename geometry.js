function vecSub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }
  
  function vecCross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
  
  function vecLength(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
  
  function vecNormalize(v) {
    let len = vecLength(v);
    if (len < 0.000001) return [0, 1, 0];
    return [v[0] / len, v[1] / len, v[2] / len];
  }
  
  function M(...matrices) {
    let result = Mat4.identity();
    for (let mat of matrices) {
      result = Mat4.multiply(result, mat);
    }
    return result;
  }
  
  function createEmptyMesh() {
    return { tris: [] };
  }
  
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