// import { Program } from "../../../../node_modules/typescript/lib/typescript"
import { PositionManager, vector3D } from "../addons/positionManager"

export default class Camera extends PositionManager {
    private _fieldOfView: number
    private _gl: WebGLRenderingContext
    private _perspectiveProjectionMatrix: Array<number>
    private _position: vector3D
    private _cameraMatrix: Array<number>
    private _worldMatrix: Array<number>
    private _program: WebGLProgram
    private _aspect: number
    constructor(gl: WebGLRenderingContext, fov: number, program: WebGLProgram) {
        super()
        this._gl = gl
        this._fieldOfView = fov
        this._position = { x: 0, y: 0, z: 0 }
        this._program = program
        this._aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        this._perspectiveProjectionMatrix = this.perspective(this._fieldOfView, this._aspect, 1e-4, 1e4)

    }
    async render() {
        this._perspectiveProjectionMatrix = this.perspective(this.degToRad(this._fieldOfView), this._aspect, 1e-4, 1e4)

        const target = [0, 1, 0];
        const up = [0, 1, 0];
        this._cameraMatrix = this.lookAt(this.getArray(), target, up);
        this._worldMatrix = this.yRotation(0)

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