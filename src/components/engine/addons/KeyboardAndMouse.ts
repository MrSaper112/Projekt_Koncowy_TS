export class KeyboardAndMouse {
    _keyboardWork: boolean
    _mouseWork: boolean
    _keys: Keys
    _positionOfMouse: { x: number, y: number }
    constructor(data: { keyboardWork?: boolean; mouseWork?: boolean, keys?: any }) {
        this._keyboardWork = data.keyboardWork || false
        this._mouseWork = data.mouseWork || false
        this._keys = data.keys || null
        this._positionOfMouse = { x: document.body.clientWidth / 2, y: document.body.clientHeight / 2 }
        console.log(this._keys)
        this.init()
    }

    init() {
        if (this._keyboardWork) {
            document.addEventListener("keydown", (e) => {
                if (this._keys) {
                    Object.keys(this._keys)
                        .forEach(key => {
                            if (key === e.code) {
                                this._keys[key as keyof Keys] = true
                            }
                        });

                }
            })
            document.addEventListener("keyup", (e) => {
                Object.keys(this._keys)
                    .forEach(key => {
                        if (key === e.code) {
                            this._keys[key as keyof Keys] = false
                        }
                    });


            })
        }
        if (this._mouseWork) {
        //    document.body.requestPointerLock = document.body.requestPointerLock
        //     document.exitPointerLock = document.exitPointerLock

        //     document.body.onclick = () => {
        //         document.body.requestPointerLock();
        //     }

        //     // pointer lock event listeners
        //     // Hook pointer lock state change events for different browsers

        //     let lockChangeAlert = () => {
        //         if (document.pointerLockElement === document.body) {
        //             console.log('The pointer lock status is now locked');
        //             document.addEventListener("mousemove", canvasLoop, false);
        //         } else {
        //             console.log('The pointer lock status is now unlocked');
        //             document.removeEventListener("mousemove", canvasLoop, false);
        //         }
        //     }

        //     document.addEventListener('pointerlockchange', lockChangeAlert, false);
        //     document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

        //     let canvasLoop = (e: MouseEvent) => {
        //         var movementX = e.movementX
        //         var movementY = e.movementY
        //         this._positionOfMouse.x += movementX / Math.PI
        //         this._positionOfMouse.y += movementY / Math.PI

        //         console.log("X position: " + this._positionOfMouse.x + ', Y position: ' + this._positionOfMouse.y);
        //     }

            document.addEventListener("mousemove", (e) => {
                this._positionOfMouse.x = e.movementX;
                // console.log(this._positionOfMouse)
            })

        }
    }
}
export interface Keys {
    KeyA?: boolean;
    KeyB?: boolean;
    KeyC?: boolean;
    KeyD?: boolean;
    KeyE?: boolean;
    KeyF?: boolean;
    KeyG?: boolean;
    KeyH?: boolean;
    KeyI?: boolean;
    KeyJ?: boolean;
    KeyK?: boolean;
    KeyL?: boolean;
    KeyM?: boolean;
    KeyN?: boolean;
    KeyO?: boolean;
    KeyP?: boolean;
    KeyR?: boolean;
    KeyS?: boolean;
    KeyW?: boolean;
    KeyX?: boolean;
    KeyY?: boolean;
    KeyZ?: boolean;
}