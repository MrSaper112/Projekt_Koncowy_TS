import FigureInterface from "../addons/FiguresInterFace";
import Matrix4D from "../addons/Matrix4D";
import { vector3D } from "../addons/positionManager";
import { programArray } from "../addons/webGLutils";
let x = 0
let y = 0
let z = 0
export default class Cube implements FigureInterface{
    public _positions: Array<number>
    public _indices: Array<number>
    public _faceColors: Array<Array<number>>
    public _matrix4D: Matrix4D;
    public _gl: WebGLRenderingContext;
    public _vector: vector3D;
    public _scale: vector3D;
    public _rotationInDeg: vector3D;
    private _buffersOfCubes: { position: WebGLBuffer, color: WebGLBuffer, indices: WebGLBuffer }
    constructor(gl: WebGLRenderingContext, vect: vector3D = { x: 1, y: 1, z: 1 }){
        this._matrix4D = new Matrix4D();
        this._gl = gl
        this._vector = vect
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
        let fun  = () =>{
            return Math.random()
        }
        // let colors = new Array(6).fill(new Array(4).( Math.random()))
    //  console.log(colors)
        this._faceColors = [
            [fun(),fun(),fun(),fun()],
            [fun(),fun(),fun(),fun()],
            [fun(),fun(),fun(),fun()],
            [fun(),fun(),fun(),fun()],
            [fun(),fun(),fun(),fun()],
            [fun(),fun(),fun(),fun()],
            [fun(),fun(),fun(),fun()],
            // [1.0, 0.5, 0.5, 1.0],    // Front face: white
            // [1.0, 0.0, 0.0, 1.0],    // Back face: red
            // [0.0, 1.0, 0.0, 1.0],    // Top face: green
            // [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            // [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            // [1.0, 0.0, 1.0, 1.0],    // Left face: purple
        ];
        this._indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];
        this._buffersOfCubes = this.initAllBuffers()
    }
    updateX(e: number) {
        x = e
    }
    updateZ(e: number) {
        z = e
    }
    updateY(e: number) {
        y =e 
    }
    initAllBuffers(){
        const positionBuffer = this._gl.createBuffer()
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);    
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._positions), this._gl.STATIC_DRAW);

    
        var colors:Array<number> = [];

        for (var j = 0; j < this._faceColors.length; ++j) {
            const c = this._faceColors[j];
            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, colorBuffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(colors), this._gl.STATIC_DRAW);
 
        const indexBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), this._gl.STATIC_DRAW);

    
        return { position: positionBuffer, color: colorBuffer, indices:indexBuffer}
    }
    draw(_prg: programArray){
        const fieldOfView = 60 * Math.PI / 180;   // in radians
        const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 10000.0;
        let proj = this._matrix4D.perspective(fieldOfView, aspect, zNear, zFar)
        let translateMatrice = this._matrix4D.generateMatrix()
        translateMatrice = this._matrix4D.translate(translateMatrice,x,y,z)
        
        let projectionMatrix = this._matrix4D.multiplyMatrices(proj,translateMatrice)


        let modelViewMatrix = this._matrix4D.generateMatrix()
        modelViewMatrix = this._matrix4D.translate(modelViewMatrix, this._vector.x, this._vector.y, this._vector.z)
        modelViewMatrix = this._matrix4D.scale(modelViewMatrix, this._scale.x, this._scale.y, this._scale.z)
        modelViewMatrix = this._matrix4D.xRotate(modelViewMatrix, this._matrix4D.degToRad(this._rotationInDeg.x))
        modelViewMatrix = this._matrix4D.yRotate(modelViewMatrix, this._matrix4D.degToRad(this._rotationInDeg.y))
        modelViewMatrix = this._matrix4D.zRotate(modelViewMatrix, this._matrix4D.degToRad(this._rotationInDeg.z))

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
                _prg.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this._gl.enableVertexAttribArray(
                _prg.attribLocations.vertexPosition);
        }
        {
            var colors: Array<number> = [];

            for (var j = 0; j < this._faceColors.length; ++j) {
                const c = this._faceColors[j];
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
                _prg.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this._gl.enableVertexAttribArray(
                _prg.attribLocations.vertexColor);
        }

        // Tell WebGL which indices to use to index the vertices
        const indexBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), this._gl.STATIC_DRAW);


        // Tell WebGL to use our program when drawing

        this._gl.useProgram(_prg.prg);

        this._gl.uniformMatrix4fv(
            _prg.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        this._gl.uniformMatrix4fv(
            _prg.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const vertexCount = 36;
            const type = this._gl.UNSIGNED_SHORT;
            const offset = 0;
            this._gl.drawElements(this._gl.TRIANGLES, vertexCount, type, offset);
        }
    }
    rotateMe(vect: vector3D) {
        this._rotationInDeg.x = vect.x
        this._rotationInDeg.y = vect.y
        this._rotationInDeg.z = vect.z

    }
    updateRotation(vect: vector3D): void {
        this._rotationInDeg.x += vect.x
        this._rotationInDeg.y += vect.y
        this._rotationInDeg.z += vect.z
    }
    translateMe(vect: vector3D) {
        this._vector.x = vect.x
        this._vector.y = vect.y
        this._vector.z = vect.z
    }
    updateMyPos(vect: vector3D) {
        this._vector.x += vect.x
        this._vector.y += vect.y
        this._vector.z += vect.z
        // this._matrix = this.translate(vect.x, vect.y, vect.z);
    }
    scaleMe(vect: vector3D) {
        // this._matrix = this.scale(this._matrix, vect.x, vect.y, vect.z);
        this._scale.x = vect.x
        this._scale.y = vect.y
        this._scale.z = vect.z
    }
}

