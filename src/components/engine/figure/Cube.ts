import FigureInterface, { generateUUID, vector3D } from "../addons/FiguresInterFace";
import Matrix4D from "../addons/Matrix4D";
import { programArray } from "../addons/webGLutils";
import Camera from "./Camera";
import Materials from "./Materials";
let x = 0
let y = 0
let z = 0
export default class Cube implements FigureInterface {
    _UUID: string;
    public readonly _positions: Array<number>
    public _indices: Array<number>
    public _normals: Array<number>
    public _textureCoordinates: Array<number>
    public _faceColors: Array<Array<number>>
    public _matrix4D: Matrix4D;
    public _gl: WebGLRenderingContext;
    public _vector: vector3D;
    public _scale: vector3D;
    public _rotationInDeg: vector3D;
    public _material: Materials
    private _buffersOfCubes: { position: WebGLBuffer, color: WebGLBuffer, indices: WebGLBuffer }
    constructor(gl: WebGLRenderingContext, vect: vector3D = { x: 1, y: 1, z: 1 }) {
        this._UUID = generateUUID();

        this._matrix4D = new Matrix4D();
        this._gl = gl
        this._vector = vect
        this._material = new Materials(this._gl, { color: 'ff00ff' })
        this._scale = { x: 1, y: 1, z: 1 }
        this._rotationInDeg = { x: 0, y: 0, z: 0 }
        this._positions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];

        this._indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];
        this._textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        this._normals = [
            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
        ];
    }
    updateX(e: number) {
        x = e
    }
    updateZ(e: number) {
        z = e
    }
    updateY(e: number) {
        y = e
    }

    draw(_prg: programArray, _camera: Camera) {
        // console.log(_prg);
        let prg: WebGLProgram
        if (this._material._type === "color") {
            prg = _prg.shaders.color._prg
        } else if (this._material._type === "texture") {
            prg = _prg.shaders.texture._prg
        }
        // else if (this._material._type === "textureLight") {
        //     prg = _prg.shaders.textureNormal._prg
        // }
        this._gl.useProgram(prg)
        this._gl.linkProgram(prg)

        const vertexPosition = _prg.returnAttrib(this._gl, prg, 'aVertexPosition')
        const modelViewMatrixA = _prg.returnUniform(this._gl, prg, 'uModelViewMatrix')

        let modelMatrix = this._matrix4D.generateMatrix()
        modelMatrix = this._matrix4D.translate(modelMatrix, this._vector.x, this._vector.y, this._vector.z)
        modelMatrix = this._matrix4D.scale(modelMatrix, this._scale.x, this._scale.y, this._scale.z)
        modelMatrix = this._matrix4D.xRotate(modelMatrix, this._rotationInDeg.x)
        modelMatrix = this._matrix4D.yRotate(modelMatrix, this._rotationInDeg.y)
        modelMatrix = this._matrix4D.zRotate(modelMatrix, this._rotationInDeg.z)

        let mvMatrix = this._matrix4D.multiplyMatrices(_camera._viewProjection, modelMatrix)
        {
            const positionBuffer = this._gl.createBuffer()
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._positions), this._gl.STATIC_DRAW);
            const numComponents = 3;
            const type = this._gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this._gl.vertexAttribPointer(
                vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this._gl.enableVertexAttribArray(
                vertexPosition);
        }

        const indexBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), this._gl.STATIC_DRAW);


        // Tell WebGL to use our program when drawing

        this._gl.uniformMatrix4fv(
            modelViewMatrixA,
            false,
            mvMatrix);



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

                const numComponents = 4;
                const type = this._gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                this._gl.vertexAttribPointer(
                    vertexColor,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                this._gl.enableVertexAttribArray(
                    vertexColor);
            }

        } else if (this._material._type === "texture" || this._material._type === "textureLight") {
            const textureCoord = _prg.returnAttrib(this._gl, prg, "aTextureCoord")
            const sampler = _prg.returnUniform(this._gl, prg, "uSampler")
            {
                const textureCoordBuffer = this._gl.createBuffer();
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, textureCoordBuffer);
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._textureCoordinates),
                    this._gl.STATIC_DRAW);
                const num = 2; // every coordinate composed of 2 values
                const type = this._gl.FLOAT; // the data in the buffer is 32 bit float
                const normalize = false; // don't normalize
                const stride = 0; // how many bytes to get from one set to the next
                const offset = 0; // how many bytes inside the buffer to start from
                this._gl.vertexAttribPointer(textureCoord, num, type, normalize, stride, offset);
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
            const vertexCount = 36;
            const type = this._gl.UNSIGNED_SHORT;
            const offset = 0;
            this._gl.drawElements(this._gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    scaleMe(vect: vector3D) {
        // this._matrix = this.scale(this._matrix, vect.x, vect.y, vect.z);
        this._scale.x = vect.x
        this._scale.y = vect.y
        this._scale.z = vect.z
    }
    addToPosition(vect: vector3D): void {
        this._vector.x += vect.x
        this._vector.y += vect.y
        this._vector.z += vect.z
    }
    addToRotation(vect: vector3D): void {
        this._rotationInDeg.x += vect.x
        this._rotationInDeg.y += vect.y
        this._rotationInDeg.z += vect.z
    }
    setNewCoordinate(vect: vector3D): void {
        this._vector.x = vect.x
        this._vector.y = vect.y
        this._vector.z = vect.z
    }
    setNewRotations(vect: vector3D): void {
        this._rotationInDeg.x = vect.x
        this._rotationInDeg.y = vect.y
        this._rotationInDeg.z = vect.z
    }
}

