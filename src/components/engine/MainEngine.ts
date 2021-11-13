import { fps } from "../StaticItems";
import * as vertexShader from './assets/vertexShader.txt';
import * as fragmetalShader from './assets/fragmetalShader.txt';
import webGLutils from "./addons/webGLutils";
import Square from "./figure/Square";
import { PositionManager, vector3D } from "./addons/positionManager";
import MeshPlane from "./figure/MeshPlane";
import Camera from "./figure/Camera";
import sliderManager from "./addons/sliderApi";
// const vertexShader = require('./assets/vertexShader.txt');
// const fragmentaShader = require('./assets/fragmentaShader.txt');

export class MainEngine {
    public _cnv: HTMLCanvasElement
    private _shaders = { vertex: String, fragmetal: String };
    private _program: WebGLProgram
    private _webGLutils: webGLutils
    private _positionManager: PositionManager
    private _camera: Camera
    public square: Array<any>
    time: number
    constructor(plane: HTMLCanvasElement) {
        this._cnv = plane
        // console.log(vertexShader.default, fragmetalShader.default)
        this._shaders = { vertex: vertexShader.default, fragmetal: fragmetalShader.default }
        this._webGLutils = new webGLutils()
        this._positionManager = new PositionManager()
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

            let [x, y, z]: Array<number> = [0, 1, 10]
            this._camera = new Camera(gl, 60, this._program)
            this._camera.updateCameraPos({ x: x, y: y, z: z });
            this._program = this._webGLutils.createProgram(gl);

            const sliderMan = new sliderManager()
            sliderMan.createSlider(-100, 100, 1, 0, "Camera x", (e: number) => { this._camera.updateX(e) });
            sliderMan.createSlider(-10, 10, 0.1, 0, "Camera z", (e: number) => { this._camera.updateZ(e) });

            sliderMan.createSlider(0, 360, 1, 30, "FOV", (e: number) => { this._camera.updateFOV(e) });

            const cube = new Square({ x: 0, y: 0, z: 0, width: 100 }, gl)
            cube.rotateMe({ x: 0, y: 0, z: 0 })
            cube.scaleMe({ x: 1, y: 1, z: 1 })
            cube.translateMe({ x: 100, y: 99, z: -300 })
            this.square.push(cube)

            const cube1 = new Square({ x: 0, y: 0, z: 0, width: 100 }, gl)
            cube1.rotateMe({ x: 0, y: 0, z: 0 })
            cube1.scaleMe({ x: 1, y: 1, z: 1 })
            cube1.translateMe({ x: 100, y: 0, z: -300 })
            this.square.push(cube1)

            const cube2 = new Square({ x: 0, y: 0, z: 0, width: 100 }, gl)
            cube2.rotateMe({ x: 0, y: 50, z: 0 })
            cube2.scaleMe({ x: 1, y: 1, z: 1 })
            cube2.translateMe({ x: 0, y: 0, z: -500 })
            this.square.push(cube2)

            sliderMan.createSlider(0, 2, 0.1, 1, "Scale x", (e: number) => { cube2.scaleMe({ x: e, y: 1, z: 1 }) });


            // const plane = new MeshPlane({ width: 1000, height: 1000, widthSegments: 100, heightSegments: 100 }, gl)
            // this.square.push(plane)
        }

        // Fills the buffer with the values that define a rectangle.

    }

    async render() {
        setTimeout(async () => {
            if (this._camera != null) {
                const gl = this._cnv.getContext("webgl");

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                // gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.CULL_FACE_MODE);
                gl.enable(gl.DEPTH_TEST);

                let data = await this._camera.render()

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


                const viewMatrix = this._positionManager.inverse(data.cameraMatrix);

                let mat = this._positionManager.multiply(data.perspectiveProjectionMatrix, viewMatrix);
                mat = this._positionManager.multiply(mat, data.worldMatrix);

                // if (this.time === 2) {
                //     this.square[0].rotateMe({ x: 1, y: 1, z: 1 });
                //     this._camera.updateX(1)
                //     this.time = 0
                // }
                // this.square[0].rotateMe({ x: 2, y: 1, z: 1 });
                this.time++
                // console.log("Czas leci!")
                this.square[0].renderMe(this._program, mat)
                this.square[1].renderMe(this._program, mat)
                this.square[2].renderMe(this._program, mat)

                this.render()

            }
        }, 1000 / fps)
    }

}

