// import FirstPersonCamera from "../components/cameras/FirstPersonCamera";
import FreeMoveCamera from "../components/cameras/FPSCamera";
import Materials from "../components/Materials";
import { Engine } from "../Engine";
import { mat4, vec3 } from "../math/gl-matrix";
import { extendedFloat32Array } from "./interfaces/AdditionalInterface";
import { programArray, WebGlWProgram } from "./interfaces/WebglExtender";
import Matrix4D from "./Matrix4D";

export class Figure {
    public _UUID: string;
    public _gl: WebGlWProgram;
    public _material?: Materials;
    public _type?: string

    public _vector?: vec3;
    public _scale?: vec3;
    public _rotationInDeg?: vec3;
    public _matrix4D?: Matrix4D
    public _modelMatrix?: mat4

    public _positions?: Float32Array
    public _indices?: Uint16Array
    public _baseIndices?: Array<number>
    public _textureCoordinates?: Array<number>
    public _faceColors?: Uint8Array
    public _faceC?: extendedFloat32Array

    public _angles: number;
    public _trianglesPerSide: number;
    public _viewMatrix?: Array<number>
    _prg: programArray
    prg: WebGLProgram

    public boxBounding: { min: vec3, max: vec3 }

    _changeMaterial: boolean
    _changePosition: boolean
    private _positionBuffer: WebGLBuffer;
    private _colorBuffer: WebGLBuffer;
    private _indexBuffer: WebGLBuffer;
    private _bindedVertex: boolean;
    constructor(vector?: vec3, scale?: vec3, rotation?: vec3) {
        this._UUID = generateUUID()
        this._vector = vector || vec3.fromValues(0, 0, 0)
        this._scale = scale || vec3.fromValues(1, 1, 1)
        this._rotationInDeg = rotation || vec3.fromValues(0, 0, 0)

        // this.setVector(vector || { x: 0, y: 0, z: 0 })
        // this.setScale(scale || { x: 1, y: 1, z: 1 })
        // this.setRotations(rotation || { x: 0, y: 0, z: 0 })
        this._baseIndices = null
        this.updateMatrix()
        this._bindedVertex = false

        this.prg = Engine._gl.programs.shaders.color._prg


    }
    public updateMatrix(): void {
        let modelMatrix = mat4.create()

        modelMatrix = mat4.translate(modelMatrix, modelMatrix, this._vector)
        modelMatrix = mat4.scale(modelMatrix, modelMatrix, this._scale)
        modelMatrix = mat4.rotateX(modelMatrix, modelMatrix, this._rotationInDeg[0])
        modelMatrix = mat4.rotateY(modelMatrix, modelMatrix, this._rotationInDeg[1])
        modelMatrix = mat4.rotateY(modelMatrix, modelMatrix, this._rotationInDeg[2])
        this._modelMatrix = modelMatrix
    }

    public updateTransaltionMatrix(): void {
        this._modelMatrix = mat4.translate(this._modelMatrix, this._modelMatrix, this._vector)
        this.calculateBoundingBox()

    }
    public updateScaleMatrix(): void {
        this._modelMatrix = mat4.translate(this._modelMatrix, this._modelMatrix, this._scale)
        this.calculateBoundingBox()

    }
    public updateRotationMatrix(): void {
        this._modelMatrix = mat4.rotateY(this._modelMatrix, this._modelMatrix, this._rotationInDeg[1])

        this._modelMatrix = mat4.rotateX(this._modelMatrix, this._modelMatrix, this._rotationInDeg[0])
        this._modelMatrix = mat4.rotateZ(this._modelMatrix, this._modelMatrix, this._rotationInDeg[2])
        this.calculateBoundingBox()

    }
    initBuffer(): void {
        this._positionBuffer = Engine._gl.gl.createBuffer()
        this._indexBuffer = Engine._gl.gl.createBuffer();
        this._colorBuffer = Engine._gl.gl.createBuffer();

        this._faceC = this.createAugmentedTypedArray(4, 0 || this._indices.length, Uint8Array)

        this.calculateBoundingBox()

    }
    calculateBoundingBox() {
        // Initialize min and max vectors with high and low values
        let min: vec3 = vec3.fromValues(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        let max: vec3 = vec3.fromValues(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

        // Loop through all the points to find the minimum and maximum values
        for (let i = 0; i < this._positions.length; i += 3) {
            let p = vec3.fromValues(this._positions[i], this._positions[i + 1], this._positions[i + 2])
            vec3.multiply(p, p, this._scale);
            vec3.add(p, p, this._vector);

            min[0] = Math.min(min[0], p[0]);
            min[1] = Math.min(min[1], p[1]);
            min[2] = Math.min(min[2], p[2]);

            max[0] = Math.max(max[0], p[0]);
            max[1] = Math.max(max[1], p[1]);
            max[2] = Math.max(max[2], p[2]);
        }

        // Return the AABB
        this.boxBounding = { min: min, max: max };
    }
    draw(_camera: FreeMoveCamera): void {
        // console.log(_prg);
        let mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, _camera._viewProjection, this._modelMatrix)
        // Tell WebGL to use our program when drawing
        const modelViewMatrixA = Engine._gl.programs.returnUniform(Engine._gl.gl, this.prg, 'uModelViewMatrix')

        Engine._gl.gl.uniformMatrix4fv(modelViewMatrixA, false, mat4.convertToFloat(mvMatrix));

        if (!this._bindedVertex || Engine._gl.lastBufferedType != this._type || Engine._gl.anglesFigure != this._angles) {
            Engine._gl.lastBufferedType = this._type
            Engine._gl.anglesFigure = this._angles
            this._bindedVertex = true
            const vertexPosition = Engine._gl.programs.returnAttrib(Engine._gl.gl, this.prg, 'aVertexPosition')
            {

                Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
                Engine._gl.gl.bufferData(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indices, Engine._gl.gl.STATIC_DRAW);

                Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
                Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, this._positions, Engine._gl.gl.STATIC_DRAW);

                Engine._gl.gl.vertexAttribPointer(vertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
                Engine._gl.gl.enableVertexAttribArray(vertexPosition);
            }

        }

        if (this._material._type == "color") {
            const vertexColor = Engine._gl.programs.returnAttrib(Engine._gl.gl, this.prg, 'aVertexColor')
            {
                // TODO Change On update by render
                if (!this._material._createdFaceColors) {
                    this.constructColorArray()
                    this._material._createdFaceColors = true



                }
                Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._colorBuffer);
                // Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, new Float32Array(this._material._faceColors), Engine._gl.gl.STATIC_DRAW);
                Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, this._material._faceColors, Engine._gl.gl.STATIC_DRAW);
                Engine._gl.gl.vertexAttribPointer(vertexColor, 4, Engine._gl.gl.UNSIGNED_BYTE, false, 0, 0);
                Engine._gl.gl.enableVertexAttribArray(vertexColor);
                // this.constructColorArray()

            }
        }
        // } else if (this._material._type === "texture") {
        //     const textureCoord = _prg.returnAttrib(Engine._gl.gl, prg, "aTextureCoord")
        //     const sampler = _prg.returnUniform(Engine._gl.gl, prg, "uSampler")
        //     {
        //         const textureCoordBuffer = Engine._gl.gl.createBuffer();
        //         Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, textureCoordBuffer);
        //         Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, new Float32Array(this._textureCoordinates), Engine._gl.gl.STATIC_DRAW);

        //         Engine._gl.gl.vertexAttribPointer(textureCoord, 2, Engine._gl.gl.FLOAT, false, 0, 0);
        //         Engine._gl.gl.enableVertexAttribArray(textureCoord);

        //         // Tell WebGL we want to affect texture unit 0
        //         Engine._gl.gl.activeTexture(Engine._gl.gl.TEXTURE0);

        //         // Bind the texture to texture unit 0
        //         Engine._gl.gl.bindTexture(Engine._gl.gl.TEXTURE_2D, this._material._texture);
        //         // Tell the shader we bound the texture to texture unit 0
        //         Engine._gl.gl.uniform1i(sampler, 0);
        //     }

        // }

        {

            const vertexCount = this._indices.length
            const type = Engine._gl.gl.UNSIGNED_SHORT;
            const offset = 0;
            if (this._material._wireframe) Engine._gl.gl.drawElements(Engine._gl.gl.LINE_LOOP, vertexCount, type, offset);
            else Engine._gl.gl.drawElements(Engine._gl.gl.TRIANGLES, vertexCount, type, offset);
        }
    }
    private constructColorArray() {
        if (typeof this._material._color === 'string') {
            let color = this._material.hexToBytes(this._material._color as String)
            this._material._faceColors = new Uint8Array()
            color[3] = this._material._alpha
            this._faceC.clear()
            for (let i = 0; i < this._indices.length; i++) {
                this._faceC.push(color[0], color[1], color[2], color[3])
            }

            this._material._faceColors = this._faceC
        }

        // Array of bytes
        if (this._material.isArrayOfBytes(this._material._color)) {
            this._material._faceColors = new Uint8Array()
            let color = this._material._color as Array<number>
            color[3] = this._material._alpha
            this._faceC.clear()
            for (let i = 0; i < this._indices.length; i++) {
                this._faceC.replace(color[0], color[1], color[2], color[3])
            }
            this._material._faceColors = this._faceC

        }

        // //Array of String
        // if (this._material.isStringArray(this._material._color) && this._type !== "sphere" && this._type !== "plane") {
        //     console.log("Array of String")
        //     let newColorArray: Array<Array<number>> = new Array();
        //     (this._material._color as Array<String>).map((itm: String) => newColorArray.push(this._material.hexToBytes(itm)))
        //     if (newColorArray.length < 6) {
        //         let color = newColorArray[newColorArray.length - 1]
        //         for (let i = newColorArray.length; i < 3 * this._trianglesPerSide; i++) newColorArray.push(color)
        //     }
        //     newColorArray.forEach((itm: Array<number>) => itm[3] = this._material._alpha)
        //     this._material._color = newColorArray.map((item: (Array<number>)) => { return item });
        // }


        //Array of array bytes
        if (this._material.isArrayOfArrayBytes(this._material._color) && this._type !== "sphere" && this._type !== "plane") {
            this._faceC.clear()
            let isFirst = false
            let firstColor: Array<number>

            if (this._type == "cone") {
                (this._material._color as Array<Array<Number>>).map((itm: Array<number>) => {
                    let item = itm
                    item[3] = this._material._alpha
                    if (this._angles >= 3 && !isFirst) {
                        if ((this._material._color as Array<Array<Number>>).length == 1)
                            for (let i = 0; i < this._angles * 6; i++) this._faceC.push(item)
                        else {
                            for (let i = 0; i < this._angles * 2; i++)  this._faceC.push(item)

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
                        let item = (this._material._color as Array<Array<Number>>)[clrIdx]
                        item[3] = this._material._alpha

                        for (let x = 0; x < 3; x++) baseColor.push(item)

                        if (clrIdx !== this._material._color.length - 1) clrIdx++
                    }
                    for (let itm of baseColor) this._faceC.push(itm)

                }
            }

            let createdColorToIndices = 0;

            (this._material._color as Array<Array<Number>>).map((itm: Array<number>) => {
                if (itm[3] == undefined) itm[3] = this._material._alpha
                switch (this._type) {
                    case "block":
                        for (let i = 0; i < 4; i++) {
                            createdColorToIndices++
                            this._faceC.push(itm)
                        }
                        break;
                }
            })
            //     console.log(newColorArray)
            if (createdColorToIndices < this._indices.length) {
                let color = (this._material._color as Array<Array<number>>)[this._material._color.length - 1] as Array<number>
                color[3] = color[3]
                if (color[3] == undefined) color[3] = this._material._alpha
                switch (this._type) {
                    case "block":
                        for (let i = createdColorToIndices; i < this._indices.length; i++) this._faceC.push(color)
                        break;

                }
            }
            this._material._faceColors = this._faceC

        }
    }

    public createAugmentedTypedArray(numComponents: number, numElements: number, opt_type?: any) {
        const Type = opt_type || Float32Array;
        return this.augmentTypedArray(new Type(numComponents * numElements));
    }
    private augmentTypedArray(typedArray: any) {
        let cursor = 0;
        typedArray.indic = 0
        typedArray.replace = function () {
            for (let ii = 0; ii < arguments.length; ++ii) {
                const value = arguments[ii];
                typedArray[typedArray.indic++] = value;
            }
        }
        typedArray.push = function () {
            for (let ii = 0; ii < arguments.length; ++ii) {
                const value = arguments[ii];
                if (value instanceof Array) {
                    for (let jj = 0; jj < value.length; ++jj) {
                        typedArray[typedArray.indic++] = value[jj];
                    }
                } else {
                    typedArray[typedArray.indic++] = value;
                }
            }
            // for (let ii = 0; ii < arguments.length; ++ii) {
            //     const value = arguments[ii];
            //     if (value instanceof Array) {
            //         for (let jj = 0; jj < value.length; ++jj) {
            //             typedArray[cursor++] = value[jj];
            //         }
            //     } else {
            //         typedArray[cursor++] = value;
            //     }
            // }
        };
        typedArray.clear = function () {
            typedArray.indic = 0
        }
        return typedArray;
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