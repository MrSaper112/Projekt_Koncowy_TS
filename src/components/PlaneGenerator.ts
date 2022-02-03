import '../assets/styles/plane.css'

export default class PlaneGenerator {
    _sizeRowAndColumn: number
    _data: Array<block>
    _datatype: Array<string>
    _selected: string
    _colorInput: string
    _input: HTMLInputElement
    constructor() {
        let body = document.querySelectorAll("body")[0].children as HTMLCollection
        for (let x = 0; x < body.length; x++) {
            body[x].classList.add("display")
        }
        this._selected = ""
        this._datatype = ["texture", "color"]
        this._colorInput = ''
        this._sizeRowAndColumn = 20
        this._input = document.createElement("input")
        if (localStorage.getItem("map") == null) this._data = []
        else this._data = JSON.parse(localStorage.getItem("map"))

        this.init()
    }
    init() {
        let div = document.createElement("div")
        div.className = "bigDaddy"
        div.style.width = `${(25 * this._sizeRowAndColumn + this._sizeRowAndColumn * 3).toString()}px`
        for (let y = 0; y < this._sizeRowAndColumn; y++) {
            for (let x = 0; x < this._sizeRowAndColumn; x++) {
                let lookedup = this._data.filter(d => d.x === x && d.y === y)
                
                let inside = document.createElement("div")
                if (lookedup.length > 0) {
                    console.log(lookedup[0])
                    if (lookedup[0].textureType === "texture") {
                        inside.style.backgroundColor = "orange"
                    } else if (lookedup[0].textureType === "color") {
                        inside.style.backgroundColor = lookedup[0].color
                    }
                }
                inside.addEventListener("click", () => {
                    console.log(y, x)
                    this.handleClick(y, x, inside)
                })
                inside.className = "son"
                div.appendChild(inside)

            }

        }
        this._input.type = "text"
        this._input.style.width = "100px"
        this._input.placeholder = "Enter Color (#F0F0F0 format)"
        this._input.style.display = "none"

        let addons = document.createElement("div")
        addons.className = "addons"

        this._input.addEventListener("keyup", (e) => { this._colorInput = this._input.value, console.log(this._colorInput) });
        addons.appendChild(this._input)

        for (let item of this._datatype) {
            let inside = document.createElement("div")
            inside.className = "son"
            if (item === "texture") {
                inside.style.backgroundColor = "orange"
                inside.innerText = item
            } else if (item === "color") {
                inside.style.backgroundColor = "lime"
                inside.innerText = item
            }
            inside.addEventListener("click", () => {
                if (item === "color") {
                    this._selected = "color"
                    this._input.style.display = "block"
                } else if (item === "texture") {
                    this._selected = "texture"
                    this._input.style.display = "none"

                }
            })
            inside.style.color = "black"
            inside.style.width = "60px"
            addons.appendChild(inside)

        }
        let saveButton = document.createElement("button")
        saveButton.innerHTML = "Save Map"
        saveButton.addEventListener("click", () => {
            localStorage.setItem("map", JSON.stringify(this._data))
        })
        let clearStorage = document.createElement("button")
        clearStorage.innerHTML = "Clear Previous Map"
        clearStorage.addEventListener("click", () => {
            this._data = []
            localStorage.setItem("map", JSON.stringify([]))
            window.location.reload()

        })
        let reloadButton = document.createElement("button")
        reloadButton.innerHTML = "Reload Page"
        reloadButton.addEventListener("click", () => {
            document.location.reload()
        })

        addons.appendChild(clearStorage)
        addons.appendChild(saveButton)
        addons.appendChild(reloadButton)
        
        let creatorDiv = document.createElement("div")
        creatorDiv.className = "creatorDiv"

        creatorDiv.appendChild(addons)
        creatorDiv.appendChild(div)

        document.body.appendChild(creatorDiv)
    }
    handleClick(y: number, x: number, div: HTMLDivElement) {
        let idx: number = -1;
        this._data.forEach((item, index) => { if (item.x == x && item.y == y) idx = index })
        console.log(idx)
        if (idx == -1) {
            if (this._selected != '') {
                if (this._selected === "texture") {
                    this._data.push({ y: y, x: x, textureType: "texture" });
                    div.style.backgroundColor = "orange"
                }
                else if (this._selected === "color" && this._colorInput.length == 7) {
                    this._data.push({ y: y, x: x, textureType: "color", color: this._colorInput });
                    console.log(this._colorInput)
                    div.style.backgroundColor = this._colorInput
                }
                else {
                    this._data.push({ y: y, x: x, textureType: "texture", color: "#FF00FF" });
                    div.style.backgroundColor = "#FF00FF"
                }
            }
        } else {
            console.log(this._data)
            this._data.splice(idx, 1)
            div.style.backgroundColor = "white"
        }
    }
}
interface block {
    x: number,
    y: number,
    textureType?: string
    color?: string
}