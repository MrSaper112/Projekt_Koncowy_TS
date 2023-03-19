import { Shader } from "../webGLutils"

export class WebGlWProgram {
    gl: WebGL2RenderingContext | null
    programs: programArray | null
    lastBufferedType: string
    anglesFigure: number

}
export interface programArray {
    returnAttrib(_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string): any,
    returnUniform(_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string): WebGLUniformLocation,
    shaders: shadersArray
}
export interface shadersArray {
    color: Shader
    texture: Shader
}
