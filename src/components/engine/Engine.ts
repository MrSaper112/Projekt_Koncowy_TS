import { sort } from "../../../node_modules/fast-sort/dist/sort.min";
import { Figure } from "./addons/Figure";
import { programArray, WebGlWProgram } from "./addons/interfaces/WebglExtender";
import webGLutils from "./addons/webGLutils";
// import FirstPersonCamera from "./components/cameras/FirstPersonCamera";
import FreeMoveCamera from "./components/cameras/FPSCamera";
import Materials from "./components/Materials";
import Block from "./components/primitives/Block";
import Cone from "./components/primitives/Cone";
import { vec3, vec4 } from "./math/gl-matrix";

export abstract class Engine {
    public _cnv: HTMLCanvasElement
    public _program: programArray
    public _webGLutils: webGLutils
    public static _gl: WebGlWProgram
    time: number
    constructor(plane: HTMLCanvasElement) {
        this._cnv = plane
        Engine._gl = new WebGlWProgram();
        this._webGLutils
        this.time = 0
        this.createCanvas()
    }
    async createCanvas() {
        let body = document.querySelectorAll("body")[0].children as HTMLCollection
        for (let x = 0; x < body.length; x++) {
            body[x].classList.add("display")
        }
        this._cnv.style.display = "block"
        this._cnv.style.cursor = "none"

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
            const gl = this._cnv.getContext("webgl2", { antialias: false, premultipliedAlpha: false });
            // Only continue if WebGL is available and working
            if (gl === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }
            this._webGLutils = new webGLutils()
            // const sliderMan = new sliderManager()    
            Engine._gl.programs = this._webGLutils.newProgram(gl)
            Engine._gl.gl = gl

            Engine._gl.gl.useProgram(Engine._gl.programs.shaders.color._prg)
            Engine._gl.gl.linkProgram(Engine._gl.programs.shaders.color._prg)

            console.log(Engine._gl);

            //             let f = () => {
            //                 return Math.floor(Math.random() * (50 + 10 + 1) - 10)
            //             }
            //             let fS = () => {
            //                 return Math.floor(Math.random() * (4 - 1 + 1) + 1)
            //             }
            //             // sliderMan.createSlider(-100, 100, 0.1, 0, "Camera x", (e: number) => { this._camera.updateX(e) });
            //             // sliderMan.createSlider(-100, 100, 0.1, 0, "Camera z", (e: number) => { this._camera.updateZ(e) });
            //             // sliderMan.createSlider(-100, 100, 0.1, 0, "Camera y", (e: number) => { this._camera.updateY(e) });

            //             for (let x = 0; x < 100; x++) {
            //                 let newCube = new Cube(gl, { x: f(), y: f(), z: f() });
            //                 newCube._scale = { x: 3, y: 3, z: 3 };
            // 3
            //                 if (Math.random() < 0.5) newCube._material = new Materials(gl, { color: '#ff00AA' })
            //                 else newCube._material = new Materials(gl, { texture: dirtJgp, normal: false })

            //                 this.square.push(newCube);

            //             }
            //             this._plane = new Plane({x:0, y: -10, z: 0},{width:100,depth:100,widthSegments:10,depthSegments:10},gl)

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

    engineRender(camera: FreeMoveCamera, items?: any) {
        let coneArray: Array<Cone> = [];
        let cubeArray: Array<Block> = [];
        if (items instanceof Array) {
            items.forEach((square: Figure) => {
                if (square instanceof Cone) coneArray.push(square);
                if (square instanceof Block) cubeArray.push(square);
            });
        }


        let totalItems = items.length;
        let visibleItems = 0
        cubeArray.forEach((cube: Figure) => {
            if (this.isAABBVisible(cube.boxBounding, camera.frustumPlanes)) {
                visibleItems += 1
                cube.draw(camera)
            }
        })
        coneArray.forEach((cube: Figure) => {
            if (this.isAABBVisible(cube.boxBounding, camera.frustumPlanes)) {
                visibleItems += 1
                cube.draw(camera)

            }
        })
        console.log("Total items: " + totalItems + " visible items: " + visibleItems)


        // requestAnimationFrame(() => this.render(new Date().getTime()))
    }
    isAABBVisible(aabb: any, planes: Array<vec4>) {
        // Transform the eight corner points of the AABB into view space
        if (planes === undefined || aabb == undefined) return true;
        for (let i = 0; i < 6; i++) {
            const plane = planes[i];
            const min = aabb.min;
            const max = aabb.max;

            const x = plane[0] > 0 ? max[0] : min[0];
            const y = plane[1] > 0 ? max[1] : min[1];
            const z = plane[2] > 0 ? max[2] : min[2];
            // console.log(plane[3])
            const distance = vec3.dot(plane, vec3.fromValues(x, y, z)) + plane[3]

            if (distance < 0) {
                // bounding box is fully outside the frustum, return false
                return false;
            }
        }

        // bounding box is either fully or partially inside the frustum, return true
        return true;
    }
}

let f = () => {
    return Math.floor(Math.random() * (50 + 10 + 1) - 10)
}