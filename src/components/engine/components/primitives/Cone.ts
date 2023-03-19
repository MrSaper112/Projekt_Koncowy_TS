import { Figure, Vector3D } from "../../addons/Figure";
import Materials from "../Materials";
import cobble from '../../textures/cobble.png'

export default class Cone extends Figure {
    _subdivisionsAxis: number
    _subdivisionsHeight: number
    _radius: number
    _height: number
    constructor(build: { radius: number, angles: number, height?: number }, vector?: Vector3D, scale?: Vector3D, rotation?: Vector3D, material?: Materials) {
        super(vector, scale, rotation);
        this._material = material || Materials.color({ clr: "#ff00ff" });
        this._angles = build.angles || 0
        this._radius = build.radius
        this._height = build.height
        this._type = "cone"
        this._trianglesPerSide = 1

        if (this._angles >= 3) {
            let working = this.createVertices()
            this._positions = working.position
            this._textureCoordinates = []
            this._indices = working.indices
            this._baseIndices = working.baseInices
            this.initBuffer()
        }
    }
    createVertices() {
        const positions = []
        const indices: Array<number> = []

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
            position: new Float32Array(positions),
            normal: normals,
            indices: new Uint16Array(indices),
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