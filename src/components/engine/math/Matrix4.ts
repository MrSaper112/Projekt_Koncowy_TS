import { glMatrix } from "./gl-matrix";
import Quat from "./Quat";
import Vector3 from "./Vector3";

export default class Matrix4 {
    _matrix: Float32Array;
    constructor() {
        this._matrix = new Float32Array(
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ])
    }

    create(): Matrix4 {
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;

        this._matrix[0] = 1;
        this._matrix[5] = 1;
        this._matrix[10] = 1;
        this._matrix[15] = 1;
        return this
    }

    copy(a: Matrix4): Matrix4 {
        this._matrix = new Float32Array(16)
        this._matrix[0] = a._matrix[0];
        this._matrix[1] = a._matrix[1];
        this._matrix[2] = a._matrix[2];
        this._matrix[3] = a._matrix[3];
        this._matrix[4] = a._matrix[4];
        this._matrix[5] = a._matrix[5];
        this._matrix[6] = a._matrix[6];
        this._matrix[7] = a._matrix[7];
        this._matrix[8] = a._matrix[8];
        this._matrix[9] = a._matrix[9];
        this._matrix[10] = a._matrix[10];
        this._matrix[11] = a._matrix[11];
        this._matrix[12] = a._matrix[12];
        this._matrix[13] = a._matrix[13];
        this._matrix[14] = a._matrix[14];
        this._matrix[15] = a._matrix[15];
        return this
    }


    fromValues(
        m00: number,
        m01: number,
        m02: number,
        m03: number,
        m10: number,
        m11: number,
        m12: number,
        m13: number,
        m20: number,
        m21: number,
        m22: number,
        m23: number,
        m30: number,
        m31: number,
        m32: number,
        m33: number
    ): Matrix4 {
        this._matrix = new Float32Array(16)
        this._matrix[0] = m00;
        this._matrix[1] = m01;
        this._matrix[2] = m02;
        this._matrix[3] = m03;
        this._matrix[4] = m10;
        this._matrix[5] = m11;
        this._matrix[6] = m12;
        this._matrix[7] = m13;
        this._matrix[8] = m20;
        this._matrix[9] = m21;
        this._matrix[10] = m22;
        this._matrix[11] = m23;
        this._matrix[12] = m30;
        this._matrix[13] = m31;
        this._matrix[14] = m32;
        this._matrix[15] = m33;
        return this
    }



    identity(): Matrix4 {
        this._matrix[0] = 1;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = 1;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 1;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
        return this
    }


    transpose(a: Matrix4): Matrix4 {
        // If we are transposing ourselves we can skip this._matrix few steps but have to cache some values
        this._matrix[0] = a._matrix[0];
        this._matrix[1] = a._matrix[4];
        this._matrix[2] = a._matrix[8];
        this._matrix[3] = a._matrix[12];
        this._matrix[4] = a._matrix[1];
        this._matrix[5] = a._matrix[5];
        this._matrix[6] = a._matrix[9];
        this._matrix[7] = a._matrix[13];
        this._matrix[8] = a._matrix[2];
        this._matrix[9] = a._matrix[6];
        this._matrix[10] = a._matrix[10];
        this._matrix[11] = a._matrix[14];
        this._matrix[12] = a._matrix[3];
        this._matrix[13] = a._matrix[7];
        this._matrix[14] = a._matrix[11];
        this._matrix[15] = a._matrix[15];

        return this
    }


    invert(): Matrix4 {
        let a00 = this._matrix[0],
            a01 = this._matrix[1],
            a02 = this._matrix[2],
            a03 = this._matrix[3];
        let a10 = this._matrix[4],
            a11 = this._matrix[5],
            a12 = this._matrix[6],
            a13 = this._matrix[7];
        let a20 = this._matrix[8],
            a21 = this._matrix[9],
            a22 = this._matrix[10],
            a23 = this._matrix[11];
        let a30 = this._matrix[12],
            a31 = this._matrix[13],
            a32 = this._matrix[14],
            a33 = this._matrix[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det =
            b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        this._matrix[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this._matrix[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this._matrix[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this._matrix[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this._matrix[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this._matrix[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this._matrix[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this._matrix[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this._matrix[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this._matrix[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this._matrix[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this._matrix[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this._matrix[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this._matrix[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this._matrix[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this._matrix[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this
    }


    determinant(a: Matrix4): number {
        let a00 = a._matrix[0],
            a01 = a._matrix[1],
            a02 = a._matrix[2],
            a03 = a._matrix[3];
        let a10 = a._matrix[4],
            a11 = a._matrix[5],
            a12 = a._matrix[6],
            a13 = a._matrix[7];
        let a20 = a._matrix[8],
            a21 = a._matrix[9],
            a22 = a._matrix[10],
            a23 = a._matrix[11];
        let a30 = a._matrix[12],
            a31 = a._matrix[13],
            a32 = a._matrix[14],
            a33 = a._matrix[15];

        let b0 = a00 * a11 - a01 * a10;
        let b1 = a00 * a12 - a02 * a10;
        let b2 = a01 * a12 - a02 * a11;
        let b3 = a20 * a31 - a21 * a30;
        let b4 = a20 * a32 - a22 * a30;
        let b5 = a21 * a32 - a22 * a31;
        let b6 = a00 * b5 - a01 * b4 + a02 * b3;
        let b7 = a10 * b5 - a11 * b4 + a12 * b3;
        let b8 = a20 * b2 - a21 * b1 + a22 * b0;
        let b9 = a30 * b2 - a31 * b1 + a32 * b0;

        // Calculate the determinant
        return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
    }


    multiply(b: Matrix4): Matrix4 {
        let a00 = this._matrix[0],
            a01 = this._matrix[1],
            a02 = this._matrix[2],
            a03 = this._matrix[3];
        let a10 = this._matrix[4],
            a11 = this._matrix[5],
            a12 = this._matrix[6],
            a13 = this._matrix[7];
        let a20 = this._matrix[8],
            a21 = this._matrix[9],
            a22 = this._matrix[10],
            a23 = this._matrix[11];
        let a30 = this._matrix[12],
            a31 = this._matrix[13],
            a32 = this._matrix[14],
            a33 = this._matrix[15];

        // Cache only the current line of the second matrix
        let b0 = b._matrix[0],
            b1 = b._matrix[1],
            b2 = b._matrix[2],
            b3 = b._matrix[3];
        this._matrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._matrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._matrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._matrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b._matrix[4];
        b1 = b._matrix[5];
        b2 = b._matrix[6];
        b3 = b._matrix[7];
        this._matrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._matrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._matrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._matrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b._matrix[8];
        b1 = b._matrix[9];
        b2 = b._matrix[10];
        b3 = b._matrix[11];
        this._matrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._matrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._matrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._matrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b._matrix[12];
        b1 = b._matrix[13];
        b2 = b._matrix[14];
        b3 = b._matrix[15];
        this._matrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._matrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._matrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._matrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this
    }

    translate(v: Vector3): Matrix4 {
        let x = v._vector[0],
            y = v._vector[1],
            z = v._vector[2];

        let a00 = this._matrix[0],
            a01 = this._matrix[1],
            a02 = this._matrix[2],
            a03 = this._matrix[3];
        let a10 = this._matrix[4],
            a11 = this._matrix[5],
            a12 = this._matrix[6],
            a13 = this._matrix[7];
        let a20 = this._matrix[8],
            a21 = this._matrix[9],
            a22 = this._matrix[10],
            a23 = this._matrix[11];
        let a30 = this._matrix[12],
            a31 = this._matrix[13],
            a32 = this._matrix[14],
            a33 = this._matrix[15];

        this._matrix[0] = a00;
        this._matrix[1] = a01;
        this._matrix[2] = a02;
        this._matrix[3] = a03;
        this._matrix[4] = a10;
        this._matrix[5] = a11;
        this._matrix[6] = a12;
        this._matrix[7] = a13;
        this._matrix[8] = a20;
        this._matrix[9] = a21;
        this._matrix[10] = a22;
        this._matrix[11] = a23;

        this._matrix[12] = a00 * x + a10 * y + a20 * z + this._matrix[12];
        this._matrix[13] = a01 * x + a11 * y + a21 * z + this._matrix[13];
        this._matrix[14] = a02 * x + a12 * y + a22 * z + this._matrix[14];
        this._matrix[15] = a03 * x + a13 * y + a23 * z + this._matrix[15];


        return this
    }


    scale(v: Vector3): Matrix4 {
        let x = v._vector[0],
            y = v._vector[1],
            z = v._vector[2];

        this._matrix[0] *= x;
        this._matrix[1] *= x;
        this._matrix[2] *= x;
        this._matrix[3] *= x;
        this._matrix[4] *= y;
        this._matrix[5] *= y;
        this._matrix[6] *= y;
        this._matrix[7] *= y;
        this._matrix[8] *= z;
        this._matrix[9] *= z;
        this._matrix[10] *= z;
        this._matrix[11] *= z;

        return this
    }


    rotate(rad: number, axis: Vector3): Matrix4 {
        let x = axis._vector[0],
            y = axis._vector[1],
            z = axis._vector[2];
        let len = Math.sqrt(x * x + y * y + z * z);
        let s, c, t;
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;



        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = this._matrix[0];
        a01 = this._matrix[1];
        a02 = this._matrix[2];
        a03 = this._matrix[3];
        a10 = this._matrix[4];
        a11 = this._matrix[5];
        a12 = this._matrix[6];
        a13 = this._matrix[7];
        a20 = this._matrix[8];
        a21 = this._matrix[9];
        a22 = this._matrix[10];
        a23 = this._matrix[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        this._matrix[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this._matrix[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this._matrix[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this._matrix[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this._matrix[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this._matrix[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this._matrix[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this._matrix[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this._matrix[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this._matrix[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this._matrix[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this._matrix[11] = a03 * b20 + a13 * b21 + a23 * b22;
        this._matrix[12] = this._matrix[12];
        this._matrix[13] = this._matrix[13];
        this._matrix[14] = this._matrix[14];
        this._matrix[15] = this._matrix[15];

        return this
    }


    rotateX(rad: number): Matrix4 {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a10 = this._matrix[4];
        let a11 = this._matrix[5];
        let a12 = this._matrix[6];
        let a13 = this._matrix[7];
        let a20 = this._matrix[8];
        let a21 = this._matrix[9];
        let a22 = this._matrix[10];
        let a23 = this._matrix[11];

        this._matrix[0] = this._matrix[0];
        this._matrix[1] = this._matrix[1];
        this._matrix[2] = this._matrix[2];
        this._matrix[3] = this._matrix[3];
        this._matrix[12] = this._matrix[12];
        this._matrix[13] = this._matrix[13];
        this._matrix[14] = this._matrix[14];
        this._matrix[15] = this._matrix[15];


        // Perform axis-specific matrix multiplication
        this._matrix[4] = a10 * c + a20 * s;
        this._matrix[5] = a11 * c + a21 * s;
        this._matrix[6] = a12 * c + a22 * s;
        this._matrix[7] = a13 * c + a23 * s;
        this._matrix[8] = a20 * c - a10 * s;
        this._matrix[9] = a21 * c - a11 * s;
        this._matrix[10] = a22 * c - a12 * s;
        this._matrix[11] = a23 * c - a13 * s;
        return this
    }


    rotateY(rad: number): Matrix4 {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = this._matrix[0];
        let a01 = this._matrix[1];
        let a02 = this._matrix[2];
        let a03 = this._matrix[3];
        let a20 = this._matrix[8];
        let a21 = this._matrix[9];
        let a22 = this._matrix[10];
        let a23 = this._matrix[11];


        // If the source and destination differ, copy the unchanged rows
        this._matrix[4] = this._matrix[4];
        this._matrix[5] = this._matrix[5];
        this._matrix[6] = this._matrix[6];
        this._matrix[7] = this._matrix[7];
        this._matrix[12] = this._matrix[12];
        this._matrix[13] = this._matrix[13];
        this._matrix[14] = this._matrix[14];
        this._matrix[15] = this._matrix[15];


        // Perform axis-specific matrix multiplication
        this._matrix[0] = a00 * c - a20 * s;
        this._matrix[1] = a01 * c - a21 * s;
        this._matrix[2] = a02 * c - a22 * s;
        this._matrix[3] = a03 * c - a23 * s;
        this._matrix[8] = a00 * s + a20 * c;
        this._matrix[9] = a01 * s + a21 * c;
        this._matrix[10] = a02 * s + a22 * c;
        this._matrix[11] = a03 * s + a23 * c;
        return this
    }


    rotateZ(rad: number): Matrix4 {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = this._matrix[0];
        let a01 = this._matrix[1];
        let a02 = this._matrix[2];
        let a03 = this._matrix[3];
        let a10 = this._matrix[4];
        let a11 = this._matrix[5];
        let a12 = this._matrix[6];
        let a13 = this._matrix[7];

        // If the source and destination differ, copy the unchanged last row
        this._matrix[8] = this._matrix[8];
        this._matrix[9] = this._matrix[9];
        this._matrix[10] = this._matrix[10];
        this._matrix[11] = this._matrix[11];
        this._matrix[12] = this._matrix[12];
        this._matrix[13] = this._matrix[13];
        this._matrix[14] = this._matrix[14];
        this._matrix[15] = this._matrix[15];


        // Perform axis-specific matrix multiplication
        this._matrix[0] = a00 * c + a10 * s;
        this._matrix[1] = a01 * c + a11 * s;
        this._matrix[2] = a02 * c + a12 * s;
        this._matrix[3] = a03 * c + a13 * s;
        this._matrix[4] = a10 * c - a00 * s;
        this._matrix[5] = a11 * c - a01 * s;
        this._matrix[6] = a12 * c - a02 * s;
        this._matrix[7] = a13 * c - a03 * s;
        return this
    }

    fromTranslation(v: Vector3): Matrix4 {
        this._matrix[0] = 1;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = 1;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 1;
        this._matrix[11] = 0;
        this._matrix[12] = v._vector[0];
        this._matrix[13] = v._vector[1];
        this._matrix[14] = v._vector[2];
        this._matrix[15] = 1;
        return this
    }


    fromScaling(v: Vector3): Matrix4 {
        this._matrix[0] = v._vector[0];
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = v._vector[1];
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = v._vector[2];
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
        return this
    }


    fromRotation(rad: number, axis: Vector3): Matrix4 {
        let x = axis._vector[0],
            y = axis._vector[1],
            z = axis._vector[2];
        let len = Math.sqrt(x * x + y * y + z * z);
        let s, c, t;



        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        // Perform rotation-specific matrix multiplication
        this._matrix[0] = x * x * t + c;
        this._matrix[1] = y * x * t + z * s;
        this._matrix[2] = z * x * t - y * s;
        this._matrix[3] = 0;
        this._matrix[4] = x * y * t - z * s;
        this._matrix[5] = y * y * t + c;
        this._matrix[6] = z * y * t + x * s;
        this._matrix[7] = 0;
        this._matrix[8] = x * z * t + y * s;
        this._matrix[9] = y * z * t - x * s;
        this._matrix[10] = z * z * t + c;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
        return this
    }


    fromXRotation(rad: number): Matrix4 {
        let s = Math.sin(rad);
        let c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        this._matrix[0] = 1;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = c;
        this._matrix[6] = s;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = -s;
        this._matrix[10] = c;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
        return this
    }


    fromYRotation(rad: number): Matrix4 {
        let s = Math.sin(rad);
        let c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        this._matrix[0] = c;
        this._matrix[1] = 0;
        this._matrix[2] = -s;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = 1;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = s;
        this._matrix[9] = 0;
        this._matrix[10] = c;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
        return this
    }


    fromZRotation(rad: number): Matrix4 {
        let s = Math.sin(rad);
        let c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        this._matrix[0] = c;
        this._matrix[1] = s;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = -s;
        this._matrix[5] = c;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 1;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
        return this
    }


    fromRotationTranslation(q: Quat, v: Vector3): Matrix4 {
        // Quaternion math
        let x = q._quaternion[0],
            y = q._quaternion[1],
            z = q._quaternion[2],
            w = q._quaternion[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        this._matrix[0] = 1 - (yy + zz);
        this._matrix[1] = xy + wz;
        this._matrix[2] = xz - wy;
        this._matrix[3] = 0;
        this._matrix[4] = xy - wz;
        this._matrix[5] = 1 - (xx + zz);
        this._matrix[6] = yz + wx;
        this._matrix[7] = 0;
        this._matrix[8] = xz + wy;
        this._matrix[9] = yz - wx;
        this._matrix[10] = 1 - (xx + yy);
        this._matrix[11] = 0;
        this._matrix[12] = v._vector[0];
        this._matrix[13] = v._vector[1];
        this._matrix[14] = v._vector[2];
        this._matrix[15] = 1;

        return this
    }

    getTranslation(): Vector3 {
        let vec = new Vector3();
        vec._vector[0] = this._matrix[12];
        vec._vector[1] = this._matrix[13];
        vec._vector[2] = this._matrix[14];
        return vec
    }


    getScaling(): Vector3 {
        let vec = new Vector3();

        let m11 = this._matrix[0];
        let m12 = this._matrix[1];
        let m13 = this._matrix[2];
        let m21 = this._matrix[4];
        let m22 = this._matrix[5];
        let m23 = this._matrix[6];
        let m31 = this._matrix[8];
        let m32 = this._matrix[9];
        let m33 = this._matrix[10];

        vec._vector[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
        vec._vector[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
        vec._vector[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

        return vec
    }

    getRotation(): Quat {
        let scaling = new Vector3();
        scaling = this.getScaling();

        let is1 = 1 / scaling._vector[0];
        let is2 = 1 / scaling._vector[1];
        let is3 = 1 / scaling._vector[2];

        let sm11 = this._matrix[0] * is1;
        let sm12 = this._matrix[1] * is2;
        let sm13 = this._matrix[2] * is3;
        let sm21 = this._matrix[4] * is1;
        let sm22 = this._matrix[5] * is2;
        let sm23 = this._matrix[6] * is3;
        let sm31 = this._matrix[8] * is1;
        let sm32 = this._matrix[9] * is2;
        let sm33 = this._matrix[10] * is3;

        let trace = sm11 + sm22 + sm33;
        let S = 0;

        let quat = new Quat()
        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            quat._quaternion[3] = 0.25 * S;
            quat._quaternion[0] = (sm23 - sm32) / S;
            quat._quaternion[1] = (sm31 - sm13) / S;
            quat._quaternion[2] = (sm12 - sm21) / S;
        } else if (sm11 > sm22 && sm11 > sm33) {
            S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
            quat._quaternion[3] = (sm23 - sm32) / S;
            quat._quaternion[0] = 0.25 * S;
            quat._quaternion[1] = (sm12 + sm21) / S;
            quat._quaternion[2] = (sm31 + sm13) / S;
        } else if (sm22 > sm33) {
            S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
            quat._quaternion[3] = (sm31 - sm13) / S;
            quat._quaternion[0] = (sm12 + sm21) / S;
            quat._quaternion[1] = 0.25 * S;
            quat._quaternion[2] = (sm23 + sm32) / S;
        } else {
            S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
            quat._quaternion[3] = (sm12 - sm21) / S;
            quat._quaternion[0] = (sm31 + sm13) / S;
            quat._quaternion[1] = (sm23 + sm32) / S;
            quat._quaternion[2] = 0.25 * S;
        }

        return quat
    }



    fromRotationTranslationScale(q: Quat, v: Vector3, s: Vector3): Matrix4 {
        // Quaternion math
        let x = q._quaternion[0],
            y = q._quaternion[1],
            z = q._quaternion[2],
            w = q._quaternion[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;
        let sx = s._vector[0];
        let sy = s._vector[1];
        let sz = s._vector[2];

        this._matrix[0] = (1 - (yy + zz)) * sx;
        this._matrix[1] = (xy + wz) * sx;
        this._matrix[2] = (xz - wy) * sx;
        this._matrix[3] = 0;
        this._matrix[4] = (xy - wz) * sy;
        this._matrix[5] = (1 - (xx + zz)) * sy;
        this._matrix[6] = (yz + wx) * sy;
        this._matrix[7] = 0;
        this._matrix[8] = (xz + wy) * sz;
        this._matrix[9] = (yz - wx) * sz;
        this._matrix[10] = (1 - (xx + yy)) * sz;
        this._matrix[11] = 0;
        this._matrix[12] = v._vector[0];
        this._matrix[13] = v._vector[1];
        this._matrix[14] = v._vector[2];
        this._matrix[15] = 1;

        return this
    }


    fromRotationTranslationScaleOrigin(q: Quat, v: Vector3, s: Vector3, o: Vector3): Matrix4 {
        // Quaternion math
        let x = q._quaternion[0],
            y = q._quaternion[1],
            z = q._quaternion[2],
            w = q._quaternion[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        let sx = s._vector[0];
        let sy = s._vector[1];
        let sz = s._vector[2];

        let ox = o._vector[0];
        let oy = o._vector[1];
        let oz = o._vector[2];

        let out0 = (1 - (yy + zz)) * sx;
        let out1 = (xy + wz) * sx;
        let out2 = (xz - wy) * sx;
        let out4 = (xy - wz) * sy;
        let out5 = (1 - (xx + zz)) * sy;
        let out6 = (yz + wx) * sy;
        let out8 = (xz + wy) * sz;
        let out9 = (yz - wx) * sz;
        let out10 = (1 - (xx + yy)) * sz;

        this._matrix[0] = out0;
        this._matrix[1] = out1;
        this._matrix[2] = out2;
        this._matrix[3] = 0;
        this._matrix[4] = out4;
        this._matrix[5] = out5;
        this._matrix[6] = out6;
        this._matrix[7] = 0;
        this._matrix[8] = out8;
        this._matrix[9] = out9;
        this._matrix[10] = out10;
        this._matrix[11] = 0;
        this._matrix[12] = v._vector[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
        this._matrix[13] = v._vector[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
        this._matrix[14] = v._vector[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
        this._matrix[15] = 1;

        return this
    }

    fromQuat(q: Quat): Matrix4 {
        let x = q._quaternion[0],
            y = q._quaternion[1],
            z = q._quaternion[2],
            w = q._quaternion[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let yx = y * x2;
        let yy = y * y2;
        let zx = z * x2;
        let zy = z * y2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        this._matrix[0] = 1 - yy - zz;
        this._matrix[1] = yx + wz;
        this._matrix[2] = zx - wy;
        this._matrix[3] = 0;

        this._matrix[4] = yx - wz;
        this._matrix[5] = 1 - xx - zz;
        this._matrix[6] = zy + wx;
        this._matrix[7] = 0;

        this._matrix[8] = zx + wy;
        this._matrix[9] = zy - wx;
        this._matrix[10] = 1 - xx - yy;
        this._matrix[11] = 0;

        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;

        return this
    }

    // frustum(this._matrix, left, right, bottom, top, near, far) {
    //     let rl = 1 / (right - left);
    //     let tb = 1 / (top - bottom);
    //     let nf = 1 / (near - far);
    //     this._matrix[0] = near * 2 * rl;
    //     this._matrix[1] = 0;
    //     this._matrix[2] = 0;
    //     this._matrix[3] = 0;
    //     this._matrix[4] = 0;
    //     this._matrix[5] = near * 2 * tb;
    //     this._matrix[6] = 0;
    //     this._matrix[7] = 0;
    //     this._matrix[8] = (right + left) * rl;
    //     this._matrix[9] = (top + bottom) * tb;
    //     this._matrix[10] = (far + near) * nf;
    //     this._matrix[11] = -1;
    //     this._matrix[12] = 0;
    //     this._matrix[13] = 0;
    //     this._matrix[14] = far * near * 2 * nf;
    //     this._matrix[15] = 0;
    //     return this
    // }


    perspective(fovy: number, aspect: number, near: number, far: number) {
        const f = 1.0 / Math.tan(fovy / 2);
        this._matrix[0] = f / aspect;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = f;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[11] = -1;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[15] = 0;
        if (far != null && far !== Infinity) {
            const nf = 1 / (near - far);
            this._matrix[10] = (far + near) * nf;
            this._matrix[14] = 2 * far * near * nf;
        } else {
            this._matrix[10] = -1;
            this._matrix[14] = -2 * near;
        }
        return this
    }

    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        this._matrix[0] = -2 * lr;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = -2 * bt;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 2 * nf;
        this._matrix[11] = 0;
        this._matrix[12] = (left + right) * lr;
        this._matrix[13] = (top + bottom) * bt;
        this._matrix[14] = (far + near) * nf;
        this._matrix[15] = 1;
        return this
    }

    lookAt(eye: Vector3, center: Vector3, up: Vector3) {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        let eyex = eye._vector[0];
        let eyey = eye._vector[1];
        let eyez = eye._vector[2];
        let upx = up._vector[0];
        let upy = up._vector[1];
        let upz = up._vector[2];
        let centerx = center._vector[0];
        let centery = center._vector[1];
        let centerz = center._vector[2];

        if (
            Math.abs(eyex - centerx) < 0.000001 &&
            Math.abs(eyey - centery) < 0.000001 &&
            Math.abs(eyez - centerz) < 0.000001
        ) {
            return new Matrix4();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        this._matrix[0] = x0;
        this._matrix[1] = y0;
        this._matrix[2] = z0;
        this._matrix[3] = 0;
        this._matrix[4] = x1;
        this._matrix[5] = y1;
        this._matrix[6] = z1;
        this._matrix[7] = 0;
        this._matrix[8] = x2;
        this._matrix[9] = y2;
        this._matrix[10] = z2;
        this._matrix[11] = 0;
        this._matrix[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        this._matrix[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        this._matrix[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        this._matrix[15] = 1;

        return this
    }


    targetTo(eye: Vector3, target: Vector3, up: Vector3) {
        let eyex = eye._vector[0],
            eyey = eye._vector[1],
            eyez = eye._vector[2],
            upx = up._vector[0],
            upy = up._vector[1],
            upz = up._vector[2];

        let z0 = eyex - target._vector[0],
            z1 = eyey - target._vector[1],
            z2 = eyez - target._vector[2];

        let len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            z0 *= len;
            z1 *= len;
            z2 *= len;
        }

        let x0 = upy * z2 - upz * z1,
            x1 = upz * z0 - upx * z2,
            x2 = upx * z1 - upy * z0;

        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        this._matrix[0] = x0;
        this._matrix[1] = x1;
        this._matrix[2] = x2;
        this._matrix[3] = 0;
        this._matrix[4] = z1 * x2 - z2 * x1;
        this._matrix[5] = z2 * x0 - z0 * x2;
        this._matrix[6] = z0 * x1 - z1 * x0;
        this._matrix[7] = 0;
        this._matrix[8] = z0;
        this._matrix[9] = z1;
        this._matrix[10] = z2;
        this._matrix[11] = 0;
        this._matrix[12] = eyex;
        this._matrix[13] = eyey;
        this._matrix[14] = eyez;
        this._matrix[15] = 1;
        return this
    }



    frob(a: Matrix4) {
        return Math.sqrt(
            this._matrix[0] * a._matrix[0] +
            this._matrix[1] * a._matrix[1] +
            this._matrix[2] * a._matrix[2] +
            this._matrix[3] * a._matrix[3] +
            this._matrix[4] * a._matrix[4] +
            this._matrix[5] * a._matrix[5] +
            this._matrix[6] * a._matrix[6] +
            this._matrix[7] * a._matrix[7] +
            this._matrix[8] * a._matrix[8] +
            this._matrix[9] * a._matrix[9] +
            this._matrix[10] * a._matrix[10] +
            this._matrix[11] * a._matrix[11] +
            this._matrix[12] * a._matrix[12] +
            this._matrix[13] * a._matrix[13] +
            this._matrix[14] * a._matrix[14] +
            this._matrix[15] * a._matrix[15]
        );
    }


    add(b: Matrix4) {
        this._matrix[0] += b._matrix[0];
        this._matrix[1] += b._matrix[1];
        this._matrix[2] += b._matrix[2];
        this._matrix[3] += b._matrix[3];
        this._matrix[4] += b._matrix[4];
        this._matrix[5] += b._matrix[5];
        this._matrix[6] += b._matrix[6];
        this._matrix[7] += b._matrix[7];
        this._matrix[8] += b._matrix[8];
        this._matrix[9] += b._matrix[9];
        this._matrix[10] += b._matrix[10];
        this._matrix[11] += b._matrix[11];
        this._matrix[12] += b._matrix[12];
        this._matrix[13] += b._matrix[13];
        this._matrix[14] += b._matrix[14];
        this._matrix[15] += b._matrix[15];
        return this
    }


    subtract(b: Matrix4) {
        this._matrix[0] -= b._matrix[0];
        this._matrix[1] -= b._matrix[1];
        this._matrix[2] -= b._matrix[2];
        this._matrix[3] -= b._matrix[3];
        this._matrix[4] -= b._matrix[4];
        this._matrix[5] -= b._matrix[5];
        this._matrix[6] -= b._matrix[6];
        this._matrix[7] -= b._matrix[7];
        this._matrix[8] -= b._matrix[8];
        this._matrix[9] -= b._matrix[9];
        this._matrix[10] -= b._matrix[10];
        this._matrix[11] -= b._matrix[11];
        this._matrix[12] -= b._matrix[12];
        this._matrix[13] -= b._matrix[13];
        this._matrix[14] -= b._matrix[14];
        this._matrix[15] -= b._matrix[15];
        return this
    }


    multiplyScalar(b: number) {
        this._matrix[0] = this._matrix[0] * b;
        this._matrix[1] = this._matrix[1] * b;
        this._matrix[2] = this._matrix[2] * b;
        this._matrix[3] = this._matrix[3] * b;
        this._matrix[4] = this._matrix[4] * b;
        this._matrix[5] = this._matrix[5] * b;
        this._matrix[6] = this._matrix[6] * b;
        this._matrix[7] = this._matrix[7] * b;
        this._matrix[8] = this._matrix[8] * b;
        this._matrix[9] = this._matrix[9] * b;
        this._matrix[10] = this._matrix[10] * b;
        this._matrix[11] = this._matrix[11] * b;
        this._matrix[12] = this._matrix[12] * b;
        this._matrix[13] = this._matrix[13] * b;
        this._matrix[14] = this._matrix[14] * b;
        this._matrix[15] = this._matrix[15] * b;
        return this
    }


    multiplyScalarAndAdd(b: Matrix4, scale: number): Matrix4 {
        this._matrix[0] = this._matrix[0] + b._matrix[0] * scale;
        this._matrix[1] = this._matrix[1] + b._matrix[1] * scale;
        this._matrix[2] = this._matrix[2] + b._matrix[2] * scale;
        this._matrix[3] = this._matrix[3] + b._matrix[3] * scale;
        this._matrix[4] = this._matrix[4] + b._matrix[4] * scale;
        this._matrix[5] = this._matrix[5] + b._matrix[5] * scale;
        this._matrix[6] = this._matrix[6] + b._matrix[6] * scale;
        this._matrix[7] = this._matrix[7] + b._matrix[7] * scale;
        this._matrix[8] = this._matrix[8] + b._matrix[8] * scale;
        this._matrix[9] = this._matrix[9] + b._matrix[9] * scale;
        this._matrix[10] = this._matrix[10] + b._matrix[10] * scale;
        this._matrix[11] = this._matrix[11] + b._matrix[11] * scale;
        this._matrix[12] = this._matrix[12] + b._matrix[12] * scale;
        this._matrix[13] = this._matrix[13] + b._matrix[13] * scale;
        this._matrix[14] = this._matrix[14] + b._matrix[14] * scale;
        this._matrix[15] = this._matrix[15] + b._matrix[15] * scale;
        return this
    }

    exactEquals(b: Matrix4): boolean {
        return (
            this._matrix[0] === b._matrix[0] &&
            this._matrix[1] === b._matrix[1] &&
            this._matrix[2] === b._matrix[2] &&
            this._matrix[3] === b._matrix[3] &&
            this._matrix[4] === b._matrix[4] &&
            this._matrix[5] === b._matrix[5] &&
            this._matrix[6] === b._matrix[6] &&
            this._matrix[7] === b._matrix[7] &&
            this._matrix[8] === b._matrix[8] &&
            this._matrix[9] === b._matrix[9] &&
            this._matrix[10] === b._matrix[10] &&
            this._matrix[11] === b._matrix[11] &&
            this._matrix[12] === b._matrix[12] &&
            this._matrix[13] === b._matrix[13] &&
            this._matrix[14] === b._matrix[14] &&
            this._matrix[15] === b._matrix[15]
        );
    }

    convertToArray() {
        let _matrix = []
        _matrix[0] = this._matrix[0];
        _matrix[1] = this._matrix[1];
        _matrix[2] = this._matrix[2];
        _matrix[3] = this._matrix[3];
        _matrix[4] = this._matrix[4];
        _matrix[5] = this._matrix[5];
        _matrix[6] = this._matrix[6];
        _matrix[7] = this._matrix[7];
        _matrix[8] = this._matrix[8];
        _matrix[9] = this._matrix[9];
        _matrix[10] = this._matrix[10]
        _matrix[11] = this._matrix[11]
        _matrix[12] = this._matrix[12]
        _matrix[13] = this._matrix[13]
        _matrix[14] = this._matrix[14]
        _matrix[15] = this._matrix[15]
        return _matrix

    }
}