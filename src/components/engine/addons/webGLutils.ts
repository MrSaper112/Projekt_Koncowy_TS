import * as vertexShaderSimpleColor from '../assets/vertexShaderSimpleColor.txt'
import * as fragmetalShaderSimpleColor from '../assets/fragmetalShaderSimpleColor.txt'

import * as vertexShaderTexture from '../assets/vertexShaderTexture.txt'
import * as fragmentalShaderTexture from '../assets/fragmentalShaderTexture.txt'
// let x: { a: boolean, b: boolean, c: boolean, d: boolean } = {a: false, b: false, c: false, d: false}

export default class webGLutils {
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
    loadShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    newProgram(gl: WebGLRenderingContext): programArray {
        let finalArrayOfShaders: shadersArray = {
            color: new Shader(this, gl, vertexShaderSimpleColor.default.toString(), fragmetalShaderSimpleColor.default.toString()),
            texture: new Shader(this, gl, vertexShaderTexture.default.toString(), fragmentalShaderTexture.default.toString())
        }
        return {
            returnAttrib: (_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string) => { return _gl.getAttribLocation(_prg, _type) },
            returnUniform: (_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string): WebGLUniformLocation => { return _gl.getUniformLocation(_prg, _type) },
            shaders: finalArrayOfShaders,
        };
    }
}
class Shader implements shaderArray {
    _vrtx: WebGLShader
    _frgm: WebGLShader
    _prg: WebGLProgram
    constructor(webGl: webGLutils, gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
        this._vrtx = webGl.loadShader(gl, gl.VERTEX_SHADER, vertexShader)
        this._frgm = webGl.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
        this._prg = webGl.initShaderProgram(gl, this._vrtx, this._frgm)
    }
}

export interface programArray {
    returnAttrib(_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string): any,
    returnUniform(_gl: WebGLRenderingContext, _prg: WebGLProgram, _type: string): WebGLUniformLocation,
    shaders: shadersArray
}
interface shadersArray {
    color: Shader
    texture: Shader
}

interface shaderArray {
    _vrtx: WebGLShader
    _frgm: WebGLShader
    _prg: WebGLProgram
}
