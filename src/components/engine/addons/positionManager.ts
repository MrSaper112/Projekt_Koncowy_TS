export class PositionManager {
    constructor() {
        console.log("PositionManager")
    }
    radToDeg(r: number) {
        return r * 180 / Math.PI;
    }

    degToRad(d: number) {
        return d * Math.PI / 180;
    }

    translate(m: Array<number>, translateX: number, translateY: number, translateZ: number) {
        return this.multiply(m, this.translation(translateX, translateY, translateZ));
    }

    xRotate(m: Array<number>, angleInRadians: number) {
        return this.multiply(m, this.xRotation(this.degToRad(angleInRadians)));
    }
    yRotate(m: Array<number>, angleInRadians: number) {
        return this.multiply(m, this.yRotation(this.degToRad(angleInRadians)));
    }

    zRotate(m: Array<number>, angleInRadians: number) {
        console.log(angleInRadians)
        console.log(this.multiply(m, this.zRotation(this.degToRad(angleInRadians))))
        return this.multiply(m, this.zRotation(this.degToRad(angleInRadians)));
    }

    scale(m: Array<number>, scaleX: number, scaleY: number, scaleZ: number) {
        return this.multiply(m, this.scaling(scaleX, scaleY, scaleZ));
    }

    orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    return [
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, 2 / (near - far), 0,

        (left + right) / (left - right),
        (bottom + top) / (bottom - top),
        (near + far) / (near - far),
        1
    ]
}
    projection(width: number, height: number, depth: number) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    }
    private translation(translateX: number, translateY: number, translateZ: number) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            translateX, translateY, translateZ, 1,
        ];
    }

    private xRotation(angleInRadians: number) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    }

    private yRotation(angleInRadians: number) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    }

    private zRotation(angleInRadians: number) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        console.log(angleInRadians)
        console.log(c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1)
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    private scaling(scaleX: number, scaleY: number, scaleZ: number) {
        return [
            scaleX, 0, 0, 0,
            0, scaleY, 0, 0,
            0, 0, scaleZ, 0,
            0, 0, 0, 1,
        ];
    }
    //This operate on matrix 4x4 https://www.math10.com/en/algebra/matrices/determinant.html
    private multiply(a: Array<number>, b: Array<number>) {
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];

        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    }
}
export interface vector3D {
    x?: number,
    y?: number,
    z?: number,
    width?: number
}
