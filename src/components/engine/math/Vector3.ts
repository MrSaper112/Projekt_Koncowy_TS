import Matrix4 from "./Matrix4"
import Quat from "./Quat"


export default class Vector3 {
    public _vector: Float32Array
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._vector = new Float32Array(3)
        this._vector[0] = x
        this._vector[1] = y
        this._vector[2] = z
    }
    clone(a: Vector3): Vector3 {
        this._vector[0] = a._vector[0];
        this._vector[1] = a._vector[1];
        this._vector[2] = a._vector[2];
        return this;
    }
    length(): number {
        let x = this._vector[0];
        let y = this._vector[1];
        let z = this._vector[2];
        return Math.sqrt(x * x + y * y + z * z);
    }
    set(x: number, y: number, z: number): Vector3 {
        this._vector[0] = x;
        this._vector[1] = y;
        this._vector[2] = z;
        return this;
    }
    add(b: Vector3): Vector3 {
        this._vector[0] += b._vector[0];
        this._vector[1] += b._vector[1];
        this._vector[2] += b._vector[2];
        return this;
    }
    subtract(b: Vector3): Vector3 {
        this._vector[1] -= b._vector[1];
        this._vector[0] -= b._vector[0];
        this._vector[2] -= b._vector[2];
        return this;
    }
    multiply(b: Vector3): Vector3 {
        this._vector[1] *= b._vector[1];
        this._vector[0] *= b._vector[0];
        this._vector[2] *= b._vector[2];
        return this;
    }
    divide(b: Vector3): Vector3 {
        this._vector[1] /= b._vector[1];
        this._vector[0] /= b._vector[0];
        this._vector[2] /= b._vector[2];
        return this;
    }
    ceil(): Vector3 {
        this._vector[0] = Math.ceil(this._vector[0]);
        this._vector[1] = Math.ceil(this._vector[1]);
        this._vector[2] = Math.ceil(this._vector[2]);
        return this;
    }
    floor(): Vector3 {
        this._vector[0] = Math.floor(this._vector[0]);
        this._vector[1] = Math.floor(this._vector[1]);
        this._vector[2] = Math.floor(this._vector[2]);
        return this;
    }
    scale(b: number): Vector3 {
        this._vector[0] *= b;
        this._vector[1] *= b;
        this._vector[2] *= b;
        return this;
    }
    distance(a: Vector3): number {
        let x = a._vector[0] - this._vector[0];
        let y = a._vector[1] - this._vector[1];
        let z = a._vector[2] - this._vector[2];
        return Math.sqrt(x * x + y * y + z * z);
    }
    squaredDistance(a: Vector3): number {
        let x = a._vector[0] - this._vector[0];
        let y = a._vector[1] - this._vector[1];
        let z = a._vector[2] - this._vector[2];
        return x * x + y * y + z * z;
    }
    negate(): Vector3 {
        this._vector[0] = -this._vector[0];
        this._vector[1] = -this._vector[1];
        this._vector[2] = -this._vector[2];
        return this;
    }
    inverse(): Vector3 {
        this._vector[0] = 1.0 / this._vector[0];
        this._vector[1] = 1.0 / this._vector[1];
        this._vector[2] = 1.0 / this._vector[2];
        return this;
    }
    normalize(): Vector3 {
        let x = this._vector[0];
        let y = this._vector[1];
        let z = this._vector[2];
        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
        }
        this._vector[0] *= len;
        this._vector[1] *= len;
        this._vector[2] *= len;
        return this;
    }
    dot(b: Vector3): number {
        return this._vector[0] * b._vector[0] + this._vector[1] * b._vector[1] + this._vector[2] * b._vector[2];
    }
    cross(b: Vector3): Vector3 {
        let ax = this._vector[0],
            ay = this._vector[1],
            az = this._vector[2];
        let bx = b._vector[0],
            by = b._vector[1],
            bz = b._vector[2];

        this._vector[0] = ay * bz - az * by;
        this._vector[1] = az * bx - ax * bz;
        this._vector[2] = ax * by - ay * bx;
        return this;
    }
    transformMat4(m: Matrix4): Vector3 {
        let x = this._vector[0],
            y = this._vector[1],
            z = this._vector[2];
        let w = m._matrix[3] * x + m._matrix[7] * y + m._matrix[11] * z + m._matrix[15];
        w = w || 1.0;
        this._vector[0] = (m._matrix[0] * x + m._matrix[4] * y + m._matrix[8] * z + m._matrix[12]) / w;
        this._vector[1] = (m._matrix[1] * x + m._matrix[5] * y + m._matrix[9] * z + m._matrix[13]) / w;
        this._vector[2] = (m._matrix[2] * x + m._matrix[6] * y + m._matrix[10] * z + m._matrix[14]) / w;
        return this;
    }
    applyQuaternion(q: Quat): Vector3 {

        const x = this._vector[0], y = this._vector[1], z = this._vector[2];
        const qx = q._quaternion[0], qy = q._quaternion[1], qz = q._quaternion[2], qw = q._quaternion[3];

        // calculate quat * vector

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this._vector[0] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this._vector[1] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this._vector[2] = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return this;
    }
    // Vector Setter And Getters
    get getX(): number { return this._vector[0] }
    set setX(value: number) {
        this._vector[0] = value;
    }

    get getY(): number { return this._vector[1] }
    set setY(value: number) {
        this._vector[1] = value;
    }

    get getZ(): number { return this._vector[2] }
    set setZ(value: number) {
        this._vector[2] = value;
    }

    public get() {
        return this._vector
    }

}