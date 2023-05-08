// import FirstPersonCamera from "../components/cameras/FirstPersonCamera";
import FreeMoveCamera from "../cameras/FPSCamera";
import Materials from "../Materials";
import {Engine} from "../../Engine";
import {mat4, vec3, vec4} from "../../math/gl-matrix";
import {extendedFloat32Array} from "../../addons/interfaces/AdditionalInterface";
import {programArray, WebGlWProgram} from "../../addons/interfaces/WebglExtender";
import Matrix4D from "../../addons/Matrix4D";
import Camera from "../cameras/Camera";
import {degToRad} from "../../math/gl-matrix/common";
import brick from "../../../textures/brick.jpg";
import Light from "../lights/Light";

let texture: WebGLTexture;
const textureDebug = false
let logOnce = true;

function getRandom() {
    return Math.floor(Math.random() * 1000);
}

export class Figure {
    public _UUID: string;
    public _gl: WebGlWProgram;
    public _material?: Materials;
    public _type?: string

    public _vector?: vec3;
    public _scale?: vec3;
    public _rotationInDeg?: vec3;
    public _matrix4D?: Matrix4D
    public _worldMatrix?: mat4

    public _positions?: Float32Array
    public _indices?: Uint16Array
    public _baseIndices?: Uint16Array
    public _textureCoordinates?: Float32Array
    public _normals?: Float32Array
    public _faceColors?: Uint8Array
    public _faceC?: extendedFloat32Array

    public _angles: number;
    public _trianglesPerSide: number;
    public _viewMatrix?: Array<number>
    _prg: programArray
    prg: WebGLProgram
    _height: number

    public boxBounding: { min: vec3, max: vec3, scale: vec3 }
    public generatedBoxBounding: boolean = false
    _changeMaterial: boolean
    _changePosition: boolean
    public _positionBuffer: WebGLBuffer;
    public _colorBuffer: WebGLBuffer;
    public _textureCoordBuffer: WebGLBuffer;
    public _indexBuffer: WebGLBuffer;
    public _normalsBuffer: WebGLBuffer;
    public _bindedVertex: boolean;
    public _camera: Camera
    public _visible: boolean;
    private mv: Float32Array;

    constructor(vector?: vec3, scale?: vec3, rotation?: vec3) {
        this._UUID = generateUUID()
        this._vector = vector || vec3.fromValues(0, 0, 0)
        this._scale = scale || vec3.fromValues(1, 1, 1)
        this._rotationInDeg = rotation || vec3.fromValues(0, 0, 0)

        // this.setVector(vector || { x: 0, y: 0, z: 0 })
        // this.setScale(scale || { x: 1, y: 1, z: 1 })
        // this.setRotations(rotation || { x: 0, y: 0, z: 0 })
        this._baseIndices = null
        this._bindedVertex = false
        // new Materials().loadTexture(brick, false).then((text: WebGLTexture) => texture = text)

        this.updateMatrix()

    }

    initBuffer(): void {
        this._positionBuffer = Engine._gl.gl.createBuffer()
        this._indexBuffer = Engine._gl.gl.createBuffer();
        this._colorBuffer = Engine._gl.gl.createBuffer();
        this._textureCoordBuffer = Engine._gl.gl.createBuffer();
        this._normalsBuffer = Engine._gl.gl.createBuffer();


        Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        Engine._gl.gl.bufferData(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indices, Engine._gl.gl.STATIC_DRAW);

        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
        Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, this._positions, Engine._gl.gl.STATIC_DRAW);

        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._colorBuffer);

        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._textureCoordBuffer);
        Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, this._textureCoordinates, Engine._gl.gl.STATIC_DRAW);


        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._normalsBuffer);
        Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, this._normals, Engine._gl.gl.STATIC_DRAW);


        this._faceC = this.createAugmentedTypedArray(4, 0 || this._indices.length, Uint8Array)
        this.calculateBoundingBox()

    }

    targetTo(_camera: Camera) {
        if (this._type !== "plane") {
            this._worldMatrix = mat4.targetTo(this._worldMatrix, this._vector, _camera._vector, vec3.fromValues(0.0, 1.0, 0.0))
            this._worldMatrix = mat4.scale(this._worldMatrix, this._worldMatrix, this._scale)
        }
    }

    assignCamera(_camera: Camera): void {

        let mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, _camera._viewProjection, this._worldMatrix)

        if (this._type == "particle") {
            this.targetTo(_camera)
            Engine._gl.gl.enable(Engine._gl.gl.BLEND);
            Engine._gl.gl.blendFunc(Engine._gl.gl.SRC_ALPHA, Engine._gl.gl.ONE_MINUS_SRC_ALPHA);
            Engine._gl.gl.depthMask(false);
        } else {
            Engine._gl.gl.disable(Engine._gl.gl.BLEND);
            Engine._gl.gl.depthMask(true);
        }
        let mv: Float32Array = mat4.convertToFloat(mvMatrix)
        Engine._gl.gl.bindFramebuffer(Engine._gl.gl.FRAMEBUFFER, null)

        this._camera = _camera
        this.mv = mv

    }

    draw() {
        {

            const vertexCount = this._indices.length
            const type = Engine._gl.gl.UNSIGNED_SHORT;
            const offset = 0;
            if (this._material._wireframe) Engine._gl.gl.drawElements(Engine._gl.gl.LINE_LOOP, vertexCount, type, offset);
            else Engine._gl.gl.drawElements(Engine._gl.gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    renderShadows(light: Light) {
        // Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.color._uniforms.uLightMatrix, false, light._viewProjection, 0, light._viewProjection.length);
        //
        //
        // Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        // Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
        // Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.color._attrib.aVertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
        // // if (this._type != "particle") Engine._gl.gl.vertexAttribPointer(vertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
        // // else if (this._type == "particle") Engine._gl.gl.vertexAttribPointer(vertexPosition, 2, Engine._gl.gl.FLOAT, true, 0, 0);
        // Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.color._attrib.aVertexPosition);
        // // this.constructColorArray()
    }

    public drawColor(item: Figure) {

        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.color._uniforms.uModelViewMatrix, false, this.mv, 0, this.mv.length);


        Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
        Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.color._attrib.aVertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
        // if (this._type != "particle") Engine._gl.gl.vertexAttribPointer(vertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
        // else if (this._type == "particle") Engine._gl.gl.vertexAttribPointer(vertexPosition, 2, Engine._gl.gl.FLOAT, true, 0, 0);
        Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.color._attrib.aVertexPosition);

        // TODO Change On update by render
        if (!this._material._createdFaceColors) {
            this.constructColorArray()
            this._material._createdFaceColors = true
            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._colorBuffer);
            Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, this._material._faceColors, Engine._gl.gl.STATIC_DRAW);
        }
        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._colorBuffer);
        // Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, new Float32Array(this._material._faceColors), Engine._gl.gl.STATIC_DRAW);
        Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.color._attrib.aVertexColor, 4, Engine._gl.gl.UNSIGNED_BYTE, false, 0, 0);
        Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.color._attrib.aVertexColor);
        // this.constructColorArray()
        this.draw()
    }

    public drawTexture(mv: string) {

        {
            Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.texture._uniforms.uModelViewMatrix, false, this.mv, 0, this.mv.length);


            Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
            Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.texture._attrib.aVertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
            // if (this._type != "particle") Engine._gl.gl.vertexAttribPointer(vertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
            // else if (this._type == "particle") Engine._gl.gl.vertexAttribPointer(vertexPosition, 2, Engine._gl.gl.FLOAT, true, 0, 0);
            Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.texture._attrib.aVertexPosition);
        }

        if (true || !this._material._wireframe) {
            Engine._gl.gl.bindTexture(Engine._gl.gl.TEXTURE_2D, this._material._texture);

            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._textureCoordBuffer);

            Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.texture._attrib.aTextureCoord, 2, Engine._gl.gl.FLOAT, true, 0, 0);
            Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.texture._attrib.aTextureCoord);

            // Tell WebGL we want to affect texture unit 0
            Engine._gl.gl.activeTexture(Engine._gl.gl.TEXTURE1);

            // Bind the texture to texture unit 0
            Engine._gl.gl.bindTexture(Engine._gl.gl.TEXTURE_2D, this._material._texture);
            // Tell the shader we bound the texture to texture unit 0
            Engine._gl.gl.uniform1i(Engine._gl.shaders.texture._uniforms._uSampler, 0);
        }
        this.draw()
    }

    normalize(v: vec3) {
        let dst = vec3.create()
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
        }
        return dst;
    }

    public drawColorLights(item: string, b: boolean) {
        // if( item == undefined || item != this._type )
       if(b){

            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
            Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

            Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.colorLights._attrib.aVertexPosition, 3, Engine._gl.gl.FLOAT, false, 0, 0);
            Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.colorLights._attrib.aVertexPosition);


            Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.colorLights._attrib.aNormals, 3, Engine._gl.gl.FLOAT, false, 0, 0);
            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._normalsBuffer);
            Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.colorLights._attrib.aNormals)


        }
        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.colorLights._uniforms.uModelViewMatrix, false, this.mv, 0, this.mv.length);
        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.colorLights._uniforms.uWorldMatrix, false, this._worldMatrix);
        Engine._gl.gl.uniform3fv(Engine._gl.shaders.colorLights._uniforms.uViewWorldPosition, [this._camera._vector[0], this._camera._vector[1], this._camera._vector[2]]);
        Engine._gl.gl.uniform3fv(Engine._gl.shaders.colorLights._uniforms.uPosition, this._vector);

        if (!this._material._createdFaceColors) {
            this.constructColorArray()
            this._material._createdFaceColors = true
            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._colorBuffer);
            Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, this._material._faceColors, Engine._gl.gl.STATIC_DRAW);
        }

        // // Set the color to use
        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._colorBuffer);
        // Engine._gl.gl.bufferData(Engine._gl.gl.ARRAY_BUFFER, new Float32Array(this._material._faceColors), Engine._gl.gl.STATIC_DRAW);
        Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.colorLights._attrib.aVertexColor, 4, Engine._gl.gl.UNSIGNED_BYTE, false, 0, 0);
        Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.colorLights._attrib.aVertexColor);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, this._worldMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.colorLights._uniforms.uNormalMatrix, true, normalMatrix);


        this.draw()

        // this.constructColorArray()
    }

    public drawTextureLights(str: string, b: boolean) {

       if(b) {

            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
            Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

            Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.textureLights._attrib.aVertexPosition, 3, Engine._gl.gl.FLOAT, false, 0, 0);
            Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.textureLights._attrib.aVertexPosition);


            Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.textureLights._attrib.aNormals, 3, Engine._gl.gl.FLOAT, false, 0, 0);
            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._normalsBuffer);
            Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.textureLights._attrib.aNormals)


        }
        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.textureLights._uniforms.uModelViewMatrix, false, this.mv, 0, this.mv.length);
        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.textureLights._uniforms.uWorldMatrix, false, this._worldMatrix);
        Engine._gl.gl.uniform3fv(Engine._gl.shaders.textureLights._uniforms.uViewWorldPosition, [this._camera._vector[0], this._camera._vector[1], this._camera._vector[2]]);
        Engine._gl.gl.uniform3fv(Engine._gl.shaders.textureLights._uniforms.uPosition, this._vector);

        if (true || !this._material._wireframe) {


            Engine._gl.gl.bindTexture(Engine._gl.gl.TEXTURE_2D, this._material._texture);

            Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._textureCoordBuffer);

            Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.textureLights._attrib.aTextureCoord, 2, Engine._gl.gl.FLOAT, false, 0, 0);
            Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.textureLights._attrib.aTextureCoord);

            // Tell WebGL we want to affect texture unit 0
            Engine._gl.gl.activeTexture(Engine._gl.gl.TEXTURE0);

            // Bind the texture to texture unit 0
            Engine._gl.gl.bindTexture(Engine._gl.gl.TEXTURE_2D, this._material._texture);
            // Tell the shader we bound the texture to texture unit 0
            Engine._gl.gl.uniform1i(Engine._gl.shaders.textureLights._uniforms.uSampler, 0);


            const normalMatrix = mat4.create();
            mat4.invert(normalMatrix, this._worldMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.textureLights._uniforms.uNormalMatrix, true, normalMatrix);

        }
        this.draw()
    }

    public drawColorLightsTest(mv: Float32Array) {
        if (logOnce) console.log('Engine._gl.gl', Engine._gl.shaders.test._uniforms.uModelViewMatrix)
        logOnce = false;
        let gl = Engine._gl.gl

        Engine._gl.gl.bindBuffer(Engine._gl.gl.ARRAY_BUFFER, this._positionBuffer);
        Engine._gl.gl.bindBuffer(Engine._gl.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);


        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.test._uniforms.u_world, false, this._worldMatrix);
        Engine._gl.gl.uniformMatrix4fv(Engine._gl.shaders.test._uniforms.uModelViewMatrix, false, mv, 0, mv.length);


        Engine._gl.gl.vertexAttribPointer(Engine._gl.shaders.test._attrib.aVertexPosition, 3, Engine._gl.gl.FLOAT, true, 0, 0);
        Engine._gl.gl.enableVertexAttribArray(Engine._gl.shaders.test._attrib.aVertexPosition);


        let colors = [[1, 0.4, 0, 0.2], [0, 0.1, 1, 0.7]]
        for (let i = 0; i < colors.length; i++) {
            gl.uniform4fv(Engine._gl.shaders.test._uniforms.colorArray[i], colors[i]);

        }


        // Tell WebGL we want to affect texture unit 0
        Engine._gl.gl.activeTexture(Engine._gl.gl.TEXTURE1);
        Engine._gl.gl.uniform1i(Engine._gl.shaders.test._uniforms._uSampler, 0);

        // this.constructColorArray()
    }

    public updateMatrix(): void {
        let modelMatrix = mat4.create()

        modelMatrix = mat4.translate(modelMatrix, modelMatrix, this._vector)
        modelMatrix = mat4.scale(modelMatrix, modelMatrix, this._scale)
        modelMatrix = mat4.rotateX(modelMatrix, modelMatrix, this._rotationInDeg[0])
        modelMatrix = mat4.rotateY(modelMatrix, modelMatrix, this._rotationInDeg[1])
        modelMatrix = mat4.rotateY(modelMatrix, modelMatrix, this._rotationInDeg[2])
        this._worldMatrix = modelMatrix
    }

    public updateTransaltionMatrix(vec: vec3): void {
        this._worldMatrix = mat4.translate(this._worldMatrix, this._worldMatrix, vec)
        let v = vec3.transformMat4(vec3.create(), vec3.create(), this._worldMatrix)
        this._vector = v
        this.calculateBoundingBox()

    }

    public updateScaleMatrix(): void {
        this._worldMatrix = mat4.translate(this._worldMatrix, this._worldMatrix, this._scale)
        this.calculateBoundingBox()

    }

    public updateRotationMatrix(): void {
        this._worldMatrix = mat4.rotateY(this._worldMatrix, this._worldMatrix, this._rotationInDeg[1])

        this._worldMatrix = mat4.rotateX(this._worldMatrix, this._worldMatrix, this._rotationInDeg[0])
        this._worldMatrix = mat4.rotateZ(this._worldMatrix, this._worldMatrix, this._rotationInDeg[2])
        this.calculateBoundingBox()

    }

    rotateX(angle: number) {
        this._rotationInDeg[0] = angle
        this.updateRotationMatrix()
    }

    rotateY(angle: number) {
        this._rotationInDeg[1] = angle
        this.updateRotationMatrix()
    }

    rotateZ(angle: number) {
        this._rotationInDeg[2] = angle
        this.updateRotationMatrix()
    }

    rotate(x: number, y: number, z: number) {
        vec3.rotateX(this._rotationInDeg, this._rotationInDeg, this._vector, x)
        vec3.rotateY(this._rotationInDeg, this._rotationInDeg, this._vector, y)
        vec3.rotateZ(this._rotationInDeg, this._rotationInDeg, this._vector, z)
        this.updateRotationMatrix()
    }

    translateX(x: number) {
        this.updateTransaltionMatrix(vec3.fromValues(x, 0, 0))
    }

    translateY(y: number) {
        this.updateTransaltionMatrix(vec3.fromValues(0, y, 0))
        // this.updateTransactionMatrix()
    }

    translateZ(z: number) {
        this.updateTransaltionMatrix(vec3.fromValues(0, 0, z))
        // this.updateTranslationMatrix()
    }

    translate(x: number, y: number, z: number) {
        this.updateTransaltionMatrix(vec3.fromValues(x, y, z))

    }

    scaleX(x: number) {
        vec3.add(this._scale, this._scale, vec3.fromValues(x, 0, 0))
        this.updateScaleMatrix()
    }

    scaleY(y: number) {
        vec3.add(this._scale, this._scale, vec3.fromValues(0, y, 0))
        this.updateScaleMatrix()
    }

    scaleZ(z: number) {
        vec3.add(this._scale, this._scale, vec3.fromValues(0, 0, z))
        this.updateScaleMatrix()
    }

    scale(x: number, y: number, z: number) {
        vec3.add(this._scale, this._scale, vec3.fromValues(x, y, z))
        this.updateScaleMatrix()
    }

    calculateBoundingBox(vec?: vec3) {
        // Initialize min and max vectors with high and low values

        if (!this.generatedBoxBounding) {
            let min: vec3 = vec3.fromValues(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            let max: vec3 = vec3.fromValues(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

            this.generatedBoxBounding = true
            for (let i = 0; i < this._positions.length; i += 3) {
                let p = vec3.fromValues(this._positions[i], this._positions[i + 1], this._positions[i + 2])
                vec3.multiply(p, p, this._scale);
                vec3.add(p, p, this._vector);
                // vec3.rotateX(p, p, this._vector, this._rotationInDeg[0]);
                min[0] = Math.min(min[0], p[0]);
                min[1] = Math.min(min[1], p[1]);
                min[2] = Math.min(min[2], p[2]);

                max[0] = Math.max(max[0], p[0]);
                max[1] = Math.max(max[1], p[1]);
                max[2] = Math.max(max[2], p[2]);
            }
            let scale = vec3.fromValues(Math.abs(min[0] - max[0]) / 2, Math.abs(max[1] - min[1]) / 2, Math.abs(max[2] - min[2]) / 2)
            this.boxBounding = {min: min, max: max, scale: scale};
        } else {

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
                            for (let i = 0; i < this._angles * 2; i++) this._faceC.push(item)

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

                for (let i = 0; i < 4; i++) {
                    createdColorToIndices++
                    this._faceC.push(itm)
                }

            })
            //     console.log(newColorArray)
            if (createdColorToIndices < this._indices.length) {
                let color = (this._material._color as Array<Array<number>>)[this._material._color.length - 1] as Array<number>
                color[3] = color[3]
                if (color[3] == undefined) color[3] = this._material._alpha

                for (let i = createdColorToIndices; i < this._indices.length; i++) this._faceC.push(color)

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
    vector?: Vector3D,
    scale?: Vector3D,
    rotation?: Vector3D
}

export interface Vector3D {
    x?: number,
    y?: number,
    z?: number,
    width?: number
}