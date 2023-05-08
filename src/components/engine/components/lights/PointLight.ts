import {mat4, vec3, vec4} from "../../math/gl-matrix"
import Light from "./Light"

export default class PointLight extends Light {
    constructor({v, color, power, constant, linear, quadratic,ambient,diffuse,specular, intensity}: {
        v: vec3,
        color?: vec4,
        power?: number,
        constant?: number,
        linear?: number,
        intensity?: number,
        quadratic?: number,
        ambient?:vec3,
        diffuse?:vec3,
        specular?:vec3
    }) {
        super(v, color)
        this.intensity = intensity || 1
        this.power = power || 512;
        this.constant = constant || 1.0;
        this.linear = linear || 0.2;
        this.quadratic = quadratic || 0.01;
        this.ambient = ambient || vec3.fromValues(0.5,0.5,0.5)
        this.diffuse = diffuse || vec3.fromValues(0.5,0.5,0.5)
        this.specular = specular ||vec3.fromValues(0.5,0.5,0.5)
        this.type = "pointLight"
    }

}