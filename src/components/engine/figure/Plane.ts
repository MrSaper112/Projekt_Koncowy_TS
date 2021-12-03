import FigureInterface, { generateUUID, vector3D } from "../addons/FiguresInterFace";
import Matrix4D from "../addons/Matrix4D";
import { programArray } from "../addons/webGLutils";
import Materials from "./Materials";
import cobble from '../../textures/cobble.png'
import Camera from "./Camera";

export default class Plane implements FigureInterface {
    _UUID: string;
    _dat: { width: number, depth: number, widthSegments: number, depthSegments: number }
    _matrix4D?: Matrix4D;
    _positions?: number[];
    _indices?: number[];
    _gl?: WebGLRenderingContext;
    _vector?: vector3D;
    _scale?: vector3D;
    _rotationInDeg?: vector3D;
    _material?: Materials;
    _matrix?: Array<number>
    _datatToRender: InterHelp
    constructor(vect: vector3D, dat: { width: number, depth: number, widthSegments: number, depthSegments: number }, gl: WebGLRenderingContext) {
        this._UUID = generateUUID();
        this._dat = dat
        this._gl = gl
        this._scale = { x: 1, y: 1, z: 1 }
        this._vector = vect
        this._rotationInDeg = { x: 0, y: 0, z: 0 }
        this._matrix4D = new Matrix4D();
        this._material = new Materials(this._gl, { texture: cobble, normal: false })
        this._matrix = this._matrix4D.generateMatrix()
        this._datatToRender = this.createPlaneVertices()
        console.log(this._datatToRender)
    }
    scaleMe(vect: vector3D): void {
        throw new Error("Method not implemented.");
    }
    addToPosition(vect: vector3D): void {
        throw new Error("Method not implemented.");
    }
    addToRotation(vect: vector3D): void {
        throw new Error("Method not implemented.");
    }
    setNewCoordinate(vect: vector3D): void {
        throw new Error("Method not implemented.");
    }
    setNewRotations(vect: vector3D): void {
        throw new Error("Method not implemented.");
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
        const projectionMatrixA = _prg.returnUniform(this._gl, prg, 'uProjectionMatrix')
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
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._datatToRender.position), this._gl.STATIC_DRAW);
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
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._datatToRender.indices), this._gl.STATIC_DRAW);


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
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._datatToRender.texcoord),
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
            const vertexCount = this._datatToRender.indices.length
            const type = this._gl.UNSIGNED_SHORT;
            const offset = 0;
            this._gl.drawElements(this._gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    renderMe(prg: WebGLProgram) {

        // Setup a ui.
    }
    createPlaneVertices() {
        this._dat.width = this._dat.width || 1;
        this._dat.depth = this._dat.depth || 1;
        this._dat.widthSegments = this._dat.widthSegments || 1;
        this._dat.depthSegments = this._dat.depthSegments || 1;

        const numVertices = (this._dat.widthSegments + 1) * (this._dat.depthSegments + 1);
        const positions = this.createAugmentedTypedArray(3, numVertices);
        const normals = this.createAugmentedTypedArray(3, numVertices);
        const texcoords = this.createAugmentedTypedArray(2, numVertices);

        for (let z = 0; z <= this._dat.depthSegments; z++) {
            for (let x = 0; x <= this._dat.widthSegments; x++) {
                const u = x / this._dat.widthSegments;
                const v = z / this._dat.depthSegments;
                positions.push(
                    this._dat.width * u - this._dat.width * 0.5,
                    0,
                    this._dat.depth * v - this._dat.depth * 0.5);
                normals.push(0, 1, 0);
                texcoords.push(u, v);
            }
        }

        const numVertsAcross = this._dat.widthSegments + 1;
        const indices = this.createAugmentedTypedArray(
            3, this._dat.widthSegments * this._dat.depthSegments * 2, Uint16Array);

        for (let z = 0; z < this._dat.depthSegments; z++) {
            for (let x = 0; x < this._dat.widthSegments; x++) {
                // Make triangle 1 of quad.
                indices.push(
                    (z + 0) * numVertsAcross + x,
                    (z + 1) * numVertsAcross + x,
                    (z + 0) * numVertsAcross + x + 1);

                // Make triangle 2 of quad.
                indices.push(
                    (z + 1) * numVertsAcross + x,
                    (z + 1) * numVertsAcross + x + 1,
                    (z + 0) * numVertsAcross + x + 1);
            }
        }

        const arrays = this.reorientVertices(positions, normals, texcoords, indices);
        return arrays;
    }
    reorientVertices(position: Array<number>, normal: Array<number>, texcoord: Array<number>, indices: Array<number>) {
        let arrays: InterHelp = {
            position: position,
            normal: normal,
            texcoord: texcoord,
            indices: indices
        }

        Object.keys(arrays).forEach((name) => {
            const array = (arrays as any)[name];
            if (name.indexOf('pos') >= 0) {
                this.reorientPositions(array);
            } else if (name.indexOf('norm') >= 0) {
                this.reorientNormals(array);
            }
        });
        return arrays;
    }

    reorientPositions(array: Array<number>) {
        this.applyFuncToV3Array(array, this._matrix, this.transformPoint);
        return array;
    }

    reorientNormals(array: Array<number>) {
        this.applyFuncToV3Array(array, this._matrix4D.inverse(this._matrix), this.transformNormal);
        return array;
    }

    applyFuncToV3Array(array: Array<number>, matrix: Array<number>, fn: any) {
        const len = array.length;
        const tmp = new Float32Array(3);
        for (let ii = 0; ii < len; ii += 3) {
            fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
            array[ii] = tmp[0];
            array[ii + 1] = tmp[1];
            array[ii + 2] = tmp[2];
        }
    }

    transformNormal(mi: Array<number>, v: Array<number>, dst: Float32Array) {
        dst = dst || new Float32Array(3);
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];

        dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
        dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
        dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];

        return dst;
    }
    transformPoint(m: Array<number>, v: Array<number>, dst: Float32Array) {
        dst = dst || new Float32Array(3);
        var v0 = v[0];
        var v1 = v[1];
        var v2 = v[2];
        var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];

        dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
        dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
        dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;

        return dst;
    }
    createAugmentedTypedArray(numComponents: number, numElements: number, opt_type?: any) {
        const Type = opt_type || Float32Array;
        return this.augmentTypedArray(new Type(numComponents * numElements), numComponents);
    }
    augmentTypedArray(typedArray: any, numComponents: number) {
        let cursor = 0;
        typedArray.push = function () {
            for (let ii = 0; ii < arguments.length; ++ii) {
                const value = arguments[ii];
                if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
                    for (let jj = 0; jj < value.length; ++jj) {
                        typedArray[cursor++] = value[jj];
                    }
                } else {
                    typedArray[cursor++] = value;
                }
            }
        };
        typedArray.reset = function (opt_index: any) {
            cursor = opt_index || 0;
        };
        typedArray.numComponents = numComponents;
        Object.defineProperty(typedArray, 'numElements', {
            get: function () {
                return this.length / this.numComponents | 0;
            },
        });
        console.warn(typedArray)
        return typedArray;
    }
}
interface InterHelp {
    position: Array<number>,
    normal: Array<number>,
    texcoord: Array<number>,
    indices: Array<number>
}