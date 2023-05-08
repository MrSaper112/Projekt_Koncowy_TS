export default class FPSIndicator {
    private _container: HTMLDivElement;
    private _fpsContainer: HTMLDivElement;
    private _averageContainer: HTMLDivElement;
    private _actualFPS: HTMLSpanElement;
    private _averageFPS: HTMLSpanElement;
    private _frameTimes: Array<number>
    private _frameCursor: number;
    private _numFrames: number;
    private _maxFrames: number;
    private _totalFPS: number;
    private _then: number;
    private _timer: number;
    constructor() {
        this._container = document.createElement("div");
        let info = document.createElement("span")
        info.innerText = 'FPS: '

        this._actualFPS = document.createElement("span")
        info.appendChild(this._actualFPS)

        let info2 = document.createElement("span")
        info2.innerText = 'Average: '

        this._averageFPS = document.createElement("span")
        info2.appendChild(this._averageFPS)

        info.style.display = "flex"
        info2.style.display = "flex"

        info.style.fontSize = "15px"
        info.style.color = "purple"
        info.style.fontFamily = "Arial, Helvetica, sans-serif"

        info2.style.fontSize = "15px"
        info2.style.color = "purple"
        info2.style.fontFamily = "Arial, Helvetica, sans-serif"

        this._container.appendChild(info)
        this._container.appendChild(info2)

        this._frameTimes = [];
        this._frameCursor = 0;
        this._numFrames = 0;
        this._maxFrames = 120;
        this._totalFPS = 0;
        this._then = 0;

        this._container.style.position = "absolute";
        this._container.style.top = "10px";
        this._container.style.marginLeft = "80%";
        this._timer = 0

        document.body.appendChild(this._container);
    }
    render(now: number) {
        now *= 0.001;                          // convert to seconds
        const deltaTime = now - this._then;          // compute time since last frame
        this._then = now;                            // remember time for next frame

        this._timer += deltaTime * 1000
        if (this._timer >= 50) {
            this._timer = 0
            const fps = 1 / deltaTime;             // compute frames per second

            this._actualFPS.textContent = fps.toFixed(1);  // update fps display

            // add the current fps and remove the oldest fps
            this._totalFPS += fps - (this._frameTimes[this._frameCursor] || 0);

            // record the newest fps
            this._frameTimes[this._frameCursor++] = fps;

            // needed so the first N frames, before we have maxFrames, is correct.
            this._numFrames = Math.max(this._numFrames, this._frameCursor);

            // wrap the cursor
            this._frameCursor %= this._maxFrames;

            const averageFPS = this._totalFPS / this._numFrames;

            this._averageFPS.textContent = averageFPS.toFixed(1);  // update avg display
        }


    }
}