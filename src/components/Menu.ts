import MainGame from "./MainGame";
import { butonMenu, menuDiv } from "./StaticItems";

export default class Menu {
  constructor() {
    butonMenu.addEventListener("click", () => {
      console.log("Gra się zaczeła!")
      new MainGame()
    })
  }
}
