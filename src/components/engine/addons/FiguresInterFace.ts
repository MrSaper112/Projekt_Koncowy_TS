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
    draw(_prgL: programArray):void
    rotateMe(vect: vector3D):void
    translateMe(vect: vector3D):void
    scaleMe(vect: vector3D):void
    updateMyPos(vect: vector3D):void
    updateRotation(vect: vector3D):void
}
export interface vector3D {
    x?: number,
    y?: number,
    z?: number,
    width?: number
}
