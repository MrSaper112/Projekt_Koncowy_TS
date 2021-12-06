import Camera from "../figure/Camera";
import Materials from "../figure/Materials";
import { Vector3D } from "./Figure";
import Matrix4D from "./Matrix4D";
import { programArray } from "./webGLutils";

export default interface FigureInterface {
    _UUID: string;
    _matrix4D?: Matrix4D
    readonly _positions?: Array<number>
    _indices?: Array<number>
    _gl?: WebGLRenderingContext;
    _vector?: Vector3D;
    _scale?: Vector3D;
    _rotationInDeg?: Vector3D;
    _material?: Materials;
    draw(_prgL: programArray, _camera: Camera): void
    scaleMe(vect: Vector3D): void
    addToPosition(vect: Vector3D): void
    addToRotation(vect: Vector3D): void
    setNewCoordinate(vect: Vector3D): void
    setNewRotations(vect: Vector3D): void
}
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

