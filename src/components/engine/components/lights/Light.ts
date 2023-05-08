import {quat, vec3, vec4} from "../../math/gl-matrix";

export default class Light {
    public position?: vec3;
    public direction?: vec3;
    public intensity: number;
    public color: vec4;

    public power: number
    public ambient: vec3;
    public diffuse: vec3;
    public specular: vec3;
    public type:string
    public constant: number;
    public linear: number;
    public quadratic: number;
    public cutOff: number;
    public outerCutOff: number;
    constructor(vector?: vec3, color?: vec4) {
        this.position = vector || vec3.fromValues(0, 0, 0)
        this.color = color || vec4.fromValues(0.5, 0.5, 0.5, 1.0)
        this.intensity = 10
        this.type = ""

    }


}