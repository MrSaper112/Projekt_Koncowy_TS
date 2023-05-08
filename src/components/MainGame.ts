// import FirstPersonCamera from "./engine/components/cameras/FirstPersonCamera";
import { Engine } from "./engine/Engine";
import { canvas } from "./StaticItems";
import FiguresInterFace from "./engine/addons/FiguresInterFace";
// import Plane from "./engine/components/primitives/Plane";
import Materials from "./engine/components/Materials";
import brick from "./textures/brick.jpg";
import part from "./textures/part1.png";
import RayCaster from "./engine/addons/RayCaster";
import Block from "./engine/components/primitives/Block";
// import Sphere from "./engine/components/primitives/Sphere";
import FreeMoveCamera from "./engine/components/cameras/FPSCamera";
import { Figure } from "./engine/components/primitives/Figure";
import Cone from "./engine/components/primitives/Cone";
import Plane from "./engine/components/primitives/Plane";
import { quat, vec3 } from "./engine/math/gl-matrix";
import { KeyboardAndMouse } from "./engine/addons/KeyboardAndMouse";
import Sphere from "./engine/components/primitives/Sphere";
import Particle from "./engine/components/primitives/Particles";
import FPSIndicator from "./engine/addons/FPSIndicator";
import ShadowMap from "./engine/components/lights/ShadowMap";
import Light from "./engine/components/lights/Light";
import PointLight from "./engine/components/lights/PointLight";
import Directional from "./engine/components/lights/DirLight";
import DirLight from "./engine/components/lights/DirLight";
import SpotLight from "./engine/components/lights/SpotLight";
// import Cone from "./engine/components/primitives/Cone";
let texture: WebGLTexture;
let texture2: WebGLTexture;
let texture3: WebGLTexture;

export default class MainGame extends Engine {
  _dataToBuild: Array<block> | any[];
  _speed = 1000;
  _then = 0;
  _fps: FPSIndicator;
  _camera: FreeMoveCamera;
  _deltaTime: number
  _plane: Plane;
  _squares: Array<Figure>;
  _particles: Array<Particle>;
  _lights: Array<Light>;
  constructor() {
    super(canvas);
    this._deltaTime = new Date().getTime()
    this._squares = [];
    this._particles = [];
    this._lights = [];
    this.init()
  }
  async init() {
    this._dataToBuild = JSON.parse(localStorage.getItem("map")) || [];
    this._fps = new FPSIndicator();
    let keyboard = new KeyboardAndMouse({
      keyboardWork: true,
      mouseWork: true,
      keys: {
        KeyS: false,
        KeyW: false,
        KeyA: false,
        KeyD: false,
        Space: false,
        ShiftLeft: false,
      }
    });
    this._camera = new FreeMoveCamera({ fov: 50, keyboard: keyboard, keyboardWork: true }, vec3.fromValues(1000, 1000, -1000), vec3.fromValues(1, 1, 1), quat.fromEuler(quat.create(), 0, 180, 0));
    // this._camera = new FreeMoveCamera({ fov: 50, keyboard: keyboard, keyboardWork: true }, vec3.fromValues(0, 10, 0), vec3.fromValues(1, 1, 1), quat.fromEuler(quat.create(), 0, 180, 0));
    // this._camera.addToRotation({ x: 0, y: 0, z: 45 })
    this._plane = new Plane({
      vector: vec3.fromValues(0, 0, 0),
    },
      { width: 1000, depth: 1000, widthSegments: 5, depthSegments: 5 }
    );
    // console.error("String")
    this._plane._material = Materials.color({ clr: "#FF0FA0" });
    // // // console.error(" Array String")
    this._squares.push(this._plane)
    // // this._plane._material = Materials.color({ gl: Engine._gl.gl, clr: ["#FFAA00", "#AFAA00", "111222"], alpha: 0.5 });
    // // console.error(" Array Byte")
    // // this._plane._material = Materials.color({ gl: Engine._gl.gl, clr: [1, 220, 5, 0.7] });
    // console.error(" Array Array Byte")
    // this._plane._material = Materials.color({ gl: Engine._gl.gl, clr: [100, 100, 202, 0.6] });
    texture = await new Materials().loadTexture(brick, false)
    texture3 = await new Materials().loadTexture(part, false)
    for (let p = 0; p < 1000; p++) {
      // let particle = new Particle(vec3.fromValues(getRandom() - 500, getRandom(), getRandom() + 1500), vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0))
      // particle._material = Materials.texture({ texture: texture3 });
      // // this._particles.push(particle)

      let newBlock2 = new Block(vec3.fromValues(getRandom() + 500 , getRandom(), getRandom() + 500), vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0))
      // newBlock2._material = Materials.color({ clr: [255,0,255], wireframe: false, light: true });
      // newBlock2._material = Materials.texture({ texture: texture, light: true });

      // this._squares.push(newBlock2)
      //
      let newBlock3 = new Block(vec3.fromValues(getRandom() + 500 , getRandom(), getRandom() + 500 ), vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0))
      newBlock3._material = Materials.color({ clr: [255, 255, 0], wireframe: false, light: true });
      // newBlock3._material = Materials.texture({ texture: texture, light: true });
      //
      // let newBlock666 = new Block(vec3.fromValues(250,250,250 ), vec3.fromValues(5,5,5), vec3.fromValues(0, 0, 0))
      // newBlock666._material = Materials.color({ clr: [0,0,0], wireframe: false, light: false });
      // // newBlock3._material = Materials.texture({ texture: texture, light: true });
      //
      //
      // this._squares.push(newBlock666)
      // this._squares.push(newBlock3)
      //
      // let newBlock4 = new Block(vec3.fromValues(200, 200, 200), vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0))
      // newBlock4._material = Materials.color({ clr: [255, 255, 0], wireframe: false, light: false });
      // // newBlock2._material = Materials.texture({ texture: texture, light: true });
      //
      // // this._squares.push(newBlock4)
      //
      //
      let sphere = new Sphere({ radius: 1, subdivisionsAxis: 60, subdivisionsHeight: 60 }, vec3.fromValues(getRandom(), getRandom(), getRandom()), vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0))
      // sphere._material = Materials.color({ clr: randomByteColor() });
      sphere._material = Materials.color({ clr: [randomByteColor(), randomByteColor()], wireframe: false , light:true});
      sphere._material = Materials.color({ clr: [255, 255, 0], wireframe: false, light: true, });

      // this._squares.push(sphere)

      // let sphere2 = new Block(vec3.fromValues(sphere._vector[0], sphere._vector[1], sphere._vector[2]), vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0))
      // // sphere2._material = Materials.color({ clr: randomByteColor(), wireframe: true });
      // console.log('newBlock2', newBlock2)
      // this._squares.push(sphere2)
      let random = getRandomArbitrary(10, 15)
      let cone = new Cone({ radius: 6, angles: random, height: 20 }, vec3.fromValues(getRandom(), getRandom() + 50, getRandom()), vec3.fromValues(3, 3, 3))
      let cl = []
      for (let i = 0; i < random; i++) {
        cl.push(randomByteColor())
      }
      // // console.log('sphere._normals', sphere._normals)
      cone._material = Materials.color({ clr: [255, 255, 0], wireframe: false, light: true });
      // // cone._material = Materials.texture({ texture: texture3 });
      //  console.log('sphere', cone)
      this._squares.push(cone)

      // let cone2 = new Cone({ radius: 6, angles: random, height: 20 }, vec3.fromValues(getRandom(), getRandom() + 50, getRandom()), vec3.fromValues(3, 3, 3))
      //
      // cone2._material = Materials.texture({ texture: texture });
      // console.log('sphere', sphere)
      // console.log('newBlock2', newBlock2)
      // let newBlock3 = new Block(vec3.fromValues(cone._vector[0], cone._vector[1] + 10, cone._vector[2]), cone.boxBounding.scale)
      // newBlock3._material = Materials.color({ clr: [randomByteColor(), randomByteColor()], wireframe: true });
      // newBlock3._material = Materials.color({ clr: [randomByteColor(), randomByteColor()], wireframe: true });

      // // let cone2 = new Cone({ radius: 6, angles: random, height: 20 }, vec3.fromValues(newBlock._vector[0], newBlock._vector[1], newBlock._vector[2]), vec3.fromValues(1, 1, 1))

    }
    for (let p = 0; p < 2; p++) {
      // // let cone2 = new Cone({ radius: 6, angles: random, height: 20 }, vec3.fromValues(newBlock._vector[0], newBlock._vector[1], newBlock._vector[2]), vec3.fromValues(1, 1, 1))
      let vec = vec3.fromValues(getRandom() + 500 , getRandom(), getRandom() + 500)
      let light = new PointLight({v: vec,intensity:0.1})
      this._lights.push(light)

      let lightBlock = new Block(vec, vec3.fromValues(5,5,5), vec3.fromValues(0, 0, 0))
      lightBlock._material = Materials.color({ clr: [0,0,255], wireframe: false, light: false });
      this._squares.push(lightBlock)






      let vec33 = vec3.fromValues(getRandom() + 500 , getRandom(), getRandom() + 500)
      let light3 = new SpotLight({v: vec33})
      this._lights.push(light3)

      let lightBlock3 = new Block(vec33, vec3.fromValues(5,5,5), vec3.fromValues(0, 0, 0))
      lightBlock3._material = Materials.color({ clr: [255,0,0], wireframe: false, light: false });
      this._squares.push(lightBlock3)

    }
    let vec2 = vec3.fromValues(getRandom() + 500 , getRandom(), getRandom() + 500)
    let light2 = new DirLight({v: vec2})
    this._lights.push(light2)

    let lightBlock2 = new Block(vec2, vec3.fromValues(5,5,5), vec3.fromValues(0, 0, 0))
    lightBlock2._material = Materials.color({ clr: [0,255,0], wireframe: false, light: false });
    this._squares.push(lightBlock2)

    requestAnimationFrame(() => this.render(0));

    // canvas.style.display = "block"
  }
  render(now: number): void {
    // Subtract the previous time from the current time
    let gl = Engine._gl.gl
    gl.viewport(0, 0, 1024, 1024);
    let shadowMap = new ShadowMap()
    shadowMap.ShadowMap()
    this.renderShadows()
    gl.clear(gl.DEPTH_BUFFER_BIT);
    // ConfigureShaderAndMatrices();
    this.renderScene(now)



    // Remember the current time for the next frame.
    Engine._gl.gl.viewport(0, 0, Engine._gl.gl.canvas.width, Engine._gl.gl.canvas.height);

    Engine._gl.gl.clearColor(0.0, 0.0, 0.0, 0); // Clear to black, fully opaque
    Engine._gl.gl.enable(Engine._gl.gl.DEPTH_TEST); // Enable depth testing
    Engine._gl.gl.clear(Engine._gl.gl.COLOR_BUFFER_BIT | Engine._gl.gl.DEPTH_BUFFER_BIT);

    Engine._gl.gl.enable(Engine._gl.gl.BLEND);
    Engine._gl.gl.clear(Engine._gl.gl.SRC_ALPHA | Engine._gl.gl.ONE_MINUS_SRC_ALPHA);


    gl.blendEquation(gl.FUNC_ADD); // Normally not needed because it's the default
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this.renderScene(now)

    this._deltaTime = now
    // this._squares.forEach((square: Figure) => {
    //   // square.translateX(0.1)
    //   square.rotateX(.1)
    //   square.rotateZ(0.1)
    // })
    asdasd++
    if (asdasd % 3 == 0) {
      textureindi++;

      this._squares.forEach((square: Figure) => {
        // square.rotateX(0.01)
        // square.rotateZ(0.01)
        // if (textureindi % 5 == 0) {
        //   square._material = Materials.texture({ texture: texture });

        // } else {
        //   square._material = Materials.texture({ texture: texture2 });

        // }

        //   square._material = Materials.color({ clr: [] });
        //   if (square._type == "block") {
        //     let random = getRandomArbitrary(3, 100)
        //     let cl = []
        //     for (let i = 0; i < 6; i++) {
        //       cl.push(randomByteColor())
        //     }
        //     square._material = Materials.color({ clr: cl });
        //   } else {
        //     let cl = []
        //     for (let i = 0; i < square._angles; i++) {
        //       cl.push(randomByteColor())
        //     }
        //     square._material = Materials.color({ clr: cl });

        //   }
      });
    }




    requestAnimationFrame(() => this.render(new Date().getTime()));
  }
  renderShadows() {
    let gl = Engine._gl.gl
    const depthTexture = gl.createTexture();
    const depthTextureSize = 512;
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,      // target
      0,                  // mip level
      gl.DEPTH_COMPONENT32F, // internal format
      depthTextureSize,   // width
      depthTextureSize,   // height
      0,                  // border
      gl.DEPTH_COMPONENT, // format
      gl.FLOAT,           // type
      null);              // data
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const depthFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,       // target
      gl.DEPTH_ATTACHMENT,  // attachment point
      gl.TEXTURE_2D,        // texture target
      depthTexture,         // texture
      0);                   // mip level


  }
  renderScene(now: number) {

    this.engineRender(this._camera, this._squares, this._particles, this._lights)

    let num = Date.now();
    this._fps.render(num);

    now *= 0.001;

    var deltaTime = now - this._then;
    this._then = now;

    this._camera.calculateAndMove(deltaTime);


  }
}
let asdasd = 0;
let textureindi = 0
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