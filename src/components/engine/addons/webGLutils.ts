// let x: { a: boolean, b: boolean, c: boolean, d: boolean } = {a: false, b: false, c: false, d: false}
import { Engine } from '../Engine';
import { programArray, shadersArray } from './interfaces/WebglExtender';
import fsColor from '../shaders/color/fs.glsl'
import vsColor from '../shaders/color/vs.glsl'

import fsColorLight from '../shaders/colorLights/fs.glsl'
import vsColorLight from '../shaders/colorLights/vs.glsl'

import fsTexture from '../shaders/texture/fs.glsl'
import vsTexture from '../shaders/texture/vs.glsl'

import fsTextureLight from '../shaders/textureLights/fs.glsl'
import vsTextureLight from '../shaders/textureLights/vs.glsl'

import fsTest from '../shaders/test/fs.glsl'
import vsTest from '../shaders/test/vs.glsl'
export default class webGLutils {
    newProgram(gl: WebGLRenderingContext): shadersArray {
        let finalArrayOfShaders: shadersArray = {
            color: new Shader(gl, vsColor, fsColor),
            texture: new Shader(gl, vsTexture, fsTexture),
            colorLights: new Shader(gl, vsColorLight, fsColorLight),
            textureLights: new Shader(gl, vsTextureLight, fsTextureLight),
            test: new Shader(gl, vsTest, fsTest)
        }
        return finalArrayOfShaders;
    }
}
export class Shader {
    _vrtx: WebGLShader
    _frgm: WebGLShader
    _prg: WebGLProgram
    _uniforms: any
    _attrib: any
    constructor(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
        this._vrtx = this.loadShader(gl, gl.VERTEX_SHADER, vertexShader)
        this._frgm = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
        this._prg = this.initShaderProgram(gl, this._vrtx, this._frgm)
        this._uniforms = new Object()
        this._attrib = new Object()
        this.generateUniforms()
        this.generateAttrib()

    }
    generateUniforms() {
        const numUniforms = Engine._gl.gl.getProgramParameter(this._prg, Engine._gl.gl.ACTIVE_UNIFORMS);

        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = Engine._gl.gl.getActiveUniform(this._prg, ii);
            if (this.isBuiltIn(uniformInfo)) {
                continue;
            }
            const { name, type, size } = uniformInfo;
            let arr = []
            if(size != 1 ){
                for(let i = 0 ; i<size; i++){
                    // @ts-ignore
                    arr[i] = Engine._gl.gl.getUniformLocation(this._prg, name.replaceAll("[0]",`[${i}]`))
                }
                this._uniforms[name.replace("[0]","")] = arr
            }else{
                this._uniforms[name] = Engine._gl.gl.getUniformLocation(this._prg, name)

            }
            // console.log(
            //     name, size, this.glEnumToString(Engine._gl.gl, type),
            //     blockIndex, offset);
        }
        console.log(this._uniforms)
    }

    generateAttrib() {
        const numUniforms = Engine._gl.gl.getProgramParameter(this._prg, Engine._gl.gl.ACTIVE_ATTRIBUTES);

        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = Engine._gl.gl.getActiveAttrib(this._prg, ii);
            if (this.isBuiltIn(uniformInfo)) {
                continue;
            }
            const { name, type, size } = uniformInfo;
            this._attrib[name] = Engine._gl.gl.getAttribLocation(this._prg, name)
            // console.log(
            //     name, size, this.glEnumToString(Engine._gl.gl, type),
            //     blockIndex, offset);
        }
    }
    isBuiltIn(info: any) {
        const name = info.name;
        return name.startsWith("gl_") || name.startsWith("webgl_");
    }
    glEnumToString(gl: any, value: any) {
        const keys = [];
        for (const key in gl) {
            if (gl[key] === value) {
                keys.push(key);
            }
        }
        return keys.length ? keys.join(' | ') : `0x${value.toString(16)}`;
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

