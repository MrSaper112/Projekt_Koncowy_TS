import Camera from "../figure/Camera";
import Materials from "../figure/Materials";
import Matrix4D from "./Matrix4D";
import { programArray } from "./webGLutils";

export default interface FigureInterface {
    _matrix4D?: Matrix4D
    readonly _positions?: Array<number>
    _indices?: Array<number>
    _gl?: WebGLRenderingContext;
    _vector?: vector3D;
    _scale?: vector3D;
    _rotationInDeg?: vector3D;
    _material?:Materials;
    draw(_prgL: programArray, _camera: Camera):void
    scaleMe(vect: vector3D):void
    addToPosition(vect: vector3D):void
    addToRotation(vect: vector3D):void
    setNewCoordinate(vect: vector3D):void
    setNewRotations(vect: vector3D):void
}
export interface vector3D {
    x?: number,
    y?: number,
    z?: number,
    width?: number
}
