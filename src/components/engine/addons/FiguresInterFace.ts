import Camera from "../figure/Camera";
import Materials from "../figure/Materials";
import Matrix4D from "./Matrix4D";
import { programArray } from "./webGLutils";

export default interface FigureInterface {
    _UUID: string;
    _matrix4D?: Matrix4D
    readonly _positions?: Array<number>
    _indices?: Array<number>
    _gl?: WebGLRenderingContext;
    _vector?: vector3D;
    _scale?: vector3D;
    _rotationInDeg?: vector3D;
    _material?: Materials;
    draw(_prgL: programArray, _camera: Camera): void
    scaleMe(vect: vector3D): void
    addToPosition(vect: vector3D): void
    addToRotation(vect: vector3D): void
    setNewCoordinate(vect: vector3D): void
    setNewRotations(vect: vector3D): void
}
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export interface vector3D {
    x?: number,
    y?: number,
    z?: number,
    width?: number
}
