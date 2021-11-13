import * as vertexShaderT from '../assets/vertexShader.txt'
import * as fragmetalShaderT from '../assets/fragmetalShader.txt'


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
    // createProgram(gl: WebGLRenderingContext) {
    //     var fragmentShader2 = this.createShader(gl, gl.FRAGMENT_SHADER, fragmetalShaderT.default.toString());
    //     var vertexShader2 = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderT.default.toString());

    //     var program = gl.createProgram();
    //     gl.attachShader(program, vertexShader2);
    //     gl.attachShader(program, fragmentShader2);
    //     gl.linkProgram(program);
    //     var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    //     if (success) {
    //         return program;
    //     }

    //     console.log(gl.getProgramInfoLog(program));
    //     gl.deleteProgram(program);
    // }
    createProgram(gl: WebGLRenderingContext){
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderT.default.toString());
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vertexShader))
        };

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmetalShaderT.default.toString());
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fragmentShader))
        };

        const prg = gl.createProgram();
        gl.attachShader(prg, vertexShader);
        gl.attachShader(prg, fragmentShader);
        gl.linkProgram(prg);
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(prg))
        };
        return prg;
    }
}