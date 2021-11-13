import { fps } from "../StaticItems";
import * as vertexShader from './assets/vertexShader.txt';
import * as fragmetalShader from './assets/fragmetalShader.txt';
import webGLutils from "./addons/webGLutils";
import Square from "./figure/Square";
import { vector3D } from "./addons/positionManager";
import MeshPlane from "./figure/MeshPlane";
// const vertexShader = require('./assets/vertexShader.txt');
// const fragmentaShader = require('./assets/fragmentaShader.txt');

export class MainEngine {
    public _cnv: HTMLCanvasElement
    private _shaders = { vertex: String, fragmetal: String };
    private _program: WebGLProgram
    private _webGLutils: webGLutils
    public square: Array<any>
    time: number
    constructor(plane: HTMLCanvasElement) {
        this._cnv = plane
        // console.log(vertexShader.default, fragmetalShader.default)
        this._shaders = { vertex: vertexShader.default, fragmetal: fragmetalShader.default }
        this._webGLutils = new webGLutils()
        this.square = []
        this.time = 0
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

            this._program = this._webGLutils.createProgram(gl);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Clear the canvas.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const cube = new Square({x: 0, y: 0, z: 0,width:100},gl)
            cube.rotateMe({x:40,y:0,z:40})
            cube.scaleMe({x:1,y:3,z:-2})
            cube.translateMe({ x: 200, y: 0, z: -100})
            cube.renderMe(this._program)
            this.square.push(cube)

            const plane = new MeshPlane({width:1000,height:1000,widthSegments:100,heightSegments:100},gl)
            this.square.push(plane)
        
        }

        // Fills the buffer with the values that define a rectangle.

    }

    async render() {
        setTimeout(() => {
            const gl = this._cnv.getContext("webgl");

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE_MODE);
            gl.enable(gl.DEPTH_TEST);

            if(this.time === 2){
                // this.square[0].rotateMe({ x:1 , y: 2, z: 3 });
                this.time = 0
            }
            this.time++
            this.square[0].renderMe(this._program)
            this.square[1].renderMe(this._program)
            console.log("Czas leci!")
            this.render()
        }, 1000 / fps)
    }

}