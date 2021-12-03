import FPSIndicator from "./engine/addons/FpsIndicator";
import Camera from "./engine/figure/Camera";
import Cube from "./engine/figure/Cube";
import { MainEngine } from "./engine/MainEngine2";
import { canvas } from "./StaticItems";
import FiguresInterFace, { vector3D } from './engine/addons/FiguresInterFace'
import Plane from "./engine/figure/Plane";
import Materials from "./engine/figure/Materials";
import brick from "./textures/brick.jpg";
import dirtJgp from '../components/textures/grass.jpg'
import RayCaster from "./engine/addons/RayCaster";

export default class MainGame extends MainEngine {
  _dataToBuild: Array<block> | any[];
  _speed = 1000
  _then = 0
  _fps: FPSIndicator
  _camera: Camera
  _plane: Plane
  _squares: Array<Cube>
  _rayCaster: RayCaster
  constructor() {
    super(canvas)

    console.log("Tes2t");
    this._squares =[]
    this.init()
  }
  init() {
    this._dataToBuild = JSON.parse(localStorage.getItem("map")) || []
    this._fps = new FPSIndicator()
    this._camera = new Camera(this._gl, {fov:90}, { x: 25, y: 0, z: -25 })

    this._plane = new Plane({ x: 125, y: -5, z: 125 }, { width: 250, depth: 250, widthSegments: 1, depthSegments: 1 }, this._gl)
    this._plane._material = new Materials(this._gl, { texture: dirtJgp})
    // let newBlock = new Cube(this._gl, { x: 10, y: 0, z: 0 })
    //   newBlock._scale = { x: 2, y: 1, z: 2 }
    //   this._squares.push(newBlock)

    this._dataToBuild.forEach(block => {
      let newBlock = new Cube(this._gl, { x: block.x * 10, y: 0, z: block.y * 10 })
      newBlock._scale = { x: 5, y: 10, z: 5 }
      newBlock._rotationInDeg.x = 90
      if (block.textureType === "texture") {
        newBlock._material = new Materials(this._gl, { texture: brick, normal: false, repeatTexture: true })
      } else if (block.textureType === "color") {
        newBlock._material = new Materials(this._gl, { color: block.color })
      }
      this._squares.push(newBlock)
    })
    // for (let z = -1; z <= 1; ++z) {
    //   for (let y = -1; y <= 1; ++y) {
    //     for (let x = -1; x <= 1; ++x) {
    //       if (x === 0 && y === 0 && z === 0) {
    //         continue;
    //       }

    //       let newBlock = new Cube(this._gl, { x: x * 10, y: y * 10, z: z * 10})
    //       newBlock._scale = { x: 1, y: 1, z: 1 }
    //       this._squares.push(newBlock)
    //     }
    //   }
    // }

    this._rayCaster = new RayCaster(this._squares)
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
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

    this._gl.clearColor(0.0, 0.0, 0.0, 0);  // Clear to black, fully opaque
    this._gl.enable(this._gl.DEPTH_TEST);           // Enable depth testing
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this._gl.enable(this._gl.CULL_FACE);

    this._camera.generateMatrixOfView()

    // // Clear the canvas before we start drawing on it.
    // this.square.forEach((square) => {
    //     square.draw(this._program,this._camera);
    //     square.addToRotation({ x: 0, y: 0, z: speed * deltaTime });
    // })
    this._rayCaster.lookup(10,this._camera._vector)
    let num = Date.now()
    this._fps.render(num)

    this._plane.draw(this._program, this._camera)

    this._squares.forEach(square =>{
      square.draw(this._program, this._camera)
    })
    this._camera.calculate(deltaTime)

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