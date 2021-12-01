import FPSIndicator from "./engine/addons/FpsIndicator";
import Camera from "./engine/figure/Camera";
import Cube from "./engine/figure/Cube";
import { MainEngine } from "./engine/MainEngine2";
import { canvas } from "./StaticItems";
import { vector3D } from './engine/addons/FiguresInterFace'
import Plane from "./engine/figure/Plane";
import Materials from "./engine/figure/Materials";
import brick from "./textures/brick.jpg";
export default class MainGame extends MainEngine {
  _dataToBuild: Array<block> | any[];
  _speed = 1000
  _then = 0
  _fps: FPSIndicator
  _camera: Camera
  _plane: Plane
  _squares: Array<Cube>

  constructor() {
    super(canvas)

    console.log("Tes2t");
    this._squares =[]
    this.init()
  }
  init() {
    this._dataToBuild = JSON.parse(localStorage.getItem("map")) || []
    this._fps = new FPSIndicator()
    this._camera = new Camera(this._gl, {fov:90}, { x: 0, y: 0, z:0 })

    this._plane = new Plane({ x: 0, y: -100, z: 0}, { width: 1000, depth: 1000, widthSegments: 10, depthSegments: 10 }, this._gl)
    this._plane._material = new Materials(this._gl,{color: "#420F0F0"})
    this._dataToBuild.forEach(block => {
      let newBlock = new Cube(this._gl, { x: block.x*20, y: 0, z: block.y*20 })
      newBlock._scale = { x: 5, y: 5, z: 5 }

      if (block.textureType === "texture") {
        newBlock._material = new Materials(this._gl, { texture: brick, normal: false })
      } else if (block.textureType === "color") {
        newBlock._material = new Materials(this._gl, { color: block.color })
      }
      this._squares.push(newBlock)
    })

    requestAnimationFrame(() => this.render(0))

    // canvas.style.display = "block"

  }
  render(now: number): void {
    now *= 0.001;
    // Subtract the previous time from the current time
    // console.log(now, then)
    var deltaTime = now - this._then
    // Remember the current time for the next frame.
    this._then = now;
    const gl = this._cnv.getContext("webgl");
    gl.clearColor(0.0, 0.0, 0.0, 0);  // Clear to black, fully opaque
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing

    // // Clear the canvas before we start drawing on it.
    this._camera.calculate(deltaTime)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // this.square.forEach((square) => {
    //     square.draw(this._program,this._camera);
    //     square.addToRotation({ x: 0, y: 0, z: speed * deltaTime });
    // })
    let num = Date.now()
    this._fps.render(num)
    this._plane.draw(this._program, this._camera)

    this._squares.forEach(square =>{
      square.draw(this._program, this._camera)
    })

    // // this.square[0].draw(this._program);
    // // this.square[1].draw(this._program);
    // // // if (this.time === 2) {
    // // //     this.square[0].rotateMe({ x: 1, y: 1, z: 1 });
    // // //     this._camera.updateX(1)
    // // //     this.time = 0
    // // // }
    // // this.square[0].rotateMe({ x: 3, y: 3, z: 1 });
    // // this.square[1].rotateMe({ x: 30, y: 30, z: 1 });
    // this.time++
    // // console.log("Czas leci!")


    requestAnimationFrame(() => this.render(new Date().getTime()))

  }
}
interface block {
  x: number,
  y: number,
  textureType?: string
  color?: string
}