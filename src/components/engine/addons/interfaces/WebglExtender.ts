import { Shader } from "../webGLutils"

export class WebGlWProgram {
    gl: WebGL2RenderingContext | null
    shaders: shadersArray | null
    lastBufferedType: string
    anglesFigure: number
    uniforms: any
    attributes: any
    constructor() {
        this.uniforms = {}
        this.attributes = {}
    }
}

export interface programArray {
    shaders: shadersArray
}
export interface shadersArray {
    color: Shader
    texture: Shader
    colorLights: Shader
    textureLights: Shader
    test: Shader
}
