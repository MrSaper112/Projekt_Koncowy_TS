import FigureInterface from "../addons/FiguresInterFace";
import Matrix4D from "../addons/Matrix4D";
import { vector3D } from "../addons/positionManager";
import { programArray } from "../addons/webGLutils";

export class BulbLight implements FigureInterface {
    public _matrix4D?: Matrix4D;
    public _positions?: number[];
    public _indices?: number[];
    public _gl?: WebGLRenderingContext;
    public _vector?: vector3D;
    public _scale?: vector3D;
    public _rotationInDeg?: vector3D;
    constructor(gl: WebGLRenderingContext, vect: vector3D = { x: 1, y: 1, z: 1 }) {
        this._matrix4D = new Matrix4D();
        this._gl = gl
        this._vector = vect
        this._scale = { x: 1, y: 1, z: 1 }
        this._rotationInDeg = { x: 0, y: 0, z: 0 }
    }


    draw(_prgL: programArray): void {
        throw new Error("Method not implemented.");
    }
    rotateMe(vect: vector3D) {
        this._rotationInDeg.x = vect.x
        this._rotationInDeg.y = vect.y
        this._rotationInDeg.z = vect.z

    }
    updateRotation(vect: vector3D): void {
        this._rotationInDeg.x += vect.x
        this._rotationInDeg.y += vect.y
        this._rotationInDeg.z += vect.z
    }
    translateMe(vect: vector3D) {
        this._vector.x = vect.x
        this._vector.y = vect.y
        this._vector.z = vect.z
    }
    scaleMe(vect: vector3D) {
        this._scale.x = vect.x
        this._scale.y = vect.y
        this._scale.z = vect.z
    }
    updateMyPos(vect: vector3D): void {
        this._vector.x += vect.x
        this._vector.y += vect.y
        this._vector.z += vect.z
    }
}