import FPSIndicator from "./engine/addons/FpsIndicator";
import FirstPersonCamera from "./engine/components/cameras/FirstPersonCamera";
import { Engine } from "./engine/Engine";
import { canvas } from "./StaticItems";
import FiguresInterFace from "./engine/addons/FiguresInterFace";
// import Plane from "./engine/components/primitives/Plane";
import Materials from "./engine/components/Materials";
import brick from "./textures/brick.jpg";
import dirtJgp from "../components/textures/grass.jpg";
import RayCaster from "./engine/addons/RayCaster";
import Block from "./engine/components/primitives/Block";
// import Sphere from "./engine/components/primitives/Sphere";
import FreeMoveCamera from "./engine/components/cameras/FreeMoveCamera";
import { Figure } from "./engine/addons/Figure";
import Cone from "./engine/components/primitives/Cone";
import Plane from "./engine/components/primitives/Plane";
// import Cone from "./engine/components/primitives/Cone";

export default class MainGame extends Engine {
  _dataToBuild: Array<block> | any[];
  _speed = 1000;
  _then = 0;
  _fps: FPSIndicator;
  _camera: FreeMoveCamera;
  _deltaTime: number
  _plane: Plane;
  _squares: Array<Figure>;
  constructor() {
    super(canvas);
    this._deltaTime = new Date().getTime()
    this._squares = [];
    this.init()
  }
  init() {
    this._dataToBuild = JSON.parse(localStorage.getItem("map")) || [];
    this._fps = new FPSIndicator();
    this._camera = new FreeMoveCamera({ fov: 50 }, 2, { x: 50, y: 5, z: 50 });
    // this._camera.addToRotation({ x: 0, y: 0, z: 45 })
    this._plane = new Plane({
      vector: {
        x: 500,
        y: 0, z: 500,
      },
    },
      { width: 1000, depth: 1000, widthSegments: 5, depthSegments: 5 }
    );
    // console.error("String")
    this._plane._material = Materials.color({ clr: "#FF0FA0" });
    // // // console.error(" Array String")
    // // this._plane._material = Materials.color({ gl: Engine._gl.gl, clr: ["#FFAA00", "#AFAA00", "111222"], alpha: 0.5 });
    // // console.error(" Array Byte")
    // // this._plane._material = Materials.color({ gl: Engine._gl.gl, clr: [1, 220, 5, 0.7] });
    // console.error(" Array Array Byte")
    // this._plane._material = Materials.color({ gl: Engine._gl.gl, clr: [100, 100, 202, 0.6] });

    for (let p = 0; p < 1000; p++) {
      let newBlock = new Block({ x: getRandom(), y: getRandom(), z: getRandom() }, { x: 10, y: 10, z: 10 }, { x: 0, y: 0, z: 0 })
      newBlock._material = Materials.color({ clr: [randomByteColor(), randomByteColor()] });

      this._squares.push(newBlock)
      let random = getRandomArbitrary(3, 100)
      let cone = new Cone({ radius: 6, angles: random, height: 20 }, { x: getRandom(), y: getRandom(), z: getRandom() }, { x: 2, y: 1, z: 2 })
      let cl = []
      for (let i = 0; i < random; i++) {
        cl.push(randomByteColor())
      }
      cone._material = Materials.color({ clr: cl });
      this._squares.push(cone);
    }


    // let newBlock2 = new Block(Engine._gl.gl, { x: 70, y: 10, z: 100 }, { x: 2, y: 2, z: 2 }, { x: 45, y: 0, z: 0 })
    // newBlock2._material = Materials.color({ gl: Engine._gl.gl, wireframe: true });

    // this._squares.push(newBlock2)
    // this._dataToBuild.forEach((block) => {
    //   let newBlock = new Block(Engine._gl.gl, {
    //     x: block.x * 10,
    //     y: 10,
    //     z: block.y * 10,
    //   });
    //   newBlock.scaleMe({ x: 5, y: 10, z: 5 });
    //   newBlock._rotationInDeg.x = 90;
    //   if (block.textureType === "texture") {
    //     newBlock._material = Materials.color({ gl: Engine._gl.gl, clr: ["#ff00ff", "#ffffff"] });
    //   } else if (block.textureType === "color") {
    //     newBlock._material = Materials.color({ gl: Engine._gl.gl, clr: ["#ff00ff", "#ffffff"] });
    //   }
    //   this._squares.push(newBlock);
    // });
    // let circle = new Sphere(Engine._gl.gl, { radius: 10, subdivisionsAxis: 10, subdivisionsHeight: 10 }, { x: 0, y: 10, z: 125 })
    // circle._material = Materials.color({ gl: Engine._gl.gl, clr: ["#ff00ff", "#ffffff"] });
    // this._squares.push(circle)


    // let cone = new Cone(Engine._gl.gl, { radius: 6, angles: 15, height: 20 }, { x: 40, y: 10, z: 100 }, { x: 2, y: 1, z: 2 })
    // 
    // cone._material = Materials.color({ gl: Engine._gl.gl, clr: [[221, 66, 12], [0, 66, 12], [0, 255, 12], [255, 255, 12], [0, 255, 128], [255, 4, 0]] });
    // cone._material = Materials.color({ gl: Engine._gl.gl, clr: [221, 66, 12] });
    // cone._material = Materials.color({ gl: Engine._gl.gl, clr: ["#FFAA00", "#AFAA00", "111222"], alpha: 0.5 });

    // this._squares.push(cone);



    // this._squares.push(pyramid);

    requestAnimationFrame(() => this.render(0));

    // canvas.style.display = "block"
  }
  render(now: number): void {
    // Subtract the previous time from the current time

    this._deltaTime = now
    // Remember the current time for the next frame.
    Engine._gl.gl.viewport(0, 0, Engine._gl.gl.canvas.width, Engine._gl.gl.canvas.height);

    Engine._gl.gl.clearColor(0.0, 0.0, 0.0, 0); // Clear to black, fully opaque
    Engine._gl.gl.enable(Engine._gl.gl.DEPTH_TEST); // Enable depth testing
    Engine._gl.gl.clear(Engine._gl.gl.COLOR_BUFFER_BIT | Engine._gl.gl.DEPTH_BUFFER_BIT);
    this._camera.generateMatrixOfView();



    this._squares.forEach((square: Figure) => {
      square.rotateX = 1
      square.rotateY = 1
      square.rotateZ = 0.5
      // square._material = Materials.color({ clr: [] });
      if (square._type == "block") {
        let random = getRandomArbitrary(3, 100)
        let cl = []
        for (let i = 0; i < 6; i++) {
          cl.push(randomByteColor())
        }
        square._material = Materials.color({ clr: cl });
      } else {
        let cl = []
        for (let i = 0; i < square._angles; i++) {
          cl.push(randomByteColor())
        }
        square._material = Materials.color({ clr: cl });

      }
    });


    this._plane.draw(this._camera);
    this.engineRender(this._camera, this._squares)

    let num = Date.now();
    this._fps.render(num);

    now *= 0.001;

    var deltaTime = now - this._then;
    this._then = now;

    this._camera.calculateAndMove(deltaTime);

    // // Remember the current time for the next frame.
    // this._then = now;
    // Engine._gl.gl.viewport(0, 0, Engine._gl.gl.canvas.width, Engine._gl.gl.canvas.height);

    // Engine._gl.gl.clearColor(0.0, 0.0, 0.0, 0); // Clear to black, fully opaque
    // Engine._gl.gl.enable(Engine._gl.gl.DEPTH_TEST); // Enable depth testing
    // Engine._gl.gl.clear(Engine._gl.gl.COLOR_BUFFER_BIT | Engine._gl.gl.DEPTH_BUFFER_BIT);
    // this._camera.generateMatrixOfView();

    // let num = Date.now();
    // this._fps.render(num);

    // // this._plane.draw(this._program, this._camera);

    // this._squares.forEach((square) => {
    //   square.draw(this._camera);
    // });
    // this._camera.calculateAndMove(deltaTime);

    requestAnimationFrame(() => this.render(new Date().getTime()));
  }
}
interface block {
  x: number;
  y: number;
  textureType?: string;
  color?: string;
}
function getRandom() {
  return Math.floor(Math.random() * 1000)
}
function randomHex() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
function randomByteColor() {
  return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1]
}
function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}