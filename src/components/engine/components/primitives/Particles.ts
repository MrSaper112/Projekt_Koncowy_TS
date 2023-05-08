import Materials from "../Materials";
import Block from "./Block";
import { Figure } from "./Figure";

export default class Particle extends Block {
    constructor(vector?: vec3, scale?: vec3, rotation?: vec3, material?: Materials, visible?: boolean, type?: String) {
        super(vector, scale, rotation);
        if (!visible) this._visible = false;
        else this._visible = true;
        this._type = "particle"
        this._textureCoordinates = new Float32Array([
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ]);
        this._positions = new Float32Array([
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
        ])
        this._indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,   // front

        ]);
    }
}