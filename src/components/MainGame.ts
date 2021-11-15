import { MainEngine } from "./engine/MainEngine2";
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
