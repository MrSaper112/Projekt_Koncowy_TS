export  class KeyboardAndMouse {
    _keyboardWork: boolean
    _mouseWork: boolean
    _keys: Keys
    constructor(data: { keyboardWork?: boolean; mouseWork?: boolean, keys?: any }) {
        this._keyboardWork = data.keyboardWork || false
        this._mouseWork = data.mouseWork || false
        this._keys = data.keys || null
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