import FigureInterface, { generateUUID } from "../../addons/FiguresInterFace";
import Matrix4D from "../../addons/Matrix4D";
import Materials from "../Materials";
import cobble from '../../textures/cobble.png'
import FirstPersonCamera from "../cameras/FirstPersonCamera";
import { Figure, Vector3D } from "../../addons/Figure";

export default class Plane extends Figure {
    _dat: { width: number, depth: number, widthSegments: number, depthSegments: number }
    constructor(info?: { vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D }, dat?: { width: number, depth: number, widthSegments: number, depthSegments: number }) {
        super(info.vector, info.scale, info.rotation);
        this._type = "plane"

        this._dat = dat
        this._material = Materials.color({ clr: "#ff00ff" });
        let working = this.createPlaneVertices()

        this._positions = working.position
        this._textureCoordinates = working.textureCoordinates
        this._indices = working.indices
        this.initBuffer()

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

        return {
            position: positions,
            normal: normals,
            textureCoordinates: texcoords,
            indices: indices
        };
    }

}
interface InterHelp {
    position: Array<number>,
    normal: Array<number>,
    texcoord: Array<number>,
    indices: Array<number>
}