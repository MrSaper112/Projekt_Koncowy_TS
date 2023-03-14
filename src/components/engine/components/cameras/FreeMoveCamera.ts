// import { Program } from "../../../../node_modules/typescript/lib/typescript"

import { Figure, Vector3D } from "../../addons/Figure";
import FigureInterface, { generateUUID } from "../../addons/FiguresInterFace";
import { KeyboardAndMouse, Keys } from "../../addons/KeyboardAndMouse";
import Matrix4D from "../../addons/Matrix4D";
import RayCaster from "../../addons/RayCaster";
import { programArray } from "../../addons/webGLutils";
import Materials from "../Materials";
export default class FreeMoveCamera extends Figure {
    _fov?: number;
    _aspect?: number;
    _zNear?: number;
    _zFar?: number;
    _perspectiveMatrix?: Array<number>;
    _viewProjection?: Array<number>;
    _keyboardAndMouseManager?: KeyboardAndMouse;
    _acceleration?: number;
    _aroundSpeed?: number;
    _keys: Keys;
    _rayCaster: RayCaster;
    _speed: number;
    constructor(
        gl: WebGLRenderingContext,
        data: {
            fov?: number;
            aspect?: number;
            zNear?: number;
            zFar?: number;
            acceleration?: number;
            keys?: Keys;
            aroundSpeed?: number;
        },
        speed?: number,
        vector?: Vector3D,
        scale?: Vector3D,
        rotation?: Vector3D
    ) {
        super(gl, vector, scale, rotation);
        this._UUID = generateUUID();

        this._gl = gl;
        this._fov = this._matrix4D.degToRad(data.fov || 60);
        this._aspect = this._gl.canvas.width / this._gl.canvas.height;
        this._zNear = data.zNear || 0.1;
        this._zFar = data.zFar || 100000.0;

        this._acceleration = data.acceleration || 20;
        this._aroundSpeed = data.aroundSpeed || 130;

        this._keys = data.keys || {
            KeyS: false,
            KeyW: false,
            KeyA: false,
            KeyD: false,
            Space: false,
            ShiftLeft: false,
        };

        this._keyboardAndMouseManager = new KeyboardAndMouse({
            keyboardWork: true,
            mouseWork: true,
            keys: this._keys,
        });

        this._speed = speed || 1;
        this.generateMatrixOfView();
    }
    generateMatrixOfView() {
        this._perspectiveMatrix = this._matrix4D.perspective(this._fov, this._aspect, this._zNear, this._zFar)

        this._modelMatrix = this._matrix4D.generateMatrix()
        this._modelMatrix = this._matrix4D.translate(this._modelMatrix, this._vector.x, this._vector.y, -this._vector.z)
        this._modelMatrix = this._matrix4D.yRotate(this._modelMatrix, this._rotationInDeg.y)
        this._modelMatrix = this._matrix4D.zRotate(this._modelMatrix, this._rotationInDeg.z)
        this._modelMatrix = this._matrix4D.xRotate(this._modelMatrix, this._rotationInDeg.x)
        this._modelMatrix = this._matrix4D.inverse(this._modelMatrix)

        this._viewProjection = this._matrix4D.multiplyMatrices(this._perspectiveMatrix, this._modelMatrix);

    }
    calculateAndMove(deltaTime: number) {
        if (this._keyboardAndMouseManager._mouseWork) {
            this._rotationInDeg.x += deltaTime * 36 * (this._speed / 2) * -this._keyboardAndMouseManager._positionOfMouse.y
            this._keyboardAndMouseManager._positionOfMouse.y = 0;

            this._rotationInDeg.y += deltaTime * 36 * (this._speed / 2) * -this._keyboardAndMouseManager._positionOfMouse.x
            this._keyboardAndMouseManager._positionOfMouse.x = 0;


        }
        if (this._keyboardAndMouseManager) {
            if (
                this._keyboardAndMouseManager._keys.KeyW ||
                this._keyboardAndMouseManager._keys.KeyS
            ) {
                const direction = this._keyboardAndMouseManager._keys.KeyW ? -1 : 1;
                let x = this._vector.x - this._modelMatrix[8] * deltaTime * this._acceleration * direction * this._speed;
                let y = this._vector.y - this._modelMatrix[9] * deltaTime * this._acceleration * direction * this._speed;
                let z = this._vector.z - this._modelMatrix[10] * deltaTime * this._acceleration * direction * this._speed;
                this._vector.x = x
                this._vector.y = y
                this._vector.z = z


            }

            // shift - space
            if (
                this._keyboardAndMouseManager._keys.ShiftLeft ||
                this._keyboardAndMouseManager._keys.Space
            ) {
                const direction = this._keyboardAndMouseManager._keys.ShiftLeft ? 1 : -1;
                let x = this._vector.x - this._modelMatrix[4] * deltaTime * this._acceleration * direction * this._speed;
                let y = this._vector.y - this._modelMatrix[5] * deltaTime * this._acceleration * direction * this._speed;
                let z = this._vector.z - this._modelMatrix[6] * deltaTime * this._acceleration * direction * this._speed;
                this._vector.x = x
                this._vector.y = y
                this._vector.z = z
            }

            // //a-d
            if (
                this._keyboardAndMouseManager._keys.KeyA ||
                this._keyboardAndMouseManager._keys.KeyD
            ) {
                const direction = this._keyboardAndMouseManager._keys.KeyD ? -1 : 1;
                let x = this._vector.x - this._modelMatrix[0] * deltaTime * this._acceleration * direction * this._speed;
                let y = this._vector.y - this._modelMatrix[1] * deltaTime * this._acceleration * direction * this._speed;
                let z = this._vector.z - this._modelMatrix[2] * deltaTime * this._acceleration * direction * this._speed;
                this._vector.x = x
                this._vector.y = y
                this._vector.z = z
            }
        }
    }
}
