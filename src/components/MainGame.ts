import { MainEngine } from "./engine/MainEngine";
import { canvas } from "./StaticItems";

export default class MainGame extends MainEngine {
  constructor() {
    super(canvas)
  
    console.log("Tes2t");
    this.init()
  }
  init() {

    // canvas.style.display = "block"

  }
}
