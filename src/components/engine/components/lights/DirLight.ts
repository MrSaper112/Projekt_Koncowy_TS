import {vec3} from "../../math/gl-matrix";
import Light from "./Light";

export default class DirLight extends Light {
    constructor({v, clr, intens, ambient, diffuse, specular}: {
        v: vec3, clr?: vec4, intens?: number, ambient?: vec3,
        diffuse?: vec3,
        specular?: vec3
    }) {
        super(v);
        this.color = clr
        this.intensity = intens ||  1
        this.type = "dirLight"
        this.direction = vec3.fromValues(1,10,1)
        this.ambient = ambient || vec3.fromValues(0.5, 0.5, 0.5)
        this.diffuse = diffuse || vec3.fromValues(0.5, 0.5, 0.5)
        this.specular = specular || vec3.fromValues(0.5, 0.5, 0.5)
    }
}