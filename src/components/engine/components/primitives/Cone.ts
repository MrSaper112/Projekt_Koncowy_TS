import { Figure, Vector3D } from "../../addons/Figure";
import Materials from "../Materials";
import cobble from '../../textures/cobble.png'

export default class Cone extends Figure {
    _subdivisionsAxis: number
    _subdivisionsHeight: number
    _radius: number
    _height: number
    constructor(gl: WebGLRenderingContext, build: { radius: number, angles: number, height?: number }, vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D, material?: Materials) {
        super(gl, vector, scale, rotation);
        this._material = material || Materials.color({ gl, clr: "#ff00ff" });
        this._angles = build.angles || 0
        this._radius = build.radius
        this._height = build.height
        this._type = "cone"
        this._trianglesPerSide = 1

        if (this._angles >= 3) {
            let working = this.createVertices()
            console.log(working)

            this._positions = working.position
            this._textureCoordinates = []
            this._indices = working.indices
            this._baseIndices = working.baseInices
        }
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

    createVertices() {
        const positions: Array<number> = []
        const normals = this.createAugmentedTypedArray(3, this._angles);
        const texCoords = this.createAugmentedTypedArray(2, this._angles);

        var angleIncrement = (2 * Math.PI) / this._angles; // angle increment between each vertex

        // positions.push(0, 0, 0)
        let ind = this._angles

        for (var i = 1; i <= this._angles; i++) {
            var angle = i * angleIncrement;
            var x = this._radius * Math.cos(angle);
            var y = 0;
            var z = this._radius * Math.sin(angle);
            positions.push(x, y, z);
        }
        for (var i = 0; i < this._angles; i++) positions.push(0, 0, 0)

        const indices: Array<number> = []
        let baseIndices = []
        let coneIndices = []
        for (let i = 0; i < this._angles; i++) {
            if (i !== this._angles - 1) baseIndices.push(i, i + 1, ind)
            else baseIndices.push(i, 0, ind)
            ind += 1
        }
        let pack: Array<Array<number>> = []

        for (var i = 1; i <= this._angles; i += 1) {
            var angle = i * angleIncrement;
            var x = this._radius * Math.cos(angle);
            var y = 0;
            var z = this._radius * Math.sin(angle);
            pack.push([x, y, z]);
        }
        for (let i = 0; i < this._angles; i++) {
            console.warn(pack[i], pack[(i + 1) % this._angles], [0, this._height, 0]);
            pack[i].forEach((itm: number) => positions.push(itm));
            pack[(i + 1) % this._angles].forEach((itm: number) => positions.push(itm));
            [0, this._height, 0].forEach((itm: number) => positions.push(itm));
        }

        for (var i = ind; i < ind + this._angles * 3; i += 3) {
            coneIndices.push(i, i + 1, i + 2)

        }
        baseIndices.forEach((itm: number) => indices.push(itm));
        coneIndices.forEach((itm: number) => indices.push(itm));

        return {
            position: positions,
            normal: normals,
            indices: indices,
            baseInices: baseIndices
        }
    }
}
// const positions = this.createAugmentedTypedArray(3, this._angles + 1);
// const normals = this.createAugmentedTypedArray(3, this._angles);
// const texCoords = this.createAugmentedTypedArray(2, this._angles);
// var centerX = 1 / 2; // center of screen
// var centerY = 1 / 2; // center of screen
// var angleIncrement = (2 * Math.PI) / this._angles; // angle increment between each vertex

// positions.push(0, 0, 0)


// for (var i = 0; i <= this._angles + 1; i++) {
//     var angle = i * angleIncrement;
//     var x = centerX + this._radius * Math.cos(angle);
//     var y = -1;
//     var z = centerY + this._radius * Math.sin(angle);
//     positions.push(x, y, z);
// }
// const indices = this.createAugmentedTypedArray(3, this._subdivisionsAxis * this._subdivisionsHeight * 2, Uint16Array);

// for (let i = 1; i <= (positions.length - 3) / 3; i += 1) {
//     if (i === (positions.length - 3) / 3) {
//         console.log(0, i, 1)
//     } else {
//         console.log(positions[i], positions[i + 1], positions[i + 2])
//         console.log(0, i, i + 1)
//     }
// }

// return {
//     position: positions,
//     normal: normals,
//     textureCoordinates: texCoords,
//     indices: indices
// }