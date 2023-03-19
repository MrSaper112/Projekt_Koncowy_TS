export default class Materials {
    _useNormals: boolean
    _textureReapet: boolean
    _type: String
    _faceColors: Uint8Array
    _gl: WebGLRenderingContext
    _urlOfTexture: String
    _texture: WebGLTexture
    _repeatTexture: boolean
    _hexColor: Array<number>

    //Color 
    public _alpha: number;
    public _isSided: boolean;
    public _color: String | Array<String> | Array<Array<Number>> | Array<Number>;
    public _colorOrder: Array<Array<number>>

    //Wireframe
    public _wireFrameColor: Array<number>
    public _wireframe: boolean
    _createdFaceColors: boolean


    // public constructor(gl: WebGLRenderingContext, color?: color, args?: args) {
    //     this._gl = gl
    //     this._useNormals = true
    //     console.log(color)
    //     if (color != null) {
    //         this._type = "color"
    //         this._alpha = color.alpha || 1;
    //         this._color = color._color

    //         const hexToByte = this.hexToBytes(this._color[0].replace("#", ""))
    //         this._hexColor = hexToByte
    //         // console.log(hexToByte)
    //         // console.log(this._faceColors)

    //     }
    //     if ("texture" in args) {
    //         this._type = "texture"
    //         this._urlOfTexture = args.texture
    //         if ("normal" in args && args.normal) {
    //             this._type = "textureLight"
    //         }
    //         if ("repeatTexture" in args && args.repeatTexture) {
    //             this._repeatTexture = true

    //         }
    //         this._texture = this.loadTexture()

    //     } else {
    //         this._type = "null"
    //     }

    // }
    public static color({ clr, alpha, wireframe }: { clr?: String | Array<String> | Array<Array<Number>> | Array<Number>; alpha?: number, wireframe?: boolean }): Materials {
        let cls = new Materials();
        cls._type = "color"
        cls._alpha = alpha || 1
        cls._createdFaceColors = false
        cls._color = clr || [100, 100, 100, 1]
        cls._wireframe = wireframe || false
        return cls
    }
    public static texture(gl: WebGLRenderingContext, args: args): Materials {
        let cls = new Materials();
        cls._gl = gl;
        cls._type = "texture"
        cls._urlOfTexture = args.texture
        if ("normal" in args && args.normal) {
            cls._type = "textureLight"
        }
        if ("repeatTexture" in args && args.repeatTexture) {
            cls._repeatTexture = true

        }
        cls._texture = cls.loadTexture()
        return cls
    }
    hexToBytes(hex: String): Array<number> {
        hex = hex.replace("#", "")
        let bytes = [];
        for (let c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16))
        bytes[3] = this._alpha
        return bytes
    }
    // isArrayOfBytes(byteArray: any): Array<Array<number>> {
    //     let newByteArray = new Array<Array<number>>
    //     byteArray.forEach((item: any) => {
    //         if (item instanceof Array) {
    //             item.forEach(item => {
    //                 if (!(item instanceof Number) || !(item >= 0 && item <= 255)) {
    //                     return Array(0);
    //                 }
    //             })
    //             newByteArray.push(item)
    //         } else return Array(0);

    //     })
    //     let lastColor = newByteArray[newByteArray.length - 1]
    //     for (var i = 0; i < newByteArray.length; i++) {
    //         if (newByteArray instanceof Array<number>) newByteArray.push(lastColor)
    //     }
    //     if (newByteArray.length == 6) return newByteArray
    //     else return Array(0)
    // } 
    isArrayOfArrayBytes(byteArray: any): boolean {
        if (Array.isArray(byteArray)) {
            var somethingIsNotString = false;
            byteArray.forEach(function (item) {
                if (Array.isArray(item)) {
                    item.forEach(function (byte) {
                        if (typeof byte !== 'number') {
                            somethingIsNotString = true;
                        }
                    })
                } else somethingIsNotString = true
            })
            if (!somethingIsNotString && byteArray.length > 0) {
                return true
            } else return false
        }
    }
    isArrayOfBytes(byteArray: any): boolean {
        if (Array.isArray(byteArray)) {
            var somethingIsNotString = false;
            byteArray.forEach(function (item) {
                if (typeof item !== 'number') {
                    somethingIsNotString = true;
                }
            })
            if (!somethingIsNotString && byteArray.length > 0) {
                return true
            } else return false
        }
    }
    isStringArray(byteArray: any): boolean {
        if (Array.isArray(byteArray)) {
            var somethingIsNotString = false;
            byteArray.forEach(function (item) {
                if (typeof item !== 'string') {
                    somethingIsNotString = true;
                }
            })
            if (!somethingIsNotString && byteArray.length > 0) {
                return true
            } else return false
        }
    }
    // Convert a byte array to a hex String
    bytesToHex(bytes: Array<number>): String {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }

    loadTexture() {
        const texture = this._gl.createTexture();
        // this._gl.bindTexture(this._gl.TEXTURE_2D, texture);


        // const level = 0;
        // const internalFormat = this._gl.RGBA;
        // const width = 1;
        // const height = 1;
        // const border = 0;
        // const srcFormat = this._gl.RGBA;
        // const srcType = this._gl.UNSIGNED_BYTE;
        // const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        // this._gl.texImage2D(this._gl.TEXTURE_2D, level, internalFormat,
        //     width, height, border, srcFormat, srcType,
        //     pixel);

        // const image = new Image();
        // image.onload = () => {
        //     this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
        //     this._gl.texImage2D(this._gl.TEXTURE_2D, level, internalFormat,
        //         srcFormat, srcType, image);

        //     // WebGL1 has different requirements for power of 2 images
        //     // vs non power of 2 images so check if the image is a
        //     // power of 2 in both dimensions.
        //     if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
        //         // Yes, it's a power of 2. Generate mips.
        //         this._gl.generateMipmap(this._gl.TEXTURE_2D);
        //     } else {
        //         // No, it's not a power of 2. Turn off mips and set
        //         // wrapping to clamp to edge
        //         if (this._textureReapet) {
        //             console.warn("WRAPP")
        //             this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
        //             this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
        //             this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);

        //         } else {
        //             // console.warn("PIPA Repeat")
        //             // this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
        //             // this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
        //             // this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);

        //             this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
        //             this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
        //             this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);

        //         }
        //     }
        // };
        // image.src = this._urlOfTexture;

        return texture;
    }
    isPowerOf2(value: number): boolean {
        return (value & (value - 1)) == 0;
    }

}
interface args {
    color?: String
    faces?: Array<Array<number>>
    alpha?: number
    texture?: String
    normal?: boolean
    repeatTexture?: boolean
    wireframe?: boolean
}
interface color { alpha?: number, isSided: boolean, _color: Array<Array<String>>, colorOrder: Array<number> }