import { quat, vec3 } from "../../math/gl-matrix";

export default class Camera {
    public _aspect?: number;
    public _vector?: vec3;
    public _scale?: vec3;
    public _rotation?: quat;
    public _modelMatrix?: mat4
    public _perspectiveMatrix?: mat4;
    public _viewProjection?: mat4;
    constructor(vector?: vec3, scale?: vec3, rotation?: vec3) {
        this._vector = vector || vec3.fromValues(0, 0, 0)
        this._scale = scale || vec3.fromValues(1, 1, 1)
        this._rotation = rotation || quat.fromValues(0, 0, 0, 1)
    }
}