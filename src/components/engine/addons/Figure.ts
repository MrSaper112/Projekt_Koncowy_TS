import Camera from "../figure/Camera";
import Materials from "../figure/Materials";
import Matrix4D from "./Matrix4D";
import { programArray } from "./webGLutils";

export class Figure {
    public _UUID: string;
    public _matrix4D?: Matrix4D
    public _gl: WebGLRenderingContext;
    public _material?: Materials;

    public _positions?: Array<number>
    public _indices?: Array<number>
    public _textureCoordinates?: Array<number>
    public _faceColors?: Array<Array<number>>

    public _vector?: Vector3D;
    private _scale?: Vector3D;
    public _rotationInDeg?: Vector3D;

    public _modelMatrix?: Array<number>
    public _viewMatrix?: Array<number>
    constructor(gl:WebGLRenderingContext,vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D) {
        this._UUID = generateUUID()
        this._gl = gl
        this._vector = vector || { x: 0, y: 0, z: 0 }
        this._scale = scale || { x: 1, y: 1, z: 1 }
        this._rotationInDeg = rotation || { x: 0, y: 0, z: 0 }
        this._matrix4D = new Matrix4D();
        this.updateMatrix()

    }
    draw(_prg: programArray, _camera: Camera): void {
        // console.log(_prg);
        let prg: WebGLProgram
        if (this._material._type === "color") {
            prg = _prg.shaders.color._prg
        } else if (this._material._type === "texture") {
            prg = _prg.shaders.texture._prg
        }

        this._gl.useProgram(prg)
        this._gl.linkProgram(prg)

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

        if (this._material._type === "color") {
            const vertexColor = _prg.returnAttrib(this._gl, prg, 'aVertexColor')
            {
                var colors: Array<number> = [];

                for (var j = 0; j < this._material._faceColors.length; ++j) {
                    const c = this._material._faceColors[j];
                    colors = colors.concat(c, c, c, c);
                }

                const colorBuffer = this._gl.createBuffer();
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, colorBuffer);
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(colors), this._gl.STATIC_DRAW);

                this._gl.vertexAttribPointer(vertexColor, 4, this._gl.FLOAT, false, 0, 0);
                this._gl.enableVertexAttribArray(vertexColor);
            }

        } else if (this._material._type === "texture") {
            const textureCoord = _prg.returnAttrib(this._gl, prg, "aTextureCoord")
            const sampler = _prg.returnUniform(this._gl, prg, "uSampler")
            {
                const textureCoordBuffer = this._gl.createBuffer();
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, textureCoordBuffer);
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._textureCoordinates), this._gl.STATIC_DRAW);

                this._gl.vertexAttribPointer(textureCoord, 2, this._gl.FLOAT, false, 0, 0);
                this._gl.enableVertexAttribArray(textureCoord);

                // Tell WebGL we want to affect texture unit 0
                this._gl.activeTexture(this._gl.TEXTURE0);

                // Bind the texture to texture unit 0
                this._gl.bindTexture(this._gl.TEXTURE_2D, this._material._texture);
                // Tell the shader we bound the texture to texture unit 0
                this._gl.uniform1i(sampler, 0);
            }

        }

        {
            const vertexCount = this._indices.length
            const type = this._gl.UNSIGNED_SHORT;
            const offset = 0;
            this._gl.drawElements(this._gl.TRIANGLES, vertexCount, type, offset);
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
interface position{
    vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D
}
export interface Vector3D {
    x?: number,
    y?: number,
    z?: number,
    width?: number
}