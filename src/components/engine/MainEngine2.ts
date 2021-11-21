import { fps } from "../StaticItems";
import webGLutils, { programArray } from "./addons/webGLutils";
import MeshPlane from "./figure/MeshPlane";
import Camera from "./figure/Camera";
import sliderManager from "./addons/sliderApi";
import Cube from "./figure/NewCube";
import Materials from "./figure/Materials";
// const vertexShader = require('./assets/vertexShader.txt');
// const fragmentaShader = require('./assets/fragmentaShader.txt');
import dirtJgp from '../textures/dirt.jpg'

export class MainEngine {
    public _cnv: HTMLCanvasElement
    private _program: programArray
    private _webGLutils: webGLutils
    private _camera: Camera
    public square: Array<Cube>
    time: number
    constructor(plane: HTMLCanvasElement) {
        this._cnv = plane
        // console.log(vertexShader.default, fragmetalShader.default)
        this._webGLutils 
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

    async draw() {
        if (this._cnv) {
            //Get context from webgl!
            const gl = this._cnv.getContext("webgl");
            // Only continue if WebGL is available and working
            console.log(gl)
            if (gl === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }
            this._webGLutils = new webGLutils()
            const sliderMan = new sliderManager()

            this._program = this._webGLutils.newProgram(gl);
            console.log(this._program)
            let f = () =>{ 
                return Math.floor(Math.random() * (50 + 10 + 1) -10)
            }
            let fS = () => {
                return Math.floor(Math.random() * (4 -1 + 1) + 1)
            }
            let newCube = new Cube(gl,{x:5, y:-2,z:-3});
            newCube._scale = {x:3, y:3, z:3};
            sliderMan.createSlider(-100, 100, 0.1, 0, "Camera x", (e: number) => { newCube.updateX(e) });
            sliderMan.createSlider(-100, 100, 0.1, 0, "Camera z", (e: number) => { newCube.updateZ(e) });
            sliderMan.createSlider(-100, 100, 0.1, 0, "Camera y", (e: number) => { newCube.updateY(e) });

            for(let x  = 0 ; x < 100 ;x++){
                let newCube = new Cube(gl, { x: f(), y: f(), z: f()  });
                if (Math.random() < 0.5) newCube._material = new Materials(gl, { color: '#ff00AA' })
                else newCube._material = new Materials(gl, { texture: dirtJgp, })

                this.square.push(newCube);

            }
            // let newCube2 = new Cube(gl, { x: 10, y: -2, z: -3 });
            // newCube2._scale = { x: 1, y: 1, z: 1 };
            // // newCube._rotationInDeg = {x:45, y:0, z: 45 }
            // this.square.push(newCube);
            // this.square.push(newCube2);
            // const plane = new MeshPlane({ width: 1000, height: 1000, widthSegments: 100, heightSegments: 100 }, gl)
            // this.square.push(plane)
        }

        // Fills the buffer with the values that define a rectangle.

    }

    async render() {
        // let now *= 0.001;  // convert to seconds
        // const deltaTime = now - then;
        // let then = now;
        setTimeout(async () => {
                const gl = this._cnv.getContext("webgl");
                gl.clearColor(0.0, 0.0, 0.0, 0.3);  // Clear to black, fully opaque
                gl.enable(gl.DEPTH_TEST);           // Enable depth testing

                // Clear the canvas before we start drawing on it.

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                this.square.forEach((square) =>{
                    square.draw(this._program);
                              square.updateRotation({ x: 0, y: 0, z: 360});
                })
                // this.square[0].draw(this._program);
                // this.square[1].draw(this._program);
                // // if (this.time === 2) {
                // //     this.square[0].rotateMe({ x: 1, y: 1, z: 1 });
                // //     this._camera.updateX(1)
                // //     this.time = 0
                // // }
                // this.square[0].rotateMe({ x: 3, y: 3, z: 1 });
                // this.square[1].rotateMe({ x: 30, y: 30, z: 1 });
                this.time++
                // console.log("Czas leci!")
    

                this.render()

            
        }, 1000 / fps)
    }

}

let f = () => {
    return Math.floor(Math.random() * (50 + 10 + 1) - 10)
}