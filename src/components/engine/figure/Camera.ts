// import { Program } from "../../../../node_modules/typescript/lib/typescript"

import { vector3D } from "../addons/FiguresInterFace"

export default class Camera {
    private _fieldOfView: number
    private _gl: WebGLRenderingContext
    private _perspectiveProjectionMatrix: Array<number>
    private _position: vector3D
    private _cameraMatrix: Array<number>
    private _worldMatrix: Array<number>
    private _program: WebGLProgram
    private _aspect: number
    constructor(gl: WebGLRenderingContext, fov: number, program: WebGLProgram) {
        this._gl = gl
        this._fieldOfView = fov
        this._position = { x: 0, y: 0, z: 0 }
        this._program = program
        this._aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;

    }
    async render() {

        const target = [0, 1, 0];
        const up = [0, 1, 0];
      
        return { perspectiveProjectionMatrix: this._perspectiveProjectionMatrix, cameraMatrix: this._cameraMatrix, worldMatrix: this._worldMatrix }
    }
    getArray() {
        return [this._position.x, this._position.y, this._position.z]
    }
    updateX(x: number) {
        this._position.x = x
    }
    updateY(y: number) {
        this._position.y = y
    }
    updateZ(z: number) {
        this._position.z = z
    }
    updateFOV(fov: number) {
        this._fieldOfView = fov
    }
    updateCameraPos(vect: vector3D) {
        this._position = vect
    }
}