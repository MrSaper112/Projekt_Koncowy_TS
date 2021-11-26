
export default class Matrix4D {
    public _Matrix: Array<number>
    constructor() {
        this._Matrix = this.generateMatrix();
    }
    generateMatrix() {
        return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]
    }
    radToDeg(r: number) {
        return r * 180 / Math.PI;
    }

    degToRad(d: number) {
        return d * Math.PI / 180;
    }
    multiplyMatrices(matrixA: Array<number>, matrixB: Array<number>) {
        // Slice the second matrix up into rows
        let row0 = [matrixB[0], matrixB[1], matrixB[2], matrixB[3]];
        let row1 = [matrixB[4], matrixB[5], matrixB[6], matrixB[7]];
        let row2 = [matrixB[8], matrixB[9], matrixB[10], matrixB[11]];
        let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];

        // Multiply each row by matrixA
        let result0 = this.multiplyMatrixAndPoint(matrixA, row0);
        let result1 = this.multiplyMatrixAndPoint(matrixA, row1);
        let result2 = this.multiplyMatrixAndPoint(matrixA, row2);
        let result3 = this.multiplyMatrixAndPoint(matrixA, row3);

        // Turn the result rows back into a single matrix
        return [
            result0[0], result0[1], result0[2], result0[3],
            result1[0], result1[1], result1[2], result1[3],
            result2[0], result2[1], result2[2], result2[3],
            result3[0], result3[1], result3[2], result3[3]
        ];

    }
    multiplyMatrixAndPoint(matrix: Array<number>, point: Array<number>) {
        // Give a simple variable name to each part of the matrix, a column and row number
        let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
        let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
        let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
        let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

        // Now set some simple names for the point
        let x = point[0];
        let y = point[1];
        let z = point[2];
        let w = point[3];

        // Multiply the point against each part of the 1st column, then add together
        let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

        // Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

        // Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

        // Multiply the point against each part of the 4th column, then add together
        let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

        return [resultX, resultY, resultZ, resultW];
    }
    translate(m: Array<number>, translateX: number = 0, translateY: number = 0, translateZ: number = 0) {
        const matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            translateX, translateY, translateZ, 1,
        ]
        return this.multiplyMatrices(m, matrix);
    }
    projection(width: number, height: number, depth: number) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    }
    makeZToWMatrix(fudgeFactor: number) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, fudgeFactor,
            0, 0, 0, 1,
        ];
    }
    perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    }
    lookAt(cameraPosition: Array<number>, target: Array<number>, up: Array<number>) {
        var zAxis = this.normalize(this.subtractVectors(cameraPosition, target));
        var xAxis = this.normalize(this.cross(up, zAxis));
        var yAxis = this.normalize(this.cross(zAxis, xAxis));

        return [
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            cameraPosition[0],
            cameraPosition[1],
            cameraPosition[2],
            1,
        ];
    }
    cross(a: Array<number>, b: Array<number>) {
        return [a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]];
    }
    subtractVectors(a: Array<number>, b: Array<number>) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }
    normalize(v: Array<number>) {
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length];
        } else {
            return [0, 0, 0];
        }
    }
    xRotate(m: Array<number>, angleInRadians: number) {
        var c = Math.cos(this.degToRad(angleInRadians));
        var s = Math.sin(this.degToRad(angleInRadians));

        const matrix = [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
        return this.multiplyMatrices(m, matrix);
    }
    yRotate(m: Array<number>, angleInRadians: number) {
        var c = Math.cos(this.degToRad(angleInRadians));
        var s = Math.sin(this.degToRad(angleInRadians));

        const matrix = [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
        return this.multiplyMatrices(m, matrix);
    }

    zRotate(m: Array<number>, angleInRadians: number) {
        var c = Math.cos(this.degToRad(angleInRadians));
        var s = Math.sin(this.degToRad(angleInRadians));

        const matrix = [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
        return this.multiplyMatrices(m, matrix);
    }

    scale(m: Array<number>, scaleX: number = 1, scaleY: number = 1, scaleZ: number = 1) {
        const matrix = [
            scaleX, 0, 0, 0,
            0, scaleY, 0, 0,
            0, 0, scaleZ, 0,
            0, 0, 0, 1
        ]
        return this.multiplyMatrices(m, matrix);
    }

    inverse(matrix: Array<number>) {
        let r = this.generateMatrix()
        var m = matrix

        r[0] = m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10];
        r[1] = -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10];
        r[2] = m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6];
        r[3] = -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6];

        r[4] = -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10];
        r[5] = m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10];
        r[6] = -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6];
        r[7] = m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6];

        r[8] = m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9];
        r[9] = -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9];
        r[10] = m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5];
        r[11] = -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5];

        r[12] = -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9];
        r[13] = m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9];
        r[14] = -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5];
        r[15] = m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5];

        var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];
        for (var i = 0; i < 16; i++) r[i] /= det;
        return r;
    };

    transpose(matrix: Array<number>) {
        let r = this.generateMatrix()
        var m = matrix

        r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
        r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
        r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
        r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];
        return r;
    };
}