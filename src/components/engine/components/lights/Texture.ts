import { Engine } from "../../Engine";
import { generateUUID } from "../../addons/FiguresInterFace";

export default class Texture {
    width: number
    height: number
    id: number
    constructor(width: number, height: number, format: number) {
        this.width = width;
        this.height = height;
        this.id = 512
        let gl = Engine._gl.gl
        // gl.bindTexture(gl.TEXTURE_2D, g);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, format, gl.FLOAT, null);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }
}