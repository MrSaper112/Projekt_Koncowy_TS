// import { Program } from "../../../../node_modules/typescript/lib/typescript"

import FigureInterface, { vector3D } from "../addons/FiguresInterFace"
import KeyboardAndMouse from "../addons/KeyboardAndMouse";
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
    _keyboardAndMouseManager?: KeyboardAndMouse
    _acceleration?: number
    constructor(gl: WebGLRenderingContext, data: { fov?: number, aspect?: number, zNear?: number, zFar?: number, acceleration?: number }) {
        this._gl = gl;
        this._fov = (data.fov || 60) * Math.PI / 180;
        this._aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        this._zNear = data.zNear || 0.1;
        this._zFar = data.zFar || 10000.0;
        this._matrix4D = new Matrix4D()
        this._scale = { x: 1, y: 1, z: 1 }
        this._rotationInDeg = { x: 0, y: 0, z: 0 }
        this._vector = { x: 0, y: 0, z: 0 }
        this._acceleration = data.acceleration || 5
        this._keyboardAndMouseManager = new KeyboardAndMouse({ keyboardWork: true, keys: { KeyS: false, KeyW: false, KeyA: false, KeyD: false } })
        console.log(this._keyboardAndMouseManager)
        this.generateMatrixOfView()



    }
    generateMatrixOfView() {
        let proj = this._matrix4D.perspective(this._fov, this._aspect, this._zNear, this._zFar)

        this._matrix = this._matrix4D.generateMatrix()
        this._matrix = this._matrix4D.translate(this._matrix, this._vector.x, this._vector.y, this._vector.z)
        this._matrix = this._matrix4D.scale(this._matrix, this._scale.x, this._scale.y, this._scale.z)
        this._matrix = this._matrix4D.xRotate(this._matrix, this._matrix4D.degToRad(this._rotationInDeg.x))
        this._matrix = this._matrix4D.yRotate(this._matrix, this._matrix4D.degToRad(this._rotationInDeg.y))
        this._matrix = this._matrix4D.zRotate(this._matrix, this._matrix4D.degToRad(this._rotationInDeg.z))

        this._viewMatrix = this._matrix4D.multiplyMatrices(proj, this._matrix)
    }
    calculate(deltaTime: number) {
        if (this._keyboardAndMouseManager) {

        }
    }
    draw(_prgL: programArray): void {
        if (this._keyboardAndMouseManager) {

        }
    }
    addToPosition(vect: vector3D): void {
        this._vector.x += vect.x
        this._vector.y += vect.y
        this._vector.z += vect.z
        this.generateMatrixOfView()
    }
    addToRotation(vect: vector3D): void {
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