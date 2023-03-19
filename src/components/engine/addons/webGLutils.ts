// let x: { a: boolean, b: boolean, c: boolean, d: boolean } = {a: false, b: false, c: false, d: false}
import { fShaderColor, fShaderTexture, fShaderTextureNormal, vShaderColor, vShaderTexture, vShaderTextureNormal } from '../assets/ShaderTexted'
import { programArray, shadersArray } from './interfaces/WebglExtender';

export default class webGLutils {
    newProgram(gl: WebGLRenderingContext): programArray {
        let finalArrayOfShaders: shadersArray = {
            color: new Shader(gl, vShaderColor, fShaderColor),
            texture: new Shader(gl, vShaderTexture, fShaderTexture),
        }
        return {
            returnAttrib: (_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string) => { return _gl.getAttribLocation(_prg, _type) },
            returnUniform: (_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string): WebGLUniformLocation => { return _gl.getUniformLocation(_prg, _type) },
            shaders: finalArrayOfShaders,
        };
    }
}
export class Shader {
    _vrtx: WebGLShader
    _frgm: WebGLShader
    _prg: WebGLProgram
    constructor(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
        this._vrtx = this.loadShader(gl, gl.VERTEX_SHADER, vertexShader)
        this._frgm = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
        this._prg = this.initShaderProgram(gl, this._vrtx, this._frgm)
    }
    loadShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
    initShaderProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // Check that shader program was able to link to WebGL
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            var error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        //gl.useProgram(program);
        return program;
    }
}

