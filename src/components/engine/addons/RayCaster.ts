import { Vector3D } from "../components/primitives/Figure";
import FigureInterface from "./FiguresInterFace";

export default class RayCaster {
    private _boxesToLookup: Array<any>
    private _withoutYAxis: boolean
    constructor(blocksToCheck?: Array<any>, withoutYAxis?: boolean) {
        this._boxesToLookup = blocksToCheck || []
        this._withoutYAxis = withoutYAxis || false
    }
    setBoxes(objects: Array<any>) {
        this._boxesToLookup = objects
    }
    lookup(distanceMin: number, distanceToCheck: Vector3D) {
        let found: any[] = []
        if (this._boxesToLookup.length > 0) {
            this._boxesToLookup.forEach((box) => {
                if (this.distanceTwoPoint(box._vector, distanceToCheck) < distanceMin) {
                    found.push(box)
                    // let halfScaleX = box._scale.x / 2
                    // let halfScaleZ = box._scale.z / 2
                    // let xAdded = box._vector.x + halfScaleX
                    // let xSubbed = box._vector.x - halfScaleX

                    // let zAdded = box._vector.z + halfScaleZ
                    // let zSubbed = box._vector.z - halfScaleZ

                    // let viewX = distanceToCheck.x
                    // let viewZ = distanceToCheck.z

                    // let viewXLooked = distanceToCheck.x + 10
                    // let viewZLooked = distanceToCheck.z + 10

                    // let face1 = this.intersectsVectors(viewX, viewZ, viewXLooked, viewZLooked, xSubbed, zAdded, xAdded, zAdded)
                    // // console.warn("")
                    // // console.log({
                    // //     p1: { x: xSubbed, z: zAdded },
                    // //     p2: { x: xAdded, z: zAdded }
                    // // })

                    // let face2 = this.intersectsVectors(viewX, viewZ, viewXLooked, viewZLooked, xSubbed, zSubbed, xAdded, zSubbed)

                    // // console.log(this.distanceBeetwenPointAndVector(distanceToCheck, xSubbed, zAdded, xAdded, zAdded))
                    // // console.log({
                    // //     p1: { x: xSubbed, z: zSubbed },
                    // //     p2: { x: xAdded, z: zSubbed }
                    // // })

                    // let face3 = this.intersectsVectors(viewX, viewZ, viewXLooked, viewZLooked, xAdded, zSubbed, xAdded, zAdded)

                    // // console.log({
                    // //     p1: { x: xAdded, z: zSubbed },
                    // //     p2: { x: xAdded, z: zAdded }
                    // // })

                    // let face4 = this.intersectsVectors(viewX, viewZ, viewXLooked, viewZLooked, xSubbed, zSubbed, xSubbed, zAdded)
                    // // console.log({
                    // //     p1: { x: xSubbed, z: zSubbed },
                    // //     p2: { x: xSubbed, z: zAdded }
                    // // })

                    // // console.log(face1 || face2 || face3 || face4)
                    // console.log("Face1: ", face1)
                    // console.log("Face2: ", face2)
                    // console.log("Face3: ", face3)
                    // console.log("Face4: ", face4)
                    // console.warn("")
                }
            })
        }
        return found
    }
    intersectsVectors(p0_x: number, p0_z: number, p1_x: number, p1_z: number, p2_x: number, p2_z: number, p3_x: number, p3_z: number) {
        var det, gamma, lambda;
        det = (p1_x - p0_x) * (p3_z - p2_z) - (p3_x - p2_x) * (p1_z - p0_z);
        if (det === 0) {
            return false;
        } else {
            lambda = ((p3_z - p2_z) * (p3_x - p0_x) + (p2_x - p3_x) * (p3_z - p0_z)) / det;
            gamma = ((p0_z - p1_z) * (p3_x - p0_x) + (p1_x - p0_x) * (p3_z - p0_z)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    };
    distanceBeetwenPointAndVector(point: Vector3D, v0_x: number, v0_z: number, v1_x: number, v1_z: number) {
        let A = v0_z - v1_z
        let B = v1_x - v0_x
        let C = (v0_x - v1_x) * v0_z + (v1_z - v0_z) * v0_x
        let up = A * point.x + B * point.z + C
        if (up < 0) { up = up * -1 }
        console.log(up)
        return up / Math.sqrt(A ** 2 + B ** 2)
    }
    distanceTwoPoint(v1: Vector3D, v2: Vector3D) {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;

        if (!this._withoutYAxis) return Math.sqrt(dx * dx + dy * dy + dz * dz);
        else return Math.hypot(dx, dz)
    }
}