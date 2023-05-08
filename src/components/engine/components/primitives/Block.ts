import { Figure, Vector3D } from "./Figure";
import { programArray } from "../../addons/interfaces/WebglExtender";
import Materials from "../Materials";

export default class Block extends Figure {
    _subdivisionsAxis: number
    _subdivisionsHeight: number
    _radius: number
    constructor(vector?: vec3, scale?: vec3, rotation?: vec3, material?: Materials) {
        super(vector, scale, rotation);
        this._type = "block"
        this._trianglesPerSide = 2
        this._material = material || Materials.color({ clr: "#ff00ff" });

        let working = this.c2()

        // this._positions = new Float32Array(working.position.flat())
        // this._textureCoordinates = new Float32Array(working.texcoord.flat())
        // this._indices = new Uint16Array(working.indices)
        // // this._normals = new Float32Array(working.normal.flat())

        // this._positions = new Float32Array(working.position)
        // this._textureCoordinates = new Float32Array(working.texcoord)
        // this._indices = new Uint16Array(working.indices)
        // this._normals = new Float32Array(working.normal)
        this._positions = new Float32Array([
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        ]);

        this._indices = new Uint16Array([
            0,
            1,
            2,
            0,
            2,
            3, // front
            4,
            5,
            6,
            4,
            6,
            7, // back
            8,
            9,
            10,
            8,
            10,
            11, // top
            12,
            13,
            14,
            12,
            14,
            15, // bottom
            16,
            17,
            18,
            16,
            18,
            19, // right
            20,
            21,
            22,
            20,
            22,
            23, // left
        ]);
        this._textureCoordinates = new Float32Array([
            // Front
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Back
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Top
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Bottom
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Right
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            // Left
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        ]);
        this._normals = new Float32Array([
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

            // Back
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

            // Top
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

            // Bottom
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

            // Right
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0])
        this.initBuffer()
    }
    c2() {
        const k = 1;
        const CUBE_FACE_INDICES = [
            [3, 7, 5, 1], // right
            [6, 2, 0, 4], // left
            [6, 7, 3, 2], // ??
            [0, 1, 5, 4], // ??
            [7, 6, 4, 5], // front
            [2, 3, 1, 0], // back
        ];
        const cornerVertices = [
            [-k, -k, -k],
            [+k, -k, -k],
            [-k, +k, -k],
            [+k, +k, -k],
            [-k, -k, +k],
            [+k, -k, +k],
            [-k, +k, +k],
            [+k, +k, +k],
        ];

        const faceNormals = [
            [+1, +0, +0],
            [-1, +0, +0],
            [+0, +1, +0],
            [+0, -1, +0],
            [+0, +0, +1],
            [+0, +0, -1],
        ];

        const uvCoords = [
            [1, 0],
            [0, 0],
            [0, 1],
            [1, 1],
        ];

        const numVertices = 6 * 4;
        const positions = []
        const normals = []
        const texCoords = []
        const indices = []

        for (let f = 0; f < 6; ++f) {
            const faceIndices = CUBE_FACE_INDICES[f];
            for (let v = 0; v < 4; ++v) {
                const position = cornerVertices[faceIndices[v]];
                const normal = faceNormals[f];
                const uv = uvCoords[v];

                // Each face needs all four vertices because the normals and texture
                // coordinates are not all the same.
                positions.push(position);
                normals.push(normal);
                texCoords.push(uv);

            }
            // Two triangles make a square face.
            const offset = 4 * f;
            indices.push(offset + 0, offset + 1, offset + 2);
            indices.push(offset + 0, offset + 2, offset + 3);
        }

        return {
            position: positions,
            normal: normals,
            texcoord: texCoords,
            indices: indices,
        };
    }
    createVertices() {
        let width = 1;
        let height = 1;
        let depth = 1;

        let CUBE_FACE_INDICES_ = [
            [3, 7, 5, 1], // right
            [6, 2, 0, 4], // left
            [6, 7, 3, 2], // top?
            [0, 1, 5, 4], // bottom?
            [7, 6, 4, 5], // front
            [2, 3, 1, 0]  // back
        ];

        let cornerVertices = [
            [-width, -height, -depth],
            [+width, -height, -depth],
            [-width, +height, -depth],
            [+width, +height, -depth],
            [-width, -height, +depth],
            [+width, -height, +depth],
            [-width, +height, +depth],
            [+width, +height, +depth]
        ];

        let faceNormals = [
            [+1, +0, +0],
            [-1, +0, +0],
            [+0, +1, +0],
            [+0, -1, +0],
            [+0, +0, +1],
            [+0, +0, -1]
        ];

        let uvCoords = [
            [1, 0],
            [0, 0],
            [0, 1],
            [1, 1]
        ];

        // let numVertices = 6 * 4;
        let positions = [];
        let normals = [];
        let texCoords = [];
        let indices = [];

        for (let f = 0; f < 6; ++f) {
            let faceIndices = CUBE_FACE_INDICES_[f];
            for (let v = 0; v < 4; ++v) {
                let position = cornerVertices[faceIndices[v]];
                let normal = faceNormals[f];
                let uv = uvCoords[v];
                // Each face needs all four vertices because the normals and texture
                // coordinates are not all the same.
                positions.push(position);
                normals.push(normal);
                texCoords.push(uv);

            }
            // Two triangles make a square face.
            let offset = 4 * f;
            indices.push([offset + 0, offset + 1, offset + 2]);
            indices.push([offset + 0, offset + 2, offset + 3]);
        }
        positions = [].concat.apply([], positions);
        normals = [].concat.apply([], normals);
        texCoords = [].concat.apply([], texCoords);
        indices = [].concat.apply([], indices);

        return {
            position: positions.flat(),
            normal: normals.flat(),
            texcoord: texCoords.flat(),
            indices: indices.flat(),
        };
    }
}
