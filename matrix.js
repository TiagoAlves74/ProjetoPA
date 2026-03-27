class Mat4 {
    static identity() {
        return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
        ];
    }

    static multiply(a, b) {
        let result = Mat4.identity();

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i][j] = 0;
                for (let k = 0; k < 4; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }

    static translation(tx, ty, tz){
        return [
            [1, 0, 0, tx],
            [0, 1, 0, ty],
            [0, 0, 1, tz],
            [0, 0, 0, 1]
        ];
    }

    static scale(sx, sy, sz){
        return [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];
    }

    static rotationX(angle){
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return [
            [1, 0, 0, 0],
            [0, c, -s, 0],
            [0, s, c, 0],
            [0, 0, 0, 1]
        ];
    }

    static rotationY(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return [
            [c, 0, s, 0],
            [0, 1, 0, 0],
            [-s, 0, c, 0],
            [0, 0, 0, 1]
        ];
    }

    static rotationZ(angle) {
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return [
            [c, -s, 0, 0],
            [s, c, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    static transformPoint(m, p){
        let x = p[0], y = p[1], z = p[2], w = 1;

        let nx = 
            m[0][0] * x + m[0][1] * y + m[0][2] * z + m[0][3] * w;
        let ny =
            m[1][0] * x + m[1][1] * y + m[1][2] * z + m[1][3] * w;
        let nz =
            m[2][0] * x + m[2][1] * y + m[2][2] * z + m[2][3] * w;
        let nw = 
            m[3][0] * x + m[3][1] * y + m[3][2] * z + m[3][3] * w;
        
        if (nw !== 0) {
            nx /= nw;
            ny /= nw;
            nz /= nw;
        }

        return [nx, ny, nz];
    }
}