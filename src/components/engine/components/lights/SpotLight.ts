import {vec3, vec4} from "../../math/gl-matrix";
import Light from "./Light";

export default class SpotLight extends Light{
    constructor({v, color, intensity, constant, linear, quadratic,ambient,diffuse,specular,cutOff,outerCutOff,direction}: {
        v: vec3,
        direction?: vec3,
        color?: vec4,
        intensity?: number,
        constant?: number,
        linear?: number,
        quadratic?: number,
        ambient?:vec3,
        diffuse?:vec3,
        specular?:vec3,
        cutOff?: number
        outerCutOff?: number
    }) {
        super(v, color)
        this.intensity = intensity || 1
        this.constant = constant || 1.0;
        this.linear = linear || 0.5
        this.cutOff = cutOff || 0.1;
        this.outerCutOff = outerCutOff || 0.2;
        this.quadratic = quadratic || 0.01;
        this.ambient = ambient || vec3.fromValues(0.5,0.5,0.5)
        this.diffuse = diffuse || vec3.fromValues(0.5,0.5,0.5)
        this.specular = specular ||vec3.fromValues(0.5,0.5,0.5)
        this.direction = direction || vec3.fromValues(1,1,1)
        this.type = "spotLight"
    }
}