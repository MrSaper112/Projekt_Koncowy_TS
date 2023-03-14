import FirstPersonCamera from "../components/cameras/FirstPersonCamera";
import Materials from "../components/Materials";
import Matrix4D from "./Matrix4D";
import { programArray } from "./webGLutils";

export class Figure {
    public _UUID: string;
    public _matrix4D?: Matrix4D
    public _gl: WebGLRenderingContext;
    public _material?: Materials;
    public _type?: string

    public _positions?: Array<number>
    public _indices?: Array<number>
    public _baseIndices?: Array<number>
    public _textureCoordinates?: Array<number>
    public _faceColors?: Array<number>

    public _vector?: Vector3D;
    public _scale?: Vector3D;
    public _rotationInDeg?: Vector3D;
    public _angles: number;
    public _trianglesPerSide: number;
    public _modelMatrix?: Array<number>
    public _viewMatrix?: Array<number>
    constructor(gl: WebGLRenderingContext, vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D) {
        this._UUID = generateUUID()
        this._gl = gl
        this._vector = vector || { x: 0, y: 0, z: 0 }
        this._scale = scale || { x: 1, y: 1, z: 1 }
        this._rotationInDeg = rotation || { x: 0, y: 0, z: 0 }
        this._baseIndices = null
        this._matrix4D = new Matrix4D();
        this.updateMatrix()

    }
    draw(_prg: programArray, _camera: FirstPersonCamera): void {
        // console.log(_prg);

        let prg: WebGLProgram
        if (this._material._type === "color") {
            prg = _prg.shaders.color._prg
        } else if (this._material._type === "texture") {
            prg = _prg.shaders.texture._prg
        }
        this._gl.useProgram(prg)
        this._gl.linkProgram(prg)
        this._gl.enable(this._gl.BLEND)
        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
        const vertexPosition = _prg.returnAttrib(this._gl, prg, 'aVertexPosition')
        const modelViewMatrixA = _prg.returnUniform(this._gl, prg, 'uModelViewMatrix')

        let mvMatrix = this._matrix4D.multiplyMatrices(_camera._viewProjection, this._modelMatrix)

        {
            const positionBuffer = this._gl.createBuffer()
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._positions), this._gl.STATIC_DRAW);

            this._gl.vertexAttribPointer(vertexPosition, 3, this._gl.FLOAT, false, 0, 0);
            this._gl.enableVertexAttribArray(vertexPosition);
        }

        const indexBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), this._gl.STATIC_DRAW);


        // Tell WebGL to use our program when drawing

        this._gl.uniformMatrix4fv(modelViewMatrixA, false, mvMatrix);
        if (this._material._type == "color") {
            const vertexColor = _prg.returnAttrib(this._gl, prg, 'aVertexColor')
            {
                // TODO Change On update by render
                if (!this._material._createdFaceColors) {
                    this.constructColorArray()
                    this._material._createdFaceColors = true
                }
                // this.constructColorArray()

                const colorBuffer = this._gl.createBuffer();
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, colorBuffer);
                // this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._material._faceColors), this._gl.STATIC_DRAW);
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._material._faceColors), this._gl.STATIC_DRAW);
                this._gl.vertexAttribPointer(vertexColor, 4, this._gl.FLOAT, false, 0, 0);
                this._gl.enableVertexAttribArray(vertexColor);
            }
        }
        // } else if (this._material._type === "texture") {
        //     const textureCoord = _prg.returnAttrib(this._gl, prg, "aTextureCoord")
        //     const sampler = _prg.returnUniform(this._gl, prg, "uSampler")
        //     {
        //         const textureCoordBuffer = this._gl.createBuffer();
        //         this._gl.bindBuffer(this._gl.ARRAY_BUFFER, textureCoordBuffer);
        //         this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._textureCoordinates), this._gl.STATIC_DRAW);

        //         this._gl.vertexAttribPointer(textureCoord, 2, this._gl.FLOAT, false, 0, 0);
        //         this._gl.enableVertexAttribArray(textureCoord);

        //         // Tell WebGL we want to affect texture unit 0
        //         this._gl.activeTexture(this._gl.TEXTURE0);

        //         // Bind the texture to texture unit 0
        //         this._gl.bindTexture(this._gl.TEXTURE_2D, this._material._texture);
        //         // Tell the shader we bound the texture to texture unit 0
        //         this._gl.uniform1i(sampler, 0);
        //     }

        // }

        {
            const vertexCount = this._indices.length
            const type = this._gl.UNSIGNED_SHORT;
            const offset = 0;
            this._gl.drawElements(this._gl.TRIANGLES, vertexCount, type, offset);
        }
    }
    private constructColorArray() {

        if (typeof this._material._color === 'string') {
            console.log(" Only String")
            let color = this._material.hexToBytes(this._material._color as String)
            this._material._faceColors = []
            color[3] = this._material._alpha

            for (let i = 0; i < this._indices.length; i++) {
                this._material._faceColors.push(color[0] / 255, color[1] / 255, color[2] / 255, color[3])
            }
        }

        // Array of bytes
        if (this._material.isArrayOfBytes(this._material._color)) {
            console.log("Array of Byte")
            this._material._faceColors = []
            let color = this._material._color as Array<number>
            color[3] = this._material._alpha

            for (let i = 0; i < this._indices.length; i++) {
                this._material._faceColors.push(color[0] / 255, color[1] / 255, color[2] / 255, color[3])
            }
        }

        //Array of String
        if (this._material.isStringArray(this._material._color) && this._type !== "sphere" && this._type !== "plane") {
            console.log("Array of String")
            let newColorArray: Array<Array<number>> = new Array();
            (this._material._color as Array<String>).map((itm: String) => newColorArray.push(this._material.hexToBytes(itm)))
            if (newColorArray.length < 6) {
                let color = newColorArray[newColorArray.length - 1]
                for (let i = newColorArray.length; i < 3 * this._trianglesPerSide; i++) newColorArray.push(color)
            }
            newColorArray.forEach((itm: Array<number>) => itm[3] = this._material._alpha)
            this._material._color = newColorArray.map((item: (Array<number>)) => { return item });
        }


        //Array of array bytes
        if (this._material.isArrayOfArrayBytes(this._material._color) && this._type !== "sphere" && this._type !== "plane") {
            console.log("Array of Array Byte")
            let newColorArray: Array<Array<number>> = new Array();
            let isFirst = false
            let firstColor: Array<number>

            if (this._type == "cone") {

                (this._material._color as Array<Array<Number>>).map((itm: Array<number>) => {
                    console.log(itm)
                    let item = itm.map((itm: number) => itm / 255)
                    item[3] = this._material._alpha
                    if (this._angles >= 3 && !isFirst) {
                        if ((this._material._color as Array<Array<Number>>).length == 1)
                            for (let i = 0; i < this._angles * 6; i++) newColorArray.push(item)
                        else {
                            for (let i = 0; i < this._angles * 2; i++) newColorArray.push(item)

                        }
                        firstColor = item
                        isFirst = true
                    }
                })
                if ((this._material._color as Array<Array<Number>>).length > 1) {
                    let baseColor = []
                    let clrIdx = 1;
                    for (let i = 0; i < this._angles; i++) {
                        // testa.forEach((itm: Array<number>) => newColorArray.push(itm))
                        let item = (this._material._color as Array<Array<Number>>)[clrIdx].map((itm: number) => itm / 255)
                        item[3] = this._material._alpha

                        for (let x = 0; x < 3; x++) baseColor.push(item)

                        if (clrIdx !== this._material._color.length - 1) clrIdx++
                    }

                    baseColor.forEach((itm: Array<number>) => newColorArray.push(itm))

                }
            }


            (this._material._color as Array<Array<Number>>).map((itm: Array<number>) => {
                let item = itm.map((item: number, idx: number) => {
                    if (idx !== 3) return item / 255
                })
                item[3] = itm[3]
                if (item[3] == undefined) item[3] = this._material._alpha

                switch (this._type) {
                    case "block":
                        for (let i = 0; i < 4; i++)  newColorArray.push(item)
                        break;
                }
            })

            console.log(newColorArray)

            if (newColorArray.length < this._indices.length) {
                let color = (this._material._color as Array<Array<number>>)[this._material._color.length - 1] as Array<number>
                let color2 = color.map((item: number, idx: number) => {
                    if (idx !== 3) return item / 255
                })
                color2[3] = color[3]
                if (color2[3] == undefined) color2[3] = this._material._alpha
                switch (this._type) {
                    case "block":
                        for (let i = newColorArray.length; i < this._indices.length; i++) newColorArray.push(color2)
                        break;

                }
            }
            console.log(newColorArray)
            this._material._faceColors = newColorArray.flat()
        }
    }
    private updateMatrix(): void {
        let modelMatrix = this._matrix4D.generateMatrix()
        modelMatrix = this._matrix4D.translate(modelMatrix, this._vector.x, this._vector.y, -this._vector.z)
        modelMatrix = this._matrix4D.scale(modelMatrix, this._scale.x, this._scale.y, this._scale.z)
        modelMatrix = this._matrix4D.xRotate(modelMatrix, this._rotationInDeg.x)
        modelMatrix = this._matrix4D.yRotate(modelMatrix, this._rotationInDeg.y)
        modelMatrix = this._matrix4D.zRotate(modelMatrix, this._rotationInDeg.z)
        this._modelMatrix = modelMatrix

    }
    public scaleMe(vect: Vector3D): void {
        this._scale.x = vect.x
        this._scale.y = vect.y
        this._scale.z = vect.z
        this.updateMatrix()
    }
    public addToPosition(vect: Vector3D): void {
        this._vector.x += vect.x
        this._vector.y += vect.y
        this._vector.z += vect.z
        this.updateMatrix()

    }
    public addToRotation(vect: Vector3D): void {
        this._rotationInDeg.x += vect.x
        this._rotationInDeg.y += vect.y
        this._rotationInDeg.z += vect.z
        this.updateMatrix()

    }
    public setNewCoordinate(vect: Vector3D): void {
        this._vector.x = vect.x
        this._vector.y = vect.y
        this._vector.z = vect.z
        this.updateMatrix()

    }
    public setNewRotations(vect: Vector3D): void {
        this._rotationInDeg.x = vect.x
        this._rotationInDeg.y = vect.y
        this._rotationInDeg.z = vect.z
        this.updateMatrix()

    }
    public createAugmentedTypedArray(numComponents: number, numElements: number, opt_type?: any) {
        const Type = opt_type || Float32Array;
        return this.augmentTypedArray(new Type(numComponents * numElements));
    }
    private augmentTypedArray(typedArray: any) {
        let cursor = 0;
        typedArray.push = function () {
            for (let ii = 0; ii < arguments.length; ++ii) {
                const value = arguments[ii];
                if (value instanceof Array) {
                    for (let jj = 0; jj < value.length; ++jj) {
                        typedArray[cursor++] = value[jj];
                    }
                } else {
                    typedArray[cursor++] = value;
                }
            }
        };
        return typedArray;
    }
    updateXPos(e: number) {
        this._vector.x = e
        this.updateMatrix()

    }
    updateZPos(e: number) {
        this._vector.z = e
        this.updateMatrix()

    }
    updateYPos(e: number) {
        this._vector.y = e
        this.updateMatrix()

    }
}

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
interface blockPlacement {
    position: Array<number>,
    normal: Array<number>,
    texcoord: Array<number>,
    indices: Array<number>
}
interface position {
    vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D
}
export interface Vector3D {
    x?: number,
    y?: number,
    z?: number,
    width?: number
}