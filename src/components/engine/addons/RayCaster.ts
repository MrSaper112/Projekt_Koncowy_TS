import FigureInterface, { vector3D } from "./FiguresInterFace";

export default class RayCaster {
    _boxesToLookup: Array<any>
    constructor(blocksToCheck: Array<any>) {
        this._boxesToLookup = blocksToCheck;
    }
    lookup(distanceMin: number, distanceToCheck: vector3D) {
        this._boxesToLookup.forEach((box) => {

            if (this.distanceVector(box._vector, distanceToCheck) < distanceMin) {
                console.log(box, this.distanceVector(box._vector, distanceToCheck))

            }
        })
    }
    distanceVector(v1: vector3D, v2: vector3D) {
        var dx = v1.x - v2.x;
        if (dx < 0) dx * -1
        var dy = v1.y - v2.y;
        if (dy < 0) dx * -1

        var dz = v1.z - v2.z;
        if (dz < 0) dx * -1


        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}