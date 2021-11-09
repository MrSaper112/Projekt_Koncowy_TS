import * as vertexShader from '../assets/vertexShader.txt'
import * as fragmetalShader from '../assets/fragmetalShader.txt'


export default class webGLutils{
    contructor(){

    }
    createShader(gl: WebGLRenderingContext, type: number, source: string) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    createProgram(gl: WebGLRenderingContext) {
        var fragmentShader2 = this.createShader(gl, gl.FRAGMENT_SHADER, fragmetalShader.default.toString());
        var vertexShader2 = this.createShader(gl, gl.VERTEX_SHADER, vertexShader.default.toString());

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader2);
        gl.attachShader(program, fragmentShader2);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}