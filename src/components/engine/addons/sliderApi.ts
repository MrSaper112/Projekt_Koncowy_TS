export default class sliderManager {
    private _div: HTMLDivElement;
    constructor() {
        this._div = document.createElement("div")
        this._div.style.position = "absolute";
        this._div.style.top = "10px";
        document.body.appendChild(this._div)

    }
    createSlider(min: number, max: number, step: number, value: number, name: string, onUpdate: any): void {
        const box = document.createElement("div")
        box.style.display = "flex"
        const a = document.createElement("a")
        a.style.fontSize = "30px"
        a.style.color = "black"
        a.style.fontFamily = "Arial, Helvetica, sans-serif"
        a.innerText = name
        const slider = document.createElement("input");
        slider.type = "range";
        slider.max = max.toString()
        slider.min = min.toString()
        slider.step = step.toString()
        slider.value = value.toString()
        slider.addEventListener("change", (e) => {
            onUpdate(slider.value)
        })
        box.append(a)
        box.append(slider)
        this._div.appendChild(box)
    }
}