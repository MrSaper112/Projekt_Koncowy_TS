// import { Program } from "../../../../node_modules/typescript/lib/typescript"

import FigureInterface, { generateUUID, vector3D } from "../addons/FiguresInterFace"
import { KeyboardAndMouse, Keys } from "../addons/KeyboardAndMouse";
import Matrix4D from "../addons/Matrix4D";
import { programArray } from "../addons/webGLutils";
import Materials from "./Materials";
export default class Camera implements FigureInterface {
    _matrix4D?: Matrix4D;
    _vector?: vector3D;
    _gl?: WebGLRenderingContext;
    _rotationInDeg?: vector3D;
    _fov?: number;
    _aspect?: number
    _zNear?: number
    _zFar?: number
    _viewMatrix?: Array<number>
    _perspectiveMatrix?: Array<number>
    _viewProjection?: Array<number>
    _matrix2?: Array<number>
    _keyboardAndMouseManager?: KeyboardAndMouse
    _acceleration?: number
    _aroundSpeed?: number
    _keys: Keys
    _UUID: string;
    _positions?: number[];
    _indices?: number[];
    _scale?: vector3D;
    _material?: Materials;
    constructor(gl: WebGLRenderingContext, data: { fov?: number, aspect?: number, zNear?: number, zFar?: number, acceleration?: number, keys?: Keys, aroundSpeed?: number }, vect?: vector3D) {
        this._matrix4D = new Matrix4D()
        this._UUID = generateUUID();

        this._gl = gl;
        this._fov = this._matrix4D.degToRad(data.fov || 60)
        this._aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        this._zNear = data.zNear || 0.1;
        this._zFar = data.zFar || 100000.0;
        this._rotationInDeg = { x: 0, y: 0, z: 0 }
        this._vector = vect || { x: 0, y: 0, z: 0 } 
        this._acceleration = data.acceleration || 20
        this._aroundSpeed = data.aroundSpeed || 130

        this._keys = data.keys || { KeyS: false, KeyW: false, KeyA: false, KeyD: false }

        this._keyboardAndMouseManager = new KeyboardAndMouse({ keyboardWork: true, mouseWork: true, keys: this._keys })

        this.generateMatrixOfView()

    }

    scaleMe(vect: vector3D): void {
        throw new Error("Method not implemented.");
    }
    generateMatrixOfView() {
        this._perspectiveMatrix = this._matrix4D.perspective(this._fov, this._aspect, this._zNear, this._zFar)

        this._matrix2 = this._matrix4D.generateMatrix()
        this._matrix2 = this._matrix4D.translate(this._matrix2, this._vector.x, this._vector.y, -this._vector.z)
        this._matrix2 = this._matrix4D.yRotate(this._matrix2, this._rotationInDeg.y)

        this._matrix2 = this._matrix4D.inverse(this._matrix2)

        this._viewProjection = this._matrix4D.multiplyMatrices(this._perspectiveMatrix, this._matrix2);

    }
    calculate(deltaTime: number) {
        if (this._keyboardAndMouseManager) {
            if (this._keyboardAndMouseManager._keys.KeyW || this._keyboardAndMouseManager._keys.KeyS) {
                const direction = this._keyboardAndMouseManager._keys.KeyW ? -1 : 1;
                this._vector.x -= this._matrix2[8] * deltaTime * this._acceleration * direction;
                this._vector.y -= this._matrix2[9] * deltaTime * this._acceleration * direction;
                this._vector.z -= this._matrix2[10] * deltaTime * this._acceleration * direction;
            }
            //a-d
            if (this._keyboardAndMouseManager._keys.KeyA || this._keyboardAndMouseManager._keys.KeyD) {
                const direction = this._keyboardAndMouseManager._keys.KeyA ? 1 : -1;
                this._rotationInDeg.y += deltaTime * this._aroundSpeed * direction;
            }

        }
    }
    draw(_prgL: programArray): void {
        if (this._keyboardAndMouseManager) {

        }
    }
    addToPosition(vect: vector3D): void {

        // console.log(this._vector)
        this._vector.x += vect.x
        this._vector.y += vect.y
        this._vector.z += vect.z
        this.generateMatrixOfView()
    }
    addToRotation(vect: vector3D): void {
        console.log(this._rotationInDeg)

        this._rotationInDeg.x += vect.x
        this._rotationInDeg.y += vect.y
        this._rotationInDeg.z += vect.z
        // let quaternion = this.setFromEuler()

        // this.applyQuaternion(quaternion)
        this.generateMatrixOfView()


    }
    setNewCoordinate(vect: vector3D): void {
        this._vector.x = vect.x
        this._vector.y = vect.y
        this._vector.z = vect.z
        this.generateMatrixOfView()
    }
    setNewRotations(vect: vector3D): void {
        console.log(this._rotationInDeg)

        this._rotationInDeg.x = vect.x
        this._rotationInDeg.y = vect.y
        this._rotationInDeg.z = vect.z
        this.generateMatrixOfView()
    }
    updateX(e: number) {
        this._vector.x = e
        this.generateMatrixOfView()

    }
    updateZ(e: number) {
        this._vector.z = e
        this.generateMatrixOfView()

    }
    updateY(e: number) {
        this._vector.y = e
        this.generateMatrixOfView()

    }

}
interface quaternion {
    x: number,
    y: number,
    z: number,
    w: number
}