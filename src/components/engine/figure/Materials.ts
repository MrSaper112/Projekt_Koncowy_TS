export default class Materials {
    _type: string
    _faceColors: Array<Array<number>>
    _alpha: number
    _gl: WebGLRenderingContext
    _urlOfTexture: string
    _texture: WebGLTexture
    constructor(gl:WebGLRenderingContext,args?: args) {
        this._gl = gl
        if ("color" in args) {
            this._type = "color"
            "alpha" in args ? this._alpha = args.alpha : this._alpha = 1

            if("faces" in args && args.faces.length == 6){
                this._faceColors = args.faces
            }else{
                const hexToByte = this.hexToBytes(args.color.replace("#",""))
                this._faceColors = new Array(6).fill(hexToByte)
                console.log(hexToByte)
                // console.log(this._faceColors)
            }

        } else if ("texture" in args) {
            this._type = "texture"
            this._urlOfTexture = args.texture
            this._texture = this.loadTexture()

        } else {
            this._type = "null"
        }
    }
    hexToBytes(hex: string): Array<number> {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        bytes = bytes.map(item => { return item / 255 })
        bytes[3] = this._alpha
        return bytes
    }

    // Convert a byte array to a hex string
    bytesToHex(bytes: Array<number>): string {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }
    loadTexture() {
        const texture = this._gl.createTexture();
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture);

        // Because images have to be downloaded over the internet
        // they might take a moment until they are ready.
        // Until then put a sinthis._gle pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = this._gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this._gl.RGBA;
        const srcType = this._gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        this._gl.texImage2D(this._gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        const image = new Image();
        image.onload =  () => {
            this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
            this._gl.texImage2D(this._gl.TEXTURE_2D, level, internalFormat,
                srcFormat, srcType, image);

            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
                // Yes, it's a power of 2. Generate mips.
                this._gl.generateMipmap(this._gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn off mips and set
                // wrapping to clamp to edge
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
            }
        };
        image.src = this._urlOfTexture;

        return texture;
    }
 isPowerOf2(value:number):boolean {
    return (value & (value - 1)) == 0;
}

}
interface args {
    color?: string
    faces?: Array<Array<number>>
    alpha?: number
    texture?: string
}