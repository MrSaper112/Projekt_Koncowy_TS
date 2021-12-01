// import { Program } from "../../../../node_modules/typescript/lib/typescript"

import FigureInterface, { vector3D } from "../addons/FiguresInterFace"
import { KeyboardAndMouse, Keys } from "../addons/KeyboardAndMouse";
import Matrix4D from "../addons/Matrix4D";
import { programArray } from "../addons/webGLutils";
import Materials from "./Materials";

export default class Camera implements FigureInterface {
    _matrix4D?: Matrix4D;
    _vector?: vector3D;
    _gl?: WebGLRenderingContext;
    _scale?: vector3D;
    _rotationInDeg?: vector3D;
    _fov?: number;
    _aspect?: number
    _zNear?: number
    _zFar?: number
    _matrix?: Array<number>
    _viewMatrix?: Array<number>
    _matrixRot?: Array<number>
    _keyboardAndMouseManager?: KeyboardAndMouse
    _acceleration?: number
    _keys: Keys
    constructor(gl: WebGLRenderingContext, data: { fov?: number, aspect?: number, zNear?: number, zFar?: number, acceleration?: number, keys?: Keys }, vect?: vector3D) {
        this._gl = gl;
        this._fov = (data.fov || 30) * Math.PI / 180;
        this._aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        this._zNear = data.zNear || 0.1;
        this._zFar = data.zFar || 10000.0;
        this._matrix4D = new Matrix4D()
        this._scale = { x: 1, y: 1, z: 1 }
        this._rotationInDeg = { x: 0, y: 0, z: 0 }
        this._vector = { x: 0, y: 0, z: 0 }
        this._acceleration = data.acceleration || 20
        this._keys = data.keys || { KeyS: false, KeyW: false, KeyA: false, KeyD: false }

        console.log(this._keys)
        this._keyboardAndMouseManager = new KeyboardAndMouse({ keyboardWork: true, mouseWork: false, keys: this._keys })

        console.log(this._keyboardAndMouseManager)
        this.generateMatrixOfView()



    }
    generateMatrixOfView() {
        this._viewMatrix = this._matrix4D.perspective(this._fov, this._aspect, this._zNear, this._zFar)

        this._matrixRot = this._matrix4D.generateMatrix()
        this._matrixRot = this._matrix4D.yRotate(this._matrixRot, this._matrix4D.degToRad(this._rotationInDeg.y))
        this._matrixRot = this._matrix4D.inverse(this._matrixRot)

        this._matrix = this._matrix4D.generateMatrix()
        this._matrix = this._matrix4D.translate(this._matrix, this._vector.x, this._vector.y, this._vector.z)
        this._matrix = this._matrix4D.multiplyMatrices(this._matrix,this._matrixRot)


    }
    calculate(deltaTime: number) {
        if (this._keyboardAndMouseManager) {
            if (this._keyboardAndMouseManager._keys.KeyW) {
                this.addToPosition({ x: 0, y: 0, z: this._acceleration * deltaTime })
            }
            if (this._keyboardAndMouseManager._keys.KeyS) {
                this.addToPosition({ x: 0, y: 0, z: -this._acceleration * deltaTime })

            }
            // if (this._keyboardAndMouseManager._keys.KeyA) {
            //     this.addToPosition({ z: 0, y: 0, x: -this._acceleration * deltaTime })
            // }
            // if (this._keyboardAndMouseManager._keys.KeyD) {
            //     this.addToPosition({ z: 0, y: 0, x: this._acceleration * deltaTime })

            // }
            if (this._keyboardAndMouseManager._keys.KeyA) {
                this.addToRotation({ y: 100 * this._acceleration * deltaTime, z: 0, x: 0 })
            }
            if (this._keyboardAndMouseManager._keys.KeyD) {
                this.addToRotation({ y: 100 * -this._acceleration * deltaTime, z: 0, x: 0 })
            }
            // if (this._keyboardAndMouseManager._mouseWork) {
            //     this.setNewRotations({ z: 0, y: 30 * this._keyboardAndMouseManager._positionOfMouse.x, x:0 })
            // }
        }
    }
    //document.addEventListener("mousemove", (e) =>{console.log(e.offsetX - document.body.clientWidth/2)})
    //document.addEventListener("mousemove", (e) =>{console.log(e.offsetY - document.body.clientHeight/2)})
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
    scaleMe(vect: vector3D) {
        // this._matrix = this.scale(this._matrix, vect.x, vect.y, vect.z);
        this._scale.x = vect.x
        this._scale.y = vect.y
        this._scale.z = vect.z
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