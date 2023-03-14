import MainGame from "./MainGame";
import PlaneGenerator from "./PlaneGenerator";
import { butonMenu, butonMenu2, butonMenu3, menuDiv } from "./StaticItems";
const DEBUG = true;
export default class Menu {
  constructor() {
    if (localStorage.getItem("map") == null) localStorage.setItem("map", JSON.stringify([]))

    if (DEBUG) new MainGame()
    console.log(localStorage.getItem("map"))
    butonMenu.addEventListener("click", () => {
      console.log("Gra się zaczeła!")
      new MainGame()
    })
    butonMenu2.addEventListener("click", () => {
      console.log("Gra się zaczeła!")
      new PlaneGenerator()
    })
  }
}
