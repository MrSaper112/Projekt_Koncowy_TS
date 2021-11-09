import { fps } from "../StaticItems";
import * as vertexShader from './assets/vertexShader.txt';
import * as fragmetalShader from './assets/fragmetalShader.txt';
import webGLutils from "./addons/webGLutils";
// const vertexShader = require('./assets/vertexShader.txt');
// const fragmentaShader = require('./assets/fragmentaShader.txt');

export class MainEngine {
    public _cnv: HTMLCanvasElement
    private _shaders = { vertex: String, fragmetal: String };
    private _program: WebGLProgram
    private _webGLutils: webGLutils
    constructor(plane: HTMLCanvasElement) {
        this._cnv = plane
        // console.log(vertexShader.default, fragmetalShader.default)
        this._shaders = { vertex: vertexShader.default, fragmetal: fragmetalShader.default }
        this._webGLutils = new webGLutils()
        this.createCanvas()
        this.render()
    }
    async ininitialize() {
        await this.createCanvas()
        await this.render()
    }
    async createCanvas() {
        let body = document.querySelectorAll("body")[0].children as HTMLCollection
        for (let x = 0; x < body.length; x++) {
            body[x].classList.add("display")

        }
        
        this._cnv.style.display = "block"
        this._cnv.width = window.innerWidth;
        this._cnv.height = window.innerHeight;
        window.addEventListener("resize", () => {
            this._cnv.width = window.innerWidth;
            this._cnv.height = window.innerHeight;
            this.draw()


        }, false)

        this.draw()

    }
    draw() {
        if (this._cnv) {
            //Get context from webgl!
            const gl = this._cnv.getContext("webgl");
            // Only continue if WebGL is available and working
            console.log(gl)
            if (gl === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }
            //Clear Canvas to white
            gl.clearColor(0.0, 0.0, 0.0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            //SEt viewport to center of canvas 
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            console.log(gl.canvas.width,gl.canvas.height);

            //Create Shaders from file c++ byy webgl 
         
            //Connect shaders!
            this._program = this._webGLutils.createProgram(gl);
            // look up where the vertex data needs to go.
            var positionAttributeLocation = gl.getAttribLocation(this._program, "a_position");
            var resolutionUniformLocation = gl.getUniformLocation(this._program, "u_resolution");

            var colorUniformLocation = gl.getUniformLocation(this._program, "u_color");
            // Create a buffer to put three 2d clip space points in
            var positionBuffer = gl.createBuffer();

            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Clear the canvas
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Tell it to use our program (pair of shaders)
            gl.useProgram(this._program);

            // Turn on the attribute
            gl.enableVertexAttribArray(positionAttributeLocation);

            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 2;          // 2 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                positionAttributeLocation, size, type, normalize, stride, offset);

            // set the resolution
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

            let setRectangle = (gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) => {
                var x1 = x;
                var x2 = x + width;
                var y1 = y;
                var y2 = y + height;

                // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
                // whatever buffer is bound to the `ARRAY_BUFFER` bind point
                // but so far we only have one buffer. If we had more than one
                // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                    x1, y1,
                    x2, y1,
                    x1, y2,
                    x1, y2,
                    x2, y1,
                    x2, y2]), gl.STATIC_DRAW);
            }
            // draw 50 random rectangles in random colors
            for (var ii = 0; ii < 50; ++ii) {
                // Setup a random rectangle
                // This will write to positionBuffer because
                // its the last thing we bound on the ARRAY_BUFFER
                // bind point
                setRectangle(
                    gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

                // Set a random color.
                gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

                // Draw the rectangle.
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }

        // Returns a random integer from 0 to range - 1.
        function randomInt(range:number) {
            return Math.floor(Math.random() * range);
        }

        // Fills the buffer with the values that define a rectangle.
    
    }
    async render() {
        setTimeout(() => {
            console.log("Czas leci!")
            this.render()
        }, 1000 / fps)
    }
    
}