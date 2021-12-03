import * as twgl from '../../node_modules/twgl.js/dist/4.x/twgl-full'
import { KeyboardAndMouse } from './engine/addons/KeyboardAndMouse';
import { canvas } from './StaticItems';


export default class test {
    _keyboardAndMouseManager: KeyboardAndMouse
    _cnv: HTMLCanvasElement
    constructor() {
        console.log(twgl)
        this._keyboardAndMouseManager = new KeyboardAndMouse({ keyboardWork: true, mouseWork: true, keys: { KeyS: false, KeyW: false, KeyA: false, KeyD: false } })
        console.log(this._keyboardAndMouseManager)
        this.init()
    }
    init() {
        this._cnv = canvas

        let body = document.querySelectorAll("body")[0].children as HTMLCollection
        for (let x = 0; x < body.length; x++) {
            body[x].classList.add("display")
        }
        this._cnv.style.display = "block"
        this._cnv.style.cursor = "none"

        this._cnv.width = window.innerWidth;
        this._cnv.height = window.innerHeight;

        const m4 = twgl.m4;
        const v3 = twgl.v3;
        const gl = document.querySelector("canvas").getContext("webgl");
        const vs = `
uniform mat4 u_worldViewProjection;

attribute vec4 position;

void main() {
  gl_Position = u_worldViewProjection * position;
}
`;
        const fs = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = vec4(u_color.rgb, u_color.a);
}
`;

        const progInfo = twgl.createProgramInfo(gl, [vs, fs]);
        const bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);

        let projection = m4.identity();
        let camera = m4.identity();
        let view = m4.identity();
        let viewProjection = m4.identity();
        let block = m4.identity();
        let worldViewProjection = m4.identity();

        const fov = degToRad(90);
        const zNear = 0.1;
        const zFar = 100;

        let px = 0;
        let py = 0;
        let pz = 0;
        let ang = 0;
        const speed = 1;
        const turnSpeed = 90;

        let then = 0;
        let render = (now: number = 0) => {
            now *= 0.001; // seconds;
            const deltaTime = now - then;
            then = now;

            twgl.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);

            gl.useProgram(progInfo.program);

            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            projection = m4.perspective(fov, aspect, zNear, zFar);

            camera = m4.identity();
            camera = m4.translate(camera, [px, py, pz], camera);
            camera = m4.rotateY(camera, degToRad(-ang));
            
            viewProjection = m4.multiply(projection, m4.inverse(camera));
            console.log(viewProjection);
            for (let z = -1; z <= 1; ++z) {
                for (let y = -1; y <= 1; ++y) {
                    for (let x = -1; x <= 1; ++x) {
                        if (x === 0 && y === 0 && z === 0) {
                            continue;
                        }

                        block = m4.identity();
                        block = m4.translate(block, [x * 3, y * 3, z * 3]);

                        worldViewProjection = m4.multiply(viewProjection, block);

                        twgl.setBuffersAndAttributes(gl, progInfo, bufferInfo);
                        twgl.setUniforms(progInfo, {
                            u_worldViewProjection: worldViewProjection,
                            u_color: [(x + 2) / 3, (y + 2) / 3, (z + 2) / 3, 1],
                        });
                        twgl.drawBufferInfo(gl, bufferInfo);
                    }
                }
            }
            //w-s
            if (this._keyboardAndMouseManager._keys.KeyW || this._keyboardAndMouseManager._keys.KeyS) {
                const direction = this._keyboardAndMouseManager._keys.KeyW ? 1 : -1;
                px -= camera[8] * deltaTime * speed * direction;
                py -= camera[9] * deltaTime * speed * direction;
                pz -= camera[10] * deltaTime * speed * direction;
            }
            //a-d
            if (this._keyboardAndMouseManager._keys.KeyA || this._keyboardAndMouseManager._keys.KeyD) {
                const direction = this._keyboardAndMouseManager._keys.KeyA ? -1 : 1;
              ang += deltaTime * turnSpeed * direction;
            }

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);


        function degToRad(d: number) {
            return (d * Math.PI) / 180;
        }

    }

}