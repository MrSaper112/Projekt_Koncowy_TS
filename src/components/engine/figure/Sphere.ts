import { Figure, Vector3D } from "../addons/Figure";
import Materials from "./Materials";
import cobble from '../../textures/cobble.png'

export default class Sphere extends Figure {
    _subdivisionsAxis: number
    _subdivisionsHeight: number
    _radius: number
    constructor(gl: WebGLRenderingContext, build: {
        radius: number, subdivisionsAxis: number, subdivisionsHeight: number
    }, vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D, material?: Materials) {
        super(gl, vector, scale, rotation);
        this._material = material || new Materials(gl, { texture: cobble, normal: false })
        this._subdivisionsAxis = build.subdivisionsAxis
        this._subdivisionsHeight = build.subdivisionsHeight
        this._radius = build.radius
        this._type = "sphere"
        let working = this.createSphereVertices()
        this._positions = working.position
        this._textureCoordinates = working.textureCoordinates
        this._indices = working.indices
    }
    createSphereVertices() {
        if (this._subdivisionsAxis <= 0 || this._subdivisionsHeight <= 0) {
            throw Error('subdivisionAxis and subdivisionHeight must be > 0');
        }

        let opt_startLatitudeInRadians = 0;
        let opt_endLatitudeInRadians = Math.PI;
        let opt_startLongitudeInRadians = 0;
        let opt_endLongitudeInRadians = (Math.PI * 2);

        const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
        const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

        // We are going to generate our sphere by iterating through its
        // spherical coordinates and generating 2 triangles for each quad on a
        // ring of the sphere.
        const numVertices = (this._subdivisionsAxis + 1) * (this._subdivisionsHeight + 1);
        const positions = this.createAugmentedTypedArray(3, numVertices);
        const normals = this.createAugmentedTypedArray(3, numVertices);
        const texCoords = this.createAugmentedTypedArray(2, numVertices);

        // Generate the individual vertices in our vertex buffer.
        for (let y = 0; y <= this._subdivisionsHeight; y++) {
            for (let x = 0; x <= this._subdivisionsAxis; x++) {
                // Generate a vertex based on its spherical coordinates
                const u = x / this._subdivisionsAxis;
                const v = y / this._subdivisionsHeight;
                const theta = longRange * u + opt_startLongitudeInRadians;
                const phi = latRange * v + opt_startLatitudeInRadians;
                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                const ux = cosTheta * sinPhi;
                const uy = cosPhi;
                const uz = sinTheta * sinPhi;
                positions.push(this._radius * ux, this._radius * uy, this._radius * uz);
                normals.push(ux, uy, uz);
                texCoords.push(1 - u, v);
            }
        }

        const numVertsAround = this._subdivisionsAxis + 1;
        const indices = this.createAugmentedTypedArray(3, this._subdivisionsAxis * this._subdivisionsHeight * 2, Uint16Array);
        for (let x = 0; x < this._subdivisionsAxis; x++) {
            for (let y = 0; y < this._subdivisionsHeight; y++) {
                // Make triangle 1 of quad.
                indices.push(
                    (y + 0) * numVertsAround + x,
                    (y + 0) * numVertsAround + x + 1,
                    (y + 1) * numVertsAround + x);

                // Make triangle 2 of quad.
                indices.push(
                    (y + 1) * numVertsAround + x,
                    (y + 0) * numVertsAround + x + 1,
                    (y + 1) * numVertsAround + x + 1);
            }
        }

        return {
            position: positions,
            normal: normals,
            textureCoordinates: texCoords,
            indices: indices,
        };
    }


}