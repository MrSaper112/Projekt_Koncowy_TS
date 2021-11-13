import { depth } from "../addons/config";
import { PositionManager, vector3D } from "../addons/positionManager";

export default class MeshPlane extends PositionManager {
    public _positionFloat32Array3: Float32Array;
    public _positionFloat32Array: Float32Array;
    private _position: vector3D;
    public _testColor: Uint8Array;
    public rotation: vector3D;
    private _gl: WebGLRenderingContext;
    private _matrix: number[];

    constructor(dat: { width: number, height: number, widthSegments: number, heightSegments: number }, gl: WebGLRenderingContext) {
        super()
        this._gl = gl
        var left = 0;
        var right = gl.canvas.clientWidth;
        var bottom = gl.canvas.clientHeight;
        var top = 0;
        var near = 400;
        var far = -1000;
        this._matrix = this.orthographic(left, right, bottom, top, near, far);
        if (dat.width !== undefined && dat.height !== undefined) {
            console.log(this._position)

            const width_half = dat.width / 2;
            const height_half = dat.height / 2;

            const gridX = Math.floor(dat.widthSegments);
            const gridY = Math.floor(dat.heightSegments);

            const gridX1 = gridX + 1;
            const gridY1 = gridY + 1;

            const segment_width = dat.width / gridX;
            const segment_height = dat.height / gridY;

            //

            const indices = [];
            const vertices = [];
            const normals = [];
            const uvs = [];

            for (let iy = 0; iy < gridY1; iy++) {

                const y = iy * segment_height - height_half;

                for (let ix = 0; ix < gridX1; ix++) {

                    const x = ix * segment_width - width_half;

                    vertices.push(x, - y, 0);

                    normals.push(0, 0, 1);

                    uvs.push(ix / gridX);
                    uvs.push(1 - (iy / gridY));

                }

            }

            for (let iy = 0; iy < gridY; iy++) {
                for (let ix = 0; ix < gridX; ix++) {
                    const a = ix + gridX1 * iy;
                    const b = ix + gridX1 * (iy + 1);
                    const c = (ix + 1) + gridX1 * (iy + 1);
                    const d = (ix + 1) + gridX1 * iy;

                    indices.push(a, b, d);
                    indices.push(b, c, d);

                }

            }


            console.log(indices, vertices)
        }
    }

    renderMe(prg: WebGLProgram) {
        this._gl.useProgram(prg);

        var positionLocation = this._gl.getAttribLocation(prg, "a_position");
        var colorLocation = this._gl.getAttribLocation(prg, "a_color");
        var matrixLocation = this._gl.getUniformLocation(prg, "u_matrix");

        this._gl.enableVertexAttribArray(positionLocation);


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


        //Bind color buffer

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

        this._gl.uniformMatrix4fv(matrixLocation, false, this._matrix);
        // console.log(this._matrix)
        // Draw the geometry.
        var primitiveType = this._gl.TRIANGLES;
        var offset = 0;
        var count = 36;
        this._gl.drawArrays(primitiveType, offset, count);
        // Setup a ui.
    }
}
