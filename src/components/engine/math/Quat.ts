export default class Quat {
    _quaternion: Float32Array;
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this._quaternion = new Float32Array([x, y, z, w])


    }
}