import { depth } from "../addons/config";
import { PositionManager, vector3D } from "../addons/positionManager";

export default class Square extends PositionManager {
    public _positionFloat32Array3: Float32Array;
    public _positionFloat32Array: Float32Array;
    private _position: vector3D;
    public _testColor: Uint8Array;
    public rotation: vector3D;
    private _gl: WebGLRenderingContext;
    private _matrix: number[];
    private _projectMatrix: number[];
    private _rotation: vector3D;
    private _scale: vector3D;
    private _fudge: number;
    private _cubeVertexPositions: Float32Array;
    private _cubeVertexNormals: Float32Array;
    private _cubeVertexTexcoords: Float32Array;
    private _cubeVertexIndices: Uint16Array;
    constructor(position: vector3D, gl: WebGLRenderingContext) {
        super()
        this._rotation = { x: 0, y: 0, z: 0 }
        this._scale = { x: 0, y: 0, z: 0 }
        this._fudge = -1
        this._gl = gl

        if (position.x !== null && position.y !== null && position.z !== null) {
            this._position = position
            let [x, y, z, width] = [this._position.x, this._position.y, this._position.z, this._position.width]
            this._positionFloat32Array = new Float32Array([
                // left column
                x, y, z,
                x, y + width, z,
                x + width, y, z,
                x, y + width, z,
                x + width, y + width, z,
                x + width, y, z,

                //back
                x, y, z + width,
                x, y + width, z + width,
                x + width, y, z + width,
                x, y + width, z + width,
                x + width, y + width, z + width,
                x + width, y, z + width,

                //Left 
                x, y, z,
                x, y + width, z,
                x, y, z + width,
                x, y, z + width,
                x, y + width, z,
                x, y + width, z + width,

                //Right
                x + width, y, z,
                x + width, y + width, z,
                x + width, y, z + width,
                x + width, y, z + width,
                x + width, y + width, z,
                x + width, y + width, z + width,

                //Top 
                x, y, z,
                x, y, z + width,
                x + width, y, z,

                x, y, z + width,
                x + width, y, z + width,
                x + width, y, z,

                //Bottom
                x, y + width, z,
                x, y + width, z + width,
                x + width, y + width, z,

                x, y + width, z + width,
                x + width, y + width, z + width,
                x + width, y + width, z,


                // 0, 150, 0,
                // 30, 0, 0,
                // 30, 150, 0,



            ])
            // vertex positions for a cube
            this._cubeVertexPositions = new Float32Array([
                1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,
            ]);
            // vertex normals for a cube
            this._cubeVertexNormals = new Float32Array([
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            ]);
            // vertex texture coordinates for a cube
            this._cubeVertexTexcoords = new Float32Array([
                1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
            ]);
            // vertex indices for the triangles of a cube
            // the data above defines 24 vertices. We need to draw 12
            // triangles, 2 for each size, each triangle needs
            // 3 vertices so 12 * 3 = 36
            this._cubeVertexIndices = new Uint16Array([
                0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
            ]);

            this._testColor = new Uint8Array([
                // left column front
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,

                // top rung front


                // left column back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,


                // top
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,

                // top rung right
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,

                // under top rung
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,

                // between top rung and middle
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,

                // top of middle rung
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,

                // right of middle rung
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,

                // bottom of middle rung.
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,

                // right of bottom
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,

                // bottom
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,

                // left side
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220])
        }
    }
    rotateMe(vect: vector3D) {
        this._rotation.x += vect.x
        this._rotation.y += vect.y
        this._rotation.z += vect.z

    }
    translateMe(vect: vector3D) {
        this._position.x += vect.x
        this._position.y += vect.y
        this._position.z += vect.z
        // this._matrix = this.translate(vect.x, vect.y, vect.z);
    }
    scaleMe(vect: vector3D) {
        // this._matrix = this.scale(this._matrix, vect.x, vect.y, vect.z);
        this._scale.x = vect.x
        this._scale.y = vect.y
        this._scale.z = vect.z
    }
    fudge(f: number) {
        this._fudge += f
    }

    renderMe(prg: WebGLProgram, uMatrix: Array<number>) {
        // this._matrix = this.makeZToWMatrix(this._fudge);
        // this._matrix = this.multiply(this._matrix, this.perspective(50, this._gl.canvas.clientWidth / this._gl.canvas.clientHeight, 1e-4, 1e4));
        // this._matrix = this.translate(this._matrix, this._position.x, this._position.y, this._position.z);
        // this._matrix = this.xRotate(this._matrix, this._rotation.x);
        // this._matrix = this.yRotate(this._matrix, this._rotation.y);
        // this._matrix = this.zRotate(this._matrix, this._rotation.z);
        // this._matrix = this.scale(this._matrix, this._scale.x, this._scale.y, this._scale.z);

        // this._matrix = this.projection(this._gl.canvas.clientWidth, this._gl.canvas.clientHeight, 4000);

        this._projectMatrix = this.perspective(80, this._gl.canvas.clientWidth / this._gl.canvas.clientHeight, 1e-4, 1e4)
        // this._matrix = this.orthographic(0, 0, 0, 0, 0, 0)
        this._matrix = this.createMatrix()
        this._matrix = this.translate(this._matrix, this._position.x, this._position.y, this._position.z);
        this._matrix = this.xRotate(this._matrix, this._rotation.x);
        this._matrix = this.yRotate(this._matrix, this._rotation.y);
        this._matrix = this.zRotate(this._matrix, this._rotation.z);
        this._matrix = this.scale(this._matrix, this._scale.x, this._scale.y, this._scale.z);

        this._gl.useProgram(prg);

        var positionLocation = this._gl.getAttribLocation(prg, "a_position");
        var colorLocation = this._gl.getAttribLocation(prg, "a_color");
        var matrixLocation = this._gl.getUniformLocation(prg, "u_matrix");

        this._gl.enableVertexAttribArray(positionLocation);

        const mvMatrix = this.multiply(uMatrix, this._matrix)
        const finalMatrix = this.multiply(this._projectMatrix, mvMatrix)
        const test = this.multiply(this._projectMatrix, this._matrix)
        // console.log(finalMatrix)
        //Bind Position
        var positionBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._positionFloat32Array, this._gl.STATIC_DRAW);


        var size = 3;          // 3 components per iteration
        var type = this._gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this._gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);


        // Turn on the color attribute
        this._gl.enableVertexAttribArray(colorLocation);

        // Bind the color buffer
        var colorBuffer = this._gl.createBuffer();

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, colorBuffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._testColor, this._gl.STATIC_DRAW);

        // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        var size = 3;                 // 3 components per iteration
        var type = this._gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        this._gl.vertexAttribPointer(
            colorLocation, size, type, normalize, stride, offset);

        this._gl.uniformMatrix4fv(matrixLocation, false, mvMatrix);
        // Draw the geometry.
        var primitiveType = this._gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        this._gl.drawArrays(primitiveType, offset, count);
        // Setup a ui.
    }
}
