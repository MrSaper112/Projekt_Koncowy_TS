import FPSIndicator from "./engine/addons/FpsIndicator";
import Camera from "./engine/figure/Camera";
import { MainEngine } from "./engine/MainEngine2";
import { canvas } from "./StaticItems";
import FiguresInterFace from './engine/addons/FiguresInterFace'
import Plane from "./engine/figure/Plane";
import Materials from "./engine/figure/Materials";
import brick from "./textures/brick.jpg";
import dirtJgp from '../components/textures/grass.jpg'
import RayCaster from "./engine/addons/RayCaster";
import Block from "./engine/figure/Block";
import Sphere from "./engine/figure/Sphere";

export default class MainGame extends MainEngine {
  _dataToBuild: Array<block> | any[];
  _speed = 1000
  _then = 0
  _fps: FPSIndicator
  _camera: Camera
  _plane: Plane
  _squares: Array<Block>
  constructor() {
    super(canvas)

    console.log("Tes2t");
    this._squares = []
    this.init()
  }
  init() {
    this._dataToBuild = JSON.parse(localStorage.getItem("map")) || []
    this._fps = new FPSIndicator()
    this._camera = new Camera(this._gl, { fov: 90 }, { x: 50, y: 5, z: 50 })

    this._plane = new Plane(this._gl, {
      vector: {
        x: 125, y: 0, z: 125
      }
    }, { width: 250, depth: 250, widthSegments: 5, depthSegments: 5 })

    this._plane._material = new Materials(this._gl, { texture: dirtJgp })
    // let newBlock = new Cube(this._gl, { x: 10, y: 0, z: 0 })
    //   newBlock._scale = { x: 2, y: 1, z: 2 }
    //   this._squares.push(newBlock)

    this._dataToBuild.forEach(block => {
      let newBlock = new Block(this._gl, { x: block.x * 10, y: 10, z: block.y * 10 })
      newBlock.scaleMe({ x: 5, y: 10, z: 5 })
      newBlock._rotationInDeg.x = 90
      if (block.textureType === "texture") {
        newBlock._material = new Materials(this._gl, { texture: brick, normal: false, repeatTexture: true })
      } else if (block.textureType === "color") {
        newBlock._material = new Materials(this._gl, { color: block.color })
      }
      this._squares.push(newBlock)
    })
    let circle = new Sphere(this._gl, { radius: 10, subdivisionsAxis: 10, subdivisionsHeight: 10 }, { x: 125, y: 10, z: 125 })
    circle._material = new Materials(this._gl, {color:"00F0FF"})
    this._squares.push(circle)
    this._camera._rayCaster.setBoxes(this._squares)
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


    let num = Date.now()
    this._fps.render(num)

    this._plane.draw(this._program, this._camera)

    this._squares.forEach(square => {
      square.draw(this._program, this._camera)
    })
    this._camera.calculateAndMove(deltaTime)



    requestAnimationFrame(() => this.render(new Date().getTime()))

  }
}
interface block {
  x: number,
  y: number,
  textureType?: string
  color?: string
}