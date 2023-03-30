import { mat4 } from ".";

// export class Matrix4D {
//     public _Matrix: Array<number>
//     constructor() {
//         this._Matrix = this.generateMatrix();
//     }
//     generateMatrix() {
//         return [
//             1, 0, 0, 0,
//             0, 1, 0, 0,
//             0, 0, 1, 0,
//             0, 0, 0, 1
//         ]
//     }
//     radToDeg(r: number) {
//         return (r * 180) / Math.PI;
//     }

//     degToRad(d: number) {
//         return (d * Math.PI) / 180;
//     }
//     multiplyMatrices(matrixA: Array<number>, matrixB: Array<number>) {
//         // Slice the second matrix up into rows
//         let row0 = [matrixB[0], matrixB[1], matrixB[2], matrixB[3]];
//         let row1 = [matrixB[4], matrixB[5], matrixB[6], matrixB[7]];
//         let row2 = [matrixB[8], matrixB[9], matrixB[10], matrixB[11]];
//         let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];

//         // Multiply each row by matrixA
//         let result0 = this.multiplyMatrixAndPoint(matrixA, row0);
//         let result1 = this.multiplyMatrixAndPoint(matrixA, row1);
//         let result2 = this.multiplyMatrixAndPoint(matrixA, row2);
//         let result3 = this.multiplyMatrixAndPoint(matrixA, row3);

//         // Turn the result rows back into a single matrix
//         return [
//             result0[0], result0[1], result0[2], result0[3],
//             result1[0], result1[1], result1[2], result1[3],
//             result2[0], result2[1], result2[2], result2[3],
//             result3[0], result3[1], result3[2], result3[3]
//         ];

//     }
//     multiplyMatrixAndPoint(matrix: Array<number>, point: Array<number>) {
//         // Give a simple variable name to each part of the matrix, a column and row number
//         let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
//         let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
//         let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
//         let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

//         // Now set some simple names for the point
//         let x = point[0];
//         let y = point[1];
//         let z = point[2];
//         let w = point[3];

//         // Multiply the point against each part of the 1st column, then add together
//         let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

//         // Multiply the point against each part of the 2nd column, then add together
//         let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

//         // Multiply the point against each part of the 3rd column, then add together
//         let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

//         // Multiply the point against each part of the 4th column, then add together
//         let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

//         return [resultX, resultY, resultZ, resultW];
//     }

//     translate(m: Array<number>, translateX: number = 0, translateY: number = 0, translateZ: number = 0) {
//         const matrix = [
//             1, 0, 0, 0,
//             0, 1, 0, 0,
//             0, 0, 1, 0,
//             translateX, translateY, translateZ, 1,
//         ]
//         return this.multiplyMatrices(m, matrix);
//     }
//     projection(width: number, height: number, depth: number) {
//         return [
//             2 / width, 0, 0, 0,
//             0, -2 / height, 0, 0,
//             0, 0, 2 / depth, 0,
//             -1, 1, 0, 1,
//         ];
//     }
//     makeZToWMatrix(fudgeFactor: number) {
//         return [
//             1, 0, 0, 0,
//             0, 1, 0, 0,
//             0, 0, 1, fudgeFactor,
//             0, 0, 0, 1,
//         ];
//     }
//     perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
//         var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
//         var rangeInv = 1.0 / (near - far);

//         return [
//             f / aspect, 0, 0, 0,
//             0, f, 0, 0,
//             0, 0, (near + far) * rangeInv, -1,
//             0, 0, near * far * rangeInv * 2, 0
//         ];
//     }
//     lookAt(cameraPosition: Array<number>, target: Array<number>, up: Array<number>) {
//         var zAxis = this.normalize(this.subtractVectors(cameraPosition, target));
//         var xAxis = this.normalize(this.cross(up, zAxis));
//         var yAxis = this.normalize(this.cross(zAxis, xAxis));

//         return [
//             xAxis[0], xAxis[1], xAxis[2], 0,
//             yAxis[0], yAxis[1], yAxis[2], 0,
//             zAxis[0], zAxis[1], zAxis[2], 0,
//             cameraPosition[0],
//             cameraPosition[1],
//             cameraPosition[2],
//             1,
//         ];
//     }
//     cross(a: Array<number>, b: Array<number>) {
//         return [a[1] * b[2] - a[2] * b[1],
//         a[2] * b[0] - a[0] * b[2],
//         a[0] * b[1] - a[1] * b[0]];
//     }
//     subtractVectors(a: Array<number>, b: Array<number>) {
//         return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
//     }
//     addVec4(a: Array<number>, b: Array<number>) {
//         let out = []

//         out[0] = a[0] + b[0];
//         out[1] = a[1] + b[1];
//         out[2] = a[2] + b[2];
//         out[3] = a[3] + b[3];
//         return out;
//     }
//     scaleVec(vec: Array<number>, scale: number) {
//         return [vec[0] * scale, vec[1] * scale, vec[2] * scale];
//     }
//     subtractVec4(a: Array<number>, b: Array<number>) {
//         let out = []

//         out[0] = a[0] - b[0];
//         out[1] = a[1] - b[1];
//         out[2] = a[2] - b[2];
//         out[3] = a[3] - b[3];
//         return out;
//     }

//     invert(a: Array<number>) {
//         let out = [];
//         let a00 = a[0],
//             a01 = a[1],
//             a02 = a[2],
//             a03 = a[3];
//         let a10 = a[4],
//             a11 = a[5],
//             a12 = a[6],
//             a13 = a[7];
//         let a20 = a[8],
//             a21 = a[9],
//             a22 = a[10],
//             a23 = a[11];
//         let a30 = a[12],
//             a31 = a[13],
//             a32 = a[14],
//             a33 = a[15];

//         let b00 = a00 * a11 - a01 * a10;
//         let b01 = a00 * a12 - a02 * a10;
//         let b02 = a00 * a13 - a03 * a10;
//         let b03 = a01 * a12 - a02 * a11;
//         let b04 = a01 * a13 - a03 * a11;
//         let b05 = a02 * a13 - a03 * a12;
//         let b06 = a20 * a31 - a21 * a30;
//         let b07 = a20 * a32 - a22 * a30;
//         let b08 = a20 * a33 - a23 * a30;
//         let b09 = a21 * a32 - a22 * a31;
//         let b10 = a21 * a33 - a23 * a31;
//         let b11 = a22 * a33 - a23 * a32;

//         // Calculate the determinant
//         let det =
//             b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

//         if (!det) {
//             return null;
//         }
//         det = 1.0 / det;

//         out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
//         out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
//         out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
//         out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
//         out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
//         out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
//         out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
//         out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
//         out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
//         out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
//         out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
//         out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
//         out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
//         out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
//         out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
//         out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

//         return out;
//     }
//     normalizeVec4(a: Array<number>) {
//         let out = []

//         let x = a[0];
//         let y = a[1];
//         let z = a[2];
//         let w = a[3];
//         let len = x * x + y * y + z * z + w * w;
//         if (len > 0) {
//             len = 1 / Math.sqrt(len);
//         }
//         out[0] = x * len;
//         out[1] = y * len;
//         out[2] = z * len;
//         out[3] = w * len;
//         return out;
//     }
//     addVectors(a: Array<number>, b: Array<number>) {
//         return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
//     }
//     vec4Scale(a: Array<number>, b: number) {
//         let out = []
//         out[0] = a[0] * b;
//         out[1] = a[1] * b;
//         out[2] = a[2] * b;
//         out[3] = a[3] * b;
//         return out;
//     }
//     transformMat4(a: Array<number>, m: Array<number>) {
//         let x = a[0],
//             y = a[1],
//             z = a[2];
//         let w = m[3] * x + m[7] * y + m[11] * z + m[15];
//         w = w || 1.0;
//         let out: Array<number> = []
//         out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
//         out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
//         out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
//         return out;
//     };
//     scaleVectors(a: Array<number>, b: Array<number>) {
//         a[0] *= b[0];
//         a[1] *= b[1];
//         a[2] *= b[2];
//         return a;
//     }
//     dot(a: Array<number>, b: Array<number>) {
//         return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
//     };
//     scaleVector(a: Array<number>, b: number) {
//         a[0] *= b;
//         a[1] *= b;
//         a[2] *= b;
//         return a;
//     }
//     normalize(v: Array<number>) {
//         var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
//         // make sure we don't divide by 0.
//         if (length > 0.00001) {
//             return [v[0] / length, v[1] / length, v[2] / length];
//         } else {
//             return [0, 0, 0];
//         }
//     }
//     xRotate(m: any, angleInRadians: number) {
//         var c = Math.cos(this.degToRad(angleInRadians));
//         var s = Math.sin(this.degToRad(angleInRadians));

//         const matrix = [
//             1, 0, 0, 0,
//             0, c, s, 0,
//             0, -s, c, 0,
//             0, 0, 0, 1
//         ];
//         return mat4.multiply(mat4.create(), m, matrix);;
//     }

//     yRotate(m: any, angleInRadians: number) {
//         var c = Math.cos(this.degToRad(angleInRadians));
//         var s = Math.sin(this.degToRad(angleInRadians));

//         const matrix = [
//             c, 0, -s, 0,
//             0, 1, 0, 0,
//             s, 0, c, 0,
//             0, 0, 0, 1
//         ];
//         return mat4.multiply(mat4.create(), m, matrix);;
//     }

//     zRotate(m: any, angleInRadians: number) {
//         var c = Math.cos(this.degToRad(angleInRadians));
//         var s = Math.sin(this.degToRad(angleInRadians));

//         const matrix = [
//             c, 0, -s, 0,
//             0, 1, 0, 0,
//             s, 0, c, 0,
//             0, 0, 0, 1
//         ];
//         return mat4.multiply(mat4.create(), m, matrix);;
//     }

//     scale(m: Array<number>, scaleX: number = 1, scaleY: number = 1, scaleZ: number = 1) {
//         const matrix = [
//             scaleX, 0, 0, 0,
//             0, scaleY, 0, 0,
//             0, 0, scaleZ, 0,
//             0, 0, 0, 1
//         ]
//         return this.multiplyMatrices(m, matrix);
//     }

//     inverse(matrix: Array<number>) {
//         let r = this.generateMatrix()
//         var m = matrix

//         r[0] = m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10];
//         r[1] = -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10];
//         r[2] = m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6];
//         r[3] = -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6];

//         r[4] = -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10];
//         r[5] = m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10];
//         r[6] = -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6];
//         r[7] = m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6];

//         r[8] = m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9];
//         r[9] = -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9];
//         r[10] = m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5];
//         r[11] = -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5];

//         r[12] = -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9];
//         r[13] = m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9];
//         r[14] = -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5];
//         r[15] = m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5];

//         var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];
//         for (var i = 0; i < 16; i++) r[i] /= det;
//         return r;
//     };

//     transpose(matrix: Array<number>) {
//         let r = this.generateMatrix()
//         var m = matrix

//         r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
//         r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
//         r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
//         r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];
//         return r;
//     };
// }

export function xRotate(m: any, angleInRadians: number) {
    var c = Math.cos(degToRad(angleInRadians));
    var s = Math.sin(degToRad(angleInRadians));

    const matrix = [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
    ];
    return mat4.multiply(mat4.create(), m, matrix);;
}

export function yRotate(m: any, angleInRadians: number) {
    var c = Math.cos(degToRad(angleInRadians));
    var s = Math.sin(degToRad(angleInRadians));

    const matrix = [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ];
    return mat4.multiply(mat4.create(), m, matrix);;
}

export function zRotate(m: any, angleInRadians: number) {
    var c = Math.cos(degToRad(angleInRadians));
    var s = Math.sin(degToRad(angleInRadians));

    const matrix = [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ];
    return mat4.multiply(mat4.create(), m, matrix);;
}
export function radToDeg(r: number) {
    return (r * 180) / Math.PI;
}

export function degToRad(d: number) {
    return (d * Math.PI) / 180;
}