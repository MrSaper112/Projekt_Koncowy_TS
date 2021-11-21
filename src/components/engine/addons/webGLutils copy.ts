// import * as vertexShaderSimpleColor from '../assets/vertexShaderSimpleColor.txt'
// import * as fragmetalShaderSimpleColor from '../assets/fragmetalShaderSimpleColor.txt'

// import * as vertexShaderTexture from '../assets/vertexShaderTexture.txt'
// import * as fragmentalShaderTexture from '../assets/fragmentalShaderTexture.txt'
// // let x: { a: boolean, b: boolean, c: boolean, d: boolean } = {a: false, b: false, c: false, d: false}

// export default class webGLutils {
//     _vrtxShader: Array<any>
//     _frgmShader: Array<any>
//     _loadedShader: {}

//     async initShaderProgram(gl: WebGLRenderingContext) {
//         // Create the shader program
//         const shaderProgram = gl.createProgram();
//         gl.linkProgram(shaderProgram);
//         return shaderProgram;
//     }
//     loadShader(gl: WebGLRenderingContext, type: number, source: string) {
//         const shader = gl.createShader(type);
//         gl.shaderSource(shader, source);
//         gl.compileShader(shader);
//         if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//             alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
//             gl.deleteShader(shader);
//             return null;
//         }

//         return shader;
//     }

//     async newProgram(gl: WebGLRenderingContext) {
//         const shaders = {
//             color: {
//                 vrtx: this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSimpleColor.default.toString()),
//                 frgm: this.loadShader(gl, gl.FRAGMENT_SHADER, fragmetalShaderSimpleColor.default.toString()),
//                 prg: gl.createProgram()
//                 linkMe: (_gl: WebGLRenderingContext) => {
//                     _gl.attachShader(prg, shaders.color.vrtx);
//                     _gl.attachShader(prg, shaders.color.frgm);
//                 }
//             },
//             texture: {

//                 vrtx: this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderTexture.default.toString()),
//                 frgm: this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentalShaderTexture.default.toString()),
//                 linkMe: (_gl: WebGLRenderingContext) => {
//                     _gl.attachShader(prg, shaders.texture.vrtx);
//                     _gl.attachShader(prg, shaders.texture.frgm);
//                 }
//             }
//         }
//         return {
//             prg: prg,
//             attribLocations: {
//                 vertexPosition: gl.getAttribLocation(prg, 'aVertexPosition'),
//                 vertexColor: gl.getAttribLocation(prg, 'aVertexColor'),
//             },
//             uniformLocations: {
//                 projectionMatrix: gl.getUniformLocation(prg, 'uProjectionMatrix'),
//                 modelViewMatrix: gl.getUniformLocation(prg, 'uModelViewMatrix'),
//             },
//             shaders: shaders,
//         };
//     }
//     createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
//         /**
//          * Create and return a shader program
//          **/
//         var program: nProgram = gl.createProgram();
//         gl.attachShader(program, vertexShader);
//         gl.attachShader(program, fragmentShader);
//         gl.linkProgram(program);

//         // Check that shader program was able to link to WebGL
//         if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//             var error = gl.getProgramInfoLog(program);
//             console.log('Failed to link program: ' + error);
//             gl.deleteProgram(program);
//             gl.deleteShader(fragmentShader);
//             gl.deleteShader(vertexShader);
//             return null;
//         }

//         // Set the vertex and fragment shader to the program for easy access
//         program.vertexShader = vertexShader;
//         program.fragmentShader = fragmentShader;
        
//         // Create buffers for all vertex attributes
//         var attributesLength = program.vertexShader.attributes.length;
//         for (var i = 0; i < attributesLength; i++) {
//             program[program.vertexShader.attributes[i].name] = gl.createBuffer();
//         }

//         return program;
//     }

//     getShader: function(gl, type, source) {
//     /**
//      * Get, compile, and return an embedded shader object
//      **/
//     var shader = gl.createShader(type);
//     gl.shaderSource(shader, source);
//     gl.compileShader(shader);

//     // Check if compiled successfully
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.log("An error occurred compiling the shaders:" + gl.getShaderInfoLog(shader));
//         gl.deleteShader(shader);
//         return null;
//     }

//     // Set the attributes, varying, and uniform to shader
//     shader.attributes = this.attributesFromSource(source);
//     shader.varyings = this.varyingsFromSource(source);
//     shader.uniforms = this.uniformsFromSource(source);
//     return shader;
// },

// }
// export interface programArray {
//     prg: WebGLProgram,
//     attribLocations: {
//         vertexPosition: number,
//         vertexColor: number,
//     },
//     uniformLocations: {
//         projectionMatrix: WebGLUniformLocation,
//         modelViewMatrix: WebGLUniformLocation,
//     },
//     shaders: { color: shaderArray, texture: shaderArray }
// }
// interface shaderArray {
//     vrtx: WebGLShader,
//     frgm: WebGLShader,
//     linkMe(_gl: WebGLRenderingContext): void
// }
// interface nProgram implements WebGLProgram {
//     vertexShader?: WebGLShader,
//     fragmentShader?: WebGLShader
// }